SkyEditor.JavaScriptEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.JavaScriptEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/javascript.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'javascript',
				icon : getIcon()
			};
		}
	};
});
