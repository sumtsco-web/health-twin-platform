# Health Twin™ - Database Setup Guide

## Prerequisites
- Docker and Docker Compose installed
- PostgreSQL client (psql) installed

## Step 1: Start Database Services

```bash
# From project root
docker-compose up -d
```

This starts:
- PostgreSQL + TimescaleDB (port 5432)
- MongoDB (port 27017)
- Redis (port 6379)

## Step 2: Verify Database is Running

```bash
docker ps
```

You should see `healthtwin-timescaledb` running.

## Step 3: Run Migrations

### Option A: Using psql

```bash
# Connect to database
psql -h localhost -p 5432 -U admin -d healthtwin_core

# Run migration
\i backend/database/migrations/001_initial_schema.sql
```

### Option B: Using Docker

```bash
docker exec -i healthtwin-timescaledb psql -U admin -d healthtwin_core < backend/database/migrations/001_initial_schema.sql
```

## Step 4: Verify Tables Created

```bash
psql -h localhost -p 5432 -U admin -d healthtwin_core -c "\dt"
```

You should see:
- users
- vital_signs (hypertable)
- risk_assessments
- sleep_data
- activity_data
- alerts
- medical_records
- reports
- audit_log
- user_settings

## Step 5: Create Admin User

The migration already creates a default admin user:
- **Email:** dr.ai@healthtwin.com
- **Password:** You need to set this (see below)

### Generate Password Hash

```bash
# Using Node.js
node -e "console.log(require('bcryptjs').hashSync('YourPassword123!', 10))"
```

Then update the user:

```sql
UPDATE users 
SET password_hash = '$2a$10$YourGeneratedHashHere'
WHERE email = 'dr.ai@healthtwin.com';
```

## Step 6: Insert Sample Data (Optional)

```sql
-- Insert sample employee
INSERT INTO users (email, password_hash, first_name, last_name, employee_code, department, role)
VALUES (
    'john.doe@company.com',
    '$2a$10$YourHashHere',
    'John',
    'Doe',
    'EMP-1001',
    'Drilling Operations',
    'employee'
);

-- Insert sample vital signs
INSERT INTO vital_signs (time, user_id, metric_type, value, unit, device_source)
SELECT 
    NOW() - (interval '1 hour' * generate_series),
    (SELECT user_id FROM users WHERE email = 'john.doe@company.com'),
    'heart_rate',
    70 + (random() * 20)::int,
    'bpm',
    'Apple Watch'
FROM generate_series(0, 24);

-- Insert sample risk assessment
INSERT INTO risk_assessments (user_id, cardiac_risk_score, fatigue_score, overall_risk_level, fit_to_work)
SELECT 
    user_id,
    35,
    42,
    'Moderate',
    true
FROM users WHERE email = 'john.doe@company.com';
```

## Step 7: Update Backend Services

### Update User Service

Edit `backend/services/user-service/src/config/database.ts`:

```typescript
import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'healthtwin_core',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
});
```

### Update Auth Service

The auth service already has the database connection logic.

## Step 8: Environment Variables

Create `.env` files:

### backend/services/user-service/.env
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthtwin_core
DB_USER=admin
DB_PASSWORD=admin123
JWT_SECRET=your-secret-key-here
```

### backend/services/auth-service/.env
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthtwin_core
DB_USER=admin
DB_PASSWORD=admin123
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h
```

## Step 9: Test Database Connection

```bash
# Start user service
cd backend/services/user-service
npm run dev

# Start auth service
cd backend/services/auth-service
npm run dev
```

## Useful Commands

### View all users
```sql
SELECT user_id, email, first_name, last_name, role, department FROM users;
```

### View recent vital signs
```sql
SELECT time, metric_type, value, unit 
FROM vital_signs 
WHERE user_id = 'YOUR_USER_ID'
ORDER BY time DESC 
LIMIT 10;
```

### View risk assessments
```sql
SELECT assessment_time, cardiac_risk_score, fatigue_score, overall_risk_level, fit_to_work
FROM risk_assessments
ORDER BY assessment_time DESC
LIMIT 10;
```

### View active alerts
```sql
SELECT alert_type, severity, title, triggered_at, status
FROM alerts
WHERE status = 'active'
ORDER BY triggered_at DESC;
```

## Backup Database

```bash
docker exec healthtwin-timescaledb pg_dump -U admin healthtwin_core > backup.sql
```

## Restore Database

```bash
docker exec -i healthtwin-timescaledb psql -U admin healthtwin_core < backup.sql
```

## Troubleshooting

### Can't connect to database
```bash
# Check if container is running
docker ps | grep timescaledb

# Check logs
docker logs healthtwin-timescaledb

# Restart container
docker-compose restart timescaledb
```

### Permission denied
```bash
# Grant permissions
docker exec -it healthtwin-timescaledb psql -U admin -d healthtwin_core -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;"
```

---

**Database is now ready for use!** 🎉

The backend services can now store and retrieve real data instead of using mock data.
