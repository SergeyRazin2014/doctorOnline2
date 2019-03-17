class StartManyQuizzes {
    constructor(quizNumbers) {
        this.quizNumbers = quizNumbers;
        this.currentQuizIndex = 0;
    }

    start() {

        //запуск тестов последовательно
        var p = Promise.resolve();
        for (let i = 0; i < this.quizNumbers.length; i++) {
            let quizNumber = this.quizNumbers[i];
            let isLastQuiz = false;
            if(i == this.quizNumbers.length-1){
                isLastQuiz = true;
            }
            p = p.then(() => new StartQuiz(quizNumber,isLastQuiz).executeQuizzing());
        }

    }

    isLastQuiz() {
        let result = this.currentQuizIndex >= this.quizNumbers.length;
        return result;
    }

    isManyQuiz() {
        let result = this.quizNumbers.length > 1;
        return result;
    }

    hasNextQuiz() {
        let result = this.isManyQuiz() && !this.isLastQuiz();
        return result;
    }
}
jQuery(document).ready(function () {
    //получить из странички номера выбранных тестов
    let quizChecked = $('.quizNumber');

    let quizNumbers = [];
    for (let i = 0; i < quizChecked.length; i++) {
        let item = quizChecked[i];
        let quizNumber = $(item).text().trim();
        quizNumbers.push(quizNumber);
    }

    //запустить тестирование
    let startManyQuiz = new StartManyQuizzes(quizNumbers);
    startManyQuiz.start();
});
"use strict"

class StartQuiz {
    constructor(quizNumber, isLastQuiz = false) {
        this.quizNumber = quizNumber;
        this.quiz = null;
        this.currentQuestionIndex = 0;
        this.key = '';
        this.findedDiagnos = null;
        this.resolve = null;
        this.isLastQuiz = isLastQuiz

        if ($('.isLastQuiz-div').length) {
            $('.isLastQuiz-div').html(`${isLastQuiz}`);
        } else {
            $('body').append(`<div class='isLastQuiz-div hidden' >${isLastQuiz}</div>`);
        }
    }

    executeQuizzing() {

        this.hideFooterButtons();

        let promise = new Promise((resolve, reject) => {

            this.resolve = resolve;

            new StartQuizLoader()
                .getQuiz(this.quizNumber)
                .then((quiz) => {
                    this.quiz = quiz;
                    this.showStartQuizInfo();
                    this.showQuestions();
                });
        });

        return promise;

    }

    showStartQuizInfo() {

        //при создании объекта StartQuiz - добавляется данная разметка, 
        //например если выбрано 2 теста, то будет 2 раза дабавлена данная разметка
        //классы с учетом номеров вопросов нужны чтобы корректно вставить данные когда у нас несколько тестов.

        let quizNameHtml = `<div class="alert alert-primary" role="alert">
                                Тест: <strong>${this.quiz.name}</strong>
                            </div>`;

        let quizQueryResultHtml = `<table class="quiz-query-result-table-${this.quiz.number} hidden table table-sm table-active">
                                        <thead>
                                            <tr>
                                                <th colspan="2" scope="col" class="px-4">ЖАЛОБЫ:</th>
                                            </tr>
                                        </thead>
                                        <tbody class = "quiz-query-result-${this.quiz.number}">
                                            <!--тут будут результаты ответов -->
                                        </tbody>
                                    </table>`;


        let quizDiagnosHtml = `<div class="hidden quiz-query-diagnos-${this.quiz.number} alert alert-warning" role="alert"> </div>`


        let quizFooterButtons = `<div class="quizFooterButtons hidden" >
                                    <button class=" nextQuizBtn btn btn-primary ml-3">ПРОДОЛЖИТЬ</button>
                                    <button class=" printBtn  btn btn-primary ml-3">ПЕЧАТЬ</button>
                                    <button class=" endBtn  btn btn-primary ml-3">ЗАВЕРШИТЬ</button>
                                </div>`;

        let quizInfoHtml = `<div class="start-quiz-info-${this.quiz.number}">
                                ${quizNameHtml}  ${quizQueryResultHtml}  ${quizDiagnosHtml}
                                <div class="quizzing"> </div> 
                                ${quizFooterButtons}
                            </div>`;

        $('body').append(quizInfoHtml);
    }

    showQuestions() {

        //прокрутить экран вниз
        window.scrollTo(0, document.body.scrollHeight);

        let self = this;


        //если найден диагноз
        if (this.findedDiagnos) {
            this.showDiagnos(`<p>РЕЗУЛЬТАТ: ${this.findedDiagnos.name}</p> `);
            $(`.quizzing`).addClass('hidden');
            return;
        }

        if (this.isQuestionsEnd()) {
            this.showDiagnos(`<p>РЕЗУЛЬТАТ: Установить диагноз не удалось, обратитесь к врачу.</p>`)
            $(`.quizzing`).addClass('hidden');
            this.resolve();
            return;
        }

        this.showQuestion();

        $('.yes-btn').click(() => {
            this.yesNoClick(1);
        });

        $('.no-btn').click(() => {
            this.yesNoClick(0);
        });
    }

    showQuestion() {

        let currentQuestion = this.quiz.questions[this.currentQuestionIndex];

        let html1 = `<div class="alert alert-success" role="alert">
                        <p>
                            ${currentQuestion.name}
                        </p>
                        <div class="yes-no-buttons">
                            <input class="yes-btn btn btn-primary" type="button" value="ДА">
                            <input class="no-btn btn btn-primary" type="button" value="НЕТ">
                        </div>
                    </div>`

        $('.quizzing').html(html1);
    }

    yesNoClick(oneOrZero) {
        let self = this;
        let currentQuestion = self.quiz.questions[self.currentQuestionIndex];

        let valStr = oneOrZero == 0 ? 'НЕТ' : 'ДА';

        $(`.quiz-query-result-table-${this.quiz.number}`).removeClass('hidden');

        let html = `<tr>
                        <td class="px-4">${currentQuestion.name}</td>
                        <th scope="row">${valStr}</th>
                    </tr>`;

        $(`.quiz-query-result-${this.quiz.number}`).append(html);
        this.key += `${currentQuestion.number}${oneOrZero}`;
        let isDiagnos = this.trySetDiagnos();
        if (!isDiagnos) {
            self.currentQuestionIndex++;
        }

        self.showQuestions(self.currentQuestionIndex);
    }

    showDiagnos(diagnosText) {

        let self = this;

        $(`.quiz-query-diagnos-${this.quiz.number}`).removeClass('hidden');

        //вывести диагноз на табло информации
        $(`.quiz-query-diagnos-${this.quiz.number}`).append(diagnosText);

        $('.quiz-in-diagnos').click((event) => {
            event.stopImmediatePropagation();
            event.preventDefault();

            let diagnosQuizNumber = $('.quiz-in-diagnos').data('quizNumber');

            $(`.start-quiz-info-${diagnosQuizNumber}`).html('');

            let isLastQuiz = $('.isLastQuiz-div').text() == 'true' ? true : false;

            new StartQuiz(diagnosQuizNumber, isLastQuiz).executeQuizzing().then(()=>{
                self.resolve();
            });
        });

        //отобразить кнопку продолжить
        this.showQuizFooterButtons();

        if (this.isLastQuiz) {
            this.hideNextBtn();
        }

    }

    showQuizFooterButtons() {
        //показать кнопку ПРОДОЛЖИТЬ, ПЕЧАТЬ, ЗАКОНЧИТЬ
        let self = this;
        $(`.quizFooterButtons`).removeClass('hidden');

        $('.nextQuizBtn').click((event) => {
            self.hideFooterButtons();
            event.stopImmediatePropagation();
            self.resolve('ok');

        });

        $(`.endBtn`).click((event) => {
            event.stopImmediatePropagation();
            location.href = '/';
        })

        $(`.printBtn`).click((event) => {
            event.stopImmediatePropagation();
            window.print();
        })
    }

    hideNextBtn() {
        $('.nextQuizBtn').addClass('hidden');
    }

    hideFooterButtons() {
        $('.quizFooterButtons').html('');
    }

    isQuestionsEnd(questionIndex) {
        let res = this.currentQuestionIndex >= this.quiz.questions.length;
        return res;
    }

    trySetDiagnos() {
        let diagnos = this.quiz.diagnoses.find(x => x.keys.some(k => k.replace('\r', '').replace(/,/g, '').replace(/;/g, '').trim() == this.key));

        if (diagnos) {
            this.findedDiagnos = diagnos;
            return true;
        } else {
            return false;
        }
    }


}
class StartQuizLoader {

    loadQuizListByNumbers(quizNumberList) {
        let promise = new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                data: { quizNumbers: quizNumberList },
                url: '/getQuizListByNumbers',
                success: (data) => {
                    resolve(data);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
        return promise;
    }

    getQuiz(quizNumber) {
        let promise = new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                data: quizNumber,
                url: `/getQuiz/${quizNumber}`,
                success: (data) => {
                    resolve(data);
                },
                error: (error) => {
                    reject(error);
                }
            })
        })

        return promise;
    }
}