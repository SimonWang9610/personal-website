function displayMessages(rows) {
    let $contents = $('#contents');
    rows.forEach(row => {
        let $div_row = $('<div/>').addClass('feedback').appendTo($contents);
        let $div_user = $('<div/>').addClass('user').text(row.user).appendTo($div_row);
        let $div_date = $('<div/>').addClass('date').text(row.date).appendTo($div_row);
        let $div_body = $('<div/>').addClass('body').html(row.body).appendTo($div_row);
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
    // $(document).on('click', '.ql-submit button', function(e) {
    //     e.preventDefault();
    //     let input = myQuill.getText();
    //     let user = $('#passenger').val();
    //     console.log(input);
    //     console.log(user);
    // });
}

$(function() {
    $('#link-messages a').click(function(e) {
        e.preventDefault();
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        $.ajax({
            method: 'GET',
            url: '/messages',
            dataType: 'json',
            success: function(data) {
                $('#container').html(data.html);
                displayMessages(data.rows);
                pagination(data.number, data.page);
                customizedEditor();
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
    console.log(comment);
    $.ajax({
        type: 'POST',
        url: '/messages',
        data: comment,
        dataType: 'json',
        success: function(response) {
            $('#contents').empty();
            displayMessages(response.rows);
        },
        error: function(error) {console.error(error)}
    })
});