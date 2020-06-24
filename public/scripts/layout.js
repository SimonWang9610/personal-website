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

let $admin = $('<div/>').attr('id', 'admin').appendTo($('#profile'));
$('<p/>').addClass('identity').text('You are Passenger').appendTo($admin);
let $auth = $('<a/>').attr('href', '/auth').text('get Permission').appendTo($admin);
