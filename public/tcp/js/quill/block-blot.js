const Block = Quill.import('blots/block');

class DraggleBlock extends Block {
	static create(value) {
		const node = super.create(value);

		node.className = 'article-block';
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
}

DraggleBlock.tagName = 'DIV';
Quill.register('blots/block', DraggleBlock);
