*** Settings ***
Library     SeleniumLibrary 
Library     CryptoLibrary    variable_decryption=True

*** Variables ***
${LOGIN URL}    http://localhost:5500/Frontend/login/loginpatient.html
${BROWSER}    chrome
${USERNAME}    crypt:0djxIIou9vDYRtkj2wQzqyMuEYsMWhKjQpiv/v223lsRxKDkSWU3YNuCmjBPviML5LLLII25t9PgF2UDWGq7NtH/xpFPxC+ZIPmt

${PASSWORD}    crypt:S4n+fBnYqc4Wjpgmv4eFu2Sa4ezTrITl8joWMFf4cmEg9cS2qpWiZsMrBXBweqRQKF5t5mi6bBHg

*** Test Cases ***
Test Web Form
    Open Browser to Login Page
    Input Text      id=LoginEmail        ${USERNAME}    delay=1.0 s 
    Input Text    id=LoginPassword        ${PASSWORD}      delay=1.0 s
    Click Button    class=LoginUser   

Successful login
    Wait Until Page Contains    Kirjaudutaan sisään! 

Choose Weekreports
    Wait Until Page Contains    Viikkoraportit
    Click Link    xpath=//a[contains(@href, 'weekReportAll.html')]

Choose first week
    Wait Until Page Contains    Viikko
    Click Link    xpath=//a[contains(@href, 'weekReport.html')]
    Week Report Page Should Be open

*** Keywords ***
Open Browser to Login Page
    Open Browser    ${LOGIN URL}    ${BROWSER}
    Title Should Be    Vite App
Open Browser to Week reports
    Open Browser    ${LOGIN URL}    ${BROWSER}
    Title Should Be    Vite App
All Week Reports Should Be Shown
    Title Should Be    Vite App
Week Report Page Should Be open
    Title Should Be    Vite App


    