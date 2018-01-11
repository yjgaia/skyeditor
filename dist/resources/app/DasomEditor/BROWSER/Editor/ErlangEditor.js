DasomEditor.ErlangEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.ErlangEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/erlang.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'erlang',
				icon : getIcon()
			}
		}
	};
});
