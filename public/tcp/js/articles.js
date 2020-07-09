function prepareArticlesView() {
	createAdminEntity();
	displayAllArticles();
}

// $('.articles-tabs').click(function() {
// 	$('.selected').removeClass('.selected');
// 	$(this).addClass('selected');
// });

function displayAllArticles() {
	let $positionInfo = $('.position-info');
	$positionInfo.empty();

	$('<span/>').addClass('translate').attr('data-args', 'CurrentPosition').appendTo($positionInfo);
	// $('<span/>').html(' >>> ').appendTo($positionInfo);
	$('<span/>').addClass('translate').attr('data-args', 'ArticlesList').appendTo($positionInfo);
	let $positionNav = $('<div/>').addClass('position-nav').appendTo($positionInfo);

	if (isAdmin()) {
		$('<a/>')
			.addClass('translate')
			.attr({
				href: "javascript:render('edit');",
				'data-args': 'NewArticle'
			})
			.appendTo($positionNav);
	}

	SimonService.getArticles(null, function(err, articles) {
		if (articles.length) {
			showArticles(articles);
		} else {
			$('<span/>').addClass('translate').attr('data-args', 'NoArticles').appendTo($('#article-list'));
		}
		console.log('Setting language!');
		setLocaleTo(LangID);
	});
}

function displayArticlesByCategory(type) {
	let $positionInfo = $('.position-info');
	$positionInfo.empty();

	$('<span/>').addClass('translate').attr('data-args', 'CurrentPosition').appendTo($positionInfo);
	// $('<span/>').html(' >>> ').appendTo($positionInfo);
	$('<span/>').addClass('translate').attr('data-args', type + 'List').appendTo($positionInfo);
	let $positionNav = $('<div/>').addClass('position-nav').appendTo($positionInfo);

	if (isAdmin()) {
		$('<a/>')
			.addClass('translate')
			.attr({
				href: "javascript:render('edit');",
				'data-args': 'NewArticle'
			})
			.appendTo($positionNav);
	}

	SimonService.getArticles(type, function(err, articles) {
		if (articles.length) {
			// $('#position-info').text('Category >> ' + type);
			showArticles(articles);
		} else {
			$('#article-list').empty();
			$('<p/>').addClass('translate').attr('data-args', 'No' + type + 'Articles').appendTo($('#article-list'));
		}
		setLocaleTo(LangID);
	});
}

function showArticles(articles) {
	// $('.position-info').text('Article lists');
	let $articleList = $('#article-list');
	$articleList.empty();

	articles.forEach((article) => {
		let $articleInfo = $('<div/>').addClass('article-info').appendTo($articleList);
		$('<a/>')
			.attr({
				href: 'javascript:void(0)',
				onclick: "redirectToSingleArticle('display', '" + article.Guid + "')"
			})
			.html(article.Subject)
			.appendTo($articleInfo);

		let $articleSummary = $('<div/>').addClass('articles-summary').appendTo($articleInfo);
		let private = article.IsPrivated ? 'Private' : 'Public';
		let count = article.CommentsCount ? article.CommentsCount : 0;

		$('<span/>').addClass('translate').attr('data-args', 'CreatedAt').appendTo($articleSummary);
		$('<span/>').html(localDate(article.CreationDate)).appendTo($articleSummary);

		$('<span/>').html(' | (' + count + '/' + article.ViewsCount + ') | ').appendTo($articleSummary);

		$('<span/>').addClass('translate').attr('data-args', private).appendTo($articleSummary);

		if (isAdmin()) {
			$('<a/>')
				.addClass('translate')
				.attr({
					href: 'javascript: void(0)',
					onclick: "deleteArticle('" + article.Guid + "')",
					'data-args': 'Delete'
				})
				.appendTo($articleInfo);

			$('<a/>')
				.addClass('translate')
				.attr({
					href: "javascript: render('edit', '" + article.Guid + "');",
					'data-args': 'Edit'
				})
				.appendTo($articleInfo);
		}
	});
}

function redirectToSingleArticle(type, Guid) {
	render(type, Guid);
}
