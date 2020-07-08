
function prepareHomeView() {
	createAdminEnity();
	SimonService.getArticles('latest', function(err, article) {
		if (article) {
			showLatestUpdate(article);
		} else {
			$('#latest-update').html('Author has no articles!');
		}
	});
}

function showLatestUpdate(article) {
	$('#update-time p').text(localDate(article.CreationDate));
	
	$('#update-subject').append($('<a/>').attr({
		'href': 'javascript: render(\'display\', \'' + article.Guid + '\');'
	}).html(article.Subject));

	$('#update-content').html(article.content);
}