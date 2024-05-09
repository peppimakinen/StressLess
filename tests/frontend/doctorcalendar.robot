*** Settings ***
Library     SeleniumLibrary 
Resource    doctorkeywords.robot

*** Variables ***
${LOGIN URL}    http://localhost:5173/login/logindoctor.html
${BROWSER}      Chrome

*** Keywords ***
Open Browser to Login Page
    Open Browser    ${LOGIN URL}    ${BROWSER}
    Title Should Be    Vite App

*** Test Cases ***
Test Login Form
    Open Browser to Login Page
    [Tags]          sensitive
    Input Text      id=LoginEmail        ${USERNAME}    delay=0.1 s 
    Input Text      id=LoginPassword     ${PASSWORD}      delay=0.1 s
    Click Button    class=LoginUser   

Successful login
    Wait Until Page Contains    Kirjaudutaan sisään! 

Choose client to view
    Wait Until Element Is Visible    xpath=//a[@href="../home/doctorhome.html?client=2"]
    Click Link    xpath=//a[@href="../home/doctorhome.html?client=2"]

Choose date to inspect and close
    Wait Until Element Is Visible    xpath=//li[@class='' and contains(@style, 'background-color: #FFF67E;') and text()='4']
    Click Element    xpath=//li[@class='' and contains(@style, 'background-color: #FFF67E;') and text()='4']
    Wait Until Element Is Visible     xpath=//span[@class='closePopup']
    Click Element     xpath=//span[@class='closePopup']

