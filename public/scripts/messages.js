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

const messageConfig = {
    eventClass: 'feedback',
    rowClass: 'user',
    bodyClass: 'body',
    dateClass: 'date',
    action: '/messages',
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

let loadMessages = function(res) {
    $('#container').html(res.html);
    display(res.rows, messageConfig, res.admin);
    pagination(res.number, res.page, messageConfig.action);
    customizedEditor();
}

let displayMessages = function(res) {
    $('#contents').empty();
    display(res.rows, messageConfig, res.admin);
    if (res.total && !$('#pagination').find('a').length) {
        pagination(res.number, res.page, messageConfig.action);
    }
}

let deleteMessage = function(res) {
    $('#contents').empty();
    if (!res.total) {
        $('#pagination').remove();
    }
    display(res.rows, messageConfig, res.admin);
}

$(function() {
    $('#link-messages a').click(function(e) {
        e.preventDefault();
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        ajaxGet(messageConfig.action, loadMessages);
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
    ajaxPost(messageConfig.action, comment, displayMessages);
});

$(document).on('click', '#page-list a', function(e) {
    e.preventDefault();
    $('.activated').removeClass('activated');
    $(this).addClass('activated');
    ajaxGet(this.attributes.href.value, displayMessages);
});


$(document).on('click', '.delete-message', function(e) {
    e.preventDefault();
    ajaxGet(this.attributes.href.value, deleteMessage);
});