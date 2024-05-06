// redirect to kubios for user creation
const Kubios = document.getElementById('gotokubios');
Kubios.addEventListener('click', () => {
    window.location.href = 'https://kubioscloud.auth.eu-west-1.amazoncognito.com/signup?response_type=code&client_id=1h4rmoi5s66u2cliaqcpuejgpg&redirect_uri=https://analysis.kubioscloud.com/v2/portal/login&scope=openid%20profile%20email%20phone';
})

// redirect to patient login page
const patientLogin = document.getElementById('gotopatientlogin');
patientLogin.addEventListener('click', () => {
    window.location.href = '../login/loginpatient.html';
})