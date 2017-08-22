DasomEditor.File = CLASS({

	preset : () => {
		return SkyDesktop.File;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.title
		
		let title = params.title;
		
		let extname = title.substring(title.lastIndexOf('.') + 1).toLowerCase();
		
		let Editor = DasomEditor.IDE.getEditor(extname);
		
		if (Editor !== undefined) {
			self.setIcon(Editor.getIcon());
		}
		
		self.on('contextmenu', (e) => {
			
			DasomEditor.FileContextMenu({
				path : self.getPath(),
				e : e
			});
			
			e.stop();
		});
	}
});
