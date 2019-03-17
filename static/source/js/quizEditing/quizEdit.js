jQuery(document).ready(function () {

    $('.quiz-edit-buttons-save').click(async (event) => {
        event.stopImmediatePropagation();

        let quiz = new GetQuiz().execute();
        let result = await new QuizEditLoader().quizUpdate(quiz);

        if (result) {
            alert(`ТЕСТ № ${result.number} УСПЕШНО ОБНОВЛЕН`);
        }else{
            alert(`ПРОИЗОШЛА ОШИБКА`);
        }

    })



});

class GetQuiz {

    execute() {

        let quizNumber = $('.quizEdit-number').text().replace( /^\D+/g, '');
        let quizName = $('.input-quiz-name').val().trim();
        let questions = this.getQuestions();
        let diagnoses = this.getDiagnoses();
        let recommends = this.getRecommends();

        let quiz = {
            number: quizNumber,
            name: quizName,
            diagnoses: diagnoses,
            questions: questions,
            recommends: recommends 
        }

        return quiz;
    }

    getQuestions() {
        let questionRows = $('.quizEdit-question-row');

        let questionList = [];

        for (let i = 0; i < questionRows.length; i++) {
            let questionRow = questionRows[i];

            let number = $(questionRow).find('.quizEdit-question-number').text().trim();
            let name = $(questionRow).find('.input-queston-name').val().trim();

            let quiz = { number, name };
            questionList.push(quiz);
        }

        return questionList;
    }

    getDiagnoses() {

        let diagnosesRows = $('.quizEdit-diagnos-row');

        let diagList = [];
        for (let i = 0; i < diagnosesRows.length; i++) {
            let diagnosRow = diagnosesRows[i];

            let diagName = $(diagnosRow).find('.input-quizEdit-diagnos-name').val().trim();
            let diagNumber = $(diagnosRow).find('.quizEdit-diagnos-number').text().trim();
            let diagKeys = this.getDiagnosKeys(diagnosRow);


            let diagnos = {
                number: diagNumber,
                name: diagName,
                keys: diagKeys
            }

            diagList.push(diagnos);

        };

        return diagList;
    }

    getDiagnosKeys(diagnosRow) {
        let diagKeys = $(diagnosRow).find('.input-quiz-edit-diagnos-key');

        let keyList = [];
        for (let i = 0; i < diagKeys.length; i++) {
            let key = diagKeys[i];

            let keyVal = $(key).val().trim();

            keyList.push(keyVal);
        };

        return keyList;
    }

    getRecommends() {

        let recommends = $('.quizEdit-input-recommends');

        if (recommends.length > 0) {
            return $(recommends[0]).val().trim();
        } else {
            return null;
        }

    }
}