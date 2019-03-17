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