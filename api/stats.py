from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager

import os
import psycopg2
import json
import hashlib
import logging

logging.basicConfig(level=logging.INFO)

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
def login():
    username = request.json.get("username", None).lower()
    password = hashlib.sha256(request.json.get("password", None).lower().encode("utf-8")).hexdigest()

    cred_retrieve_query = """
    SELECT username,password FROM users WHERE username = %s
    """

    cursor = get_db_connection()
    cursor.execute(cred_retrieve_query, (username,))
    cred_retrieve = cursor.fetchone()

    retreived_user = cred_retrieve[0]
    retrieved_pass = cred_retrieve[1]

    if username != retreived_user or password != retrieved_pass:
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
def profile():
    username = get_jwt_identity()
    cursor = get_db_connection()

    profile_query = """
    SELECT wins, losses FROM users WHERE username = %s;
    """
    cursor.execute(profile_query, (username,))
    profile_data = cursor.fetchone()

    app.logger.info(profile_data)

    response_body = {
        "username": username,
        "wins": profile_data[0],
        "losses": profile_data[1]
    }
    return response_body

@app.route('/modify_stats', methods=['POST'])
@jwt_required()
def modify_stats():
    action = request.json.get("action", None)
    username = get_jwt_identity()

    cursor = get_db_connection()

    if action == "add_win":
        update_query = """
        UPDATE users SET wins = wins + 1 WHERE username = %s;
        """
        cursor.execute(update_query, (username,))

    elif action == "add_loss":
        update_query = """
        UPDATE users SET losses = losses + 1 WHERE username = %s;
        """
        cursor.execute(update_query, (username,))

    elif action == "reset":
        update_query = """
        UPDATE users SET wins = 0, losses = 0 WHERE username = %s;
        """
        cursor.execute(update_query, (username,))
        
    return {"msg": "Stats updated successfully"}


@app.route('/register', methods=['GET', 'POST'])
def register():
    create_query = """
    INSERT INTO users (username, password, wins, losses)
    VALUES (%s, %s, 0, 0);
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
    cursor.execute('CREATE TABLE IF NOT EXISTS users (username VARCHAR(255), password VARCHAR(255), wins INT, losses INT, PRIMARY KEY (username))')
    cursor.close
    app.run(debug=True, host='0.0.0.0', port=port)