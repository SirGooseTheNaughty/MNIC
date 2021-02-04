const base = document.querySelector("#base");
let currentPage = 0;
let container;
let results;
let calcResults = {
  name: "",
  age: "",
  sex: "",
  weight: "",
  values: [],
  texts: [],
};
let progressText, progressBar, questionText, questionBlock, buttonBlock;

document.addEventListener("DOMContentLoaded", () => {
  $(base).append(basePage);
  container = base.querySelector(".container");
  const cookieData = getCookie('mnic');
  if (cookieData) {
    calcResults = JSON.parse(cookieData);
    showResults()
  } else {
    base.querySelector(".begin").addEventListener("click", startTest);
  }
  base.addEventListener("click", clickListener);
});

function startTest() {
  results = [];
  $(container).html("");
  $(container).append(questionsPage);
  progressText = container.querySelector("#progress p");
  progressBar = container.querySelector("#progress .bar div");
  questionText = container.querySelector("h2");
  questionBlock = container.querySelector(".questionBlock");
  buttonBlock = container.querySelector(".buttonBlock");
  nextPage(0);
}

function showResults() {
  $(container).html("");
  $(container).append(resultsPage);
  $('h1').html(`${calcResults.name}, ваши персональные рекомендации`)
  $('.welcomeText').text(calcResults.name + $('.welcomeText').text());
  displayResults();
}

function calcAndSaveResults() {
    calculateResults();
    saveCookies();
}

function calculateResults() {
  calcResults.name = results[0];
  calcResults.age = questions[1].findIndex((ans) => ans == results[1]);
  calcResults.sex = results[2];
  calcResults.weight = results[3];
  for (let i = 4; i < results.length; i++) {
    let resInd = 0;
    if (results[i] < 5) {
      resInd = 0;
    } else if (results[i] < 7) {
      resInd = 1;
    } else if (results[i] < 9) {
      resInd = 2;
    } else {
      resInd = 3;
    }
    if (i - 4 == 12) {
      calcResults.texts.push(doses[i - 4][0][resInd]);
      calcResults.texts.push(doses[i - 4][1][resInd]);
      calcResults.values.push(resInd);
    } else {
      calcResults.texts.push(doses[i - 4][resInd]);
    }
    calcResults.values.push(resInd);
  }
}

function displayResults() {
  const resultsList = base.querySelector(".resultsList");
  if (calcResults.values.some(value => value == 0)) {
    $(resultsList).append(resultGroups.ok);
  }
  if (calcResults.values.some(value => value == 1 || value == 2)) {
    $(resultsList).append(resultGroups.lack);
  }
  if (calcResults.values.some(value => value == 3)) {
    $(resultsList).append(resultGroups.bad);
  }
  calcResults.values.forEach((res, i) => {
    if (res == 0) {
      $(".ok").append(
        `<div class="result">
            <p>${vitamins[i]}: ваша дневная дозировка ${calcResults.texts[i]}</p>
        </div>`
      );
    }
    if (res == 1 || res == 2) {
      $(".lack").append(
        `<div class="result">
            <p>${vitamins[i]}: ваша дневная дозировка ${calcResults.texts[i]}</p>
        </div>`
      );
    }
    if (res == 3) {
      $(".bad").append(
        `<div class="result">
            <p>${vitamins[i]}: ваша дневная дозировка ${calcResults.texts[i]}</p>
        </div>`
      );
    }
  });
}

function saveCookies() {
    const data = JSON.stringify(calcResults);
    setCookie('mnic', data, {secure: true, 'max-age': 3600});
}

function nextPage(dir) {
  const nextPage = currentPage + dir;
  if (nextPage >= questions.length) {
    saveResults(currentPage);
    calcAndSaveResults();
    showResults();
    return;
  }
  if (dir > 0) {
    saveResults(currentPage);
  }
  $(questionBlock).html("");
  const blank = loadBlanks(nextPage);
  $(questionBlock).append(blank);
  loadQuestions(nextPage);
  currentPage = nextPage;
  progressText.textContent = `${currentPage + 1}/24 вопросов`;
  progressBar.style.width = `${(100 * currentPage) / 24}%`;
  questionText.textContent =
    currentPage < 4 ? questionTitles[currentPage] : questionTitles[4];
}

function loadBlanks(page) {
  let blank = "";
  switch (page) {
    case 0:
      return '<input type="text" class="answer" placeholder="Введите Имя">';
    case 1:
    case 2:
      questions[page].forEach(() => {
        blank += answerTypes["radio"];
      });
      return blank;
    case 3:
      return '<input type="text" class="answer" placeholder="Укажите вес (в кг)" pattern="^[0-9]+$">';
    default:
      questions[page].forEach(() => {
        blank += answerTypes["checkbox"];
      });
      blank += noAnswer;
      return blank;
  }
}

function loadQuestions(page) {
  if (page != 0 && page != 3) {
    const label = base.querySelectorAll(".label");
    questions[page].forEach((question, i) => {
      label[i].textContent = question;
    });
  }
}

function clickListener(e) {
  const target = e.target;
  if (target.tagName == "BUTTON" && !target.classList.contains("begin")) {
    if (target.classList.contains("results")) {
        saveToFile();
    } else if (target.classList.contains("forwards") && isAnswerValid()) {
      nextPage(1);
    } else if (target.classList.contains("backwards")) {
      nextPage(-1);
    }
  } else if (target.classList.contains("checkbox")) {
    answer(target);
  }
}

function answer(target) {
  if (target.classList.contains("noAnswer")) {
    document.querySelectorAll("input").forEach((e) => (e.checked = false));
    setTimeout(
      () => (document.querySelector(".noAnswer input").checked = true),
      50
    );
  } else {
    document.querySelector(".noAnswer input").checked = false;
  }
}

function isAnswerValid() {
  const inputs = base.querySelectorAll("input");
  let valid = false;
  inputs.forEach((input) => {
    valid +=
      (input.validity.valid && input.type == "text" && input.value.length) ||
      input.checked;
  });
  return Boolean(valid);
}

function saveResults(page) {
  switch (page) {
    case 0:
      saveText(page);
      break;
    case 1:
    case 2:
      saveRadio(page);
      break;
    case 3:
      saveText(page);
      break;
    default:
      saveVitaminPoints(page);
      break;
  }
}

function saveText(page) {
  results[page] = base.querySelector("input").value;
}

function saveRadio(page) {
  base.querySelectorAll("input").forEach((input) => {
    if (input.checked) {
      results[page] = $(input).siblings(".label").text();
    }
  });
}

function saveVitaminPoints(page) {
  let res = 0;
  base.querySelectorAll("input").forEach((input, i) => {
    if (input.checked) {
      res += points[page][i];
    }
  });
  results[page] = res || 0;
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function saveToFile() {
    html2canvas(container, {
        y: $(container).offset().top,
        height: $(container).height() - $('.buttonBlock').height(),
        width: $(container).width()*1.1
    })
        .then(canvas => {
            canvas.toBlob(function(blob) {
                saveAs(blob, "MNIC_results.pdf");
            });
        });
}