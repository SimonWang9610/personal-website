const Articles = ['title', 'body', 'date'];
const Messages = ['user', 'body', 'date'];
const Plans = ['body', 'date', 'completed'];



function displayMessages(rows, eventClass, rowClass, bodyClass, dateClass, action, admin) {
    let $contents = $('#contents');
    rows.forEach(row => {
        let $div_row = $('<div/>').addClass(eventClass).appendTo($contents);
        let $div_date = $('<div/>').addClass(dateClass).text(row.date).appendTo($div_row);
        let $div_body = $('<div/>').addClass(bodyClass).html(row.body).appendTo($div_row);
        if (row.user) let $div_user = $('<div/>').addClass(rowClass).text(row.user).appendTo($div_row);
        if (row.title) let $div_title = $('<div/>').addClass(rowClass).text(row.title).appendTo($div_row);
        if (row.completed) let $div_completed = $('<div/>').addClass(rowClass).text(row.completed).appendTo($div_row);
        // set 'delete' and 'reply' permission for admin
        if (admin) {
            let $delete_link = $('<a/>').attr('href', action + '/delete/' + row.id).appendTo($div_row);
            let $reply_btn = $('<button/>').attr('id', 'reply').html('reply');
        }
    });
};

function pagination(number, page, action) {
    let $contents = $('#contents');
    let $pager = $('<div/>').attr('id', 'pagination').insertAfter($contents);
    let $page_ul = $('<ul/>').attr('id', 'page-list').appendTo($pager);
    for (let i = 1; i <= number; i++) {
        let $li = $('<li/>').appendTo($page_ul);
        let $a = $('<a/>').attr('href', action + i).text(i).appendTo($li);
        if (i == page) $a.addClass('activated');
    }
};

function customizedEditor(admin) {
    const myQuill = new Quill('#editor', {
        theme: 'snow',
    });
    $('#editor').data('quill', myQuill);
    let $span_email = $('<span/>').addClass('ql-email').appendTo('.ql-toolbar');
    if (!admin) $('<input/>').attr('id', 'passenger').appendTo($span_email);
    let $span = $('<span/>').addClass('ql-submit').appendTo($('.ql-toolbar'));
    $('<button/>').html('Post').appendTo($span);
};

function controlContents(response, eventClass, rowClass, bodyClass, dateClass, action) {
    if (response.html) {
        $('#container').html(response.html);
    } else {
        $('#contents').empty();
    }
    displayMessages(response.rows, eventClass, rowClass, bodyClass, dateClass, action, response.admin);

    if (response.number) pagination(response.number, response.page, action);
    if (action == '/messages') customizedEditor(response.admin);
    
}

function ajaxGet(url, admin) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        password: admin,
        success: function(response) {
            $('#container').html(response.html);
            displayMessages
        }
    })
};
