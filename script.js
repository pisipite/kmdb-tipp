const dataset = /* Load your dataset here */;
let currentQuestion = {};
let score = 0;
let totalQuestions = 0;

document.getElementById('next').addEventListener('click', () => {
    generateQuestion();
});

function generateQuestion() {
    // Reset result
    document.getElementById('result').innerText = '';

    // Select a random month
    const randomMonth = getRandomMonth();
    const articles = dataset['train'].filter(article => article.pub_time.startsWith(randomMonth));

    // Find the most mentioned person
    const personCounts = {};
    articles.forEach(article => {
        article.persons.forEach(person => {
            if (!personCounts[person]) {
                personCounts[person] = 0;
            }
            personCounts[person]++;
        });
    });

    const sortedPersons = Object.keys(personCounts).sort((a, b) => personCounts[b] - personCounts[a]);
    const correctPerson = sortedPersons[0];
    const otherOptions = sortedPersons.slice(1, 10).sort(() => 0.5 - Math.random()).slice(0, 2);

    currentQuestion = {
        month: randomMonth,
        correctPerson,
        options: [correctPerson, ...otherOptions].sort(() => 0.5 - Math.random())
    };

    displayQuestion();
}

function displayQuestion() {
    document.getElementById('question').innerText = `${currentQuestion.month} hónapban kihez kapcsolódik a legtöbb cikk?`;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.addEventListener('click', () => checkAnswer(option));
        optionsDiv.appendChild(button);
    });
}

function checkAnswer(selectedPerson) {
    totalQuestions++;
    if (selectedPerson === currentQuestion.correctPerson) {
        score++;
        document.getElementById('result').innerText = 'Gratulálok, eltaláltad!';
    } else {
        document.getElementById('result').innerText = `Sajnálom, a helyes válasz: ${currentQuestion.correctPerson}`;
    }
    document.getElementById('score').innerText = `Kérdések száma: ${totalQuestions}, Találatok aránya: ${(score / totalQuestions * 100).toFixed(2)}%`;
}

function getRandomMonth() {
    const year = Math.floor(Math.random() * 3) + 2006; // Assuming dataset is from 2006 to 2008
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// Initialize the first question
generateQuestion();
