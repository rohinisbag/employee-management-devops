import json
import os

import psycopg2


connection = None


def get_connection():
    global connection

    if connection is None or connection.closed:
        connection = psycopg2.connect(
            host=os.environ["DB_HOST"],
            port=5432,
            database=os.environ["DB_NAME"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASSWORD"],
            connect_timeout=5,
        )

    return connection


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        "body": json.dumps(body),
    }


def get_employees():
    conn = get_connection()

    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT id, name, email, department
            FROM employees
            ORDER BY id
            """
        )

        rows = cursor.fetchall()

    return [
        {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "department": row[3],
        }
        for row in rows
    ]


def get_employee(employee_id):
    conn = get_connection()

    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT id, name, email, department
            FROM employees
            WHERE id = %s
            """,
            (employee_id,),
        )

        row = cursor.fetchone()

    if not row:
        return None

    return {
        "id": row[0],
        "name": row[1],
        "email": row[2],
        "department": row[3],
    }


def create_employee(data):
    conn = get_connection()

    with conn.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO employees
                (name, email, department)
            VALUES
                (%s, %s, %s)
            RETURNING id
            """,
            (
                data["name"],
                data["email"],
                data.get("department"),
            ),
        )

        employee_id = cursor.fetchone()[0]

    conn.commit()

    return get_employee(employee_id)


def update_employee(employee_id, data):
    conn = get_connection()

    with conn.cursor() as cursor:
        cursor.execute(
            """
            UPDATE employees
            SET name = %s,
                email = %s,
                department = %s
            WHERE id = %s
            """,
            (
                data["name"],
                data["email"],
                data.get("department"),
                employee_id,
            ),
        )

        updated = cursor.rowcount

    conn.commit()

    if updated == 0:
        return None

    return get_employee(employee_id)


def delete_employee(employee_id):
    conn = get_connection()

    with conn.cursor() as cursor:
        cursor.execute(
            """
            DELETE FROM employees
            WHERE id = %s
            """,
            (employee_id,),
        )

        deleted = cursor.rowcount

    conn.commit()

    return deleted > 0


def lambda_handler(event, context):
    try:
        request_context = event.get("requestContext", {})
        http = request_context.get("http", {})

        method = http.get("method", "GET")
        path = http.get("path", "/employees")

        if method == "OPTIONS":
            return response(200, {"message": "OK"})

        if method == "GET" and path == "/employees":
            return response(200, get_employees())

        if method == "POST" and path == "/employees":
            body = json.loads(event.get("body") or "{}")
            employee = create_employee(body)
            return response(201, employee)

        if "/employees/" in path:
            employee_id = int(path.rstrip("/").split("/")[-1])

            if method == "GET":
                employee = get_employee(employee_id)

                if not employee:
                    return response(
                        404,
                        {"message": "Employee not found"},
                    )

                return response(200, employee)

            if method == "PUT":
                body = json.loads(event.get("body") or "{}")

                employee = update_employee(
                    employee_id,
                    body,
                )

                if not employee:
                    return response(
                        404,
                        {"message": "Employee not found"},
                    )

                return response(200, employee)

            if method == "DELETE":
                deleted = delete_employee(employee_id)

                if not deleted:
                    return response(
                        404,
                        {"message": "Employee not found"},
                    )

                return response(
                    200,
                    {"message": "Employee deleted"},
                )

        return response(
            404,
            {"message": "Route not found"},
        )

    except Exception as exc:
        print(f"ERROR: {exc}")

        return response(
            500,
            {"message": "Internal server error"},
        )