DasomEditor.JavaScriptEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.JavaScriptEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/js.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'javascript',
				icon : getIcon()
			}
		}
	};
});
