# migrations/firebase_to_aws.py - Run with python firebase_to_aws.py
import json
import psycopg2  # pip install psycopg2

# Step 1: Export from Firebase (manual or via admin SDK; simulated here)
firebase_export = {"users": [{"id": "user1", "role": "coach", "profile": {"gpa": 3.8}}]}

# Step 2: Connect to AWS RDS - UPDATE THESE CREDENTIALS
DB_CONFIG = {
    'dbname': 'ivylevel',  # Database name you set during RDS creation
    'user': 'ivylevel_admin',  # Master username you set during RDS creation
    'password': 'YOUR_DATABASE_PASSWORD',  # Master password you set during RDS creation
    'host': 'ivylevel-database-1.cbeyu4q002ay.us-east-1.rds.amazonaws.com',  # Your RDS endpoint
    'port': 5432
}

print("Connecting to RDS database...")
conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()

# Step 3: Create tables if not exist (from specs)
print("Creating tables...")
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    role TEXT NOT NULL,
    profile JSONB
);
""")

# Step 4: Insert data
print("Inserting sample data...")
for user in firebase_export['users']:
    cur.execute(
        "INSERT INTO users (id, role, profile) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
        (user['id'], user['role'], json.dumps(user['profile']))
    )

conn.commit()
cur.close()
conn.close()
print("✅ Migration complete - Data transferred to RDS.")
print(f"Database endpoint: {DB_CONFIG['host']}") 