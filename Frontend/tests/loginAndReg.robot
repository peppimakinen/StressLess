*** Settings ***
Library           SeleniumLibrary

*** Variables ***
${BROWSER}        Chrome
${URL}            file://${CURDIR}/login.html

*** Test Cases ***
Test Register Form Submission
    Open Browser    ${URL}    ${BROWSER}
    Click Element   xpath=//a[@class='openPopup']
    Input Text      id=username    test_user
    Input Text      id=password    test_password
    Input Text      id=email       test@example.com
    Click Element   id=createAccount
    Wait Until Page Contains Element    xpath=//h3[text()='Account Created']
    Capture Page Screenshot

Test Login Form Submission
    Open Browser    ${URL}    ${BROWSER}
    Input Text      xpath=//div[@class='login']//input[@name='username']    test_user
    Input Text      xpath=//div[@class='login']//input[@name='password']    test_password
    Click Element   id=loginbutton
    Wait Until Page Contains Element    xpath=//h3[text()='Login Successful']
    Capture Page Screenshot