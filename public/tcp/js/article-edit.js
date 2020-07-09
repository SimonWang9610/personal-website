/*
 * Author: Dengpan Wang
 * Date: 7/6/2020
 */
var theUploadurl = '/api/v1/upload/article';
var myArticle = null;
var setPrivated = 0;
var category = 'Daily';

function prepareEditView(id) {
	createAdminEntity();

	let $positionInfo = $('.position-info');
	$positionInfo.empty();

	$('<span/>').addClass('translate').attr('data-args', 'CurrentPosition').appendTo($positionInfo);
	// $('<span/>').html(' >>> ').appendTo($positionInfo);
	$('<span/>').addClass('translate').attr('data-args', 'EditArticle').appendTo($positionInfo);
	let $positionNav = $('<div/>').addClass('position-nav').appendTo($positionInfo);

	$('<a/>')
		.addClass('translate')
		.attr({
			href: "javascript: myArticle=null; render('articles')",
			'data-args': 'BackToArticlesList'
		})
		.appendTo($positionNav);

	if (id) {
		SimonService.getSingleArticle(id, function(err, article) {
			category = article.Category;
			setPrivated = article.IsPrivated ? 'Private' : 'Public';

			$("input[vale='category']").attr('checked', 'true');
			$("input[vale='setPrivated']").attr('checked', 'true');

			myArticle = article;
			showEditor(article);
			console.log('Setting language!');
			setLocaleTo(LangID);
		});
	} else {
		showEditor();
		console.log('Setting language!');
		setLocaleTo(LangID);
	}
}

function showEditor(article) {
	if (article) {
		$('#subject').val(article.Subject);
		isPrivated = article.isPrivated;
		$('#editor').html(article.Content);
		$('<button/>')
			.addClass('translate')
			.attr({
				type: 'button',
				onclick: "deleteArticle('" + article.Guid + "')",
				'data-args': 'Delete'
			})
			.appendTo($('#submit-form'));
	}

	initQuill(); // quill.js
}

function saveArticle() {
	// let basicForm = document.querySelector('#basic-form');

	let subject = $('#subject').val().trim();
	let content = myEditor.root.innerHTML;
	// articlePropertySetting();

	let payload = null;

	if (myArticle) {
		payload = {
			Guid: myArticle.Guid,
			Subject: subject,
			Content: content,
			IsPrivated: setPrivated,
			Category: category
		};
	} else {
		payload = {
			Subject: subject,
			Content: content,
			IsPrivated: setPrivated,
			Category: category
		};
	}
	console.log(payload);
	SimonService.edit(payload, function(err, data) {
		if (err) {
			// showInfoDialog(err.message);
		} else {
			// showInfoDialog(data.message);
			myArticle = null;
			render('articles');
		}
	});
}

function deleteArticle(articleGuid) {
	if (articleGuid) {
		SimonService.deleteArticle(articleGuid, function(err, data) {
			if (err) {
				// showInfoDialog(err.message);
			} else {
				// showInfoDialog(data.message);
				myArticle = null;
				render('articles');
			}
		});
	}
}

function cancelEdit() {
	render('articles');
}

function articlePropertySetting() {
	if (!$("input[name='category']:checked").val()) {
		$("input[name='category']:first").attr('checked', 'true');
	}

	if (!$("input[name='setPrivated']:checked").val()) {
		$("input[name='setPrivated']:first").attr('checked', 'true');
	}

	category = $("input[name='category']:checked").val();
	setPrivated = $("input[name='setPrivated']:checked").val();

	// setPrivated = (setPrivated === 'Private') ? 1: 0;
}
