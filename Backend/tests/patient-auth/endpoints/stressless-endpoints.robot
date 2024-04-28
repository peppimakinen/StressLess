*** Settings ***
Library     Browser    auto_closing_level=SUITE
Library     CryptoLibrary    variable_decryption=True
Library    RequestsLibrary
Library    Collections


*** Variables ***
${Username}    crypt:PcD1tAnbMlsIge3//bWX4nPhyyB0Lu0DPXPDipMgv3tIcWPcfvgM8jV4XFsfW2vEqheWyVv+A2cg0ChpDESQKDWy5Y0k0W3LEgMriR0p
${Password}    crypt:tSNi8tTS6pD1IMEy9EfvtwdUdwF3xqzMd/EZMEfhtTw04yQGm3XXaODegPSQ7uIFyRRK8wJj3NrGbvzjp8OZAw==
${token}    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFsZWtzaS5raXZpbGVodG9AbWV0cm9wb2xpYS5maSIsImZ1bGxfbmFtZSI6IkFsZWtzaSBLaXZpbGVodG8iLCJ1c2VyX2xldmVsIjoicGF0aWVudCIsImNyZWF0ZWRfYXQiOiIyMDI0LTA0LTI4VDA4OjIxOjAyLjAwMFoiLCJzdXJ2ZXlDb21wbGV0ZWQiOmZhbHNlLCJ0b2tlbiI6ImV5SnJhV1FpT2lKUVZFUlJVR1pMYmpVMmJYQjVSVTlwY0hWeE9HUkZVREJQZVhsSk1XaDFXbFF3TVZKVmVrZFhVU3RSUFNJc0ltRnNaeUk2SWxKVE1qVTJJbjAuZXlKaGRGOW9ZWE5vSWpvaVlXWkRPREZCTUZCVmMyaEliMlJpYTJSblZsazRkeUlzSW5OMVlpSTZJbVZrTWpnNE1tVTVMV1F3WVRBdE5EZ3pNaTA0TTJReExUYzBObUV5T1RJek1UZGtOQ0lzSW1WdFlXbHNYM1psY21sbWFXVmtJanAwY25WbExDSnBjM01pT2lKb2RIUndjenBjTDF3dlkyOW5ibWwwYnkxcFpIQXVaWFV0ZDJWemRDMHhMbUZ0WVhwdmJtRjNjeTVqYjIxY0wyVjFMWGRsYzNRdE1WOTFVVzFCWnpRMWVIa2lMQ0pqYjJkdWFYUnZPblZ6WlhKdVlXMWxJam9pWldReU9EZ3laVGt0WkRCaE1DMDBPRE15TFRnelpERXROelEyWVRJNU1qTXhOMlEwSWl3aVoybDJaVzVmYm1GdFpTSTZJa0ZzWld0emFTSXNJbUYxWkNJNklqYzBOVGN4Y0dSb2RXTTNkblpoYXpSMGJEUTFkWFJ6T0hVNElpd2laWFpsYm5SZmFXUWlPaUl6WW1GbE9HWTRNUzFrTjJZMUxUUXdZMkl0WVRWbE1pMHlOMkV4TURJNE1ERXhaV1VpTENKMGIydGxibDkxYzJVaU9pSnBaQ0lzSW1GMWRHaGZkR2x0WlNJNk1UY3hOREk1TWpRMk1Td2laWGh3SWpveE56RTBNamsyTURZeExDSnBZWFFpT2pFM01UUXlPVEkwTmpFc0ltWmhiV2xzZVY5dVlXMWxJam9pUzJsMmFXeGxhSFJ2SWl3aVpXMWhhV3dpT2lKaGJHVnJjMmt1YTJsMmFXeGxhSFJ2UUcxbGRISnZjRzlzYVdFdVpta2lmUS5Ec1RQU1kyS1dueXdkTTdvQ053VktOamFZOVVwelZrV05YM2dWWFpkUEpoeWhfekZsVUNVSy1WcWc5N2lpUjhLa2tqR1k2ZUFnTHZwUENyaXgxcTBYR0kxTFp1OWU2SVljWVV4cEQxWlkyUG5paDFqaVRkcmtQLTlLTmRSUFNwYlctVHN5N3Zpd2JDV1o5UnNDbEQydHlvbFQzZGo4LUlsdGZDTmp0YTJwU2FfWW1qU2JlR1E3X1hxTml0czEwVGUzVzVYZldNX0hpM1g0a3BmSmliYW50Y181MTFzbGxoSkpXS3NJMDgydW9PVEN1OFlQeE1XbkI5Nk9fdWszLXFvSExJX1lGWnhkZWZVVnpqeW5ZQTA1dWRCeHB3b0RUUmFXNEtudS1Ya3p0RUNLMGUtWkZ0VUd1aXQ2OVdrR1hleGs3SThLcjNLQzJDamhrUXhDWGpMOFEiLCJpYXQiOjE3MTQyOTI0NjIsImV4cCI6MTcxNDI5NjA2Mn0.rkUstKZCTHDWfX-c3oHotwrlKeFWnaJaqfPcKoXor6A
${surveyStatus}    True
&{headers}    Content-Type=application/json   Authorization=Bearer ${token}
${question1}    On a scale from 1 to 5, how stressed are you?
${question2}    Does stress affect your sleep?
${answer1}  Around a 3
${answer2}  It doesn't
@{activities}   Hiking    Swimming    Meditation

&{entry1}    entry_date=2024-02-09    mood_color=9BCF53    notes=First entry for week 6    activities=['1', '2', '3']
&{entry2}    entry_date=2024-02-10    mood_color=FFF67E    notes=Second entry for week 6    activities=['4', '5', '6']
&{entry3}    entry_date=2024-02-11    mood_color=FF8585    notes=Third entry for week 6    activities=['7', '8', '9']
@{week6Entries}    &{entry1}    &{entry2}    &{entry3}

&{entry4}    entry_date=2024-02-12    mood_color=FF8585    notes=First entry for week 7    activities=['10', '11', '12']
&{entry5}    entry_date=2024-02-13    mood_color=FFF67E    notes=Second entry for week 7    activities=['13', '14', '15']
&{entry6}    entry_date=2024-02-14    mood_color=FFF67E    notes=Third entry for week 7    activities=['16', '17', '18']
@{week7Entries}    &{entry4}    &{entry5}    &{entry6}



*** Keywords ***
Send Post Requests For Each entry
    [Arguments]    @{allEntries}
    FOR    ${entry}    IN    @{allEntries}
        ${response}=    POST   http://127.0.0.1:3000/api/entries    headers=${headers}    json=${entry}
        Log    ${response}
    END

Check if month empty
    [Arguments]    ${monthNum}    ${yearNum}
    ${response}=    GET    url=http://127.0.0.1:3000/api/entries/monthly?month=${monthNum}&year=${yearNum}     headers=${headers}
    Log    ${response.json()}
    ${emptyMonth}    Set Variable  True
    FOR    ${date}    IN    ${response.json()}
        Run Keyword If    ${date} != '{}'    Set Variable    ${emptyMonth}    False
    END
    RETURN   ${emptyMonth}

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
    Log    Is month empty? ${isEmpty}
