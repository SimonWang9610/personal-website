
$(function() {
    $('#link-articles a').click(function(e) {
        e.preventDefault();
        // indicate what passengers are browsering 
        $('.selected').removeClass('selected');
        $(this).addClass('selected');

        // get and display articles
        ajaxGet(articleConfig.action, loadArticle);
    });
});

$(document).on('click', '.' + articleConfig.submitClass, function(e) {
    e.preventDefault();
    let quill = $('#editor').data('quill');

    // get an article
    let input = document.querySelector('.' + articleConfig.contentClass).innerHTML;
    let title = $('#' + articleConfig.inputId).val();
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // set editor as empty;
    quill.setContents('');
    $('#' + articleConfig.inputId).val('');

    let article = {
        title:title,
        body: input,
        date: date,
    }
    // post one article
    ajaxPost(articleConfig.action, article, pageArticles);
});

$(document).on('click', '#' + articleConfig.pageId + ' a', function(e) {
    e.preventDefault();
    // indicate which page user are browsering
    $('.activated').removeClass('activated');
    $(this).addClass('activated');

    ajaxGet(this.attributes.href.value, pageArticles);
});

//delete article
$(document).on('click', '.' + articleConfig.deleteClass, function(e) {
    e.preventDefault();
    ajaxGet(this.attributes.href.value, pageArticles);
})

//redirect to single article
$(document).on('click', '.' + articleConfig.rowClass, function(e) {
    e.preventDefault();
    ajaxGet(this.attributes.href.value, singleArticle);
});

//back to article list
$(document).on('click', '#back-list', function(e) {
    e.preventDefault();
    ajaxGet(this.attributes.href.value, loadArticle);
});