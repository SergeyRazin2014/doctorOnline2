

jQuery(document).ready(function () {

    //получить ссылку - УДАЛИТЬ
    //отменить стандартное поведение ссылки
    //вывести алерт - вы действительно хотите удалить статью
    //если да тогда
    //получить номер статьи

    $('.delete-article-btn').click(function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        var areYouShure = confirm("Вы действительно хотите удалить статью?");

        if (areYouShure) {

            debugger;

            let number = this.dataset.number;

            new DeleteArticleLoader().deleteArticle(number)
                .then((data) => {
                    alert(data.message);
                }).then(() => {
                    window.location.replace("/showAllArticles");
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    })


});