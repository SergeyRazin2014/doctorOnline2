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