import psycopg2
import os
from datetime import datetime, timedelta
import random

# Database URL from Render
DB_URL = "postgresql://healthtwin_user:olIC7aXi8Y97YknaG6gjICRpiKrtAbLl@dpg-d4oqaoqli9vc73dndv1g-a.oregon-postgres.render.com/healthtwin_a5ya"

def get_db_connection():
    return psycopg2.connect(DB_URL)

def create_tables():
    commands = [
        """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'employee',
            department VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS vital_signs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            heart_rate INTEGER,
            hrv INTEGER,
            spo2 INTEGER,
            temperature DECIMAL(4,1),
            stress_level INTEGER,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS alerts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            type VARCHAR(50),
            severity VARCHAR(20),
            message TEXT,
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    ]
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    print("Creating tables...")
    for command in commands:
        cur.execute(command)
    
    conn.commit()
    cur.close()
    conn.close()
    print("Tables created successfully!")

def seed_data():
    conn = get_db_connection()
    cur = conn.cursor()
    
    print("Seeding data...")
    
    # 1. Create Admin User
    # Password is 'password123' (hashed)
    admin_pass = "$2b$10$5w1.3.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1" # Placeholder hash
    
    cur.execute("""
        INSERT INTO users (email, password_hash, full_name, role, department)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
    """, ('admin@healthtwin.com', admin_pass, 'System Admin', 'admin', 'IT'))
    
    admin_id = cur.fetchone()
    
    # 2. Create Sample Employees
    departments = ['Engineering', 'Sales', 'HR', 'Operations']
    
    for i in range(1, 6):
        email = f'employee{i}@healthtwin.com'
        name = f'Employee {i}'
        dept = random.choice(departments)
        
        cur.execute("""
            INSERT INTO users (email, password_hash, full_name, role, department)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (email) DO NOTHING
            RETURNING id
        """, (email, admin_pass, name, 'employee', dept))
        
        user_row = cur.fetchone()
        if user_row:
            user_id = user_row[0]
            
            # 3. Add Vital Signs for each employee
            for _ in range(5):
                hr = random.randint(60, 100)
                hrv = random.randint(30, 80)
                spo2 = random.randint(95, 100)
                temp = round(random.uniform(36.5, 37.2), 1)
                stress = random.randint(1, 10)
                
                cur.execute("""
                    INSERT INTO vital_signs (user_id, heart_rate, hrv, spo2, temperature, stress_level)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (user_id, hr, hrv, spo2, temp, stress))
            
            # 4. Add some alerts
            if random.random() > 0.7:
                cur.execute("""
                    INSERT INTO alerts (user_id, type, severity, message)
                    VALUES (%s, %s, %s, %s)
                """, (user_id, 'High Heart Rate', 'medium', f'Heart rate detected at {random.randint(100, 120)} bpm'))

    conn.commit()
    cur.close()
    conn.close()
    print("Sample data seeded successfully!")

if __name__ == "__main__":
    try:
        create_tables()
        seed_data()
        print("Database initialization complete! 🚀")
    except Exception as e:
        print(f"Error: {e}")
