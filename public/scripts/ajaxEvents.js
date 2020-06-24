
function display(rows, config, admin) {
    let $contents = $('#contents');
    rows.forEach(row => {
        let $div_row = $('<div/>').addClass(config.eventClass).appendTo($contents);
        $('<div/>').addClass(config.dateClass).text(row.date).appendTo($div_row);
        $('<div/>').addClass(config.bodyClass).html(row.body).appendTo($div_row);
        
        if (row.user) $('<div/>').addClass(config.rowClass).text(row.user).appendTo($div_row);
        if (row.title) $('<div/>').addClass(config.rowClass).text(row.title).appendTo($div_row);
        if (row.completed) $('<div/>').addClass(config.rowClass).text(row.completed).appendTo($div_row);
        
        if (admin) {
            $('<a/>').addClass('delete-message')
            .attr('href', config.action + '/delete/' + row.id)
            .text('Delete').appendTo($div_row);
        }
    });
};

function pagination(number, page, action) {
    let $contents = $('#contents');
    let $pager = $('<div/>').attr('id', 'pagination').insertAfter($contents);
    let $page_ul = $('<ul/>').attr('id', 'page-list').appendTo($pager);
    for (let i = 1; i <= number; i++) {
        let $li = $('<li/>').appendTo($page_ul);
        let $a = $('<a/>').attr('href', action + '/' + i).text(i).appendTo($li);
        if (i == page) $a.addClass('activated');
    }
};


function ajaxGet(url, callback) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(res) {callback(res)},
        error: function(error) {console.error(error)}
    });
};

function ajaxPost(url, data, callback) {
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        success: function(res) {callback(res)},
        error: function(error) {console.error(error)}
    });
};