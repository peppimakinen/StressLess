-- Drop the database if it exists and then create it
DROP DATABASE IF EXISTS StressLess;
CREATE DATABASE StressLess;

USE StressLess;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL,
    full_name VARCHAR(50),
    user_level VARCHAR(10) DEFAULT 'patient',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DoctorPatient (
    pair_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES Users(User_id),
    FOREIGN KEY (doctor_id) REFERENCES Users(User_id)
);

CREATE TABLE Surveys (
    survey_id INT AUTO_INCREMENT PRIMARY KEY,
    u_id INT NOT NULL,
    FOREIGN KEY (u_id) REFERENCES Users(user_id)
);

CREATE TABLE Questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(250),
    answer VARCHAR(300)
);

CREATE table SQ (
    row_id INT AUTO_INCREMENT PRIMARY KEY,
    q_id INT NOT NULL,
    s_id INT NOT NULL,
    FOREIGN KEY (q_id) REFERENCES Questions(question_id),
    FOREIGN KEY (s_id) REFERENCES Surveys(survey_id)
);


CREATE TABLE DiaryEntries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    mood_color VARCHAR(50),
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


CREATE table Measurements (
    measurement_id INT AUTO_INCREMENT PRIMARY KEY,
    kubios_result_id VARCHAR(100),
    measurement_date date,
    artefact_level VARCHAR(50),
    lf_power DECIMAL(5, 2),
    lf_power_nu DECIMAL(5, 2),
    hf_power DECIMAL(5, 2),
    hf_power_nu DECIMAL(5, 2),
    tot_power DECIMAL(5, 2),
    mean_hr_bpm DECIMAL(5, 2),
    mean_rr_ms DECIMAL(5, 2),
    rmssd_ms DECIMAL(5, 2),
    sd1_ms DECIMAL(5, 2),
    sd2_ms DECIMAL(6, 2),
    sdnn_ms DECIMAL(6, 2),
    sns_index DECIMAL(6, 2),
    pns_index DECIMAL(6, 2),
    stress_index DECIMAL(6, 2),
    respiratory_rate DECIMAL(6, 2),
    user_readiness DECIMAL(6, 2),
    user_recovery DECIMAL(6, 2),
    user_happiness INT,
    result_type VARCHAR(50)
);

CREATE TABLE CompletedActivities (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    e_id INT NOT NULL,
    activity_name VARCHAR(75),
    FOREIGN KEY (e_id) REFERENCES DiaryEntries(entry_id)
);

CREATE table DM (
    hrv_entry_id INT AUTO_INCREMENT PRIMARY KEY,
    m_id INT NOT NULL,
    e_id INT NOT NULL,
    FOREIGN KEY (m_id) REFERENCES Measurements(measurement_id),
    FOREIGN KEY (e_id) REFERENCES DiaryEntries(entry_id)
);
