const TABS = ['Daily', 'Articles', 'Messages'];
const $nav = $('#nav');
const PERPAGE = 5;
$nav.before('<p>Find something you are interested below:');

$.each(TABS,(i) => {
    let key = TABS[i].toLowerCase();
    let $div = $('<div/>').addClass('tabs').attr('id', 'link-' + key).appendTo($nav);
    let $a = $('<a/>').attr('href', '/pages/' + key + '.html').appendTo($div);
    $a.text(key);
});

function displayMessages(rows) {
    let $contents = $('#contents');
    rows.forEach(row => {
        let $div_row = $('<div/>').addClass('feedback').appendTo($contents);
        let $div_user = $('<div/>').addClass('user').text(row.user).appendTo($div_row);
        let $div_date = $('<div/>').addClass('date').text(row.date).appendTo($div_row);
        let $div_body = $('<div/>').addClass('body').text(row.body).appendTo($div_row);
    });
}

function pagination(number, page) {
    let $contents = $('#contents');
    let $pager = $('<div/>').attr('id', 'pagination').insertAfter($contents);
    let $page_ul = $('<ul/>').attr('id', 'page-list').appendTo($pager);
    for (let i = 1; i <= number; i++) {
        let $li = $('<li/>').appendTo($page_ul);
        let $a = $('<a/>').attr('href', '/messages/' + i).text(i).appendTo($li);
        if (i == page) $a.addClass('activated');
    }
}

$(function() {
    $('#link-messages a').click((e) => {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: '/messages',
            dataType: 'json',
            success: function(data) {
                $('#container').html(data.html);
                displayMessages(data.rows);
                pagination(data.number, data.page);
                const myQuill = new Quill('#editor', {
                    theme: 'snow'
                });
            },
            error: function(xhr, error) {console.error(error)}
        });
    });
});


$(document).on('click', '#page-list a', function(e) {
    e.preventDefault();
    $('.activated').removeClass('activated');
    $(this).addClass('activated');
    console.log(this.attributes.href.value);
    
    $.ajax({
        method: 'GET',
        url: this.attributes.href.value,
        dataType: 'json',
        success: function(data) {
            console.log(data);
            $('#contents').empty();
            displayMessages(data.rows);
        },
        error: (error) => {console.error(error)}
    });

});