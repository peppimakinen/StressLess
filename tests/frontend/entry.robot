*** Settings ***
Library     SeleniumLibrary 
Resource    entrykeywords.robot

# Suite Setup       Open Browser To LoginPage
# Suite Teardown    Close Browser
# Test Teardown     Close Browser  # Ensure browser closes if a test fails

*** Variables ***
${LOGIN URL}    http://localhost:5173/login/loginpatient.html
${BROWSER}      Chrome

*** Keywords ***
Open Browser to Login Page
    Open Browser    ${LOGIN URL}    ${BROWSER}
    Title Should Be    Vite App

*** Test Cases ***
Test Login Form
    Open Browser to Login Page
    Input Text      id=LoginEmail        ${USERNAME}    delay=0.1 s 
    Input Text      id=LoginPassword        ${PASSWORD}      delay=0.1 s
    Click Button    class=LoginUser
  

Successful login
    Wait Until Page Contains    Kirjaudutaan sisään! 

Choose date for new entry
    Wait Until Element Is Visible    xpath=//li[contains(text(), '8')]
    Click Element    xpath=//li[contains(text(), '8')]

Input entry data and submit
    Wait Until Element Is Visible    xpath=//input[@name='SubmitNew' and @value='Lähetä']
    Click Element    xpath=//input[@class='moodBtn' and @id='redBtn']
    Click Element    xpath=//option[@value='lukeminen']
    Input Text       id=NotesNew     ${notes}      delay=0.1 s
    Click Element    xpath=//input[@name='SubmitNew' and @value='Lähetä']

Successful submit
    Wait Until Page Contains    Uusi merkintä luotu ja HRV data lisätty
