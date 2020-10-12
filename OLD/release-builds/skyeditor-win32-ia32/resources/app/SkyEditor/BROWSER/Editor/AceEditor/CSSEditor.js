SkyEditor.CSSEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.CSSEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/css.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'css',
				icon : getIcon()
			};
		}
	};
});
