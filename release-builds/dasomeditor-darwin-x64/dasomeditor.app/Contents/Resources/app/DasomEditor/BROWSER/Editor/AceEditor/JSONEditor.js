DasomEditor.JSONEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.JSONEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/json.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'json',
				icon : getIcon()
			};
		}
	};
});
