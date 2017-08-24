DasomEditor.Folder = CLASS({

	preset : () => {
		return SkyDesktop.Folder;
	},

	init : (inner, self) => {
		
		self.on('contextmenu', (e) => {
			
			DasomEditor.FileContextMenu({
				path : self.getPath(),
				folderPath : self.getPath(),
				e : e
			});
			
			e.stop();
		});
	}
});
