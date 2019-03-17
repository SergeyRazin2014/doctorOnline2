class DeleteArticleLoader {

    deleteArticle(articleNumber) {
        let promise = new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                data: { articleNumber },
                url: '/deleteArticle',
                method: 'DELETE',
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