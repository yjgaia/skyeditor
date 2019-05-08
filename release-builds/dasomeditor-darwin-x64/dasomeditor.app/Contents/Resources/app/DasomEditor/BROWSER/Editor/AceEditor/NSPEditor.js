DasomEditor.NSPEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.NSPEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/nsp.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'nsp',
				icon : getIcon()
			};
		}
	};
});
