DasomEditor.TextEditor = CLASS({

	preset : () => {
		return DasomEditor.AceEditor;
	},
	
	params : () => {
		return {
			mode : 'text',
			icon : IMG({
				src : SkyDesktop.R('file.png')
			})
		}
	}
});
