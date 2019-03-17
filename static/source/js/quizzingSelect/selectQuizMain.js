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