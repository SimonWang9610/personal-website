const Module = Quill.import('core/module');
const defaults = {
	normalizeRegex: /(https?:\/\/[\S]+)|(www.[\S]+)/,
	normalizeUrlOptions: {
		stripWWW: false
	}
};

var youtubeRegex = /^(https?):\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
var imageRegex = /(https?:\/\/[\S]+?\/[\S]+?\.(?:jpg|jpeg|gif|png))/;
var videoRegex = /(https?:\/\/[\S]+?\/[\S]+?\.(?:mp4|avi|mov))/;

function clipUrlTitle(url) {
	let urlRegex = /\/\/.*com/;
	let title = url.match(urlRegex);
	return title[0].slice(2);
}

class MagicUrl extends Module {
	constructor(quill, options) {
		super(quill, options);
		options = options || {};
		this.options = { ...defaults, ...options };

		// this.quill.on('text-change', this.checkTextUrl.bind(this));
		// this.quill.clipboard.addMatcher(Node.TEXT_NODE, this.checkTextUrl.bind(this));
		// this.checkTextUrl();
		this.registerTypeListener();
		// this.registerPasteListener();
	}

	registerTypeListener() {
		this.quill.on('text-change', (delta) => {
			let ops = delta.ops;
			if (!ops || ops.length < 1 || ops.length > 2) {
				return;
			}

			let lastOp = ops[ops.length - 1];

			if (!lastOp.insert || typeof lastOp.insert !== 'string' || !lastOp.insert.match(/\s/)) {
				return;
			}

			this.checkTextUrl();
		});
	}

	registerPasteListener() {
		this.quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
			if (typeof node.data !== 'string') {
				return;
			}

			let matches = node.data.match(this.options.normalizeRegex);

			if (!matches) {
				return;
			}

			this.checkTextUrl();
		});
	}

	checkTextUrl() {
		let sel = this.quill.getSelection();
		if (!sel) {
			return;
		}

		let [ leaf ] = this.quill.getLeaf(sel.index);
		if (!leaf.text || leaf.parent.domNode === 'a') {
			return;
		}

		let urlMatch = leaf.text.match(this.options.normalizeRegex);
		if (!urlMatch) {
			return;
		}

		let index = this.quill.getIndex(leaf) + urlMatch.index;
		this.textToEmbed(index, urlMatch[0]);
	}

	textToEmbed(index, url) {
		let isImage = false;
		let isVideo = false;
		let isEmbed = false;

		if (youtubeRegex.test(url) || videoRegex.test(url)) {
			isVideo = true;
			if (youtubeRegex.test(url)) {
				isEmbed = true;
			}
		} else if (imageRegex.test(url)) {
			isImage = true;
		}

		if (isImage) {
			const ops = new Delta().retain(index).delete(url.length).insert({
				blockFigure: {
					image: url,
					class: 'img-fluid'
				}
			});
			this.quill.updateContents(ops, Quill.sources.USER);
		} else if (isEmbed && isVideo) {
			const ops = new Delta().retain(index).delete(url.length).insert({
				blockFigure: {
					embed: url,
					width: '100%',
					height: '100%'
				}
			});
			this.quill.updateContents(ops, Quill.sources.USER);
		} else if (isVideo) {
			const ops = new Delta().retain(index).delete(url.length).insert({
				blockFigure: {
					video: url,
					class: 'video-fluid',
					controls: 'controls',
					width: '100%',
					height: '100%'
				}
			});
			this.quill.updateContents(ops, Quill.sources.USER);
		} else {
			let title = clipUrlTitle(url);
			const ops = new Delta().retain(index).delete(url.length).insert(title, {
				link: {
					url: url,
					title: title
				}
			});
			this.quill.updateContents(ops, Quill.sources.USER);
		}
	}
}

Quill.register('modules/magicUrl', MagicUrl);
