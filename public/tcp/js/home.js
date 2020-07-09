function prepareHomeView() {
	createAdminEntity();
	SimonService.getArticles('latest', function(err, article) {
		if (article) {
			showLatestUpdate(article);
			setLocaleTo(LangID);
		} else {
			$('#latest-update').html('Author has no articles!');
		}
	});
}

function showLatestUpdate(article) {
	let $updateTime = $('#update-time');
	$('<span/>').addClass('translate').attr('data-args', 'UpdateAt').appendTo($updateTime);
	$('<span/>').text(localDate(article.CreationDate)).appendTo($updateTime);
	// $('#update-time p').text(localDate(article.CreationDate));

	$('#update-subject').append($('<span/>').addClass('translate').attr('data-args', 'Title'));
	$('#update-subject').append(
		$('<a/>')
			.attr({
				href: "javascript: render('display', '" + article.Guid + "');"
			})
			.html(article.Subject)
	);

	$('#update-content').html(article.Content);
}
