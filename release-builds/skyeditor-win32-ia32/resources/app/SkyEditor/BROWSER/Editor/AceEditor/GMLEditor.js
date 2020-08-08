SkyEditor.GMLEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.GMLEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/gml.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'gml',
				icon : getIcon()
			};
		}
	};
});
