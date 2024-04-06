*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource    Keywords.robot  

*** Variables ***
${base_url}=    http://127.0.0.1:3000/


*** Test Cases ***
Send a succesfull POST Request to log in as patient user
    ${session}=    Create Session    mysession    ${base_url}
    ${body}=    Create Dictionary    username=${Username}    password=${Password}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    ${session}    api/auth/patient-login    json=${body}    headers=${headers}    expected_status=200

    Log    Response Body: ${response}
