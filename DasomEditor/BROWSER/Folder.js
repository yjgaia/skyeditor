DasomEditor.Folder = CLASS({

	preset : () => {
		return SkyDesktop.Folder;
	},

	init : (inner, self) => {
		
		let isControlMode;
		
		self.on('tap', () => {
			if (isControlMode === true) {
				DasomEditor.IDE.selectMultipleFile(self);
			} else {
				DasomEditor.IDE.selectFile(self);
			}
		});
		
		self.on('contextmenu', (e) => {
			
			if (isControlMode === true) {
				DasomEditor.IDE.selectMultipleFile(self);
			} else {
				DasomEditor.IDE.selectFile(self);
			}
			
			DasomEditor.FileContextMenu({
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
