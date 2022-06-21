const totPointsInput = document.querySelector('#total-points');
const sepInput = document.querySelector('#sep');
const missingInput = document.querySelector('#missing-tally');
const result = document.querySelector('#result');
const percentage = document.querySelector('#percentage');

let params = new URLSearchParams(window.location.search);
let totalPoints = Number(params.get('tot')) || 0;
let sep = params.get('sep') || '';

totPointsInput.value = totalPoints;
sepInput.value = sep;

document.addEventListener('keydown', event => {
    if (event.key == 'Enter') {
        missingInput.value = '';
        event.stopImmediatePropagation();
    }
});

[totPointsInput, sepInput, missingInput].forEach(
    value => value.addEventListener('input', event => {
        let total_points = parseInt(totPointsInput.value);
        let sep = sepInput.value;

        let points = missingInput.value.trim().split(sep).map((val, index) => Number(val.trim())).reduce((acc, c) => acc + c, 0);
        result.textContent = `score: ${total_points - points}`;
        percentage.textContent = `percentage: ${(((total_points - points) / total_points) * 100).toFixed(0)}%`;
    })
);

