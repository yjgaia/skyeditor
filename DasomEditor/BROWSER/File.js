DasomEditor.File = CLASS({

	preset : () => {
		return SkyDesktop.File;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.title
		
		let title = params.title;
		
		let path = self.getPath();
		let folderPath = path.substring(0, path.lastIndexOf('/'));
		
		let getFolderPath = self.getFolderPath = () => {
			return folderPath;
		};
		
		let Editor = DasomEditor.IDE.getEditor(title.substring(title.lastIndexOf('.') + 1).toLowerCase());
		
		if (Editor !== undefined) {
			self.setIcon(Editor.getIcon());
		}
		
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
				path : path,
				folderPath : folderPath,
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
