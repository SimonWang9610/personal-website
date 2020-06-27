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


function articles(row, config) {
    let $div_row = $('<div/>').addClass(config.eventClass).appendTo($('#contents'));
    $('<a/>').addClass(config.rowClass)
                .attr('href', config.action + '/display/' + row.id)
                .text(row.title).appendTo($div_row);
    return $div_row;
};

let loadArticle = function(res) {
    $('#container').html(res.html);
    display(res.rows, articleConfig, res.admin, articles);
    pagination(res.number, res.page, articleConfig);

    if (res.admin) editor(articleConfig);
}

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