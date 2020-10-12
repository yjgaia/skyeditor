SkyEditor.TSXEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.TSXEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/tsx.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'tsx',
				icon : getIcon()
			};
		}
	};
});
