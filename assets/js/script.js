  // Mendapatkan elemen progress bar dan teks progress
  const progressBar = document.querySelector(".progress-bar"),
    progressText = document.querySelector(".progress-text");

  // Fungsi untuk memperbarui progress bar dan teks progress
  const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
  };

  // Mendapatkan elemen tombol mulai dan input lainnya
  const startBtn = document.querySelector(".start"),
    numQuestions = document.querySelector("#num-questions"),
    category = document.querySelector("#category"),
    difficulty = document.querySelector("#difficulty"),
    timePerQuestion = document.querySelector("#time"),
    quiz = document.querySelector(".quiz"),
    startScreen = document.querySelector(".start-screen");

  // Variabel untuk menyimpan data quiz
  let questions = [],
    time = 30,
    score = 0,
    currentQuestion,
    timer;

  // Fungsi untuk memulai quiz
  const startQuiz = () => {
    const num = numQuestions.value,
      cat = category.value,
      diff = difficulty.value;
    loadingAnimation();
    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        questions = data.results;
        setTimeout(() => {
          startScreen.classList.add("hide");
          quiz.classList.remove("hide");
          currentQuestion = 1;
          showQuestion(questions[0]);
        }, 1000);
      });
  };

  startBtn.addEventListener("click", startQuiz);

  // Fungsi untuk menampilkan pertanyaan
  const showQuestion = (question) => {
    const questionText = document.querySelector(".question"),
      answersWrapper = document.querySelector(".answer-wrapper"),
      questionNumber = document.querySelector(".number");

    questionText.innerHTML = question.question;

    const answers = [
      ...question.incorrect_answers,
      question.correct_answer.toString(),
    ];
    answersWrapper.innerHTML = "";
    answers.sort(() => Math.random() - 0.5);
    answers.forEach((answer) => {
      answersWrapper.innerHTML += `
      <div class="answer">
              <span class="text">${answer}</span>
              <span class="checkbox">
                  <span class="icon">✓</span>
              </span>
            </div>
      `;
    });

    questionNumber.innerHTML = `Question <span class="current">${questions.indexOf(question) + 1}</span> / <span class="total">${questions.length}</span>`;

    // Menambahkan event listener ke setiap jawaban
    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
      answer.addEventListener("click", () => {
        if (!answer.classList.contains("checked")) {
          answersDiv.forEach((answer) => {
            answer.classList.remove("selected");
          });
          answer.classList.add("selected");
          submitBtn.disabled = false;
        }
      });
    });

    time = timePerQuestion.value;
    startTimer(time);
  };

  // Fungsi untuk memulai timer
  const startTimer = (time) => {
    playAudio("countdown.mp3"); // Memanggil fungsi playAudio saat timer dimulai
    timer = setInterval(() => {
      if (time >= 0) {
        progress(time);
        time--;
      } else {
        checkAnswer();
      }
    }, 1000);
  };

  // Fungsi untuk animasi loading
  const loadingAnimation = () => {
    startBtn.innerHTML = "Loading";
    const loadingInterval = setInterval(() => {
      if (startBtn.innerHTML.length === 10) {
        startBtn.innerHTML = "Loading";
      } else {
        startBtn.innerHTML += ".";
      }
    }, 500);
  };

  const submitBtn = document.querySelector(".submit"),
    nextBtn = document.querySelector(".next");
  submitBtn.addEventListener("click", () => {
    checkAnswer();
  });

  nextBtn.addEventListener("click", () => {
    nextQuestion();
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
  });

  // Fungsi untuk memeriksa jawaban
  const checkAnswer = () => {
    clearInterval(timer);
    const selectedAnswer = document.querySelector(".answer.selected");
    if (selectedAnswer) {
      const answer = selectedAnswer.querySelector(".text").innerHTML;
      console.log(currentQuestion);
      if (answer === questions[currentQuestion - 1].correct_answer) {
        score++;
        selectedAnswer.classList.add("correct");
      } else {
        selectedAnswer.classList.add("wrong");
        const correctAnswer = document.querySelectorAll(".answer").forEach((answer) => {
          if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
            answer.classList.add("correct");
          }
        });
      }
    } else {
      const correctAnswer = document.querySelectorAll(".answer").forEach((answer) => {
        if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
          answer.classList.add("correct");
        }
      });
    }
    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
      answer.classList.add("checked");
    });

    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
  };

  // Fungsi untuk menampilkan pertanyaan berikutnya
  const nextQuestion = () => {
    if (currentQuestion < questions.length) {
      currentQuestion++;
      showQuestion(questions[currentQuestion - 1]);
    } else {
      showScore();
    }
  };

  const endScreen = document.querySelector(".end-screen"),
    finalScore = document.querySelector(".final-score"),
    totalScore = document.querySelector(".total-score");

  // Fungsi untuk menampilkan skor akhir
  const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/ ${questions.length}`;
  };

  const restartBtn = document.querySelector(".restart");
  restartBtn.addEventListener("click", () => {
    window.location.reload();
  });

  // Fungsi untuk memutar audio
  const playAudio = (src) => {
    const audio = new Audio(src);
    audio.play();
  };
