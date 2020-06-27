$(document).ready(() => {
    $('#link-articles a').addClass('selected');
    ajaxGet(articleConfig.action, loadArticle);
});

$(document).on('click', '#admin a', function(e) {
    e.preventDefault();
    let admin;
    if ($(this).text() != 'logout') admin = prompt('enter ADMIN key:');

    $.ajax({
        type: 'GET',
        url: this.attributes.href.value,
        data: {admin: admin},
        dataType: 'json',
        success: function(response) {
            let identity = (response.identity)? 'admin':'passenger';
            let $identity = $('.identity');
            $identity.text('You are ' + identity);
            if (identity == 'admin') $('#admin a').remove();
        }
    });
});


$('#admin').bind('DOMSubtreeModified', function() {
    $('.selected').trigger('click');
});
