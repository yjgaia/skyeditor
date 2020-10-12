SkyEditor.XMLEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.XMLEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/xml.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'xml',
				icon : getIcon()
			};
		}
	};
});
