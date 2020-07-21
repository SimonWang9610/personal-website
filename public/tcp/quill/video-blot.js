const BlockEmbed = Quill.import('blots/block.embed');

class VideoBlot extends BlockEmbed {
	static create(value) {
		let node = super.create();
		let useIframe = value.useIframe;
		console.log('VideoBlot -> create -> useIframe', useIframe);
	}
}
