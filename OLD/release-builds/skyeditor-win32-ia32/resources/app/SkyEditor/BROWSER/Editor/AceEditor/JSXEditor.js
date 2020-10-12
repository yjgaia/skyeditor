SkyEditor.JSXEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.JSXEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/jsx.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'jsx',
				icon : getIcon()
			};
		}
	};
});
