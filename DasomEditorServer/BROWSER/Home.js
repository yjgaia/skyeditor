DasomEditorServer.Home = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let ide = DasomEditor.IDE().appendTo(BODY);
		
		inner.on('close', () => {
			ide.remove();
		});
	}
});
