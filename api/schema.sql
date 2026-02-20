-- RunPayway Database Schema
-- Database: runpayway
-- Run this on your MySQL server

CREATE DATABASE IF NOT EXISTS runpayway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE runpayway;

-- ============================================================
-- ASSESSMENTS
-- ============================================================

CREATE TABLE assessments (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id           VARCHAR(20) NOT NULL UNIQUE,
    payment_session_id      VARCHAR(255) UNIQUE,
    prepared_for_name       VARCHAR(255) NULL,
    delivery_email          VARCHAR(255) NULL,
    industry                VARCHAR(50) NULL,
    revenue_model           VARCHAR(50) NULL,
    role                    VARCHAR(50) NULL,
    profile_id              VARCHAR(255) NULL,
    responses_q1            CHAR(1) NULL,
    responses_q2            CHAR(1) NULL,
    responses_q3            CHAR(1) NULL,
    responses_q4            CHAR(1) NULL,
    responses_q5            CHAR(1) NULL,
    responses_q6            CHAR(1) NULL,
    responses_q7            CHAR(1) NULL,
    responses_q8            CHAR(1) NULL,
    responses_q9            CHAR(1) NULL,
    responses_q10           CHAR(1) NULL,
    responses_q11           CHAR(1) NULL,
    responses_q12           CHAR(1) NULL,
    score_exact             DECIMAL(5,2) NULL,
    display_score           TINYINT UNSIGNED NULL,
    band                    VARCHAR(30) NULL,
    core_weighted_int       INT NULL,
    mod_weighted_int        INT NULL,
    stab_weighted_int       INT NULL,
    raw_int                 INT NULL,
    rmax_int                INT NULL,
    output_payload          JSON NULL,
    model_version           VARCHAR(10) NOT NULL DEFAULT 'RP-1.0',
    engine_version          VARCHAR(10) NOT NULL DEFAULT '1.0',
    calibration_version     VARCHAR(10) NOT NULL DEFAULT '1.0',
    output_version          VARCHAR(10) NOT NULL DEFAULT '1.0',
    report_status           ENUM('pending','generated','failed') NOT NULL DEFAULT 'pending',
    delivery_status         ENUM('available','accessed','expired') NOT NULL DEFAULT 'available',
    status                  VARCHAR(30) NOT NULL DEFAULT 'created',
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assessment_date         DATE NULL,
    INDEX idx_payment_session (payment_session_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ACCESS GRANTS
-- ============================================================

CREATE TABLE access_grants (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id           VARCHAR(20) NOT NULL,
    token_hash              VARCHAR(128) NOT NULL,
    issued_at               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    first_accessed_at       DATETIME NULL,
    access_window_expires_at DATETIME NULL,
    final_expires_at        DATETIME NOT NULL,
    status                  ENUM('active','window_active','expired') NOT NULL DEFAULT 'active',
    download_count          INT NOT NULL DEFAULT 0,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_assessment_id (assessment_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- AUDIT EVENTS
-- ============================================================

CREATE TABLE audit_events (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id           VARCHAR(20) NULL,
    event_type              VARCHAR(50) NOT NULL,
    metadata                JSON NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_assessment_id (assessment_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================

CREATE TABLE contact_messages (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    email                   VARCHAR(255) NOT NULL,
    checkout_email          VARCHAR(255) NULL,
    message                 TEXT NOT NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
