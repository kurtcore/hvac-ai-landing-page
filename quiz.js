// Quiz state
let currentQuestion = 1;
const totalQuestions = 7;
const answers = {};

// DOM elements
const questionCards = document.querySelectorAll('.question-card');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const progressFill = document.getElementById('progressFill');
const emailInput = document.getElementById('emailInput');
const nameInput = document.getElementById('nameInput');

// Update progress bar
function updateProgress() {
    const progress = (currentQuestion / (totalQuestions + 1)) * 100;
    progressFill.style.width = progress + '%';
}

// Show current question
function showQuestion(questionNum) {
    questionCards.forEach(card => {
        card.classList.remove('active');
        if (parseInt(card.dataset.question) === questionNum) {
            card.classList.add('active');
        }
    });

    // Update navigation buttons
    if (questionNum === 1) {
        backBtn.style.visibility = 'hidden';
    } else {
        backBtn.style.visibility = 'visible';
    }

    if (questionNum === totalQuestions + 1) {
        nextBtn.textContent = 'See My Results';
    } else {
        nextBtn.textContent = 'Next';
    }

    // Check if current question is answered
    checkAnswer();
    updateProgress();
}

// Check if current question has an answer
function checkAnswer() {
    const currentCard = document.querySelector(`.question-card[data-question="${currentQuestion}"]`);

    if (currentQuestion === totalQuestions + 1) {
        // Email question
        const email = emailInput.value.trim();
        nextBtn.disabled = !email || !email.includes('@');
    } else {
        // Multiple choice question
        const hasAnswer = answers[`q${currentQuestion}`] !== undefined;
        nextBtn.disabled = !hasAnswer;
    }
}

// Handle option selection
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
        const questionCard = this.closest('.question-card');
        const questionNum = parseInt(questionCard.dataset.question);

        // Remove selected class from all options in this question
        questionCard.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selected class to clicked option
        this.classList.add('selected');

        // Store answer
        answers[`q${questionNum}`] = this.dataset.value;

        // Enable next button
        nextBtn.disabled = false;
    });
});

// Email input validation
if (emailInput) {
    emailInput.addEventListener('input', checkAnswer);
}

// Next button handler
nextBtn.addEventListener('click', function() {
    if (currentQuestion === totalQuestions + 1) {
        // Submit quiz
        submitQuiz();
    } else {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
});

// Back button handler
backBtn.addEventListener('click', function() {
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
});

// Submit quiz and redirect
async function submitQuiz() {
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();

    // Prepare data for GHL webhook
    const quizData = {
        email: email,
        name: name,
        monthlyCalls: answers.q1,
        annualRevenue: answers.q2,
        responseTime: answers.q3,
        currentSoftware: answers.q4,
        biggestBottleneck: answers.q5,
        budget: answers.q6,
        growthGoal: answers.q7,
        timestamp: new Date().toISOString()
    };

    // TODO: Replace with your actual GHL webhook URL
    const webhookURL = 'YOUR_GHL_WEBHOOK_URL_HERE';

    try {
        // Send to GHL webhook
        await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quizData)
        });
    } catch (error) {
        console.error('Error sending to webhook:', error);
        // Continue anyway to redirect user
    }

    // Convert monthly calls range to midpoint for calculator
    const callsMapping = {
        '0-50': 25,
        '50-100': 75,
        '100-200': 150,
        '200-400': 300,
        '400+': 500
    };

    const monthlyCallsValue = callsMapping[answers.q1] || 185;

    // Redirect to main page plan section with data for calculator
    window.location.href = `index.html?calls=${monthlyCallsValue}&email=${encodeURIComponent(email)}&source=quiz#plan`;
}

// Initialize
showQuestion(1);
