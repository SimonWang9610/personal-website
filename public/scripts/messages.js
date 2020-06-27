
$(function() {
    $('#link-messages a').click(function(e) {
        e.preventDefault();
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        ajaxGet(messageConfig.action, loadMessages);
    });
});


$(document).on('click', '.' + messageConfig.submitClass, function(e) {
    e.preventDefault();
    // e.stopPropagation();
    let quill = $('#editor').data('quill');
    // let input = quill.getContents();
    let input = document.querySelector('.' + messageConfig.contentClass).innerHTML;
    let user = $('#' + messageConfig.inputId).val();
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let comment = {
        user: user,
        body: input,
        date: date,
    };
    quill.setContents('');
    ajaxPost(messageConfig.action, comment, pageMessages);
});

//redirect to the specific page
$(document).on('click', '#' + messageConfig.pageId + ' a', function(e) {
    e.preventDefault();
    $('.activated').removeClass('activated');
    $(this).addClass('activated');
    ajaxGet(this.attributes.href.value, pageMessages);
});


// delete message, must have admin permission
$(document).on('click', '.' + messageConfig.deletClass, function(e) {
    e.preventDefault();
    ajaxGet(this.attributes.href.value, pageMessages);
});