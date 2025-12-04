-- Health Twin™ Database Schema
-- PostgreSQL + TimescaleDB

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(50),
    employee_code VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    role VARCHAR(50) DEFAULT 'employee',
    organization VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_code ON users(employee_code);
CREATE INDEX idx_users_department ON users(department);

-- ============================================
-- VITAL SIGNS TABLE (TimescaleDB Hypertable)
-- ============================================
CREATE TABLE vital_signs (
    time TIMESTAMPTZ NOT NULL,
    user_id UUID NOT NULL REFERENCES users(user_id),
    metric_type VARCHAR(50) NOT NULL,
    value FLOAT NOT NULL,
    unit VARCHAR(20),
    device_source VARCHAR(100),
    confidence_score FLOAT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Convert to hypertable
SELECT create_hypertable('vital_signs', 'time');

-- Create indexes
CREATE INDEX idx_vital_signs_user_time ON vital_signs (user_id, time DESC);
CREATE INDEX idx_vital_signs_metric ON vital_signs (metric_type, time DESC);

-- ============================================
-- RISK ASSESSMENTS TABLE
-- ============================================
CREATE TABLE risk_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    assessment_time TIMESTAMPTZ DEFAULT NOW(),
    cardiac_risk_score INTEGER,
    fatigue_score INTEGER,
    metabolic_risk_score INTEGER,
    overall_risk_level VARCHAR(20),
    fit_to_work BOOLEAN,
    risk_factors JSONB,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_risk_user_time ON risk_assessments (user_id, assessment_time DESC);
CREATE INDEX idx_risk_level ON risk_assessments (overall_risk_level);

-- ============================================
-- SLEEP DATA TABLE
-- ============================================
CREATE TABLE sleep_data (
    sleep_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    sleep_date DATE NOT NULL,
    sleep_start TIMESTAMPTZ,
    sleep_end TIMESTAMPTZ,
    total_duration_hours FLOAT,
    deep_sleep_hours FLOAT,
    rem_sleep_hours FLOAT,
    light_sleep_hours FLOAT,
    awake_time_hours FLOAT,
    sleep_quality_score INTEGER,
    device_source VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sleep_user_date ON sleep_data (user_id, sleep_date DESC);

-- ============================================
-- ACTIVITY DATA TABLE
-- ============================================
CREATE TABLE activity_data (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    activity_date DATE NOT NULL,
    steps INTEGER,
    distance_km FLOAT,
    calories_burned INTEGER,
    active_minutes INTEGER,
    exercise_type VARCHAR(100),
    exercise_duration_minutes INTEGER,
    device_source VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_user_date ON activity_data (user_id, activity_date DESC);

-- ============================================
-- ALERTS TABLE
-- ============================================
CREATE TABLE alerts (
    alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES users(user_id),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(user_id),
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB
);

CREATE INDEX idx_alerts_user ON alerts (user_id, triggered_at DESC);
CREATE INDEX idx_alerts_status ON alerts (status, severity);

-- ============================================
-- MEDICAL RECORDS TABLE
-- ============================================
CREATE TABLE medical_records (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    record_date DATE NOT NULL,
    record_type VARCHAR(100),
    diagnosis TEXT,
    medications JSONB,
    allergies JSONB,
    chronic_conditions JSONB,
    notes TEXT,
    provider_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medical_user ON medical_records (user_id, record_date DESC);

-- ============================================
-- REPORTS TABLE
-- ============================================
CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    period_start DATE,
    period_end DATE,
    generated_by UUID REFERENCES users(user_id),
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    file_path VARCHAR(500),
    file_size_bytes BIGINT,
    status VARCHAR(20) DEFAULT 'ready',
    metadata JSONB
);

CREATE INDEX idx_reports_type ON reports (report_type, generated_at DESC);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
CREATE TABLE audit_log (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    ip_address VARCHAR(50),
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    details JSONB
);

CREATE INDEX idx_audit_user ON audit_log (user_id, timestamp DESC);
CREATE INDEX idx_audit_action ON audit_log (action, timestamp DESC);

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE user_settings (
    setting_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    cardiac_threshold INTEGER DEFAULT 60,
    fatigue_threshold INTEGER DEFAULT 70,
    hrv_threshold INTEGER DEFAULT 50,
    heart_rate_threshold INTEGER DEFAULT 90,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    alert_frequency VARCHAR(20) DEFAULT 'immediate',
    timezone VARCHAR(50) DEFAULT 'Asia/Dubai',
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_settings_user ON user_settings (user_id);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert sample admin user
INSERT INTO users (email, password_hash, first_name, last_name, role, department, organization)
VALUES (
    'dr.ai@healthtwin.com',
    '$2a$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
    'Dr.',
    'AI',
    'admin',
    'Medical',
    'Health Twin™'
);

-- Insert sample settings for admin
INSERT INTO user_settings (user_id)
SELECT user_id FROM users WHERE email = 'dr.ai@healthtwin.com';

COMMENT ON TABLE users IS 'Core user/employee information';
COMMENT ON TABLE vital_signs IS 'Time-series vital sign data from wearables';
COMMENT ON TABLE risk_assessments IS 'AI-calculated risk scores and assessments';
COMMENT ON TABLE sleep_data IS 'Sleep tracking data';
COMMENT ON TABLE activity_data IS 'Physical activity and exercise data';
COMMENT ON TABLE alerts IS 'Health alerts and notifications';
COMMENT ON TABLE medical_records IS 'Medical history and records';
COMMENT ON TABLE reports IS 'Generated reports metadata';
COMMENT ON TABLE audit_log IS 'System audit trail';
COMMENT ON TABLE user_settings IS 'User preferences and thresholds';
