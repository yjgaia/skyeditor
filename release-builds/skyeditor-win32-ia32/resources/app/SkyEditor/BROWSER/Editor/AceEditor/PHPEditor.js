SkyEditor.PHPEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.PHPEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/php.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'php',
				icon : getIcon()
			};
		}
	};
});
