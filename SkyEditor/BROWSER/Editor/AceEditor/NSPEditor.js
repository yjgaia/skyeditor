SkyEditor.NSPEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.NSPEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/nsp.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'nsp',
				icon : getIcon()
			};
		}
	};
});
