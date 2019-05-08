DasomEditor.PHPEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.PHPEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/php.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'php',
				icon : getIcon()
			};
		}
	};
});
