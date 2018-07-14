DasomEditor.LessEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.LessEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/less.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'less',
				icon : getIcon()
			};
		}
	};
});
