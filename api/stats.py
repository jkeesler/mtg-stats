from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager

import os
import psycopg2
import json
import hashlib

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)


def get_db_connection():
    conn = psycopg2.connect(host='db',
                            database='stats',
                            user=os.environ['POSTGRES_USER'],
                            password=os.environ['POSTGRES_PASSWORD'])
    conn.autocommit = True
    cursor = conn.cursor()
    return cursor

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestap = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=10))
        if target_timestamp > exp_timestap:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data['access_token'] = access_token
                response.data = json.dumps(data)
        return response
    except(RuntimeError, KeyError):
        #Case where there is not a valid JWT. Just return original response
        return response

@app.route('/token', methods=['POST'])
def create_token():
    username = request.json.get("username", None)
    password = hashlib.sha256(request.json.get("password", None).encode("utf-8")).hexdigest()

    # cred_retrieve_query = """
    # SELECT username,password FROM users WHERE username = username
    # """

    # cursor = get_db_connection()
    # cursor.execute(cred_retrieve_query, (username,))
    # cred_retrieve = cursor.fetchone()

    if username != "test" or password != "test":
        return {"msg": "Wrong username or password"}, 401
    
    access_token = create_access_token(identity=username)
    response = {"access_token":access_token}

    return response

@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route('/profile', methods=['GET'])
@jwt_required()
def my_profile():
    response_body = {
        "name": "Jacob",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }
    return response_body

@app.route('/register', methods=['GET', 'POST'])
def add_user():
    create_query = """
    INSERT INTO users (username, password)
    VALUES (%s, %s);
    """

    username_check_query = """
    SELECT username FROM users WHERE username = %s
    """

    user = request.json.get("username", None).lower()
    password = hashlib.sha256(request.json.get("password", None).lower().encode("utf-8")).hexdigest()

    cursor = get_db_connection()

    cursor.execute(username_check_query, (user,))
    user_exists = cursor.fetchone()
    
    if bool(user_exists):
        created_message = {"created":'false'}
    else:
        cursor.execute(create_query, (user, password))
        created_message = {"created":'true'}

    return created_message

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    cursor = get_db_connection()
    cursor.execute('CREATE TABLE IF NOT EXISTS users (username VARCHAR(255), password VARCHAR(255))')
    # cursor.execute('CREATE TABLE IF NOT EXISTS stats (username VARCHAR(255), wins INT, losses INT, PRIMARY KEY (username))')
    cursor.close
    app.run(debug=True, host='0.0.0.0', port=port)