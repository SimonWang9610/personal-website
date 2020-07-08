

function prepareArticlesView() {
	createAdminEnity();
	displayAllArticles();
}

	// $('.articles-tabs').click(function() {
	// 	$('.selected').removeClass('.selected');
	// 	$(this).addClass('selected');
	// });

function displayAllArticles() {
	$('.position-info').empty();

	$('<span/>').text('Current Position >>> Articles list ').appendTo($('.position-info'));

	if (isAdmin()) {		
		$('<a/>').attr({
			"href": "javascript:render('edit');" 
		}).html(' | New Article').appendTo($('.position-info'));
	}
	
	SimonService.getArticles(null, function(err, articles) {
		if (articles.length) {
			showArticles(articles);
		} else {
			$('#article-list').html('No articles!')
		}
	});
}

function displayArticlesByCategory(type) {
	$('.position-info').empty();

	$('<span/>').text('| Current Position >>> ' + type + ' list | ').appendTo($('.position-info'));

	if (isAdmin()) {		
		$('<a/>').attr({
			"href": "javascript:render('edit');" 
		}).html('New Article').appendTo($('.position-info'));
	}

	SimonService.getArticles(type, function(err, articles) {
		if (articles.length) {
			// $('#postion-info').text('Category >> ' + type);
			showArticles(articles);
		} else {
			$('#article-list').html('No ' + type + ' articles!');
		}
	});
}

function showArticles(articles) {
	// $('.position-info').text('Article lists');
	let $articleList = $('#article-list');
	$articleList.empty();

	articles.forEach(article => {
		
		let $articleInfo = $('<div/>').addClass('article-info').appendTo($articleList);
		$('<a/>').attr({
			'href': 'javascript:void(0)',
			'onclick': 'redirectToSingleArticle(\'display\', \'' + article.Guid + '\')'
		}).html(article.Subject).appendTo($articleInfo);

		let $articleSummary = $('<div/>').addClass('articles-summary').appendTo($articleInfo);
		let private = article.IsPrivated ? 'Private': 'Public';
		let count = article.CommentsCount ? article.CommentsCount: 0;
		$('<span/>').html('Createed at ' + localDate(article.CreationDate) 
						+ ' | (' + count + '/' + article.ViewsCount +') | '
						+ private).appendTo($articleSummary);

		if (isAdmin()) {
			$('<a/>').attr({
				'href': 'javascript: void(0)',
				'onclick': 'deleteArticle(\'' + article.Guid + '\')'
			}).html('| Delete |').appendTo($articleInfo);
			$('<a/>').attr({
				'href': 'javascript: render(\'edit\', \'' + article.Guid + '\');'
			}).html('| Edit |').appendTo($articleInfo);
		}
	});
}

function redirectToSingleArticle(type, Guid) {
	render(type, Guid);
}

