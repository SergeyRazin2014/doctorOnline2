
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