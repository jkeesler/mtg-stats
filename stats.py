from flask import Flask
import os
import psycopg2

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(host='db',
                            database='stats',
                            user=os.environ['POSTGRES_USER'],
                            password=os.environ['POSTGRES_PASSWORD'])
    conn.autocommit = True
    return conn

@app.route('/docker-status')
def dockerStatus():
    return "Docker Started Successfully"


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS stats (tcg VARCHAR(255), username VARCHAR(255), wins INT, losses INT, PRIMARY KEY (username))')
    app.run(debug=True, host='0.0.0.0', port=port)