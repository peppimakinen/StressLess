*** Settings ***
Library     Browser    auto_closing_level=SUITE
Library     CryptoLibrary    variable_decryption=True
Library    RequestsLibrary
Library    Collections

*** Variables ***
${Username}    crypt:PcD1tAnbMlsIge3//bWX4nPhyyB0Lu0DPXPDipMgv3tIcWPcfvgM8jV4XFsfW2vEqheWyVv+A2cg0ChpDESQKDWy5Y0k0W3LEgMriR0p
${Password}    crypt:tSNi8tTS6pD1IMEy9EfvtwdUdwF3xqzMd/EZMEfhtTw04yQGm3XXaODegPSQ7uIFyRRK8wJj3NrGbvzjp8OZAw==

*** Test Cases ***
Authenticate as Patient
    ${body}    Create Dictionary    username=${Username}   password=${Password}
    ${response}    POST    url=http://127.0.0.1:3000/api/auth/patient-login    json=${body}
    Log    ${response.json()}
    ${token}    Set Variable    ${response.json()}[token]
    ${surveyStatus}    Set Variable    ${response.json()}[user][surveyCompleted]

    Log    ${token}
    Log    ${surveyStatus}
    Set Suite Variable    ${token}
    Set Suite Variable    ${surveyStatus}

Submit survey if necessary
    ${question1}=    Set Variable    On a scale from 1 to 5, how stressed are you?
    ${question2}=    Set Variable    Does stress affect your sleep?
    ${answer1}=    Set Variable    Around a 3
    ${answer2}=    Set Variable    It doesn't
    @{activities}=    Create List    Hiking    Swimming    Meditation
    Set Suite Variable    ${question1}
    Set Suite Variable    ${question2}
    Set Suite Variable    ${answer1}
    Set Suite Variable    ${answer2}
    Set Suite Variable    @{activities}


    ${headers}=    Create Dictionary    Authorization    Bearer ${token}
    Set Suite Variable    ${headers}

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

    Log    Check if response response activities list contains all necessary activities
    ${response_activities}=    Set Variable    ${response.json()}[activities]
    ${matched}=    Evaluate    ${response_activities} == ${activities}
    Should Be True    ${matched}

    Log    Test also the /activities endpoint
    ${response}=    GET    url=http://127.0.0.1:3000/api/survey/activities     headers=${headers}
    ${response_only_activities}=    Set Variable    ${response.json()}[activities]
    ${matched}=    Evaluate    ${response_only_activities} == ${activities}
    Should Be True    ${matched}