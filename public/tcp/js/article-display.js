function prepareDisplayView(id) {
	createAdminEntity();

	let $positionInfo = $('.position-info');
	$positionInfo.empty();

	$('<span/>').addClass('translate').attr('data-args', 'CurrentPosition').appendTo($positionInfo);
	// $('<span/>').html(' >>> ').appendTo($positionInfo);
	let $positionNav = $('<div/>').addClass('position-nav').appendTo($positionInfo);
	$('<a/>')
		.addClass('translate')
		.attr({
			href: "javascript: myArticle=null;render('articles');",
			'data-args': 'BackToArticlesList'
		})
		.appendTo($positionNav);

	if (id) {
		SimonService.getSingleArticle(id, function(err, article) {
			if (article) {
				$('<span/>').addClass('translate').attr('data-args', article.Category).insertBefore($positionNav);
				myArticle = article;
				showSingleArticle(article);
				// setLocaleTo(LangID);
				SimonService.increaseViewsCount(id, function(err, data) {
					// if (err) {
					// 	showInfoDialog(err.message);
					// } else {
					// 	showInfoDialog(data.message);
					// }
					return;
				});
			} else {
				$('<span/>').addClass('translate').attr('data-args', 'ArticleNoExists').appendTo($('#article-content'));
			}
			console.log('Setting language!');
			setLocaleTo(LangID);
		});
	} else {
		$('<span/>').addClass('translate').attr('data-args', 'ArticleNoExists').appendTo($('#article-content'));
		setLocaleTo(LangID);
	}
}

function showSingleArticle(article) {
	let $articleSubject = $('#article-subject');
	$('<span/>').addClass('translate').attr('data-args', 'Subject').appendTo($articleSubject);
	$('<span/>').html(article.Subject).appendTo($articleSubject);

	if (!article.IsPrivated) {
		let $summary = $('#one-article-summary');

		$('<span/>').addClass('translate').attr('data-args', 'CreationDate').appendTo($summary);
		$('<span/>').html(localDate(article.CreationDate) + ' | ').appendTo($summary);

		if (article.LastEditDate) {
			// $('<span/>').html(' | Last Edited: ' + localDate(article.LastEditDate)).appendTo($summary);
			$('<span/>').addClass('translate').attr('data-args', 'LastEdited').appendTo($summary);
			$('<span/>').html(localDate(article.LastEditDate) + ' | ').appendTo($summary);
		}

		let count = article.CommentsCount ? article.CommentsCount : 0;
		$('<span/>').html(' | (' + count + '/' + article.ViewsCount + ')').appendTo($summary);

		$('#article-content').html(article.Content);

		createArticleFooter(article.Guid);
	} else {
		$('<span/>').addClass('translate').attr('data-args', 'PrivateArticle').appendTo($('#article-content'));
		// $('#article-content').html('Article is set as private.');
	}
}

function createArticleFooter(articleGuid) {
	let $footer = $('#article-footer');
	let count = myArticle.CommentsCount ? myArticle.CommentsCount : 0;

	$('<a/>')
		.addClass('translate')
		.attr({
			href: 'javascript:void(0)',
			onclick: "showComments('" + articleGuid + "')",
			'data-args': 'Comment'
		})
		.appendTo($footer);
	$('<span/>').html('(' + count + ') ').appendTo($footer);

	if (isAdmin()) {
		$('<button/>')
			.addClass('translate')
			.attr({
				href: 'javascript:void(0)',
				onclick: "deleteArticle('" + articleGuid + "')",
				'data-args': 'Delete'
			})
			.appendTo($footer);

		$('<button/>')
			.addClass('translate')
			.attr({
				// href: "javascript: render('edit', '" + articleGuid + "');",
				onclick: "render('edit', '" + articleGuid + "')",
				'data-args': 'Edit'
			})
			.appendTo($footer);
	}
}

// function showLikes(likes) {
// 	// see moment-viewer.js 169
// }

// function likeArticle(id) {
// 	SimonService.addLike(id, function(err, data) {
// 		if (err) {
// 			showInfoDialog(err.message);
// 		} else {
// 			showInfoDialog(data.message);
// 		}
// 	});
// }
