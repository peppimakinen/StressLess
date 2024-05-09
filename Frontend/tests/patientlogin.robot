*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    patientloginkeywords.robot  

*** Test Cases ***
Test Web Form
    New Browser    chromium    headless=No  
    New Page       http://localhost:5173/login/loginpatient.html 
    Get Title      ==    Vite App  
    Type Text      form.LoginForm input[name="LoginEmail"]        ${Username}    delay=0.1 s 
    Type Secret    form.LoginForm input[name="LoginPassword"]        $Password      delay=0.1 s
    Click With Options    form.LoginForm input[name="LoginSubmit"]    delay=2 s