function getAdmin() {
	let adminKey = $('#admin-key').val();

	if (!adminKey) {
		alert('No AdminKey Provided!');
		return false;
	}

	let payload = {
		adminKey: adminKey
	};

	SimonService.getAdmin(payload, function(err, data) {
		if (err) {
			// showInfoDialog(err.message);
		} else {
			// showInfoDialog(data.message);

			if (data.success) {
				SimonStorage.set('token', data.token);
				let hash = window.location.hash.substring(1);
				hash = hash === 'display' || 'edit' || 'articles' ? 'articles' : 'home';
				render(hash);
			} else {
				alert(data.message);
			}
		}
	});
}

function becomePassenger() {
	SimonStorage.clear();
	let hash = window.location.hash.substring(1);
	hash = hash === 'display' || 'edit' || 'articles' ? 'articles' : 'home';
	render(hash);
}

function isAdmin() {
	return SimonStorage.get('token');
}

function createAdminEntity() {
	let $adminIdentity = $('#admin-identity');
	$adminIdentity.empty();

	if (!isAdmin()) {
		$('<input/>')
			.attr({
				id: 'admin-key',
				type: 'password',
				placeHolder: 'Enter admin key'
			})
			.appendTo($adminIdentity);

		$('<button/>')
			.attr({
				onclick: 'getAdmin()',
				type: 'button'
			})
			.html('Become Admin')
			.appendTo($adminIdentity);

		$('<span/>').html(' | Passenger |').appendTo($adminIdentity);
	} else {
		$('<button/>')
			.addClass('translate')
			.attr({
				onclick: 'becomePassenger()',
				type: 'button',
				'data-args': 'Logout'
			})
			.appendTo($adminIdentity);
		$('<span/>').addClass('translate').attr('data-args', 'Admin').appendTo($adminIdentity);
	}

	let $btn = $('<button/>')
		.attr({
			id: 'change-language',
			onclick: 'changeLanguage()'
		})
		.appendTo($adminIdentity);

	if (LangID === 'en') {
		$btn.html('English');
	} else if (LangID === 'zh') {
		$btn.html('中文');
	}
}
