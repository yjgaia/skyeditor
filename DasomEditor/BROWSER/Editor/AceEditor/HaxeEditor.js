DasomEditor.HaxeEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.HaxeEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/haxe.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'haxe',
				icon : getIcon()
			}
		}
	};
});
