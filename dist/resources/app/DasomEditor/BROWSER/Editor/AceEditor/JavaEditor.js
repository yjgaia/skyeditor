DasomEditor.JavaEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.JavaEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/java.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'java',
				icon : getIcon()
			}
		}
	};
});
