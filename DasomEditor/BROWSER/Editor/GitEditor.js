DasomEditor.GitEditor = CLASS((cls) => {
	
	let gitInfoStore = STORE('gitInfoStore');
	
	return {
	
		preset : () => {
			return DasomEditor.Editor;
		},
	
		init : (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.folderPath
			
			let folderPath = params.folderPath;
			
			self.setTitle(folderPath.substring(folderPath.lastIndexOf('/') + 1));
			
			self.setIcon(IMG({
				src : DasomEditor.R('icon/git.png')
			}));
			
			// 깃 저장소인지 체크
			DasomEditor.IDE.checkExists({
				path : folderPath + '/.git'
			}, (exists) => {
				
				if (exists === true) {
					
					DasomEditor.IDE.gitDiff(folderPath, {
						error : (errorMsg) => {
							console.log(errorMsg);
						},
						success : (newFilePaths, updatedFilePaths, movedFilePaths, removedFilePaths) => {
							
							EACH(updatedFilePaths, (path) => {
								self.append(UUI.BUTTON_H({
									icon : IMG({
										src : DasomEditor.R('icon/edit.png')
									}),
									spacing : 5,
									title : path
								}));
							});
							
							EACH(newFilePaths, (path) => {
								self.append(UUI.BUTTON_H({
									icon : IMG({
										src : DasomEditor.R('icon/add.png')
									}),
									spacing : 5,
									title : path
								}));
							});
							
							EACH(movedFilePaths, (path) => {
								self.append(UUI.BUTTON_H({
									icon : IMG({
										src : DasomEditor.R('icon/move.png')
									}),
									spacing : 5,
									title : path
								}));
							});
							
							EACH(removedFilePaths, (path) => {
								self.append(UUI.BUTTON_H({
									icon : IMG({
										src : DasomEditor.R('icon/delete.png')
									}),
									spacing : 5,
									title : path
								}));
							});
						}
					});
				}
				
				else {
					
					SkyDesktop.Alert({
						msg : 'Git 저장소가 아닙니다.'
					});
					
					self.remove();
				}
			});
		}
	};
});
