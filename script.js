
let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;
let correctSound = new Audio("correct.mp3");
let guaranteed = 0;
let wrongSound = new Audio("wrong.mp3");

fetch("sorular.json")
    .then(response => response.json())
    .then(data => {
        questions = data;
        showQuestion();
    });

function showQuestion() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById("timer").innerText = "Süre: " + timeLeft + " sn";
    document.getElementById("audienceChart").style.display = "none";
    document.getElementById("phoneResult").style.display = "none";
    timer = setInterval(updateTimer, 1000);

    const q = questions[currentQuestion];
    document.getElementById("question").innerText = q.soru;
    document.getElementById("score").innerText = "Kazanç: ₺" + score;
    document.querySelectorAll(".answer").forEach((btn, i) => {
        btn.innerText = q.siklar[i];
        btn.disabled = false;
        btn.onclick = () => checkAnswer(i);
    });
}

function updateTimer() {
    timeLeft--;
    document.getElementById("timer").innerText = "Süre: " + timeLeft + " sn";
    if (timeLeft <= 0) {
        clearInterval(timer);
        alert("Süre doldu! Oyun bitti.");
        location.reload();
    }
}

function checkAnswer(i) {
    clearInterval(timer);
    const correct = questions[currentQuestion].dogru;
    if (i === correct) {
        correctSound.play();
        
        const moneyLadder = [0, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000];
        score = moneyLadder[currentQuestion + 1];
    
        currentQuestion++;
        if (currentQuestion < questions.length) {
            setTimeout(showQuestion, 1000);
        } else {
            alert("Tebrikler! Tüm soruları doğru bildiniz! Toplam puan: " + score);
        }
    } else {
        wrongSound.play();
        alert("Yanlış cevap! Güvencede olan kazancınız: ₺" + guaranteed);
        location.reload();
    }
}

// 50:50 jokeri
document.getElementById("fifty").onclick = () => {
    const correct = questions[currentQuestion].dogru;
    let count = 0;
    document.querySelectorAll(".answer").forEach((btn, i) => {
        if (i !== correct && count < 2) {
            btn.innerText = "";
            btn.disabled = true;
            count++;
        }
    });
    document.getElementById("fifty").disabled = true;
};

// Seyirci jokeri
document.getElementById("audience").onclick = () => {
    const correct = questions[currentQuestion].dogru;
    const chartCanvas = document.getElementById("audienceChart");
    chartCanvas.style.display = "block";

    let data = [Math.floor(Math.random()*30), Math.floor(Math.random()*30), Math.floor(Math.random()*30), Math.floor(Math.random()*30)];
    data[correct] += 40;

    new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C', 'D'],
            datasets: [{
                label: 'Seyirci Oyları (%)',
                data: data,
                backgroundColor: '#007bff'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    document.getElementById("audience").disabled = true;
};

// Telefon jokeri
document.getElementById("phone").onclick = () => {
    const correct = questions[currentQuestion].dogru;
    const friendKnows = Math.random() < 0.7;
    const chosen = friendKnows ? correct : Math.floor(Math.random() * 4);

    const text = `Arkadaşınız diyor ki: Bence cevap "${String.fromCharCode(65 + chosen)}" olabilir.`;
    const resultBox = document.getElementById("phoneResult");
    resultBox.innerText = text;
    resultBox.style.display = "block";

    document.getElementById("phone").disabled = true;
};
