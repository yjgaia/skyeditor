SkyEditor.ErlangEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.ErlangEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/erlang.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'erlang',
				icon : getIcon()
			};
		}
	};
});
