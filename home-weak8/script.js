const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();
let highScore = localStorage.getItem('highScore') || Number.MAX_SAFE_INTEGER;

const quoteElement = document.getElementById('quote');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const resultModal = document.getElementById('result-modal');
const resultMessage = document.getElementById('result-message');
const closeModal = document.getElementById('close-modal');

closeModal.onclick = function() {
    resultModal.style.display = "none";
};
window.onclick = function(event) {
    if (event.target === resultModal) {
        resultModal.style.display = "none";
    }
};

startButton.addEventListener('click', () => {
    const quoteIndex = Math.floor(Math.random() * quotes.length); 
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;

    const spanWords = words.map(word => `<span>${word} </span>`);
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';
    typedValueElement.value = '';
    typedValueElement.focus();
    startTime = new Date().getTime();
    startButton.disabled = true;
    typedValueElement.disabled = false;
});

typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        const elapsedTime = new Date().getTime() - startTime;
        typedValueElement.disabled = true;
        startButton.disabled = false;

        if (elapsedTime < highScore) {
            highScore = elapsedTime;
            localStorage.setItem('highScore', highScore);
        }

        resultMessage.innerHTML = `<h3>축하합니다 ! <br>  당신의 현재 기록은 <h2>${elapsedTime / 1000}초</h2> <br><br> 최고 기록: ${highScore / 1000}초</h3>`;
        resultModal.style.display = 'block';

    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        typedValueElement.value = '';
        wordIndex++;

        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';
        quoteElement.childNodes[wordIndex - 1].classList.add('flash'); 

    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = 'typing';

    } else {
        typedValueElement.className = 'error';
    }
});
