//переопределяем событие отправки формы с файлом
$('#formUploadImg').submit(function (event) {

    event.preventDefault();
    event.stopImmediatePropagation();

    let formData = new FormData(this); //специальный тип данных для формы - есть в каждом браузере

    new EditArticleLoader().uploadFile(formData)
        .then((data) => {
            if(data.ok){
                //отобразить имя картинки на странице, чтобы пользователь мог его использовать
                $('.img-name').html(data.imgName)
            }
        }).catch((err) => {
            console.error(err)
        });
})