SkyEditor.TypeScriptEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.TypeScriptEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/typescript.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'typescript',
				icon : getIcon()
			};
		}
	};
});
