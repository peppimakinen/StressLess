*** Settings ***
Library     Browser    auto_closing_level=SUITE
Library     CryptoLibrary    variable_decryption=True
Library    RequestsLibrary
Library    Collections


*** Variables ***
${Username}    crypt:PcD1tAnbMlsIge3//bWX4nPhyyB0Lu0DPXPDipMgv3tIcWPcfvgM8jV4XFsfW2vEqheWyVv+A2cg0ChpDESQKDWy5Y0k0W3LEgMriR0p
${Password}    crypt:tSNi8tTS6pD1IMEy9EfvtwdUdwF3xqzMd/EZMEfhtTw04yQGm3XXaODegPSQ7uIFyRRK8wJj3NrGbvzjp8OZAw==
${token}    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFsZWtzaS5raXZpbGVodG9AbWV0cm9wb2xpYS5maSIsImZ1bGxfbmFtZSI6IkFsZWtzaSBLaXZpbGVodG8iLCJ1c2VyX2xldmVsIjoicGF0aWVudCIsImNyZWF0ZWRfYXQiOiIyMDI0LTA0LTI4VDA4OjIxOjAyLjAwMFoiLCJzdXJ2ZXlDb21wbGV0ZWQiOnRydWUsInRva2VuIjoiZXlKcmFXUWlPaUpRVkVSUlVHWkxialUyYlhCNVJVOXBjSFZ4T0dSRlVEQlBlWGxKTVdoMVdsUXdNVkpWZWtkWFVTdFJQU0lzSW1Gc1p5STZJbEpUTWpVMkluMC5leUpoZEY5b1lYTm9Jam9pY2twZldHRmZjeTFXYW1WMldtcFRTbk5MZEVoV1VTSXNJbk4xWWlJNkltVmtNamc0TW1VNUxXUXdZVEF0TkRnek1pMDRNMlF4TFRjME5tRXlPVEl6TVRka05DSXNJbVZ0WVdsc1gzWmxjbWxtYVdWa0lqcDBjblZsTENKcGMzTWlPaUpvZEhSd2N6cGNMMXd2WTI5bmJtbDBieTFwWkhBdVpYVXRkMlZ6ZEMweExtRnRZWHB2Ym1GM2N5NWpiMjFjTDJWMUxYZGxjM1F0TVY5MVVXMUJaelExZUhraUxDSmpiMmR1YVhSdk9uVnpaWEp1WVcxbElqb2laV1F5T0RneVpUa3RaREJoTUMwME9ETXlMVGd6WkRFdE56UTJZVEk1TWpNeE4yUTBJaXdpWjJsMlpXNWZibUZ0WlNJNklrRnNaV3R6YVNJc0ltRjFaQ0k2SWpjME5UY3hjR1JvZFdNM2RuWmhhelIwYkRRMWRYUnpPSFU0SWl3aVpYWmxiblJmYVdRaU9pSTJZakUxTm1Jd01DMDFZVE0wTFRRelpqQXRZamN5T0Mxa1pqa3pNRE0yWTJJNU9UUWlMQ0owYjJ0bGJsOTFjMlVpT2lKcFpDSXNJbUYxZEdoZmRHbHRaU0k2TVRjeE5ESTVPREV6TlN3aVpYaHdJam94TnpFME16QXhOek0xTENKcFlYUWlPakUzTVRReU9UZ3hNelVzSW1aaGJXbHNlVjl1WVcxbElqb2lTMmwyYVd4bGFIUnZJaXdpWlcxaGFXd2lPaUpoYkdWcmMya3VhMmwyYVd4bGFIUnZRRzFsZEhKdmNHOXNhV0V1Wm1raWZRLkZpMDdIRFlmcF83Sk9fMmhtMGRhV20yUHpsLVp2NzVBOVRmN3BCTmRCc09LY1llb1Q4RXh2MWNtOHZHNnJNV3k1VVVWZUUycE1tU1I1dy1zel80YjFWbktISDZUQktJdUwxQ3hKYXFwaGpvRExpZ3ZxRWVtbzNHanNmTlN4Z2h1ZVlRYlRUSjRSN3ZLZ0oyR29qNU00aVNJbDBibmtqMU4zZW1WWjhpc041VWVUcGF6ZXlRN09TQVRiOW5PeWZiRFRSWjJacTFxZ3BVRnZveFR1WnVEcTRKcEFTU1I4djR1LW1STll5U1E2LUE2U3hIQTlTMEdreHhENFpkOTVNRjEzRmNHNmM0ZFhWYmROVzR1OWRPX09kOEU4VjNWd2JPZk5vQWt1UmpOWkNUR3p6YkRmQ1ZZb09kM21tbm1kZVhfVW9MZFNZLW1jbkNVdXNsM2ZLeHV0dyIsImlhdCI6MTcxNDI5ODEzNiwiZXhwIjoxNzE0MzAxNzM2fQ.RhUfGRzTMFNJ-V1q4uyaDeXil1MDfle6EXpIGVJlpvg
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
        ${response}=    POST   http://127.0.0.1:3000/api/entries    headers=${headers}    json=${entry}
        Log    ${response}
    END

*** Keywords ***
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


*** Test Cases ***
Submit survey if necessary
    IF    ${surveyStatus} == True
        Log    Survey has been completed
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
