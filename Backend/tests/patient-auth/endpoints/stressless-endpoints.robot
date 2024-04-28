*** Settings ***
Library     Browser    auto_closing_level=SUITE
Library     CryptoLibrary    variable_decryption=True
Library    RequestsLibrary
Library    Collections


*** Variables ***
${Username}    crypt:PcD1tAnbMlsIge3//bWX4nPhyyB0Lu0DPXPDipMgv3tIcWPcfvgM8jV4XFsfW2vEqheWyVv+A2cg0ChpDESQKDWy5Y0k0W3LEgMriR0p
${Password}    crypt:tSNi8tTS6pD1IMEy9EfvtwdUdwF3xqzMd/EZMEfhtTw04yQGm3XXaODegPSQ7uIFyRRK8wJj3NrGbvzjp8OZAw==
${token}    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFsZWtzaS5raXZpbGVodG9AbWV0cm9wb2xpYS5maSIsImZ1bGxfbmFtZSI6IkFsZWtzaSBLaXZpbGVodG8iLCJ1c2VyX2xldmVsIjoicGF0aWVudCIsImNyZWF0ZWRfYXQiOiIyMDI0LTA0LTI4VDExOjM4OjMwLjAwMFoiLCJzdXJ2ZXlDb21wbGV0ZWQiOmZhbHNlLCJ0b2tlbiI6ImV5SnJhV1FpT2lKUVZFUlJVR1pMYmpVMmJYQjVSVTlwY0hWeE9HUkZVREJQZVhsSk1XaDFXbFF3TVZKVmVrZFhVU3RSUFNJc0ltRnNaeUk2SWxKVE1qVTJJbjAuZXlKaGRGOW9ZWE5vSWpvaU4zSkdlbWhoYUUxemJqVkxja3BXTVV4MVJqTmhkeUlzSW5OMVlpSTZJbVZrTWpnNE1tVTVMV1F3WVRBdE5EZ3pNaTA0TTJReExUYzBObUV5T1RJek1UZGtOQ0lzSW1WdFlXbHNYM1psY21sbWFXVmtJanAwY25WbExDSnBjM01pT2lKb2RIUndjenBjTDF3dlkyOW5ibWwwYnkxcFpIQXVaWFV0ZDJWemRDMHhMbUZ0WVhwdmJtRjNjeTVqYjIxY0wyVjFMWGRsYzNRdE1WOTFVVzFCWnpRMWVIa2lMQ0pqYjJkdWFYUnZPblZ6WlhKdVlXMWxJam9pWldReU9EZ3laVGt0WkRCaE1DMDBPRE15TFRnelpERXROelEyWVRJNU1qTXhOMlEwSWl3aVoybDJaVzVmYm1GdFpTSTZJa0ZzWld0emFTSXNJbUYxWkNJNklqYzBOVGN4Y0dSb2RXTTNkblpoYXpSMGJEUTFkWFJ6T0hVNElpd2laWFpsYm5SZmFXUWlPaUkxWldFNFpXRXpNeTFpTlRBMkxUUXlNVEV0WVdVNU1TMHdaVEJrTnpjek1EbGpPVFVpTENKMGIydGxibDkxYzJVaU9pSnBaQ0lzSW1GMWRHaGZkR2x0WlNJNk1UY3hORE13TkRNd09Td2laWGh3SWpveE56RTBNekEzT1RBNUxDSnBZWFFpT2pFM01UUXpNRFF6TURrc0ltWmhiV2xzZVY5dVlXMWxJam9pUzJsMmFXeGxhSFJ2SWl3aVpXMWhhV3dpT2lKaGJHVnJjMmt1YTJsMmFXeGxhSFJ2UUcxbGRISnZjRzlzYVdFdVpta2lmUS5reXpPTFRkbUFKSkZTVUltSTdhQ3JRTm1YdlprNnBKcXdIOVBURzJSSG1BYWhQQ2hmZFljSTM0eEZja25wX0s2eXpLcGdKY3pWejRWV3Qzb3NnT29TWFpPS1JleUtON0ZrRC0xTFVZc1F0MjZWZGpGbjFxWkNBd1pNTFR1VW8xUzVQRk1ReXU5Y2JXejRFQnAwakVuZVJDUFQxSzR1Y0dqMWtLeUQ3Q2ZyOV9VT0ktOUwwTzdFWmx3aXl2UlVEdXB2bnU1S2lpcTVacTB3bFRlbDBESE9QYlpMdTBxUlBqV0VNM1FBUTI1bVlYam1HT3F5OHBORHJKd1dRRUdmYXNNRXk0T3F1VDlqcy1ETm01aWpNNjFBUE4tQ2QtdFBLMXQ5d2c3Y1RQbGN6TThweE5hRjVPQ3NUSm5uVVNMaWFRRFZ0SGNMb3cxR25jOVU3dEFfNzZqQkEiLCJpYXQiOjE3MTQzMDQzMTAsImV4cCI6MTcxNDMwNzkxMH0.O9sl96tIa4078KzSjbGaPSgB7Qllg-t8pUwwrY-DeNg
${surveyStatus}    True
&{headers}    Content-Type=application/json   Authorization=Bearer ${token}
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



*** Keywords ***
Send Post Requests For Each entry
    [Arguments]    @{allEntries}
    FOR    ${entry}    IN    @{allEntries}
        ${containsData}=    GET   http://127.0.0.1:3000/api/kubios/check/${entry.entry_date}    headers=${headers}    json=${entry}
        IF    ${containsData.json()['kubiosDataFound']}
            ${response}=    POST   http://127.0.0.1:3000/api/entries    headers=${headers}    json=${entry}
        END
    END


Check if month empty
    [Arguments]    ${monthNum}    ${yearNum}
    ${response}=    GET    url=http://127.0.0.1:3000/api/entries/monthly?month=${monthNum}&year=${yearNum}     headers=${headers}
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
    ${response}=    GET    url=http://127.0.0.1:3000/api/reports/available-weeks     headers=${headers}
    RETURN    ${response.json()}


*** Test Cases ***
Submit survey if necessary
    IF    ${surveyStatus} == True
        Log To Console  Survey has been completed
    ELSE IF    ${surveyStatus} == False
        ${body}=    Create Dictionary    ${question1}=${answer1}   ${question2}=${answer2}    activities=@{activities}
        ${response}=    POST    url=http://127.0.0.1:3000/api/survey     headers=${headers}    json=${body}
        Status Should Be    200
        Log    Response from correct request: ${response.text}
    END


Get survey and activities
    ${response}=    GET    url=http://127.0.0.1:3000/api/survey     headers=${headers}
    Log    Check if response question/answer pairs match the previously made survey
    Should Be Equal As Strings    ${response.json()}[questions][0][question]   ${question1}
    Should Be Equal As Strings    ${response.json()}[questions][1][question]    ${question2}
    Should Be Equal As Strings    ${response.json()}[questions][0][answer]   ${answer1}
    Should Be Equal As Strings    ${response.json()}[questions][1][answer]    ${answer2}

    ${response_activities}=    Set Variable    ${response.json()}[activities]
    ${matched}=    Evaluate    ${response_activities} == ${activities}
    Should Be True    ${matched}

    ${response}=    GET    url=http://127.0.0.1:3000/api/survey/activities     headers=${headers}
    ${response_only_activities}=    Set Variable    ${response.json()}[activities]
    ${matched}=    Evaluate    ${response_only_activities} == ${activities}
    Should Be True    ${matched}


Get self
    ${response}=    GET    url=http://127.0.0.1:3000/api/auth/me     headers=${headers}
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
    Should Be Equal As Strings    ${availableReports[0]['week_number']}    6
    Should Be Equal As Strings    ${availableReports[1]['week_number']}    7
    ${week6reportId}=    Set Variable    ${availableReports[0]['report_id']}
    ${week7reportId}=    Set Variable    ${availableReports[1]['report_id']}
    Set Suite Variable    ${week6reportId}
    Set Suite Variable    ${week7reportId}


Compaire february reports
    ${week6report}=    GET    url=http://127.0.0.1:3000/api/reports/${week6reportId}     headers=${headers}
    Should Be Equal As Numbers    ${week6report.json()['week_si_avg']}    4.28
    Should Be Equal As Strings    ${week6report.json()['previous_week_si_avg']}    None
    Should Be Equal As Numbers    ${week6report.json()['gray_percentage']}    57.14

    ${week7report}=    GET    url=http://127.0.0.1:3000/api/reports/${week7reportId}     headers=${headers}
    Should Be Equal As Numbers    ${week7report.json()['yellow_percentage']}    28.57
    Should Be Equal As Numbers    ${week7report.json()['week_si_avg']}    4.27
    Should Be Equal As Strings    ${week7report.json()['previous_week_si_avg']}    4.28

