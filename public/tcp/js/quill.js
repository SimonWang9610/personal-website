var myEditor = null;
var linkRange = null;

function initQuill() {
	// var toolbarOptions = [ [ 'bold', 'italic' ], [ 'link', 'image' ] ];
	const $image_btn = $('.ql-image');

	myEditor = new Quill('#editor', {
		modules: {
			magicUrl: {},
			toolbar: '#toolbar'
		},
		theme: 'snow'
	});

	myEditor.getModule('toolbar').addHandler('image', uploadImageHandler);
	myEditor.getModule('toolbar').addHandler('video', uploadVideoHandler);
	myEditor.getModule('toolbar').addHandler('link', insertLinkHandler);

	$image_btn.click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		uploadImageHandler();
	});
}

function uploadImageHandler() {
	const input = document.querySelector('#upload-image');
	input.value = '';
	input.click();
}

function uploadVideoHandler() {
	let input = document.querySelector('#upload-video');
	input.value = '';
	input.click();
}

function insertLinkHandler() {
	linkRange = myEditor.getSelection();

	if ($('#add-link').length) {
		$('#add-link').modal('show');
		$('#link-title').val();
		$('#link-href').val('https://');
	} else {
		let url = '/tcp/modals/new-link.html';
		$.ajax({
			type: 'GET',
			cache: false,
			url: url
		}).done(function(data) {
			$(data).appendTo('body');
			setLocaleTo(LangID);
			$('#add-link').modal('show');
			$('#link-title').val();
			$('#link-href').val('https://');
		});
	}
}

function insertLink() {
	let title = $('#link-title').val();
	let url = $('#link-href').val();

	let [ leaf ] = myEditor.getLeaf(linkRange.index);
	let newRange = 0 + (linkRange ? linkRange.index : 0);
	console.log('insertLink -> leaf', leaf);

	// remove the original domNode
	if (leaf.text) {
		newRange = myEditor.getIndex(leaf);
		leaf.remove();
	}

	let ops = new Delta().retain(newRange).insert(title, {
		link: {
			url: url,
			title: title
		}
	});

	myEditor.updateContents(ops, Quill.sources.USER);
	myEditor.setSelection(newRange + title.length);
	$('#add-link').modal('hide');
}

function uploadImage(event) {
	let formData = new FormData();

	formData.append('files[]', event.target.files[0]);

	$.ajax({
		url: theUploadUrl,
		type: 'POST',
		data: formData,
		async: true,
		cache: false,
		contentType: false,
		enctype: 'multipart/form-data',
		processData: false,
		success: function(data) {
			if (data.success) {
				let file = data.file;
				let url = file.url;
				fileOldNames.push(file.OriginalName);
				fileUrls.push(url);

				const addImageRange = myEditor.getSelection();
				const newRange = 0 + (addImageRange !== null ? addImageRange.index : 0);

				myEditor.insertEmbed(
					newRange,
					'blockFigure',
					{
						image: url,
						class: 'img-fluid'
					},
					Quill.sources.USER
				);

				myEditor.setSelection(1 + newRange);
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function uploadVideo(event) {
	let formData = new FormData();

	formData.append('files[]', event.target.files[0]);

	$.ajax({
		type: 'POST',
		url: theUploadUrl,
		data: formData,
		async: true,
		cache: false,
		contentType: false,
		enctype: 'multipart/form-data',
		processData: false,
		success: function(data) {
			if (data.success) {
				let file = data.file;
				let url = file.url;
				fileOldNames.push(file.OriginalName);
				fileUrls.push(url);

				const addVideoRange = myEditor.getSelection();
				const newRange = 0 + (addVideoRange ? addVideoRange.index : 0);

				myEditor.insertEmbed(newRange, 'blockFigure', {
					video: url,
					class: 'video-fluid',
					poster: file.poster,
					controls: 'controls',
					width: '100%',
					height: '100%'
				});

				myEditor.setSelection(newRange + 1);
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}
