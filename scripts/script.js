import { basePage, questionsPage, resultsPage } from './pages.js'
import { questionTitles, questions, points, additionalPoints, addingPointsByQs, addingPointsByAge, doses, vitamins } from './questions.js'
import { answerTypes, noAnswer, resultGroups } from './answerTypes.js'
import { setCookie } from './cookies.js'

// const baseSelector = "#base";
// const resPageBlockSelectors = ".respb";
// const confidentialLink  = "#";
const base = document.querySelector(baseSelector);
const resultPageBlocks = document.querySelectorAll(resPageBlockSelectors);
let currentPage = 0;
let container;
let results;
let medAnswers = [];
let calcResults = {
  name: "",
  age: "",
  sex: "",
  weight: "",
  points: [],
  values: [],
  texts: [],
};
let progressText, progressBar, questionText, questionBlock, buttonBlock;

document.addEventListener("DOMContentLoaded", () => {
  base.id = "base";
  $(base).html("");
  $(base).append(basePage);
  $(".confidential a").attr("href", confidentialLink);
  container = base.querySelector(".container");
  const cookieData = getCookie('mnic');
  if (cookieData) {
    calcResults = JSON.parse(cookieData);
    showResults()
  } else {
    base.querySelector(".begin").addEventListener("click", startTest);
    $(resultPageBlocks).css('display', 'none');
  }
  base.addEventListener("click", clickListener);
});

function unloadListener(event) {
  event.preventDefault();
  event.returnValue = 'Не забудьте сохранить рехультаты!';
}

function restartTest() {
  $(base).html("");
  $(base).append(basePage);
  $(".confidential a").attr("href", confidentialLink);
  container = base.querySelector(".container");
  base.querySelector(".begin").addEventListener("click", startTest);
}

function startTest() {
  results = [];
  $(container).html("");
  $(container).append(questionsPage);
  progressText = container.querySelector("#progress p");
  progressBar = container.querySelector("#progress .bar div");
  questionText = container.querySelector("h2");
  questionBlock = container.querySelector(".questionBlock");
  buttonBlock = container.querySelector(".buttonBlock");
  window.addEventListener('beforeunload', unloadListener);
  nextPage(0);
}

function showResults() {
  $(container).html("");
  $(container).append(resultsPage);
  $('h1').html(`${calcResults.name}, ваши персональные рекомендации`)
  $('.welcomeText').text(calcResults.name + $('.welcomeText').text());
  displayResults();
  $(resultPageBlocks).css('display', 'block');
  window.removeEventListener('beforeunload', unloadListener);
}

function calcAndSaveResults() {
  refactorResults();
  addPoints();
  interpretResults();
  getTextResults();
  saveCookies();
}

function refactorResults() {
  calcResults.name = results[0];
  calcResults.age = questions.age.findIndex((ans) => ans == results[1]);
  calcResults.sex = results[2];
  calcResults.weight = results[3];
  for (let i = 4; i < questions.vitamins.length + 4; i++) {
    if (i - 4 == 12) {
      calcResults.points.push(results[i]);
    }
    calcResults.points.push(results[i]);
  }
}

function addPoints() {
  for (let i = 0; i < addingPointsByQs.length; i++) {
    if (results[24 + i] >= 5) {
      addingPointsByQs[i].forEach((p, j) => {
        calcResults.points[j] += p;
      })
    }
  }
  if (calcResults.age != 1) {
    addingPointsByAge[calcResults.age].forEach((p, i) => {
      calcResults.points[i] += p;
    })
  }
}

function interpretResults() {
  calcResults.name = results[0];
  calcResults.age = questions.age.findIndex((ans) => ans == results[1]);
  calcResults.sex = results[2];
  calcResults.weight = results[3];
  calcResults.points.forEach(p => {
    if (p < 5) {
      calcResults.values.push(0);
    } else if (p < 7) {
      calcResults.values.push(1);
    } else if (p < 9) {
      calcResults.values.push(2);
    } else {
      calcResults.values.push(3);
    }
  });
};

function getTextResults() {
  calcResults.values.forEach((res, i) => {
    calcResults.texts.push(doses[i][res]);
  });
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
          <div class="marker"></div>
            <p>${vitamins[i]}: ваша дневная дозировка ${calcResults.texts[i]}</p>
        </div>`
      );
    }
    if (res == 1 || res == 2) {
      $(".lack").append(
        `<div class="result">
          <div class="marker"></div>
            <p>${vitamins[i]}: ваша дневная дозировка ${calcResults.texts[i]}</p>
        </div>`
      );
    }
    if (res == 3) {
      $(".bad").append(
        `<div class="result">
          <div class="marker"></div>
            <p>${vitamins[i]}: ваша дневная дозировка ${calcResults.texts[i]}</p>
        </div>`
      );
    }
  });
}

function saveCookies() {
    const data = JSON.stringify(calcResults);
    setCookie('mnic', data, {'max-age': 30000000});
}

function nextPage(dir) {
  const nextPage = currentPage + dir;
  if (nextPage < 0) {
    restartTest();
    return;
  }
  if (nextPage >= 4 + questions.vitamins.length + questions.additional.length) {
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
  progressText.textContent = `${currentPage + 1}/28 вопросов`;
  progressBar.style.width = `${(100 * currentPage) / 28}%`;
  if (currentPage < 4) {
    questionText.textContent = questionTitles[currentPage];
  } else if (currentPage < 24) {
    questionText.textContent = questionTitles[4];
  } else {
    questionText.textContent = questionTitles[5];
  }
  $(window).scrollTop(0);
}

function loadPrevAnswers(page) {
  switch (page) {
    case 0:
    case 3:
      base.querySelector("input").value = medAnswers[page];
      break;
    case 1:
    case 2:
      base.querySelectorAll("input")[medAnswers[page]].checked = true;
      break;
    default:
      base.querySelectorAll("input").forEach((input, i) => {
        if (medAnswers[page][i]) {
          input.checked = true;
        } else {
          input.checked = false;
        }
      })
      break;
  }
}

function loadBlanks(page) {
  let blank = "";
  if (page == 0) {
    return '<input type="text" class="answer" placeholder="Введите Имя">';
  } else if (page == 1) {
    questions.age.forEach(() => {
      blank += answerTypes["radio"];
    });
    return blank;
  } else if (page == 2) {
    questions.sex.forEach(() => {
      blank += answerTypes["radio"];
    });
    return blank;
  } else if (page == 3) {
    return '<input type="text" class="answer" placeholder="Укажите вес (в кг)" pattern="^[0-9]+$">';
  } else if (page < 24) {
    questions.vitamins[page - 4].forEach(() => {
      blank += answerTypes["checkbox"];
    });
    blank += noAnswer;
    return blank;
  } else {
    questions.additional[page - 24].forEach(() => {
      blank += answerTypes["checkbox"];
    });
    blank += noAnswer;
    return blank;
  }
}

function loadQuestions(page) {
  if (page != 0 && page != 3) {
    const label = base.querySelectorAll(".label");
    if (page == 1) {
      questions.age.forEach((question, i) => {
        label[i].textContent = question;
      });
    } else if (page == 2) {
      questions.sex.forEach((question, i) => {
        label[i].textContent = question;
      });
    } else if (page < 24) {
      questions.vitamins[page - 4].forEach((question, i) => {
        label[i].textContent = question;
      });
    } else {
      questions.additional[page - 24].forEach((question, i) => {
        label[i].textContent = question;
      });
    }
  }
  if (medAnswers[page]) {
    loadPrevAnswers(page);
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
  medAnswers[page] = results[page];
}

function saveRadio(page) {
  base.querySelectorAll("input").forEach((input, i) => {
    if (input.checked) {
      results[page] = $(input).siblings(".label").text();
      medAnswers[page] = i;
    }
  });
}

function saveVitaminPoints(page) {
  let res = 0;
  medAnswers[page] = [];
  if (page < 24) {
    base.querySelectorAll("input").forEach((input, i) => {
      if (input.checked) {
        res += points[page - 4][i];
      }
      medAnswers[page].push(+input.checked);
    });
  } else {
    base.querySelectorAll("input").forEach((input, i) => {
      if (input.checked) {
        res += additionalPoints[page - 24][i];
      }
      medAnswers[page].push(+input.checked);
    });
  }
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
                saveAs(blob, "MNIC_results.png");
            });
        });
}