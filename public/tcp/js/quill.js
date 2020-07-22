var myEditor = null;

function initQuill() {
	var toolbarOptions = [ [ 'bold', 'italic' ], [ 'link', 'image' ] ];
	const $image_btn = $('.ql-image');

	myEditor = new Quill('#editor', {
		modules: {
			toolbar: '#toolbar'
		},
		theme: 'snow'
	});

	myEditor.getModule('toolbar').addHandler('image', uploadImageHandler);
	myEditor.getModule('toolbar').addHandler('video', uploadVideoHandler);

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

function uploadImage(event) {
	console.log('uploadImage -> event', event);
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
	console.log('uploadVideo -> event', event);

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

				const addVideoRange = myEditor.getSelection();
				console.log('uploadVideo -> addVideoRange', addVideoRange);
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
