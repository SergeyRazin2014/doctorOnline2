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