const Module = Quill.import('core/module');
const BlockEmbed = Quill.import('blots/block/embed');

function deleteImage(url, node) {
	SimonService.deleteVaultFile(url, function(err, data) {
		node.remove();
	});
}

function deleteVideo(url, node) {
	SimonService.deleteVaultFile(url, function(err, data) {
		node.remove();
	});
}

function deleteFile(url, node) {
	SimonService.deleteVaultFile(url, function(err, data) {
		node.remove();
	});
}

function createToolBar(node, url) {
	let div = document.createElement('div');
	div.setAttribute('class', 'widget-embed-toolbar');

	let button = document.createElement('button');
	let i = document.createElement('i');

	button.setAttribute('class', 'remove-file');
	i.setAttribute('class', 'fas fa-trash-alt');

	button.appendChild(i);
	div.appendChild(button);

	button.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (button.className === 'remove-file') {
			deleteFile(url, node);
		}
	});

	return div;
}

class FigureBlot extends BlockEmbed {
	static create(value) {
		let node = super.create();
		let figureContainer = document.createElement('div');
		figureContainer.classList.add('figure-container');

		node.appendChild(figureContainer);

		if (value.image) {
			node.appendChild(createToolBar(node, value.image));
			let img = document.createElement('img');
			img.setAttribute('src', value.image);
			img.setAttribute('class', value.class);

			img.addEventListener('mouseover', (e) => {
				let toolbar = node.querySelector('.widget-embed-toolbar');
				if (toolbar) {
					toolbar.style.display = 'block'; // display toolbar
				}
				img.classList.add('img-border'); // display image border
			});

			img.addEventListener('mouseout', (e) => {
				let toolbar = node.querySelector('.widget-embed-toolbar');
				if (toolbar) {
					toolbar.style.display = 'none';
				}
				img.classList.remove('img-border');
			});

			figureContainer.appendChild(img);
			console.log('FigureBlot -> create -> img', img);
		} else if (value.video) {
			node.appendChild(createToolBar(node, value.video));

			let video = document.createElement('video');
			video.setAttribute('src', value.video);
			video.setAttribute('class', value.class);
			video.setAttribute('controls', value.controls);
			video.setAttribute('poster', value.poster);
			video.setAttribute('width', value.width);
			video.setAttribute('height', value.height);

			video.addEventListener('mouseover', (e) => {
				let toolbar = document.querySelector('.widget-embed-toolbar');
				if (toolbar) {
					toolbar.style.display = 'block';
				}
				video.classList.add('img-border');
			});

			video.adddEventListener('mouseout', (e) => {
				let toolbar = document.querySelector('.widget-embed-toolbar');
				if (toolbar) {
					toolbar.style.display = 'none';
				}
				video.classList.remove('img-border');
			});

			figureContainer.appendChild(video);
			console.log('FigureBlot -> create -> video', video);
		}

		node.className = value.figureClass ? value.figureClass : 'article-embed-block';
		node.setAttribute('contenteditable', 'false');
		node.setAttribute('draggle', 'true');

		return node;
	}

	constructor(node) {
		super(node);

		node.addEventListener('dragstart', (e) => {
			node.classList.add('dragging');
		});

		node.addEventListener('dragend', (e) => {
			node.classList.remove('dragging');
		});
	}

	static value(node) {
		let data = {
			figureClass: node.className
		};

		let image = node.querySelector('img');

		if (image) {
			data.image = image.getAttribute('src');
			data.class = image.getAttribute('class');
		}

		let video = node.querySelector('video');
		if (video) {
			data.video = video.getAttribute('src');
			data.class = video.getAttribute('class');
			data.poster = video.getAttribute('poster');
			data.controls = video.getAttribute('controls');
		}

		return data;
	}

	focus() {
		console.log('-------FigureBlot: focus()');
		let toolbar = this.domNode.querySelector('.widget-embed-toolbar');

		if (toolbar) {
			toolbar.style.display = 'block';
		}
		this.domNode.classList.add('focus');
	}

	blur() {
		console.log('---------FigureBlot: blur()');
		let toolbar = this.domNode.querySelector('.widget-embed-toolbar');
		if (toolbar) {
			toolbar.style.display = 'none';
		}
		this.domNode.classList.remove('focus');
	}
}

FigureBlot.blotName = 'blockFigure';
FigureBlot.tagName = 'FIGURE';
Quill.register(FigureBlot);
