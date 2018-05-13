DasomEditorServer.Home = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		DasomEditor.IDE.init({
			
			showHome : () => {
				DasomEditor.IDE.openEditor(DasomEditor.HomeTab(BROWSER_CONFIG.DasomEditor.homepage + '?version=' + CONFIG.version));
			}
		});
	}
});
