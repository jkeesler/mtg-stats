from flask import Flask, render_template
from flask_wtf import FlaskForm
from wtforms import StringField, TimeField, DateField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length, Email, EqualTo

import os
import psycopg2
import time

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(host='db',
                            database='stats',
                            user=os.environ['POSTGRES_USER'],
                            password=os.environ['POSTGRES_PASSWORD'])
    conn.autocommit = True
    return conn

@app.route('/profile')
def my_profile():
    response_body = {
        "name": "Jacob",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }

    return response_body

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS stats (tcg VARCHAR(255), username VARCHAR(255), wins INT, losses INT, PRIMARY KEY (username))')
    app.run(debug=True, host='0.0.0.0', port=port)