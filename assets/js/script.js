//Grabs all elements to be manipulated in JS
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const timerContainer = document.getElementById('timer');
const scoreContainer = document.getElementById('score-container');

// Array to store saved scores
const savedScores = [];

// sets to a default of zero
let shuffledQuestions, currentQuestionIndex, timer, timeInterval, score=0;

// listens for when the game starts and calls startGame
startButton.addEventListener('click', startGame);
//Listens for when an answer is selected and calls select answer
answerButtonsElement.addEventListener('click', selectAnswer);
//Listens for when next button is clicked and calls show next question
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

// Starts game and sets timer to 30 secs and counts down and displays timer
// ends game if timer ends
function startGame() {
    // clears previous intervals
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
    
    //Hides start button and increases the randomisation of the questions
    //shows questions and calls set next question
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
}

//randomizes questions and ends game if all questions are answered
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
    // hides game over message
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.classList.add('hide');

    //calls start game function to start the next game
    startGame();
}

// saves whether you answered correctly
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    setStatusClass(selectedButton, correct);

    // increases score by 5 if you answered correctly
    // decreases time by 5 seconds if answered incorrectly
    if (correct) {
        score += 5;
    } else {
        timer -= 5;
        if (timer < 0) {
            timer = 0;
        }
    }

    // disables buttons once question is answered to stop you from swapping once answers are revealed
    answerButtonsElement.querySelectorAll('button').forEach(button => {
        button.disabled = true;
    });

    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === 'true');
    });

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        nextButton.classList.remove('hide');
    } else {
        // if all questions are answered, handle the end of the game
        endGame();
    }
}

// shows correct and wrong answers by changing button background colors
function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

// removes correct and wrong answer colors
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// Ends the game, stops the timer
function endGame() {
    clearInterval(timeInterval);

    //hides the questions
    //shows the score container
    questionContainerElement.classList.add('hide');
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.classList.remove('hide');

    //increases score depending on how much time is left
    if (timer > 0) {
        score += timer;
    }

    //shows a game over screen and displays your points
    // lets you save score or restart game
    // gives an input box to save initials
    scoreContainer.innerHTML = `
        <h2>Game Over!</h2>
        <p>Your Score: ${score} points</p> <!-- Use the total score here -->
        <label for="initials">Enter your initials:</label>
        <input type="text" id="initials">
        <button onclick="saveScore()">Save Score</button>
        <button onclick="restartGame()">Restart Game</button> 
    `;
}

// Saves the score and displays it on the page
// shows the leaderboard
function saveScore() {
    const initialsInput = document.getElementById('initials');
    const initials = initialsInput.value;

    //saves current scores to array
    const scoreData = {
        initials: initials, //take initals input
        score: score    //take current score
    };

    savedScores.push(scoreData);

    //sorts by highest score to lowest
    savedScores.sort((a, b) => b.score - a.score);

    //updates leaderboard HTML
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.classList.remove('hide');

    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = '';

    //Takes the score data and displays it on a list element
    savedScores.forEach((scoreData, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${scoreData.initials} - ${scoreData.score} points`;
        scoreList.appendChild(listItem);
    });

    //clears initials input
    initialsInput.value = '';
}

// All of the questions and their states of true or false to store whether you answered correctly
const questions = [
    {
        question: 'What is at the end of a line?',
        answers: [
            { text: 'semi-colon', correct: true },
            { text: 'period', correct: false },
            { text: 'colon', correct: false },
            { text: 'question mark', correct: false }
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
            { text: 'Curly Brackets', correct: false },
            { text: 'Brackets', correct: false },
            { text: 'Parentheses', correct: true },
            { text: 'Angle Brackets', correct: false }
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