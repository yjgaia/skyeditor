DasomEditor.XMLEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.XMLEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/xml.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'xml',
				icon : getIcon()
			}
		}
	};
});
