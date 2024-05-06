// redirect to studentlanding.html when #forstudents button is clicked
const StudentLanding = document.getElementById('forstudents');
StudentLanding.addEventListener('click', () => {
    // console.log('clicked opiskelijoille')
    window.location.href = 'studentlanding.html';
});

// redirect to doctorlanding.html when #fordoctors button is clicked
const DoctorLanding = document.getElementById('fordoctors');
DoctorLanding.addEventListener('click', () => {
    // console.log('clicked alan ammattilaisille')
    window.location.href = 'doctorlanding.html';
});
