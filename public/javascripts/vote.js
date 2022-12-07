const button = document.querySelector('.vote');
button.addEventListener('click', function () {

    if (button.getAttribute('value').length) {
        button.setAttribute("value", "");
    } else {
        button.setAttribute("value", "true");
    }
});