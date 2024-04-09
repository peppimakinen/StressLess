-- Create two patients and two doctors
INSERT INTO Users (username, password, full_name, user_level)
VALUES ('patient1@example.com', 'password1', 'Patient One', 'patient');
INSERT INTO Users (username, password, full_name, user_level)
VALUES ('patient2@example.com', 'password2', 'Patient Two', 'patient');
INSERT INTO Users (username, password, full_name, user_level)
VALUES ('doctor1@example.com', 'password1', 'Doctor One', 'doctor');
INSERT INTO Users (username, password, full_name, user_level)
VALUES ('doctor2@example.com', 'password2', 'Doctor Two', 'doctor');

-- Create Both patients choose doctor2 as their doctor
INSERT INTO DoctorPatient (patient_id, doctor_id)
VALUES (1, 4);
INSERT INTO DoctorPatient (patient_id, doctor_id)
VALUES (2, 4);

-- Simulate 'alkukartoitus'
INSERT INTO Surveys (u_id) VALUES (1);
SET @survey_id_1 = LAST_INSERT_ID();
INSERT INTO Surveys (u_id) VALUES (2);
SET @survey_id_2 = LAST_INSERT_ID();

-- Question 1
INSERT INTO Questions (question, answer) VALUES ('How often do you exercise?', 'User 1: Daily');
SET @question_id = LAST_INSERT_ID();
INSERT INTO SQ (q_id, s_id) VALUES (@question_id, @survey_id_1);
INSERT INTO Questions (question, answer) VALUES ('How often do you exercise?', 'User 2: Weekly');
SET @question_id = LAST_INSERT_ID();
INSERT INTO SQ (q_id, s_id) VALUES (@question_id, @survey_id_2);

-- Question 2
INSERT INTO Questions (question, answer) VALUES ('How many hours do you sleep each night?', 'User 1: 8 hours');
SET @question_id = LAST_INSERT_ID();
INSERT INTO SQ (q_id, s_id) VALUES (@question_id, @survey_id_1);
INSERT INTO Questions (question, answer) VALUES ('How many hours do you sleep each night?', 'User 2: 6 hours');
SET @question_id = LAST_INSERT_ID();
INSERT INTO SQ (q_id, s_id) VALUES (@question_id, @survey_id_2);

-- Question 3
INSERT INTO Questions (question, answer) VALUES ('How many meals do you eat each day?', 'User 1: 3 meals');
SET @question_id = LAST_INSERT_ID();
INSERT INTO SQ (q_id, s_id) VALUES (@question_id, @survey_id_1);
INSERT INTO Questions (question, answer) VALUES ('How many meals do you eat each day?', 'User 2: 4 meals');
SET @question_id = LAST_INSERT_ID();
INSERT INTO SQ (q_id, s_id) VALUES (@question_id, @survey_id_2);

-- Question 4
INSERT INTO Questions (question, answer) VALUES ('Do you smoke?', 'User 1: No');
SET @question_id = LAST_INSERT_ID();
INSERT INTO SQ (q_id, s_id) VALUES (@question_id, @survey_id_1);
INSERT INTO Questions (question, answer) VALUES ('Do you smoke?', 'User 2: Yes');
SET @question_id = LAST_INSERT_ID();
INSERT INTO SQ (q_id, s_id) VALUES (@question_id, @survey_id_2);

-- Question 5
INSERT INTO Questions (question, answer) VALUES ('Do you have any chronic diseases?', 'User 1: No');
SET @question_id = LAST_INSERT_ID();
INSERT INTO SQ (q_id, s_id) VALUES (@question_id, @survey_id_1);
INSERT INTO Questions (question, answer) VALUES ('Do you have any chronic diseases?', 'User 2: Yes');
SET @question_id = LAST_INSERT_ID();
INSERT INTO SQ (q_id, s_id) VALUES (@question_id, @survey_id_2);

-- Create a diary entry for user_id = 1
INSERT INTO DiaryEntries (user_id, entry_date, mood_color, notes)
VALUES (1, '2024-04-01', 'Green', 'Feeling good today.');
SET @entry_id = LAST_INSERT_ID();

-- Create a measurement for user_id = 1
INSERT INTO Measurements (kubios_result_id, measurement_date, artefact_level, lf_power, lf_power_nu, hf_power, hf_power_nu, tot_power, mean_hr_bpm, mean_rr_ms, rmssd_ms, sd1_ms, sd2_ms, sdnn_ms, sns_index, pns_index, stress_index, respiratory_rate, user_readiness, user_recovery, user_happiness, result_type)
VALUES ('result1-aaa', '2024-04-01', 'user1_GOOD', 111, 112, 113, 114, 115, 116, 117, 118, 119, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 'user-1 readiness_1');
SET @measurement_id = LAST_INSERT_ID();

-- Map the diary entry, measurement, and completed activity in the DM table
INSERT INTO DM (m_id, e_id) VALUES (@measurement_id, @entry_id);

-- Create a completed activity for user_id = 1
INSERT INTO CompletedActivities (e_id, activity_name) VALUES (1,'First activity for user1');
-- Create a completed activity for user_id = 1
INSERT INTO CompletedActivities (e_id, activity_name) VALUES (1, 'Second activity for user1');
-- Create a completed activity for user_id = 1
INSERT INTO CompletedActivities (e_id, activity_name) VALUES (1, 'Third activity for user1');
-- Bad day for user_id = 1
INSERT INTO DiaryEntries (user_id, entry_date, mood_color, notes)
VALUES (1, '2024-04-02', 'Red', 'Not feeling well today.');
SET @entry_id = LAST_INSERT_ID();

INSERT INTO Measurements (kubios_result_id, measurement_date, artefact_level, lf_power, lf_power_nu, hf_power, hf_power_nu, tot_power, mean_hr_bpm, mean_rr_ms, rmssd_ms, sd1_ms, sd2_ms, sdnn_ms, sns_index, pns_index, stress_index, respiratory_rate, user_readiness, user_recovery, user_happiness, result_type)
VALUES ('result1-bbb', '2024-04-02', 'user1_BAD', 211, 212, 213, 214, 215, 216, 217, 218, 219, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 'user-1 readiness_2');
SET @measurement_id = LAST_INSERT_ID();

INSERT INTO DM (m_id, e_id) VALUES (@measurement_id, @entry_id);

INSERT INTO CompletedActivities (e_id, activity_name) VALUES (@entry_id, 'Bad day activity for user1');

-- Good day for user_id = 2
INSERT INTO DiaryEntries (user_id, entry_date, mood_color, notes)
VALUES (2, '2024-04-03', 'Green', 'Feeling great today.');
SET @entry_id = LAST_INSERT_ID();

INSERT INTO Measurements (kubios_result_id, measurement_date, artefact_level, lf_power, lf_power_nu, hf_power, hf_power_nu, tot_power, mean_hr_bpm, mean_rr_ms, rmssd_ms, sd1_ms, sd2_ms, sdnn_ms, sns_index, pns_index, stress_index, respiratory_rate, user_readiness, user_recovery, user_happiness, result_type)
VALUES ('result2-aaa', '2024-04-03', 'user2_GOOD', 311, 312, 313, 314, 315, 316, 317, 318, 319, 3011, 3012, 3013, 3014, 3015, 3016, 3017, 3018, 3019, 'user-2 readiness_1');
SET @measurement_id = LAST_INSERT_ID();

INSERT INTO DM (m_id, e_id) VALUES (@measurement_id, @entry_id);

INSERT INTO CompletedActivities (e_id, activity_name) VALUES (@entry_id, 'Good day activity for user2');

-- Bad day for user_id = 2
INSERT INTO DiaryEntries (user_id, entry_date, mood_color, notes)
VALUES (2, '2024-04-04', 'Red', 'Feeling down today.');
SET @entry_id = LAST_INSERT_ID();

INSERT INTO Measurements (kubios_result_id, measurement_date, artefact_level, lf_power, lf_power_nu, hf_power, hf_power_nu, tot_power, mean_hr_bpm, mean_rr_ms, rmssd_ms, sd1_ms, sd2_ms, sdnn_ms, sns_index, pns_index, stress_index, respiratory_rate, user_readiness, user_recovery, user_happiness, result_type)
VALUES ('result2-bbb', '2024-04-04', 'user2_BAD', 411, 412, 413, 414, 415, 416, 417, 418, 419, 4011, 4012, 4013, 4014, 4015, 4016, 4017, 4018, 4019, 'user-2 readiness_2');
SET @measurement_id = LAST_INSERT_ID();

INSERT INTO DM (m_id, e_id) VALUES (@measurement_id, @entry_id);

INSERT INTO CompletedActivities (e_id, activity_name) VALUES (@entry_id, 'Bad day activity for user2');
