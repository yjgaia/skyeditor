DasomEditor.Folder = CLASS({

	preset : () => {
		return SkyDesktop.Folder;
	},

	init : (inner, self) => {
		
		let isControlMode;
		let isShiftMode;
		
		self.on('tap', () => {
			if (isControlMode === true) {
				DasomEditor.IDE.selectMultipleFile(self);
			} else if (isShiftMode === true) {
				DasomEditor.IDE.selectFileRange(self);
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
			
			DasomEditor.FileContextMenu({
				path : self.getPath(),
				folderPath : self.getPath(),
				e : e
			});
			
			e.stop();
		});
		
		let checkControlKeydownEvent = EVENT('keydown', (e) => {
			if (e.getKey() === 'Control') {
				isControlMode = true;
			}
			if (e.getKey() === 'Shift') {
				isShiftMode = true;
			}
		});
		
		let checkControlKeyupEvent = EVENT('keyup', (e) => {
			if (e.getKey() === 'Control') {
				isControlMode = false;
			}
			if (e.getKey() === 'Shift') {
				isShiftMode = false;
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
