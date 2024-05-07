*** Settings ***
Library           SeleniumLibrary

*** Variables ***
${URL}            https://hyte-server-aleksi.northeurope.cloudapp.azure.com/settingsD/profileD.html  # Adjust as needed
${DELETION_LINK}  xpath=//a[text()='Poista Käyttäjä']
${MODAL_CLOSE}    css=.close2  # Update the selector according to your HTML structure

*** Test Cases ***
Open and Close Deletion Modal
    Open Browser    ${URL}    Chrome
    Maximize Browser Window
    Wait Until Element Is Visible    ${DELETION_LINK}    10s
    Click Element    ${DELETION_LINK}
    Sleep    2s    # Delay to observe the modal if necessary
    Click Element    ${MODAL_CLOSE}
    Close Browser

