DasomEditor.GMLEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.GMLEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/gml.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'gml',
				icon : getIcon()
			};
		}
	};
});
