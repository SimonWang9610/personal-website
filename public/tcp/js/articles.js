var currentPage = 1;
var currentType = null;
var currentState = 1;

function prepareArticlesView() {
	createAdminEntity();
	displayAllArticles(currentPage);
}

function prepareCategoryView(type) {
	createAdminEntity();
	displayArticlesByCategory(currentPage, type);
}

function displayAllArticles(page) {
	currentType = null;
	displayPositionInfo('ArticlesList');
	currentState = 1;
	SimonService.getArticles(page, currentType, currentState, function(err, articles) {
		if (articles.length) {
			// first redirect to the specific list, have to reset pagination
			// the page number as the final element of Array 'articles'
			let number = articles.pop();
			showArticles(articles);
			createPagination(number);
			currentState = 0;
			console.log(number);
		} else {
			$('<span/>').addClass('translate').attr('data-args', 'NoArticles').appendTo($('#article-list'));
		}
		setLocaleTo(LangID);
	});
}

function displayArticlesByCategory(page, type) {
	currentType = type;
	displayPositionInfo(type + 'List');
	currentState = 1;
	SimonService.getArticles(page, currentType, currentState, function(err, articles) {
		if (articles.length) {
			// $('#position-info').text('Category >> ' + type);
			let number = articles.pop();
			showArticles(articles);
			createPagination(number);
			currentState = 0;
			console.log(number);
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
	console.log(articles);
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
		let privated = article.IsPrivated ? 'Private' : 'Public';
		let count = article.CommentsCount ? article.CommentsCount : 0;

		// $('<span/>').addClass('translate').attr('data-args', 'CreatedAt').appendTo($articleSummary);
		$('<span/>').html(localDate(article.CreationDate)).appendTo($articleSummary);

		$('<span/>').html('(' + count + '/' + article.ViewsCount + ')').appendTo($articleSummary);

		$('<span/>').addClass('translate').attr('data-args', privated).appendTo($articleSummary);

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
					onclick: "confirmDelete('" + article.Guid + "')",
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

		if (anchor === 'Edit') subject += ' (Edit)';
		$('<li/>').addClass('breadcrumb-item active').html(subject).appendTo($ul);
		return;
	}
}

function redirectToSingleArticle(type, Guid) {
	render(type, Guid);
}

function createPagination(number) {
	let $pagination = $('.pagination');
	$pagination.empty();

	for (let i = 1; i <= number; i++) {
		let $li = $('<li/>').addClass('page-item').attr('tabindex', '-1').appendTo($pagination);
		if (i == 1) $li.addClass('active disabled');

		$('<a/>')
			.addClass('page-link')
			.attr({
				href: 'javascript: void(0)',
				onclick: "gotoPage('" + i + "')"
			})
			.html(i)
			.appendTo($li);
	}
}

function gotoPage(page) {
	currentPage = parseInt(page);
	/* $('.pagination li.disabled').removeClass('active disabled');
	$('.pagination').find('li').eq(currentPage - 1).addClass('active disabled'); */
	SimonService.getArticles(page, currentType, currentState, function(err, articles) {
		if (articles.length) {
			showArticles(articles);
		} else {
			$('<span/>').addClass('translate').attr('data-args', 'NoArticles').appendTo($('#article-list'));
		}
		setLocaleTo(LangID);
	});
}

function createPrevious(position, positionIcon) {
	let $li = $('<li/>').addClass('page-item');
	let $a = $('<a/>')
		.addClass('page-link')
		.attr({
			href: 'javascript:void(0)',
			onclick: 'goto' + position + '()',
			'aria-label': position
		})
		.appendTo($li);

	$('<span/>').attr('aria-hidden', 'true').html(positionIcon).appendTo($a);
	$('<span/>').addClass('sr-only').html(position).appendTo($a);

	return $li;
}

// $(document).ready(function() {
// 	$('.pagination li a').click(function(e) {
// 		$('.pagination li.active').removeClass('active disabled');
// 		let $parent = $(this).parent();
// 		$parent.addClass('active disabled');
// 		// e.preventDefault();
// 	});
// });
