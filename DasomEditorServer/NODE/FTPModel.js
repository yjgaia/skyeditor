OVERRIDE(DasomEditorServer.FTPModel, (origin) => {
	
	DasomEditorServer.FTPModel = OBJECT({

		preset : () => {
			return origin;
		},

		init : (inner, self) => {
			
			
		}
	});
});
