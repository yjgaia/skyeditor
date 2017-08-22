DasomEditor.FileContextMenu = CLASS({

	preset : () => {
		return SkyDesktop.ContextMenu;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.path
		
		let path = params.path;
		
		console.log(path);
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '새 파일',
			on : {
				tap : () => {
					
					SkyDesktop.Prompt('파일명을 입력해주시기 바랍니다.', (filename) => {
						console.log(c);
						
						/*DasomEditor.IDE.load(path, (path, content) => {
							
							let i = path.lastIndexOf('/');
							let j = path.lastIndexOf('\\');
							
							let filename = path.substring((j === -1 || i > j ? i : j) + 1);
							
							let editor = openEditor(getEditor(filename.substring(filename.lastIndexOf('.') + 1).toLowerCase())({
								title : filename,
								path : path,
								content : content
							}));
							
							if (scrollTop !== undefined) {
								editor.setScrollTop(scrollTop);
							}
							
							if (next !== undefined) {
								next();
							}
						});*/
					});
					
					self.remove();
				}
			}
		}))
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '복사',
			on : {
				tap : () => {
				
					self.remove();
				}
			}
		}));
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '붙여넣기',
			on : {
				tap : () => {
					
					self.remove();
				}
			}
		}));
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '삭제',
			on : {
				tap : () => {
					
					self.remove();
				}
			}
		}));
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '이름 변경',
			on : {
				tap : () => {
					
					self.remove();
				}
			}
		}));
	}
});
