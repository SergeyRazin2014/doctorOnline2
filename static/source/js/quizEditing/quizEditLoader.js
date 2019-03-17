class QuizEditLoader {

    quizUpdate(quiz) {

        let promise = new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                url: '/quizEidt',
                data: quiz,
                method:'POST',
                success: (data) => {
                    resolve(data);
                },
                error: (err) => {
                    reject(err);
                }
            });
        });

        return promise;
    }
}