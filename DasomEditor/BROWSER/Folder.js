DasomEditor.Folder = CLASS({

	preset : () => {
		return SkyDesktop.Folder;
	},

	init : (inner, self) => {
		
		self.on('contextmenu', (e) => {
			
			DasomEditor.FileContextMenu({
				e : e
			});
			
			e.stop();
		});
	}
});
