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

	$image_btn.click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		console.log('goto uploadImageHandler()');
		uploadImageHandler();
	});
}

function uploadImageHandler() {
	const input = document.querySelector('#upload-image');
	input.value = '';
	input.click();
	console.log('goto uploadImage(event)');
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
				console.log('uploadImage -> file', file);
				let url = file.url;
				fileOldNames.push(file.OriginalName);
				console.log('uploadImage -> fileOldNames', fileOldNames);
				fileUrls.push(url);
				console.log('uploadImage -> fileUrls', fileUrls);

				const addImageRange = myEditor.getSelection();
				console.log('uploadImage -> addImageRange', addImageRange);
				const newRange = 0 + (addImageRange !== null ? addImageRange.index : 0);
				console.log('uploadImage -> newRange', newRange);

				myEditor.insertEmbed(newRange, 'image', url, Quill.sources.USER);

				myEditor.setSelection(1 + newRange);
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}
