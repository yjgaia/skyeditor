DasomEditor.CSSEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.CSSEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/css.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'css',
				icon : getIcon()
			}
		}
	};
});
