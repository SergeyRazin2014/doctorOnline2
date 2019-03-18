
class EditArticleLoader {

    articleUpdate(article) {

        let promise = new Promise((resolve, reject) => {
            $.ajax({
                dataType: 'json',
                url: '/editArticle',
                data: article,
                method: 'POST',
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

    //отменить отправку формы именем и текстом статьи
    $('.edit-article-submit').click((event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        updateArticle();

    });

    

    //обновить статью (имя и текст)
    function updateArticle() {

        let number = $('#articleNumber').val();
        let name = $('#articleName').val();
        let text = $('#articleText').val();

        let article = { number, name, text };

        let loader = new EditArticleLoader();
        loader.articleUpdate(article)
            .then((data) => {
                alert("Статья успешно обновлена");
            }).catch((error) => {
                console.error(error);
            })
    };

    

});