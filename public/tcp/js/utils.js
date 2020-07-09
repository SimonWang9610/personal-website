function twoDigits(d) {
	if (0 <= d && d < 10) return '0' + d.toString();
	if (-10 < d && d < 0) return '-0' + (-1 * d).toString();
	return d.toString();
}

function localDate(time) {
	let date = new Date(time);
	return (
		date.getUTCFullYear() +
		'-' +
		twoDigits(1 + date.getUTCMonth()) +
		'-' +
		twoDigits(date.getUTCDate()) +
		' ' +
		twoDigits(date.getUTCHours()) +
		':' +
		twoDigits(date.getUTCMinutes()) +
		':' +
		twoDigits(date.getUTCSeconds())
	);
}

function setLocaleTo(locale) {
	if (locale) {
		SimonStorage.set('locale', locale);
	} else {
		locale = SimonStorage.get('locale');
		if (!locale) {
			locale = 'en';
		}
	}

	LangID = locale;

	$.i18n({
		locale: locale
	});

	$('.translate').each(function() {
		let args = [];
		let $this = $(this);
		if ($this.data('args')) {
			args = $this.data('args').split(',');
			// console.log('setLocaleTo -> args', args);
		}
		$this.html($.i18n.apply(null, args));
	});
}

function changeLanguage() {
	if (LangID === 'en') {
		$('#change-language').html(' 中文');
		setLocaleTo('zh');
	} else if (LangID === 'zh') {
		$('#change-language').html('English');
		setLocaleTo('en');
	}
}
