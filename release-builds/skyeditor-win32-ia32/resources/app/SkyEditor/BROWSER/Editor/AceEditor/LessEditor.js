SkyEditor.LessEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.LessEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/less.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'less',
				icon : getIcon()
			};
		}
	};
});
