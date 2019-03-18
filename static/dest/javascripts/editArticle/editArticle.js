
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

    uploadFile(formData) {

        let promise = new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: '/uploadArticleImg',
                data: formData,
                processData: false,
                contentType: false,
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
jQuery(document).ready(function () {

    //отменить отправку формы именем и текстом статьи
    $('.edit-article-submit').click((event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        updateArticle();

    });

    // //переопределяем событие отправки формы с файлом
    // $('#formUploadImg').submit(function (event) {

    //     event.preventDefault();
    //     event.stopImmediatePropagation();

    //     let formData = new FormData(this); //специальный тип данных для формы - есть в каждом браузере

    //     new EditArticleLoader().uploadFile(formData)
    //         .then((data) => {
    //             if(data.ok){
    //                 //отобразить имя картинки на странице, чтобы пользователь мог его использовать
    //                 $('.img-name').html(data.imgName)
    //             }
    //         }).catch((err) => {
    //             console.error(err)
    //         });
    // })

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