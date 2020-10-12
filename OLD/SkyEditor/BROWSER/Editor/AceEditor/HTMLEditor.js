SkyEditor.HTMLEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.HTMLEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/html.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'html',
				icon : getIcon()
			};
		}
	};
});
