document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const resultElement = document.getElementById('result');

    // Fetch the dataset
    fetch('https://huggingface.co/datasets/K-Monitor/kmdb_base')
        .then(response => response.json())
        .then(data => {
            const dataset = data.train;
            const personsCount = {};

            // Count the number of articles for each person
            dataset.forEach(article => {
                article.persons.forEach(person => {
                    if (!personsCount[person]) {
                        personsCount[person] = 0;
                    }
                    personsCount[person]++;
                });
            });

            // Get the top 10 persons with the most articles
            const topPersons = Object.keys(personsCount)
                .sort((a, b) => personsCount[b] - personsCount[a])
                .slice(0, 10);

            // Select the correct answer and two random wrong answers
            const correctAnswer = topPersons[0];
            const wrongAnswers = topPersons.slice(1, 3);
            const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

            // Display the question and options
            questionElement.textContent = 'Which person is mentioned in the most articles?';
            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.addEventListener('click', () => {
                    if (option === correctAnswer) {
                        resultElement.textContent = 'Correct!';
                    } else {
                        resultElement.textContent = 'Wrong!';
                    }
                });
                optionsElement.appendChild(button);
            });
        });
});
