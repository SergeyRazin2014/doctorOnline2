class QuizLoader {
    loadAllSubject() {
        let promise = new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                url: '/getAllSubjects',
                success: (response) => {
                    resolve(response);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });

        return promise;
    }

    loadAllProblemGroup() {

        let promise = new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                url: '/getAllProblemGroups',
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

    loadAllQuizzes() {

        let promise = new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                url: '/getAllQuizzes',
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

    
}
jQuery(document).ready(function () {

    let quizLoader = new QuizLoader();

    let allSubjectsPromise = quizLoader.loadAllSubject();
    let allProblemGroupsPromise = quizLoader.loadAllProblemGroup();
    let allQuizzesPromise = quizLoader.loadAllQuizzes();

    

    Promise.all([allSubjectsPromise, allProblemGroupsPromise, allQuizzesPromise]).then((data) => {

        let allSubjects = data[0];
        let allProblemGroups = data[1];
        let allQuizzes = data[2];

        let quizShower = new QuizShower(allSubjects, allProblemGroups, allQuizzes);
        quizShower.showSubjects();
    });
});
"use strict"
class QuizShower {
    constructor(allSubjects, allProblemGroups, allQuizzes) {
        this.allSubjects = allSubjects;
        this.allProblemGroups = allProblemGroups;
        this.allSchortQuizzes = allQuizzes;

        $('.btn-quiz-start').click(function (event) {
            event.preventDefault();

            $('.quizzing').removeClass('hidden')
        });

    }

    /**
     * отфильтровать группы проблем со здоровьем для субъекта
     * @param {Number} subjectNumber - номер субъекта для тестирования (мужчина, женьщина, ребенок)
     */
    getProblemGroupsFor(subjectNumber) {

        let subject = this.allSubjects.find(x => x.number == subjectNumber);

        let probGroupNumbers = subject.problemGroupsNumbers;

        let result = this.allProblemGroups.filter(pp => probGroupNumbers.some(p => p == pp.number));

        return result;
    }

    /**
     * отфильтровать тесты для группы проблем
     * @param {Number} problemGroupNumber - номер группы проблем здоровья
     */
    getQuizListFor(problemGroupNumber) {

        let problemGroup = this.allProblemGroups.find(x => x.number == problemGroupNumber);
        let quizNumbers = problemGroup.quizNumbers;

        let result = this.allSchortQuizzes.filter(qq => quizNumbers.some(q => q == qq.number));
        return result;
    }


    /**
     * отобразить список субьектов тестирования (мужчина, женщина, ребенок)
     */
    showSubjects() {


        //отобразить все subjects
        this.allSubjects.forEach(subject => {


            let html1 = `<div class="custom-control custom-radio ">
                            <input   name="subject"    type="radio"     id="subject-${subject.number}"         class="quiz-subjects-item  custom-control-input"    value="${subject.number}" >
                            <label    class="custom-control-label"     for="subject-${subject.number}">${subject.name}</label>
                        </div>`;

            $('.quiz-subjects-list').append(html1);
        });

        let self = this;

        //подписка на событие выбор чекбокса (мужчина, женьщина, ребенок)
        $('.quiz-subjects-item').change(function () {

            self.hideQuizNames();
            self.showBlockProblemGroup();

            let groupProblems = self.getProblemGroupsFor(this.value);

            //очистить html с именами тестов
            let testsHtml = $('.quiz-list');

            if (testsHtml) {
                testsHtml.html('');
            }

            //вывод группы проблем
            self.showGroupProblems(groupProblems);
        });



    }

    /**
     * отобразить группы проблем со здоровьем
     * @param {Object[]} groupProblems - groupProblems массив с элементами:  группа проблем со здоровьем (Сердечные заболевания, Проблемы общего характера)
     */
    showGroupProblems(groupProblems) {

        let self = this;

        $('.quiz-groupProblem-list').html('');

        groupProblems.forEach(groupProblem => {

            let html1 = `<div class="custom-control custom-radio">
                            <input type="radio" id="problemGroup-value-${groupProblem.number}" name="problemGroup" class="quiz-groupProblem-item custom-control-input" value="${groupProblem.number}">
                            <label class="custom-control-label" for="problemGroup-value-${groupProblem.number}">${groupProblem.name}</label>
                        </div> `;

            $('.quiz-groupProblem-list').append(html1);
        });

        //подписка на событие выбора группыПроблем (Проблемы общего характера, Заболевания полости рта, языка и горла)
        $('.quiz-groupProblem-item').change(function () {

            self.showBlockQuizNames();
            self.hideStartButton();

            //отобразить все тесты для данной проблемы
            let quizzes = self.getQuizListFor(this.value);

            self.showQuizzes(quizzes);
        });

    }

    /**
     * отобразить массив тестов
     * @param {Object[]} quizList - массив тестов
     */
    showQuizzes(quizList) {

        let self = this;

        $('.quiz-list').html('');

        quizList.forEach(quiz => {

            let html1 = `<div class="custom-control custom-checkbox">
                            <input type="checkbox" class="quiz-name-item custom-control-input" id="quizName-${quiz.number}"   value="${quiz.number}">
                            <label class="custom-control-label" for="quizName-${quiz.number}">${quiz.name}</label>
                        </div>`;

            $('.quiz-list').append(html1);
        });

        $('.quiz-name-item').change(function () {

            let isAnyQuizChecked = $('.quiz-name-item').is(':checked');
            if (isAnyQuizChecked) {
                //отобразить кнопку [начать тестирование]
                $('.btn-quiz-start').removeClass('hidden');

                //клик на кнопке [начать тестирование]
                $('.btn-quiz-start').click((event) => {
                    event.stopImmediatePropagation();

                    $(`.quiz-select-main`).addClass('hidden');

                    //выбирать чекнутый тест
                    let quizChecked = $('.quiz-name-item:checked');

                    let quizNumbers = [];
                    for (let i = 0; i < quizChecked.length; i++) {
                        let item = quizChecked[i];
                        let quizNumber = $(item).val();
                        quizNumbers.push(quizNumber);
                    }

                    let quizNumbersStr = JSON.stringify(quizNumbers);
                    location.href = '/goToQuizzing?quizNumbers=' + quizNumbersStr;
                })
            } else {
                $('.btn-quiz-start').addClass('hidden');
            }
        });
    }



    hideProblemGroups() {
        $('.quiz-groupProblem-list-wrapper').addClass('hidden');
    }

    hideQuizNames() {
        $('.quiz-list-wrapper').addClass('hidden');
    }

    hideStartButton() {
        $('.btn-quiz-start').addClass('hidden');
    }

    showBlockProblemGroup() {
        $('.quiz-groupProblem-list-wrapper').removeClass('hidden');
    }

    showBlockQuizNames() {
        $('.quiz-list-wrapper').removeClass('hidden');
    }

    showStartButton() {
        $('.btn-quiz-start').removeClass('hidden');
    }
}

