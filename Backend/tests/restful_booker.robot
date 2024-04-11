*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource   restful_booker_keywords.resource
Suite Setup    Authenticate as Patient

*** Test Cases ***
Get me
    ${headers}=    Create Dictionary    Authorization    Bearer ${token}
    ${response}=    GET    http://127.0.0.1:3000/api/auth/me    headers=${headers}
    Status Should Be    200
    Log List    ${response.json()}
