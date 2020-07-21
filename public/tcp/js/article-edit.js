/*
 * Author: Dengpan Wang
 * Date: 7/6/2020
 */
var theUploadUrl = '/api/v1/upload/article';
var myArticle = null;
var articleGuid = null;
var fileUrls = [];
var fileOldNames = [];
// var setPrivated = 0;
// var category = 'Daily';

function prepareEditView(id) {
	createAdminEntity();

	if (id) {
		SimonService.getSingleArticle(id, function(err, article) {
			// category = article.Category;
			// setPrivated = article.IsPrivated ? 'Private' : 'Public';

			// $("input[vale='category']").attr('checked', 'true');
			// $("input[vale='setPrivated']").attr('checked', 'true');

			myArticle = article;
			articleGuid = myArticle.Guid;
			displayPositionInfo('Edit', myArticle.Category, myArticle.Subject);

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
		$('#editor').html(article.Content);

		$('<button/>')
			.addClass('btn btn-danger btn-sm translate')
			.attr({
				type: 'button',
				onclick: 'confirmDelete()',
				'data-args': 'Delete'
			})
			.appendTo($('#form-submit'));
	}

	initQuill(); // quill.js

	articleSetting();
}

function saveArticle() {
	// let basicForm = document.querySelector('#basic-form');

	let subject = $('#subject').val().trim();
	let content = myEditor.root.innerHTML;

	let category = convertCategory($('#category').val());
	let privacy = convertPrivacy($('#privacy').val());
	// articlePropertySetting();

	let payload = null;

	if (myArticle.Guid) {
		payload = {
			article: {
				Guid: myArticle.Guid,
				Subject: subject,
				Content: content,
				IsPrivated: privacy,
				Category: category
			},
			files: {
				urls: fileUrls,
				oldNames: fileOldNames
			}
		};
	} else {
		payload = {
			article: {
				Subject: subject,
				Content: content,
				IsPrivated: privacy,
				Category: category
			},
			files: {
				urls: fileUrls,
				oldNames: fileOldNames
			}
		};
	}
	console.log(payload);

	fileUrls = [];
	fileOldNames = [];
	SimonService.edit(payload, function(err, data) {
		if (err) {
			// showInfoDialog(err.message);
		} else {
			// showInfoDialog(data.message);

			render('articles');
		}
	});
}

function confirmDelete(id) {
	articleGuid = id;
	if ($('#confirm-delete').length) {
		$('#confirm-delete').modal('show');
	} else {
		let url = '/tcp/modals/confirm-delete.html';
		$.ajax({
			type: 'GET',
			cache: false,
			url: url
		}).done(function(data) {
			$(data).appendTo('body');
			$('#confirm-delete').modal('show');
		});
	}
}

function deleteArticle() {
	if (id) {
		SimonService.deleteArticle(id, function(err, data) {
			if (err) {
				// showInfoDialog(err.message);
			} else {
				// showInfoDialog(data.message);
				myArticle = null;
				id = null;
				render('articles');
			}
		});
	}
}

function cancelEdit() {
	render('articles');
}

function articleSetting() {
	let category = null;
	let privacy = null;

	if (myArticle) {
		category = convertChinese(myArticle.Category);
		privacy = myArticle.IsPrivated ? 'Private' : 'Public';
		privacy = convertChinese(privacy);
	} else {
		category = convertChinese('Daily');
		privacy = convertChinese('Public');
	}

	console.log(category + ':' + privacy);

	$('#category').val(category);
	$('#privacy').val(privacy);
}
