*** Settings ***
Library     Browser    auto_closing_level=SUITE
Library     CryptoLibrary    variable_decryption=True
Library    RequestsLibrary
Library    Collections


*** Variables ***
${Username}    crypt:PcD1tAnbMlsIge3//bWX4nPhyyB0Lu0DPXPDipMgv3tIcWPcfvgM8jV4XFsfW2vEqheWyVv+A2cg0ChpDESQKDWy5Y0k0W3LEgMriR0p
${Password}    crypt:tSNi8tTS6pD1IMEy9EfvtwdUdwF3xqzMd/EZMEfhtTw04yQGm3XXaODegPSQ7uIFyRRK8wJj3NrGbvzjp8OZAw==
${adminPassword}    crypt:1nsLKLJlj1MNasrGLW6PpgDeNNL1IdBEHRUhzLgpKgMOahGrRBD7e/jjlz1cHYePHZBiLjtQ8Vhf27s=
${question1}    On a scale from 1 to 5, how stressed are you?
${question2}    Does stress affect your sleep?
${answer1}  Around a 3
${answer2}  It doesn't
@{activities}   Hiking    Swimming    Meditation

&{entry1}    entry_date=2024-02-09    mood_color=9BCF53    notes=First entry for week 6    activities=@{activities}
&{entry2}    entry_date=2024-02-10    mood_color=FFF67E    notes=Second entry for week 6    activities=@{activities}
&{entry3}    entry_date=2024-02-11    mood_color=FF8585    notes=Third entry for week 6    activities=@{activities}
@{week6Entries}    &{entry1}    &{entry2}    &{entry3}

&{entry4}    entry_date=2024-02-12    mood_color=FF8585    notes=First entry for week 7    activities=@{activities}
&{entry5}    entry_date=2024-02-13    mood_color=FFF67E    notes=Second entry for week 7    activities=@{activities}
&{entry6}    entry_date=2024-02-14    mood_color=FFF67E    notes=Third entry for week 7    activities=@{activities}
@{week7Entries}    &{entry4}    &{entry5}    &{entry6}

${azureUrl}    https://hyte-server-aleksi.northeurope.cloudapp.azure.com
${localUrl}    http://127.0.0.1:3000
${baseUrl}    ${localUrl}

*** Keywords ***
Send Post Requests For Each entry
    [Arguments]    @{allEntries}
    FOR    ${entry}    IN    @{allEntries}
        ${containsData}=    GET   ${baseUrl}/api/kubios/check/${entry.entry_date}    headers=${headers}    json=${entry}
        IF    ${containsData.json()['kubiosDataFound']}
            ${response}=    POST   ${baseUrl}/api/entries    headers=${headers}    json=${entry}
        END
    END


Check if month empty
    [Arguments]    ${monthNum}    ${yearNum}
    ${response}=    GET    url=${baseUrl}/api/entries/monthly?month=${monthNum}&year=${yearNum}     headers=${headers}
    Log    ${response.json()}
    ${emptyMonth}    Set Variable  True
    FOR    ${date}    IN    @{response.json().keys()}
        ${entry}=    Set Variable    ${response.json()['${date}']}
        IF    'entry_id' in ${entry}
            ${emptyMonth}=    Set Variable    False
        END
    END
    RETURN    ${emptyMonth}


Get available week reports
    ${response}=    GET    url=${baseUrl}/api/reports/available-weeks     headers=${headers}
    RETURN    ${response.json()}


*** Test Cases ***
Authenticate as Patient
    ${body}    Create Dictionary    username=${Username}   password=${Password}
    ${response}    POST    url=${baseUrl}/api/auth/patient-login    json=${body}
    Log    ${response.json()}
    ${initialToken}    Set Variable    ${response.json()}[token]
    &{headers}    Create Dictionary    Content-Type=application/json   Authorization=Bearer ${initialToken}

    Set Suite Variable    &{headers}
    Set Suite Variable    ${initialToken}


Delete self as patient
    ${response}    DELETE    url=${baseUrl}/api/users    headers=${headers}
    Status Should Be    200


Authenticate as Patient again
    ${body}    Create Dictionary    username=${Username}   password=${Password}
    ${response}    POST    url=${baseUrl}/api/auth/patient-login    json=${body}
    Log    ${response.json()}
    ${token}    Set Variable    ${response.json()}[token]
    &{headers}    Create Dictionary    Content-Type=application/json   Authorization=Bearer ${token}

    Set Suite Variable    &{headers}
    Set Suite Variable    ${token}


Submit survey if necessary
    ${body}=    Create Dictionary    ${question1}=${answer1}   ${question2}=${answer2}    activities=@{activities}
    ${response}=    POST    url=${baseUrl}/api/survey     headers=${headers}    json=${body}
    Status Should Be    200
    Log    Response from correct request: ${response.text}


Get own survey and activities
    ${response}=    GET    url=${baseUrl}/api/survey     headers=${headers}
    Log    Check if response question/answer pairs match the previously made survey
    Should Be Equal As Strings    ${response.json()}[questions][0][question]   ${question1}
    Should Be Equal As Strings    ${response.json()}[questions][1][question]    ${question2}
    Should Be Equal As Strings    ${response.json()}[questions][0][answer]   ${answer1}
    Should Be Equal As Strings    ${response.json()}[questions][1][answer]    ${answer2}

    ${response_activities}=    Set Variable    ${response.json()}[activities]
    ${matched}=    Evaluate    ${response_activities} == ${activities}
    Should Be True    ${matched}

    ${response}=    GET    url=${baseUrl}/api/survey/activities     headers=${headers}
    ${response_only_activities}=    Set Variable    ${response.json()}[activities]
    ${matched}=    Evaluate    ${response_only_activities} == ${activities}
    Should Be True    ${matched}


Get patient self
    ${response}=    GET    url=${baseUrl}/api/auth/me     headers=${headers}
    Should Be Equal As Strings    ${response.json()}[stressLessUser][user_level]    patient
    Should Be True    ${response.json()}[stressLessUser][surveyCompleted]


Post new entries if february empty
    ${month}    Set Variable    2
    ${year}    Set Variable    2024
    ${isEmpty}    Check if month empty    ${month}    ${year}
    IF  ${isEmpty}
        Send Post Requests For Each entry    @{week6Entries}
        Send Post Requests For Each entry    @{week7Entries}
    ELSE
        Should Not Be True    ${isEmpty}
    END


Get available february week reports
    ${availableReports}=    Get available week reports
    Log To Console    ${availableReports}
    Should Be Equal As Strings    ${availableReports[0]['week_number']}    6
    Should Be Equal As Strings    ${availableReports[1]['week_number']}    7
    ${week6reportId}=    Set Variable    ${availableReports[0]['report_id']}
    ${week7reportId}=    Set Variable    ${availableReports[1]['report_id']}
    Set Suite Variable    ${week6reportId}
    Set Suite Variable    ${week7reportId}


Compaire february reports
    ${week6report}=    GET    url=${baseUrl}/api/reports/${week6reportId}     headers=${headers}
    Should Be Equal As Numbers    ${week6report.json()['week_si_avg']}    4.28
    Should Be Equal As Strings    ${week6report.json()['previous_week_si_avg']}    None
    Should Be Equal As Numbers    ${week6report.json()['gray_percentage']}    57.14

    ${week7report}=    GET    url=${baseUrl}/api/reports/${week7reportId}     headers=${headers}
    Should Be Equal As Numbers    ${week7report.json()['yellow_percentage']}    28.57
    Should Be Equal As Numbers    ${week7report.json()['week_si_avg']}    4.27
    Should Be Equal As Strings    ${week7report.json()['previous_week_si_avg']}    4.28


Search for a non-existent doctor test suite user
    ${result}=    GET    url=${baseUrl}/api/users/find-doctor/robotTestDoctor@gmail.com    headers=${headers}    expected_status=404


Create test suite doctor user
    ${body}    Create Dictionary    username=robotTestDoctor@gmail.com   password=testSecret    full_name=Only for testing    patient_level=doctor    admin_password=${adminPassword}
    ${response}    POST    url=${baseUrl}/api/users/create-doctor    json=${body}


Search for the newly created doctor test suite user
    ${result}=    GET    url=${baseUrl}/api/users/find-doctor/robotTestDoctor@gmail.com    headers=${headers}    expected_status=200


Share data to test doctor user as a patient
    ${body}=    Create Dictionary    doctor_username=robotTestDoctor@gmail.com
    ${response}=    POST    url=${baseUrl}/api/users/create-pair     headers=${headers}    json=${body}


Authenticate as test doctor
    ${body}    Create Dictionary    username=robotTestDoctor@gmail.com   password=testSecret
    ${response}    POST    url=${baseUrl}/api/auth/doctor-login    json=${body}
    ${doctorToken}    Set Variable    ${response.json()}[token]
    &{doctorHeaders}    Create Dictionary    Content-Type=application/json   Authorization=Bearer ${doctorToken}
    Set Suite Variable    &{doctorHeaders}


Get own patients as doctor
    ${result}=    GET    url=${baseUrl}/api/users/doctor/patients   headers=${doctorHeaders}    expected_status=200
    Should Be Equal As Strings    ${result.json()[0]}[username]    aleksi.kivilehto@metropolia.fi
    ${patientsId}    Set Variable  ${result.json()[0]}[user_id]
    Set Suite Variable    ${patientsId}


Compaire patients february reports
    ${week6report}=    GET    url=${baseUrl}/api/reports/doctor/specific-report/${week6reportId}/${patientsId}     headers=${doctorHeaders}
    Should Be Equal As Numbers    ${week6report.json()['week_si_avg']}    4.28
    Should Be Equal As Strings    ${week6report.json()['previous_week_si_avg']}    None
    Should Be Equal As Numbers    ${week6report.json()['gray_percentage']}    57.14

    ${week7report}=    GET    url=${baseUrl}/api/reports/doctor/specific-report/${week7reportId}/${patientsId}    headers=${doctorHeaders}
    Should Be Equal As Numbers    ${week7report.json()['yellow_percentage']}    28.57
    Should Be Equal As Numbers    ${week7report.json()['week_si_avg']}    4.27
    Should Be Equal As Strings    ${week7report.json()['previous_week_si_avg']}    4.28


Make sure doctor sees the correct survey from patient
    ${response}=    GET    url=${baseUrl}/api/survey/doctor/${patientsId}     headers=${doctorHeaders}
    Should Be Equal As Strings    ${response.json()}[questions][0][question]   ${question1}
    Should Be Equal As Strings    ${response.json()}[questions][1][question]    ${question2}
    Should Be Equal As Strings    ${response.json()}[questions][0][answer]   ${answer1}
    Should Be Equal As Strings    ${response.json()}[questions][1][answer]    ${answer2}

    ${response_activities}=    Set Variable    ${response.json()}[activities]
    ${matched}=    Evaluate    ${response_activities} == ${activities}
    Should Be True    ${matched}


Change password for as a doctor
    ${body}    Create Dictionary    new_password=newTestSecret
    ${response}    PUT    url=${baseUrl}/api/users/doctor/change-password    json=${body}    headers=${doctorHeaders}    expected_status=200


Authenticate as test doctor with new password
    ${body}    Create Dictionary    username=robotTestDoctor@gmail.com   password=newTestSecret
    ${response}    POST    url=${baseUrl}/api/auth/doctor-login    json=${body}
    ${doctorToken}    Set Variable    ${response.json()}[token]
    &{doctorHeaders}    Create Dictionary    Content-Type=application/json   Authorization=Bearer ${doctorToken}
    Set Suite Variable    &{doctorHeaders}


Delete self as doctor
    ${response}    DELETE    url=${baseUrl}/api/users    headers=${doctorHeaders}    expected_status=200