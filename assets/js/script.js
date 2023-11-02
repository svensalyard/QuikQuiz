const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const timerContainer = document.getElementById('timer');
const scoreContainer = document.getElementById('score-container');

const savedScores = [];

let shuffledQuestions, currentQuestionIndex, timer, timeInterval, score=0;


startButton.addEventListener('click', startGame);
answerButtonsElement.addEventListener('click', selectAnswer);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

function startGame() {
    clearInterval(timeInterval);
    timer = 30;
    timerContainer.textContent = timer;
    timeInterval = setInterval(function () {
        timer--;
        timerContainer.textContent = timer + ' : time remaining (sec)';
        if (timer === 0) {
            clearInterval(timeInterval);
            endGame();
        }
    }, 1000);

    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        endGame();
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function restartGame() {
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.classList.add('hide');

    startGame();
}


function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    setStatusClass(selectedButton, correct);

    if (correct) {
        score += 5;
    } else {
        timer -= 5;
        if (timer < 0) {
            timer = 0;
        }
    }

    answerButtonsElement.querySelectorAll('button').forEach(button => {
        button.disabled = true;
    });

    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === 'true');
    });

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        nextButton.classList.remove('hide');
    } else {
        endGame();
    }
}


function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function endGame() {
    clearInterval(timeInterval);

    questionContainerElement.classList.add('hide');
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.classList.remove('hide');

    if (timer > 0) {
        score += timer;
    }

    scoreContainer.innerHTML = `
        <h2>Game Over!</h2>
        <p>Your Score: ${score} points</p> <!-- Use the total score here -->
        <label for="initials">Enter your initials:</label>
        <input type="text" id="initials">
        <button onclick="saveScore()">Save Score</button>
        <button onclick="restartGame()">Restart Game</button> 
    `;
}


function saveScore() {
    const initialsInput = document.getElementById('initials');
    const initials = initialsInput.value;

    const scoreData = {
        initials: initials,
        score: score
    };

    savedScores.push(scoreData);

    savedScores.sort((a, b) => b.score - a.score);

    const leaderboard = document.getElementById('leaderboard');
    leaderboard.classList.remove('hide');

    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = '';

    savedScores.forEach((scoreData, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${scoreData.initials} - ${scoreData.score} points`;
        scoreList.appendChild(listItem);
    });

    initialsInput.value = '';
}


const questions = [
    {
        question: 'What is at the end of a line?',
        answers: [
            { text: ';', correct: true },
            { text: '.', correct: false },
            { text: ':', correct: false },
            { text: '?', correct: false }
        ]
    },
    {
        question: 'What key word defines a variable that can change?',
        answers: [
            { text: 'const', correct: false },
            { text: 'then', correct: false },
            { text: 'for', correct: false },
            { text: 'var or let', correct: true }
        ]
    },
    {
        question: 'A ___ is used to call a function?',
        answers: [
            { text: '{}', correct: false },
            { text: '[]', correct: false },
            { text: '()', correct: true },
            { text: '<>', correct: false }
        ]
    },
    {
        question: 'Console.____ sends a message to the console?',
        answers: [
            { text: '.send', correct: false },
            { text: '.store', correct: false },
            { text: '.stringify', correct: false },
            { text: '.log', correct: true }
        ]
    },
];