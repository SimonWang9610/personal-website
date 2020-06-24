
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
            let $p = $('<p/>').text('You are ' + identity).insertBefore($('#admin a'));
            $('#admin a').hide();
        }
    });
});

function displayMessages(rows, admin) {
    let $contents = $('#contents');
    rows.forEach(row => {
        let $div_row = $('<div/>').addClass('feedback').appendTo($contents);
        let $div_user = $('<div/>').addClass('user').text(row.user).appendTo($div_row);
        let $div_date = $('<div/>').addClass('date').text(row.date).appendTo($div_row);
        let $div_body = $('<div/>').addClass('body').html(row.body).appendTo($div_row);
        if (admin) {
            let $delete_link = $('<a/>').addClass('delete-message')
            .attr('href', '/messages/delete/' + row.id).text('Delete').appendTo($div_row);
        }
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

function customizedEditor() {
    const myQuill = new Quill('#editor', {
        theme: 'snow',
    });
    $('#editor').data('quill', myQuill);
    let $span_email = $('<span/>').addClass('ql-email').appendTo('.ql-toolbar');
    $('<input/>').attr('id', 'passenger').appendTo($span_email);
    let $span = $('<span/>').addClass('ql-submit').appendTo($('.ql-toolbar'));
    $('<button/>').html('Post').appendTo($span);
}


$(function() {
    $('#link-messages a').click(function(e) {
        e.preventDefault();
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        $.ajax({
            type: 'GET',
            url: '/messages',
            dataType: 'json',
            success: function(res) {
                $('#container').html(res.html);
                displayMessages(res.rows, res.admin);
                pagination(res.number, res.page);
                customizedEditor();
            },
            error: function(xhr, error) {console.error(error)}
        });
    });
});


$(document).on('click', '.ql-submit button', function(e) {
    e.preventDefault();
    let quill = $('#editor').data('quill');
    // let input = quill.getContents();
    let input = document.querySelector('.ql-editor').innerHTML;
    let user = $('#passenger').val();
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let comment = {
        user: user,
        body: input,
        date: date,
    };
    quill.setContents('');
    $.ajax({
        type: 'POST',
        url: '/messages',
        data: comment,
        dataType: 'json',
        success: function(res) {
            $('#contents').empty();
            displayMessages(res.rows, res.admin);
            if (res.total && !$('#pagination').find('a').length) {
                pagination(res.number, res.page);
            }
        },
        error: function(error) {console.error(error)}
    })
});

$(document).on('click', '#page-list a', function(e) {
    e.preventDefault();
    $('.activated').removeClass('activated');
    $(this).addClass('activated');
    
    $.ajax({
        type: 'GET',
        url: this.attributes.href.value,
        dataType: 'json',
        success: function(res) {
            $('#contents').empty();
            displayMessages(res.rows, res.admin);
        },
        error: (error) => {console.error(error)}
    });

});
$(document).on('click', '.delete-message', function(e) {
    e.preventDefault();
    $.ajax({
        type: 'GET',
        url: this.attributes.href.value,
        dataType: 'json',
        success: function(res) {
            $('#contents').empty();
            if (!res.total) {
                $('#pagination').remove();
                $('#contents').html('<p>Say something to me!</p>');
            }
            displayMessages(res.rows, res.admin);
            
        },
        error: function(error) {console.error(error)}
    });
});