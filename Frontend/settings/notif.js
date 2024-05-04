document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('on');
        button.classList.toggle('off');
        button.textContent = button.classList.contains('on') ? 'PÄÄLLÄ' : 'POIS';
    });
});
