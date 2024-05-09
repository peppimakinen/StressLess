*** Settings ***
Library           SeleniumLibrary
Resource          credentials.robot  # Assuming this contains valid login URL and possibly other reusable keywords

Suite Setup       Open Browser To LoginPage
Suite Teardown    Close Browser
Test Teardown     Close Browser  # Ensure browser closes if a test fails

*** Variables ***
${LOGIN URL}      http://localhost:5173/login/loginpatient.html
${EXPECTED ERROR MESSAGE}  Kirjautuminen epäonnistui

*** Test Cases ***
Invalid Login Attempt Should Pass
    [Documentation]    Verifies that invalid login attempts are correctly handled and reported.
    [Tags]             negative
    Enter Invalid Credentials
    Click Button    LoginSubmit
    Confirm Login Failed
    Page Should Not Contain    Kirjautuminen onnistui
    Wait Until Page Contains    Kirjautuminen epäonnistui

*** Keywords ***
Open Browser To LoginPage
    Open Browser    ${LOGIN URL}    Chrome
    Maximize Browser Window
    Wait Until Element Is Visible    id=LoginEmail    10s

Enter Invalid Credentials
    Input Text    id=LoginEmail      invalid@example.com
    Input Text    id=LoginPassword   incorrectPassword

Submit Credentials
    Click Button    id=LoginSubmit

Confirm Login Failed
    Wait Until Page Contains    ${EXPECTED ERROR MESSAGE}    timeout=10s
