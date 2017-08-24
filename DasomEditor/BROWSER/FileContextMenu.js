DasomEditor.FileContextMenu = CLASS({

	preset : () => {
		return SkyDesktop.ContextMenu;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.path
		//REQUIRED: params.folderPath
		
		let path = params.path;
		let folderPath = params.folderPath;
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '새 파일',
			on : {
				tap : () => {
					
					SkyDesktop.Prompt('파일명을 입력해주시기 바랍니다.', (fileName) => {
						
						DasomEditor.IDE.save(DasomEditor.IDE.openEditor(DasomEditor.IDE.getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
							title : fileName,
							path : folderPath + '/' + fileName
						})));
					});
					
					self.remove();
				}
			}
		}))
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '복사',
			on : {
				tap : () => {
					
					DasomEditor.IDE.copy(path);
				
					self.remove();
				}
			}
		}));
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '붙여넣기',
			on : {
				tap : () => {
					
					DasomEditor.IDE.paste(folderPath);
					
					self.remove();
				}
			}
		}));
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '삭제',
			on : {
				tap : () => {
					
					DasomEditor.IDE.remove(path);
					
					self.remove();
				}
			}
		}));
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '이름 변경',
			on : {
				tap : () => {
					
					SkyDesktop.Prompt('새 이름을 입력해주시기 바랍니다.', (newName) => {
						
						DasomEditor.IDE.rename({
							path : path,
							newName : newName
						});
					});
					
					self.remove();
				}
			}
		}));
	}
});
