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