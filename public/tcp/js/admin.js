
function getAdmin() {
	let adminKey = $('#admin-key').val();

	if (!adminKey) return false;

	let payload = {
		adminKey: adminKey
	}

	SimonService.getAdmin(payload, function(err, data) {
		
		if (err) {
			// showInfoDialog(err.message);
		} else {
			
			// showInfoDialog(data.message);

			if (data.success) {
				SimonStorage.set('token', data.token);
				let hash = window.location.hash.substring(1);
				
				if (hash) {
					render(hash);
				} else {
					render('home');
				}
			} else {
				alert(data.message);
			}
		}	
	});
}


function becomePassenger() {
	SimonStorage.clear();
	let hash = window.location.hash.substring(1);
				
	if (hash) {
		render(hash);
	} else {
		render('home');
	}
}

function isAdmin() {
	return SimonStorage.get('token');
}

function createAdminEnity() {
	let $adminIdentity = $('#admin-identity');
	$adminIdentity.empty();

	if (!isAdmin()) {	
		$('<input/>').attr({
			'id': 'admin-key',
			'type': 'password',
			'placeHolder': 'Enter admin key'
		}).appendTo($adminIdentity);

		$('<button/>').attr({
			'onclick': 'getAdmin()',
			'type': 'button'
		}).html('Become Admin').appendTo($adminIdentity);

		$('<span/>').html(' | Passenger |').appendTo($adminIdentity);
	} else {
		$('<button/>').attr({
			'onclick': 'becomePassenger()',
			'type': 'button'
		}).html('Logout').appendTo($adminIdentity);
		$('<span/>').text(' | Admin |').appendTo($adminIdentity);
	}
}