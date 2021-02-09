export const basePage = `
    <div class="container">
        <h1>Начни свой путь к хорошему самочувствию</h1>
        <div class="welcomeText">
        Тестирование займет 5-7 минут. На основании ваших ответов алгоритм
        платформы обработает информацию и определит ваши дефициты
        микронутриентов, а также составит персонализированную программу с
        дневной рекомендованной дозировкой для 20 необходимых питательных
        веществ.
        <p>
            Тест не предназначен для диагностики заболеваний, а также для
            назначения лечения или замены консультации у специалиста. Если у вас
            есть значительные симптомы, вам следует немедленно обратиться к врачу.
        </p>
        </div>
        <button class="forwards begin">начать тестирование</button>
        <div class="welcomeText confidential">Информация строго <a>конфиденциальна</a> и не передается третьим лицам.</div>
    </div>
`;

export const questionsPage = `
    <div id="progress">
        <p>1/24 вопросов</p>
        <div class="bar"><div style="width: 4%"></div></div>
    </div>
    <h2>Как вас зовут?</h2>
    <div class="questionBlock">
        <input type="text" class="answer" placeholder="Введите Имя">
    </div>
    <div class="buttonBlock">
        <button class="backwards">назад</button>
        <button class="forwards">далее</button>
    </div>
`;

export const resultsPage = `
    <h1>Ваши персональные рекомендации</h1>
    <div class="welcomeText finalText">, на основании предоставленной информации, вам рекомендовано дополнительно включить в ваш рацион питания продукты и добавки содержащие данные микронутриенты:
    </div>
    <div class="resultsList"></div>
    <div class="buttonBlock">
    <button class="forwards results">
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0)">
        <path d="M14.3279 9.16992V13.2422C14.3279 13.5653 14.062 13.8281 13.7351 13.8281H2.11671C1.78985 13.8281 1.52393 13.5653 1.52393 13.2422V9.16992H0.338379V13.2422C0.338379 14.2114 1.13614 15 2.11671 15H13.7351C14.7157 15 15.5135 14.2114 15.5135 13.2422V9.16992H14.3279Z" fill="white"/>
        <path d="M10.7712 6.90574L8.5186 9.13231V0H7.33305V9.13231L5.08049 6.90574L4.24219 7.73438L7.92582 11.3755L11.6095 7.73438L10.7712 6.90574Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0">
        <rect width="15.1751" height="15" fill="white" transform="translate(0.338379)"/>
        </clipPath>
        </defs>
        </svg>            
        СКАЧАТЬ РЕЗУЛЬТАТЫ
    </button>
    </div>
`
