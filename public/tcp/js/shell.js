const uiPage = {
	articles: {
		url: '/tcp/views/article-list.html',
		mode: 'inline',
		callback: function() {
			prepareArticlesView();
		}
	},
	home: {
		url: '/tcp/views/home.html',
		mode: 'inline',
		callback: function() {
			prepareHomeView();
		}
	},
	edit: {
		url: '/tcp/views/article-edit.html',
		mode: 'inline',
		callback: function(id) {
			prepareEditView(id);
		}
	},
	display: {
		url: '/tcp/views/article-display.html',
		mode: 'inline',
		callback: function(id) {
			prepareDisplayView(id);
		}
	}
};

// set window.location.hash
function storeState(view, page) {
	let stateObj = {
		view: view,
		url: page.url,
		mode: page.mode
	};
	let title = page.mode;
	let url = '#' + view;
	console.log(url);
	history.pushState(stateObj, title, url);
}

// get page contents by render
function setupShell(landingPage) {
	let hash = window.location.hash;
	if (hash) {
		render(hash.substring(1));
	} else {
		render(landingPage);
	}
}

// render view pages by ajax
// id : {articleGuid}
function render(view, id) {
	let page = uiPage[view];

	if (page) {
		storeState(view, page);

		if (page.mode === 'inline') {
			$.ajax({
				type: 'GET',
				cache: false,
				url: page.url
			})
				.done(function(data) {
					$('#workspace').html(data);
					setLocaleTo(LangID);

					if (id) {
						page.callback(id);
					} else {
						page.callback();
					}
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					let msg = 'There was an error to render the view "' + id + '".';
					$('#workspace').html(
						'<div class="container mt-5 pt-3"><div class="row pt-4">' +
							'<span class="view-title">' +
							jqXHR.status +
							' - ' +
							jqXHR.statusText +
							'</span>' +
							'<p>' +
							msg +
							'</p></div></div>'
					);
				});
		}
	} else {
		$('#workspace').html('Page not Found');
	}
}
