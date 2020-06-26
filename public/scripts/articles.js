const articleConfig = {
    eventClass: 'my-article',
    rowClass: 'title',
    bodyClass: 'body',
    dataClass: 'date',
    action: '/articles',
    deleteClass: 'delete-article',
    editorClass: 'ql-title',
    submitClass: 'submit-article',
    contentClass: 'ql-article',
    inputId: 'title',
    pageId: 'page-list-articles',
}

/* 
handle return of '/articles'
1) set html in container
2) display articles in database
3) set pagination
4) set editor for admin
*/
let loadArticle = function(res) {
    $('#container').html(res.html);
    display(res.rows, articleConfig, res.admin, articles);
    pagination(res.number, res.page, articleConfig);

    if (res.admin) editor(articleConfig);
}

/*
handle return 'delete', 'page', 
*/
let pageArticles = function(res) {
    $('#contents').empty();
    display(res.rows, articleConfig, res.admin, articles);
    
    // when page links are not same as res.number, refresh pagination setting
    if (res.number && $('#pagination').find('a').length != res.number) {
        pagination(res.number, res.page, articleConfig);
    }

    // if there is no record in database, remove pagination
    if (!res.rows.length) $('#pagination').remove();
    // make sure admin only have one editor
    if (res.admin && !$('#editor').length) editor(articleConfig);
}


let singleArticle = function(res) {
    let $contents = $('#contents');
    // empty articles list for displaying single article
    $contents.empty();
    $('#pagination').remove();
    // set back link to article list
    $('<a/>').attr({'href': articleConfig.action, 'id': 'back-list'})
    .text('Back').insertBefore($contents);

    // display single article
    let $info = $('<div/>').addClass('article-info').appendTo($contents);
    $('<p/>').text(res.article.title).css({'font-size': '30px', 'font-weight': 'bold', 'text-align': 'center'}).appendTo($info);
    $('<p/>').text(res.article.date).css({'font-size': '10px', 'font-weight': 'italic', 'text-align': 'center'}).appendTo($info);
    $('<div/>').addClass('article-body').html(res.article.body).appendTo($contents);

    if (res.admin && !$('#editor').length) editor(articleConfig);
}

$(document).ready(() => {
    $('#link-articles a').addClass('selected');
    ajaxGet(articleConfig.action, loadArticle);
});

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