SkyEditor.JSONEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.JSONEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/json.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'json',
				icon : getIcon()
			};
		}
	};
});
