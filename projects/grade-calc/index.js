const totalPointsDiv = document.querySelector('#total-points');
const sepDiv = document.querySelector('#sep');
const missing = document.querySelector('#missing-tally');
const result = document.querySelector('#result');

let params = new URLSearchParams(window.location.search);
let totalPoints = Number(params.get('tot')) || 0;
let sep = params.get('sep') || '';

totalPointsDiv.innerHTML = totalPoints;
sepDiv.innerHTML = sep;

document.addEventListener('keydown', event => {
    if (event.key == 'Enter') {
        missing.value = '';
        event.stopImmediatePropagation();
    }
});

missing.addEventListener('input', event => {
    let total_points = parseInt(totalPointsDiv.value);
    let sep = sepDiv.value;

    let points = missing.value.trim().split(sep).map((val, index) => Number(val.trim())).reduce((acc, c) => acc + c, 0);
    result.textContent = `score: ${total_points - points}`;
});

