DasomEditor.HTMLEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.HTMLEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/html.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'html',
				icon : getIcon()
			};
		}
	};
});
