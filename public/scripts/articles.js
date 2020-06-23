let ADMIN = null;

$('#profile button').click(function() {
    ADMIN = prompt('Enter ADMIN key:');
});

function displayMessages(rows) {
    let $contents = $('#contents');
    rows.forEach(row => {
        let $div_row = $('<div/>').addClass('article').appendTo($contents);
        let $div_user = $('<div/>').addClass('title').text(row.user).appendTo($div_row);
        let $div_date = $('<div/>').addClass('body').html(row.body).appendTo($div_row);
        let $div_body = $('<div/>').addClass('date').text(row.body).appendTo($div_row);
    });
}

function pagination(number, page) {
    let $contents = $('#contents');
    let $pager = $('<div/>').attr('id', 'pagination').insertAfter($contents);
    let $page_ul = $('<ul/>').attr('id', 'page-list').appendTo($pager);
    for (let i = 1; i <= number; i++) {
        let $li = $('<li/>').appendTo($page_ul);
        let $a = $('<a/>').attr('href', '/articles/' + i).text(i).appendTo($li);
        if (i == page) $a.addClass('activated');
    }
}


function ajaxGetArticles() {
    $.ajax({
        type: 'GET',
        url: '/articles',
        dataType: 'json',
        password: ADMIN,
        success: function(response) {
            $('contianer').html(response.html);
            displayMessages(response.rows);
            pagination(response.number, response.page);
            if (response.admin) customizedEditor(); 
        },
        error: function(error) {console.error(error)}
    });
};



$(function() {
    $('#link-articles a').click(function(e) {
        e.preventDefault();
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        ajaxGetArticles();
    });
});

