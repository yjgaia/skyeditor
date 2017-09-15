DasomEditor.MarkdownEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.MarkdownEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/markdown.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'markdown',
				icon : getIcon()
			}
		}
	};
});
