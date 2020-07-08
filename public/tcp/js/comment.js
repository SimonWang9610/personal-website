
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
				comments.forEach(comment => {
					let $div = $('<div/>').addClass('single-comment').appendTo($comments);
					$('<div/>').addClass('comment-info').append($('<span/>').html(comment.ID + 'F | '))
														.append($('<span/>').html('Created at ' + localDate(comment.CreationDate)))
														.appendTo($div);
					$('<div/>').addClass('comment-content').html(comment.Content).appendTo($div);
					$('<div/>').addClass('comment-author').html(comment.Author).appendTo($div);
				});
			} else {
				$('<p/>').text('Write the first comment!').appendTo($comments);
			}
		}
	});
}

function initCommentForm() {
	$.ajax({
		type: 'GET',
		cache: false,
		url: '/tcp/views/comments.html'
	}).done(function(data) {
		$('#comments').html(data);
	}).fail(() => {
		$('#comments').html('Page Not Found');
	});
}

function addComment() {
	let author = $('#comment-author').val();
	let content = $('#comment-content').val();

	if (!author) {
		alert('Email can not be empty!');
		return false;
	}

	let payload = {
		Author: author,
		Content: content,
		ArticleGuid: myArticle.Guid
	}
	
	clearComment();

	SimonService.addComment(payload, function(err, data) {
		if (err) {
			//showInfoDialog(err.message);
		} else {
			// showInfoDialog(data.message);
		}

		if (data.success) {

			SimonService.getComments(myArticle.Guid, function(err, comments) {
				showComments(comments);
			});
		}
	});
}

function clearComment() {
	$('#comment-author').val('');
	$('#comment-content').val('');
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