function prepareArticlesView() {
	createAdminEntity();
	displayAllArticles();
}

function prepareCategoryView(type) {
	createAdminEntity();
	displayArticlesByCategory(type);
}

function displayAllArticles() {
	displayPositionInfo('ArticlesList');
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
	displayPositionInfo(type + 'List');
	SimonService.getArticles(type, function(err, articles) {
		if (articles.length) {
			console.log(articles);
			// $('#position-info').text('Category >> ' + type);
			showArticles(articles);
		} else {
			$('#articles-list').empty();
			let $div = $('<div/>').addClass('row').appendTo($('#articles-list'));

			$('<div/>')
				.addClass('col d-flex justify-content-center translate')
				.attr('data-args', 'No' + type + 'Articles')
				.appendTo($div);
		}
		setLocaleTo(LangID);
	});
}

function showArticles(articles) {
	// $('.position-info').text('Article lists');
	let $articleList = $('#articles-list');
	$articleList.empty();
	let $ul = $('<ul/>').appendTo($articleList);

	articles.forEach((article) => {
		// let $articleInfo = $('<div/>').addClass('row article-info').appendTo($articleList);
		let $articleInfo = $('<li/>').addClass('d-flex bg-light').appendTo($ul);
		let $articleSubject = $('<div/>')
			.addClass('col d-flex justify-content-center each-article-subject')
			.appendTo($articleInfo);

		$('<a/>')
			.attr({
				href: "javascript: render('display', '" + article.Guid + "')"
			})
			.html(article.Subject)
			.appendTo($articleSubject);

		let $articleSummary = $('<div/>')
			.addClass('col d-flex justify-content-center each-article-summary')
			.appendTo($articleInfo);
		let private = article.IsPrivated ? 'Private' : 'Public';
		let count = article.CommentsCount ? article.CommentsCount : 0;

		// $('<span/>').addClass('translate').attr('data-args', 'CreatedAt').appendTo($articleSummary);
		$('<span/>').html(localDate(article.CreationDate)).appendTo($articleSummary);

		$('<span/>').html('(' + count + '/' + article.ViewsCount + ')').appendTo($articleSummary);

		$('<span/>').addClass('translate').attr('data-args', private).appendTo($articleSummary);

		if (isAdmin()) {
			/* let $articleSetting = $('<div/>')
				.addClass('col d-flex justify-content-center dropdown each-article-edit')
				.appendTo($articleInfo); */
			let $articleSetting = $('<span/>').addClass('dropdown each-article-edit').appendTo($articleSummary);

			$('<button/>')
				.addClass('btn btn-warning btn-sm dropdown-toggle translate')
				.attr({
					type: 'button',
					'data-toggle': 'dropdown',
					'data-args': 'Setting'
				})
				.appendTo($articleSetting);

			let $dropdown = $('<div/>').addClass('dropdown-menu').appendTo($articleSetting);

			$('<a/>')
				.addClass('dropdown-item translate')
				.attr({
					href: "javascript: render('edit', '" + article.Guid + "')",
					'data-args': 'Edit'
				})
				.appendTo($dropdown);

			$('<a/>')
				.addClass('dropdown-item translate')
				.attr({
					onclick: "deleteArticle('" + article.Guid + "')",
					'data-args': 'Delete'
				})
				.appendTo($dropdown);

			let changeCategoryTo = article.Category ? 'Public' : 'Private';
			$('<a/>')
				.addClass('dropdown-item translate')
				.attr({
					onclick: "changeCategory('" + article.Guid + "')",
					'data-args': 'SetAs' + changeCategoryTo
				})
				.appendTo($dropdown);
		}
	});
}

function displayPositionInfo(anchor, category, subject) {
	let $ul = $('.breadcrumb');
	let $positionNav = $('.position-nav');
	$ul.empty();
	$positionNav.empty();

	if (isAdmin()) {
		$('<button/>')
			.addClass('btn btn-danger btn-sm translate')
			.attr({
				type: 'button',
				onclick: "render('edit')",
				'data-args': 'NewArticle'
			})
			.appendTo($positionNav);
	}

	if (anchor !== 'ArticlesList') {
		$('<a/>')
			.addClass('btn btn-outline-danger btn-sm translate')
			.attr({
				onclick: "render('articles')",
				'data-args': 'BackToArticlesList'
			})
			.appendTo($positionNav);
	}

	$('<li/>').addClass('breadcrumb-item translate').attr('data-args', 'CurrentPosition').appendTo($ul);

	let $liOne = $('<li/>').addClass('breadcrumb-item').appendTo($ul);

	if (anchor === 'ArticlesList') {
		$liOne.addClass('active translate');
		$liOne.attr('data-args', anchor);
		return;
	}

	$('<a/>')
		.addClass('translate')
		.attr({
			href: "javascript: myArticle=null; render('articles')",
			'data-args': 'ArticlesList'
		})
		.appendTo($liOne);

	let $liTwo = $('<li/>').addClass('breadcrumb-item').appendTo($ul);

	if (anchor === 'DailyList' || anchor === 'NoteList') {
		console.log('category list');
		$liTwo.addClass('active translate');
		$liTwo.attr('data-args', anchor);
		return;
	} else {
		$('<a/>')
			.addClass('translate')
			.attr({
				href: "javascript: render('category', '" + category + "')",
				// onclick: "displayArticlesByCategory('" + category + "')",
				'data-args': category + 'List'
			})
			.appendTo($liTwo);
		$('<li/>').addClass('breadcrumb-item active').html(subject).appendTo($ul);
		return;
	}

	/* if (anchor === 'display') {
		console.log('category');
		$('<a/>')
			.addClass('translate')
			.attr({
				href: "javascript: render('category', " + category + ')',
				// onclick: "displayArticlesByCategory('" + category + "')",
				'data-args': category + 'List'
			})
			.appendTo($liTwo);
		$('<li/>').addClass('breadcrumb-item active').html(subject).appendTo($ul);
		return;
	} */
}

function redirectToSingleArticle(type, Guid) {
	render(type, Guid);
}
