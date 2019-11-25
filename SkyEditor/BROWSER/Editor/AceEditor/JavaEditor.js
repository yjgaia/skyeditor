SkyEditor.JavaEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.JavaEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/java.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'java',
				icon : getIcon()
			};
		}
	};
});
