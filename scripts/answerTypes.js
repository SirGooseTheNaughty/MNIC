export const answerTypes = {
    radio: `
        <label class="answer radio">
            <span class="label"></span>
            <input type="radio" name="age">
            <span class="checkmark">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.03028 9.75539C4.35365 10.0827 5.07387 9.9742 5.15141 9.45956C5.63388 6.26445 8.04808 3.56895 9.87502 1.02899C10.3816 0.32514 9.21682 -0.343497 8.71685 0.351978C7.04735 2.67279 4.94312 5.11487 4.11992 7.93106C3.17919 6.96965 2.23467 6.01736 1.17957 5.17256C0.511368 4.63732 -0.444456 5.58028 0.230944 6.12114C1.60562 7.22223 2.7936 8.50622 4.03028 9.75539Z" fill="white"/>
            </svg>              
            </span>
        </label>`,
    checkbox:  `
        <label class="answer checkbox">
            <span class="label"></span>
            <input type="checkbox">
            <span class="checkmark">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.03028 9.75539C4.35365 10.0827 5.07387 9.9742 5.15141 9.45956C5.63388 6.26445 8.04808 3.56895 9.87502 1.02899C10.3816 0.32514 9.21682 -0.343497 8.71685 0.351978C7.04735 2.67279 4.94312 5.11487 4.11992 7.93106C3.17919 6.96965 2.23467 6.01736 1.17957 5.17256C0.511368 4.63732 -0.444456 5.58028 0.230944 6.12114C1.60562 7.22223 2.7936 8.50622 4.03028 9.75539Z" fill="white"/>
            </svg>              
            </span>
        </label>`,
}

export const noAnswer = `
    <label class="answer checkbox noAnswer">
        <span class="label">Ничего из вышеуказанного</span>
        <input type="checkbox" checked>
        <span class="checkmark">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.03028 9.75539C4.35365 10.0827 5.07387 9.9742 5.15141 9.45956C5.63388 6.26445 8.04808 3.56895 9.87502 1.02899C10.3816 0.32514 9.21682 -0.343497 8.71685 0.351978C7.04735 2.67279 4.94312 5.11487 4.11992 7.93106C3.17919 6.96965 2.23467 6.01736 1.17957 5.17256C0.511368 4.63732 -0.444456 5.58028 0.230944 6.12114C1.60562 7.22223 2.7936 8.50622 4.03028 9.75539Z" fill="white"/>
        </svg>              
        </span>
    </label>`;

export const resultGroups = {
    ok: `
        <div class="resultGroup ok">
            <h3>Достаточное содержание микронутриентов</h3>
        </div>
    `,
    lack: `
        <div class="resultGroup lack">
            <h3>недостаток микронутриентов</h3>
        </div>
    `,
    bad: `
        <div class="resultGroup bad">
            <h3>Выраженный дефицит микронутриентов</h3>
        </div>
    `,
};