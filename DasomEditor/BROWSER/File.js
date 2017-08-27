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
		
		let isControlMode;
		
		self.on('tap', () => {
			if (isControlMode === true) {
				DasomEditor.IDE.selectMultipleFile(self);
			} else {
				DasomEditor.IDE.selectFile(self);
			}
		});
		
		self.on('contextmenu', (e) => {
			
			if (CHECK_IS_IN({
				array : DasomEditor.IDE.getSelectedFileItems(),
				value : self
			}) !== true) {
				DasomEditor.IDE.selectFile(self);
			}
			
			let path = self.getPath();
			
			DasomEditor.FileContextMenu({
				path : path,
				folderPath : path.substring(0, path.lastIndexOf('/')),
				e : e
			});
			
			e.stop();
		});
		
		let checkControlKeydownEvent = EVENT('keydown', (e) => {
			if (e.getKey() === 'Control') {
				isControlMode = true;
			}
		});
		
		let checkControlKeyupEvent = EVENT('keyup', (e) => {
			if (e.getKey() === 'Control') {
				isControlMode = false;
			}
		});
		
		self.on('remove', () => {
			
			checkControlKeydownEvent.remove();
			checkControlKeydownEvent = undefined;
			
			checkControlKeyupEvent.remove();
			checkControlKeyupEvent = undefined;
		});
	}
});
