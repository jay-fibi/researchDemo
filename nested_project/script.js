document.addEventListener('DOMContentLoaded', function() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '<p>This content was added by JavaScript!</p>';
    console.log('Page loaded and content updated.');
});

function randomFunction() {
    alert('This is a random function!');
}

function anotherRandomFunction() {
    const randomNumber = Math.floor(Math.random() * 100);
    console.log('Random number: ' + randomNumber);
    return randomNumber;
}
