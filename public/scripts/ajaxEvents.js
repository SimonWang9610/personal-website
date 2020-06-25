
function messages (row, config) {
    let $div_row = $('<div/>').addClass(config.eventClass).appendTo($('#contents'));
    $('<div/>').addClass(config.dateClass).text(row.date).appendTo($div_row);
    $('<div/>').addClass(config.bodyClass).html(row.body).appendTo($div_row);
    $('<div/>').addClass(config.rowClass).text(row.user).appendTo($div_row);
    return $div_row;
};

function articles(row, config) {
    let $div_row = $('<div/>').addClass(config.eventClass).appendTo($('#contents'));
    $('<a/>').addClass(config.rowClass)
                .attr('href', config.action + '/display/' + row.id)
                .text(row.title).appendTo($div_row);
    return $div_row;
};


function display(rows, config, admin, customization) {
    rows.forEach(row => {
        let $div_row = customization(row, config);
        if (admin && row) {
            let $delete = $('<div/>').addClass('delete').appendTo($div_row);
            $('<a/>').addClass(config.deleteClass)
            .attr('href', config.action + '/delete/' + row.id)
            .text('Delete').appendTo($delete);
        }
    });
};

function pagination(number, page, config) {
    let $contents = $('#contents');
    
    let $pager = $('#pagination');
    if (!$pager.length) $pager = $('<div/>').attr('id', 'pagination').insertAfter($contents);
    
    let $page_ul = $('#' + config.pageId);
    if (!$page_ul.length) $page_ul = $('<ul/>').attr('id', config.pageId).appendTo($pager);
    $page_ul.empty();
    
    for (let i = 1; i <= number; i++) {
        let $li = $('<li/>').appendTo($page_ul);
        let $a = $('<a/>').attr('href', config.action + '/' + i).text(i).appendTo($li);
        if (i == page) $a.addClass('activated');
    }
};

function editor(config) {
    const myQuill = new Quill('#editor', {
        theme: 'snow',
    });
    $('#editor').data('quill', myQuill);
    $('#editor .ql-editor').addClass(config.contentClass);
    let $span = $('<span/>').addClass(config.editorClass).appendTo($('.ql-toolbar'));
    $('<input/>').attr('id', config.inputId).appendTo($span);

    let $span_submit = $('<span/>').addClass('ql-submit').appendTo($('.ql-toolbar'));
    $('<button/>').addClass(config.submitClass).html('Post').appendTo($span_submit); 
}

function ajaxGet(url, callback) {
    return $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(res) {callback(res)},
        error: function(error) {console.error(error)}
    });
};

function ajaxPost(url, data, callback) {

    return $.ajax({
        type: 'POST',
        url: url,
        data: data, 
        dataType: 'json',
        success: function(res) {
            clearTimeout()
            callback(res);
        },
        error: function(error) {console.error(error)},
    });
};

//set admin interface
$(document).on('click', '#admin a', function(e) {
    e.preventDefault();
    let admin = prompt('enter ADMIN key:');
    $.ajax({
        type: 'GET',
        url: '/auth',
        data: {admin: admin},
        dataType: 'json',
        success: function(response) {
            let identity = (response.identity)? 'admin':'passenger';
            let $identity = $('.identity');
            $identity.text('You are ' + identity);
            if (identity == 'admin') $('#admin a').hide();
        }
    });
});