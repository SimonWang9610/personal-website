function prepareDisplayView(id) {
	createAdminEntity();

	//$('<span/>').addClass('translate').attr('data-args', 'CurrentPosition').appendTo($positionInfo);

	/* let $positionNav = $('<div/>').addClass('position-nav').appendTo($positionInfo);
	$('<a/>')
		.addClass('translate')
		.attr({
			href: "javascript: myArticle=null;render('articles');",
			'data-args': 'BackToArticlesList'
		})
		.appendTo($positionNav); */

	if (id) {
		SimonService.getSingleArticle(id, function(err, article) {
			if (article) {
				// $('<span/>').addClass('translate').attr('data-args', article.Category).insertBefore($positionNav);
				myArticle = article;
				displayPositionInfo('display', myArticle.Category, myArticle.Subject);
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
	// $('<span/>').addClass('translate').attr('data-args', 'Subject').appendTo($articleSubject);
	$('<span/>').html(article.Subject).appendTo($articleSubject);

	if (!article.IsPrivated) {
		let $summary = $('#article-summary');

		$('<span/>').addClass('translate').attr('data-args', 'CreationDate').appendTo($summary);
		$('<span/>').html(localDate(article.CreationDate)).appendTo($summary);

		if (article.LastEditDate) {
			// $('<span/>').html(' | Last Edited: ' + localDate(article.LastEditDate)).appendTo($summary);
			$('<span/>').addClass('translate').attr('data-args', 'LastEdited').appendTo($summary);
			$('<span/>').html(localDate(article.LastEditDate)).appendTo($summary);
		}

		let count = article.CommentsCount ? article.CommentsCount : 0;
		$('<span/>').html('(' + count + '/' + article.ViewsCount + ')').appendTo($summary);

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

	/* $('<a/>')
		.addClass('translate')
		.attr({
			href: 'javascript:void(0)',
			onclick: "showComments('" + articleGuid + "')",
			'data-args': 'Comment'
		})
		.appendTo($footer); */

	let $div = $('<div/>').addClass('col-sm-2 d-flex').appendTo($footer);
	$('<a/>')
		.addClass('translate')
		.attr({
			href: 'javascript: void(0)',
			onclick: "showComments('" + myArticle.Guid + "')",
			'data-args': 'Comment'
		})
		.appendTo($div);
	$('<span/>').html('(' + count + ') ').appendTo($div);

	if (isAdmin()) {
		let $articleSetting = $('<div/>').addClass('col d-flex dropdown').appendTo($footer);
		$('<button/>')
			.addClass('btn btn-primary btn-sm dropdown-toggle translate')
			.attr({
				'data-toggle': 'dropdown',
				'data-args': 'Setting'
			})
			.appendTo($articleSetting);

		let $dropdownMenu = $('<div/>').addClass('dropdown-menu').appendTo($articleSetting);
		$('<a/>')
			.addClass('dropdown-item translate')
			.attr({
				href: "javascript: render('display', '" + myArticle.Guid + "')",
				'data-args': 'Edit'
			})
			.appendTo($dropdownMenu);

		$('<a/>')
			.addClass('dropdown-item translate')
			.attr({
				href: 'javascript: void(0)',
				onclick: 'deleteArticle()',
				'data-args': 'Delete'
			})
			.appendTo($dropdownMenu);
	}
}
