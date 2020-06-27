const messageConfig = {
    eventClass: 'feedback',
    rowClass: 'user',
    bodyClass: 'body',
    dateClass: 'date',
    action: '/messages',
    deleteClass: 'delete-message',
    editorClass: 'ql-email',
    submitClass: 'submit-message',
    contentClass: 'ql-message',
    inputId: 'passenger',
    pageId: 'page-list-messages',
}

function messages (row, config) {
    let $div_row = $('<div/>').addClass(config.eventClass).appendTo($('#contents'));
    $('<div/>').addClass(config.dateClass).text(row.date).appendTo($div_row);
    $('<div/>').addClass(config.bodyClass).html(row.body).appendTo($div_row);
    $('<div/>').addClass(config.rowClass).text(row.user).appendTo($div_row);
    return $div_row;
};

let loadMessages = function(res) {
    $('#container').html(res.html);
    display(res.rows, messageConfig, res.admin, messages);
    pagination(res.number, res.page, messageConfig);
    editor(messageConfig, res.admin);
    if (res.admin) $('#' + messageConfig.inputId).val('admin');
}

let pageMessages = function(res) {
    $('#contents').empty();
    display(res.rows, messageConfig, res.admin, messages);
    
    if (res.number && $('#pagination').find('a').length != res.number) {
        pagination(res.number, res.page, messageConfig);
    }

    if (!res.rows.length) {
        $('#pagination').remove();
    }

    if (res.admin) $('#' + messageConfig.inputId).val('admin');
}