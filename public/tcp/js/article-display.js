

function prepareDisplayView(id) {
	createAdminEnity();

	$('<span/>').html('Current Position >>> New Article').appendTo($('.position-info'));
	$('<a/>').attr({
		"href": "javascript: myArticle=null;render('articles');"
		}).html('> Back to Article list').appendTo($('.position-info'));

	if (id) {
		SimonService.getSingleArticle(id, function(err, article) {
			if (article) {

				myArticle = article;
				showSingleArticle(article);
				SimonService.increaseViewsCount(id, function(err, data) {
						// if (err) {
						// 	showInfoDialog(err.message);
						// } else {
						// 	showInfoDialog(data.message);
						// }
					});
			} else {
				$('#article-content').html('Article not exists!');
			}
		});	
	} else {
		$('#article-content').html('Article not exists!');
	}
}

function showSingleArticle(article) {
	$('#article-subject').html(article.Subject);
	
	if (!article.IsPrivated) {
		let $summary = $('#one-article-summary');

		$('<span/>').html(' | ' + localDate(localDate(article.CreationDate))).appendTo($summary);

		if (article.LastEditDate) $('<span/>').html(' | Last Edited: ' + localDate(article.LastEditDate)).appendTo($summary);

		let count = article.CommentsCount ? article.CommentsCount: 0;
		$('<span/>').html(' | (' + count + '/' + article.ViewsCount + ')').appendTo($summary);

		$('#article-content').html(article.Content);

		createArticleFooter(article.Guid);
	} else {
		$('#article-content').html('Article is set as private.');
	}
	

}

function createArticleFooter(articleGuid) {
	let $footer = $('#article-footer');
	let count = myArticle.CommentsCount ? myArticle.CommentsCount: 0;
	$('<a/>').attr({
		'href': 'javascript:void(0)',
		'onclick': 'showComments(\'' + articleGuid + '\')'
	}).html('Comment (' + count + ')').appendTo($footer);

	if (isAdmin()) {
		
		$('<a/>').attr({
			'href': 'javascript:void(0)',
			'onclick': 'deleteArticle(\''+ articleGuid + '\')'
		}).html('| Delete |').appendTo($footer);

		$('<a/>').attr({
			'href': 'javascript: render(\'edit\', \'' + articleGuid + '\');'
		}).html('| Edit |').appendTo($footer);
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