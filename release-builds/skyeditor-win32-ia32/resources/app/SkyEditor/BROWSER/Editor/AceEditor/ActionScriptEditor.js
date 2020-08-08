SkyEditor.ActionScriptEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.ActionScriptEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/actionscript.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'actionscript',
				icon : getIcon()
			};
		}
	};
});
