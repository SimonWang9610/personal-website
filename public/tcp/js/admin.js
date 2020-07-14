function getAdmin() {
	let basicForm = document.getElementById('admin-form');

	if (basicForm.checkValidity() == false) {
		basicForm.classList.add('was-validated');
		return;
	}

	$('#become-admin').modal('hide');

	let adminKey = $('#admin-key').val().trim();

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

function logout() {
	$('#confirm-logout').modal('hide');
	SimonStorage.clear();
	let hash = window.location.hash.substring(1);
	hash = hash === 'display' || 'edit' || 'articles' ? 'articles' : 'home';
	render(hash);
}

function becomePassenger() {
	if ($('#confirm-logout').length) {
		$('#confirm-logout').modal('show');
	} else {
		let url = '/tcp/modals/confirm-logout.html';
		$.ajax({
			type: 'GET',
			cache: false,
			url: url
		}).done(function(data) {
			$(data).appendTo('body');
			setLocaleTo(LangID);
			$('#confirm-logout').modal('show');
		});
	}
}
function becomeAdmin() {
	if ($('#become-admin').length) {
		$('#become-admin').modal('show');
	} else {
		let url = '/tcp/modals/admin.html';
		$.ajax({
			type: 'GET',
			cache: false,
			url: url
		})
			.done(function(data) {
				$(data).appendTo('body');
				setLocaleTo(LangID);
				$('#admin-key').val('');
				$('#become-admin').modal('show');
			})
			.fail(function() {
				alert('can not load modal');
			})
			.always(function() {
				// do nothing
			});
	}
}

function isAdmin() {
	return SimonStorage.get('token');
}

function createAdminEntity() {
	let $adminIdentity = $('#admin-identity');
	$adminIdentity.empty();

	if (isAdmin()) {
		$('<a/>')
			.addClass('dropdown-item translate')
			.attr({
				href: 'javascript: void(0)',
				onclick: 'becomePassenger()',
				'data-args': 'LogOut'
			})
			.html('Logout')
			.appendTo($adminIdentity);
	} else {
		$('<a/>')
			.addClass('dropdown-item translate')
			.attr({
				href: 'javascript: void(0)',
				onclick: 'becomeAdmin()',
				'data-args': 'GetPermission'
			})
			.html('Become Admin')
			.appendTo($adminIdentity);
	}

	$('<a/>')
		.addClass('dropdown-item translate')
		.attr({
			href: 'javascript: void(0)',
			onclick: 'changeLanguage()',
			'data-args': 'Language'
		})
		.html('Language')
		.appendTo($adminIdentity);

	/* let $btn = $('<button/>')
		.attr({
			id: 'change-language',
			onclick: 'changeLanguage()'
		})
		.appendTo($adminIdentity);

	if (LangID === 'en') {
		$btn.html('English');
	} else if (LangID === 'zh') {
		$btn.html('中文');
	} */
}
