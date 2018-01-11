DasomEditor.Folder = CLASS({

	preset : () => {
		return SkyDesktop.Folder;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.ftpInfo
		
		let ftpInfo = params.ftpInfo;
		
		let path = self.getPath();
		let folderPath = self.getPath();
		
		let getFTPInfo = self.getFTPInfo = () => {
			return ftpInfo;
		};
		
		let getFolderPath = self.getFolderPath = () => {
			return folderPath;
		};
		
		let isControlMode;
		let isShiftMode;
		
		let isDragging;
		let startDraggingLeft;
		let startDraggingTop;
		
		self.on('touchstart', (e) => {
			isDragging = true;
			startDraggingLeft = e.getLeft();
			startDraggingTop = e.getTop();
		});
		
		let touchmoveEvent = EVENT('touchmove', (e) => {
			
			if (DasomEditor.IDE.getDraggingShadow() === undefined) {
				
				if (
				isDragging === true && (
					Math.abs(startDraggingLeft - e.getLeft()) > 5 ||
					Math.abs(startDraggingTop - e.getTop()) > 5)
				) {
					
					if (CHECK_IS_IN({
						array : DasomEditor.IDE.getSelectedFileItems(),
						value : self
					}) !== true) {
						DasomEditor.IDE.selectFile(self);
					}
					
					let selectedFileItemsCount = DasomEditor.IDE.getSelectedFileItems().length;
					
					DasomEditor.IDE.setDraggingShadow(DIV({
						style : {
							position : 'fixed',
							left : e.getLeft() + 10,
							top : e.getTop() + 10
						},
						c : selectedFileItemsCount > 1 ? selectedFileItemsCount + '개 파일' : self.getTitle()
					}).appendTo(BODY));
				}
			}
		});
		
		let touchendEvent = EVENT('touchend', () => {
			if (isDragging === true) {
				isDragging = false;
			}
		});
		
		self.on('touchend', () => {
			if (DasomEditor.IDE.getDraggingShadow() !== undefined) {
				
				EACH(DasomEditor.IDE.getSelectedFileItems(), (selectedFileItem) => {
					
					let from = selectedFileItem.getPath();
					
					DasomEditor.IDE.move({
						fromFTPInfo : selectedFileItem.getFTPInfo(),
						toFTPInfo : ftpInfo,
						from : from,
						to : folderPath + '/' + from.substring(from.lastIndexOf('/') + 1)
					});
				});
			}
		});
		
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
				ftpInfo : ftpInfo,
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
			
			touchmoveEvent.remove();
			touchmoveEvent = undefined;
			
			touchendEvent.remove();
			touchendEvent = undefined;
			
			checkControlKeydownEvent.remove();
			checkControlKeydownEvent = undefined;
			
			checkControlKeyupEvent.remove();
			checkControlKeyupEvent = undefined;
		});
		
		let getItem;
		OVERRIDE(self.getItem, (origin) => {
			
			getItem = self.getItem = (path) => {
				//REQUIRED: path
				
				let selectedItem = origin(path);
				
				if (selectedItem === undefined) {
					EACH(self.getItems(), (item) => {
						if (item.checkIsInstanceOf(SkyDesktop.Folder) === true) {
							let _item = item.getItem(path);
							if (_item !== undefined) {
								selectedItem = _item;
								return false;
							}
						}
					});
				}
				
				return selectedItem;
			};
		});
	}
});
