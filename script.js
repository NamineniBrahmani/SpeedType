document.addEventListener("DOMContentLoaded", () => {
  const quotes = {
    easy: [
      "Practice makes perfect.",
      "Typing is fun.",
      "Keep going.",
      "I love programming.",
      "Code is life."
    ],
    medium: [
      "The quick brown fox jumps over the lazy dog.",
      "JavaScript is a versatile language.",
      "Learning never exhausts the mind.",
      "Errors are opportunities to learn."
    ],
    hard: [
      "Simplicity is the soul of efficiency and the key to great design, even when systems become complex under the hood.",
      "Asynchronous programming in JavaScript allows for non-blocking behavior using callbacks, promises, or async-await patterns.",
      "Debugging is like being the detective in a crime movie where you are also the murderer who left mysterious clues.",
      "Mastering algorithms and data structures is crucial for building scalable, high-performance software applications.",
      "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it."
    ]
  };

  // DOM elements
  const inputArea = document.getElementById("inputArea");
  const quoteBox = document.getElementById("quoteBox");
  const timerDisplay = document.getElementById("timer");
  const wpmDisplay = document.getElementById("wpm");
  const accuracyDisplay = document.getElementById("accuracy");
  const leaderboardList = document.getElementById("leaderboardList");
  const startBtn = document.getElementById("startBtn");
  const submitBtn = document.getElementById("submitBtn");

  // State
  let timer;
  let timeLeft = 60;
  let currentQuote = "";
  let isStarted = false;

  // Event listeners
  startBtn.addEventListener("click", startTest);
  submitBtn.addEventListener("click", finishTest);

  function startTest() {
    reset();
    const difficulty = document.getElementById("difficulty").value;
    const quotesList = quotes[difficulty];
    currentQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
    quoteBox.textContent = currentQuote;

    inputArea.disabled = false;
    inputArea.value = "";
    inputArea.focus();

    isStarted = true;
    submitBtn.style.display = "inline-block";

    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        finishTest();
      }
    }, 1000);
  }

  function finishTest() {
    if (!isStarted) return;

    clearInterval(timer);
    inputArea.disabled = true;
    isStarted = false;
    submitBtn.style.display = "none";

    const typed = inputArea.value.trim();
    const wordsTyped = typed === "" ? 0 : typed.split(/\s+/).length;
    const wpm = Math.round(wordsTyped); // since timer is 60s

    const correctChars = countCorrectChars(currentQuote, typed);
    const accuracy = currentQuote.length > 0
      ? Math.round((correctChars / currentQuote.length) * 100)
      : 0;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;

    saveToLeaderboard(wpm, accuracy);
    loadLeaderboard();
  }

  function countCorrectChars(expected, actual) {
    let correct = 0;
    for (let i = 0; i < expected.length && i < actual.length; i++) {
      if (expected[i] === actual[i]) correct++;
    }
    return correct;
  }

  function reset() {
    clearInterval(timer);
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    wpmDisplay.textContent = 0;
    accuracyDisplay.textContent = 0;
    quoteBox.textContent = "";
    inputArea.value = "";
    inputArea.disabled = true;
    submitBtn.style.display = "none";
  }

  function saveToLeaderboard(wpm, accuracy) {
    const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    scores.push({ wpm, accuracy });
    scores.sort((a, b) => b.wpm - a.wpm);
    localStorage.setItem("leaderboard", JSON.stringify(scores.slice(0, 5)));
  }

  function loadLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const leaderboardBody = document.getElementById("leaderboardBody");
  leaderboardBody.innerHTML = "";

  scores.forEach((entry, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>#${index + 1}</td>
      <td>${entry.wpm}</td>
      <td>${entry.accuracy}</td>
    `;

    leaderboardBody.appendChild(row);
  });
}


  loadLeaderboard(); // load existing scores on page load
});
