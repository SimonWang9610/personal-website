const Inline = Quill.import('blots/inline');

class LinkBlot extends Inline {
	static create(value) {
		let node = super.create();
		node.setAttribute('href', value.url);
		node.setAttribute('target', '_blank');
		if (value.title) {
			node.setAttribute('title', value.title);
		}
		node.addEventListener('click', (e) => {
			editLink(node);
		});
		return node;
	}

	static formats(node) {
		return {
			url: node.getAttribute('href'),
			title: node.getAttribute('title')
		};
	}
}

LinkBlot.blotName = 'link';
LinkBlot.tagName = 'A';
Quill.register(LinkBlot);

function editLink(node) {
	let title = node.getAttribute('title');
	title = title ? title : '';
	let href = node.getAttribute('href');
	href = href ? href : 'https://';

	linkRange = myEditor.getSelection();

	if ($('#add-link').length) {
		$('#add-link').modal('show');
		$('#link-title').val(title);
		$('#link-href').val(href);
	} else {
		let url = '/tcp/modals/new-link.html';
		$.ajax({
			type: 'GET',
			cache: false,
			url: url
		}).done(function(data) {
			$(data).appendTo('body');
			$('#add-link').modal('show');
			setLocaleTo(LangID);
			$('#link-title').val(title);
			$('#link-href').val(href);
		});
	}
}
