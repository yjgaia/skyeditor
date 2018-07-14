DasomEditor.ActionScriptEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.ActionScriptEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/actionscript.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'actionscript',
				icon : getIcon()
			};
		}
	};
});
