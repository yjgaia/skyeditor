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
			
			let path = self.getPath();
			
			DasomEditor.FileContextMenu({
				path : path,
				folderPath : path.substring(0, path.lastIndexOf('/')),
				e : e
			});
			
			e.stop();
		});
	}
});
