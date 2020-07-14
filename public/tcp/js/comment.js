/*
{myArticleGuid} defined at article-display.js
*/

function showComments(articleGuid) {
	let $comments = $('#comments');
	$comments.empty();
	initCommentForm();
	SimonService.getComments(articleGuid, function(err, comments) {
		if (err) {
			// showInfoDialog(err.message);
		} else {
			if (comments.length) {
				let $comments = $('#comments');
				comments.forEach((comment) => {
					let $singleComment = $('<div/>').addClass('single-comment').appendTo($comments);
					let $row = $('<div/>').addClass('row justify-content-center').appendTo($singleComment);
					let $col = $('<div/>').addClass('col-sm-8').appendTo($row);

					$('<span/>').addClass('comment-author').html(comment.Author).appendTo($col);
					$('<span/>').addClass('comment-date').html(localDate(comment.CreationDate)).appendTo($col);

					let $rowContent = $('<div/>').addClass('row justify-content-center').appendTo($singleComment);
					$('<div/>').addClass('col-sm-8 d-flex').html(comment.Content).appendTo($rowContent);

					/* let $div = $('<div/>').addClass('single-comment').appendTo($comments);

					let $;
					let $commentInfo = $('<div/>').addClass('comment-info').appendTo($div);
					$('<span/>').addClass('comment-author').html(comment.Author + ' ').appendTo($commentInfo);

					$('<span/>').addClass('translate').attr('data-args', 'CreatedAt').appendTo($commentInfo);
					$('<span/>').html(localDate(comment.CreationDate)).appendTo($commentInfo);

					$('<div/>').addClass('comment-content').html(comment.Content).appendTo($div);
					*/
				});

				setLocaleTo(LangID);
			} else {
				$('<p/>').addClass('translate').attr('data-args', 'FirstComment').appendTo($comments);
				// $('<p/>').text('Write the first comment!').appendTo($comments);
			}
			setLocaleTo(LangID);
		}
	});
}

function initCommentForm() {
	$.ajax({
		type: 'GET',
		cache: false,
		url: '/tcp/views/comments.html'
	})
		.done(function(data) {
			$('#comments').html(data);
		})
		.fail(() => {
			$('#comments').html('Page Not Found');
		});
}

function addComment() {
	let basicForm = document.getElementById('comment-form');

	if (basicForm.checkValidity() === false) {
		basicForm.classList.add('was-validated');
		return;
	}

	let author = $('#form-comment-author').val();
	let content = $('#form-comment-content').val();
	console.log(author);

	let payload = {
		Author: author,
		Content: content,
		ArticleGuid: myArticle.Guid
	};
	console.log(payload);
	clearComment();

	SimonService.addComment(payload, function(err, data) {
		if (err) {
			//showInfoDialog(err.message);
		} else {
			// showInfoDialog(data.message);
		}

		if (data.success) {
			SimonService.getComments(myArticle.Guid, function(err, comments) {
				// showComments(comments);
				render('display', myArticle.Guid);
			});
		}
	});
}

function clearComment() {
	$('#form-comment-author').val('');
	$('#form-comment-content').val('');
}

function deleteComment(id) {
	if (id) {
		SimonService.deleteComment(id, function(err, data) {
			if (err) {
				// showInfoDialog(err.message);
			} else {
				// showInfoDialog(data.message);
			}

			if (data.success) {
				SimonService.getComments(myArticleGuid, function(err, comments) {
					showComments(comments);
				});
			}
		});
	}
}
