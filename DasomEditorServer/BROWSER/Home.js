DasomEditorServer.Home = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		DasomEditor.IDE.init({});
	}
});
