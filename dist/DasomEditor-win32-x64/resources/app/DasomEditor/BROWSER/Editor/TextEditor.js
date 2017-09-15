DasomEditor.TextEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.TextEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyDesktop.R('file.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'text',
				icon : getIcon()
			}
		}
	};
});
