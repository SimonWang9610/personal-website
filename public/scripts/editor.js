
// $(document).ready(() => {
//     const myQuill = new Quill('#editor', {
//         theme: 'snow',
//     });
//     let $span = $('<span/>').addClass('ql-submit').appendTo($('.ql-toolbar'));
//     $('<button/>').html('Post').appendTo($span);
//     $(document).on('click', '.ql-submit button', function(e) {
//         e.preventDefault();
//         let input = myQuill.getContents();
//         console.log(input);
//     });
// });

$.when({
    editor: new Quill('#editor', {theme: 'snow'})
}).then((quill) => {
    let $span = $('<span/>').addClass('ql-submit').appendTo($('.ql-toolbar'));
    $('<button/>').html('Post').appendTo($span);
    $(document).on('click', '.ql-submit button', function(e) {
        e.preventDefault();
        let input = quill.editor.getContents();
        console.log(input);
    });
});