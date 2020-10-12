SkyEditor.HaxeEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.HaxeEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/haxe.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'haxe',
				icon : getIcon()
			};
		}
	};
});
