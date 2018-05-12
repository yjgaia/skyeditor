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
					
					// 아이디, 비밀번호 정보가 없으면 정보 추가
					
					let loadDiff = () => {
						
						DasomEditor.IDE.gitDiff(folderPath, {
							error : (errorMsg) => {
								
								// 오류 발생
								SkyDesktop.Alert({
									msg : errorMsg
								});
							},
							success : (newFilePaths, updatedFilePaths, movedFilePaths, removedFilePaths) => {
								
								EACH(updatedFilePaths, (path) => {
									list.append(UUI.BUTTON_H({
										style : {
											padding : 5
										},
										icon : IMG({
											src : DasomEditor.R('icon/edit.png')
										}),
										spacing : 5,
										title : path
									}));
								});
								
								EACH(newFilePaths, (path) => {
									list.append(UUI.BUTTON_H({
										style : {
											padding : 5
										},
										icon : IMG({
											src : DasomEditor.R('icon/add.png')
										}),
										spacing : 5,
										title : path
									}));
								});
								
								EACH(movedFilePaths, (path) => {
									list.append(UUI.BUTTON_H({
										style : {
											padding : 5
										},
										icon : IMG({
											src : DasomEditor.R('icon/move.png')
										}),
										spacing : 5,
										title : path
									}));
								});
								
								EACH(removedFilePaths, (path) => {
									list.append(UUI.BUTTON_H({
										style : {
											padding : 5
										},
										icon : IMG({
											src : DasomEditor.R('icon/delete.png')
										}),
										spacing : 5,
										title : path
									}));
								});
							}
						});
					};
					
					let pushMessageInput;
					
					self.append(DIV({
						c : [
							
						UUI.BUTTON_H({
							style : {
								padding : 5
							},
							icon : IMG({
								src : DasomEditor.R('icon/pull.png')
							}),
							spacing : 5,
							title : '풀',
							on : {
								tap : () => {
									
									let loadingBar = SkyDesktop.LoadingBar('lime');
									
									DasomEditor.IDE.gitPull(folderPath, {
										error : (errorMsg) => {
											loadingBar.done();
											
											// 오류 발생
											SkyDesktop.Alert({
												msg : errorMsg
											});
										},
										success : () => {
											loadingBar.done();
											SkyDesktop.Noti('풀 받았습니다.');
											
											loadDiff();
										}
									});
								}
							}
						}),
						
						pushMessageInput = UUI.FULL_INPUT({
							value : 'no message'
						}),
						
						UUI.BUTTON_H({
							style : {
								padding : 5
							},
							icon : IMG({
								src : DasomEditor.R('icon/push.png')
							}),
							spacing : 5,
							title : '푸시',
							on : {
								tap : () => {
									
									let loadingBar = SkyDesktop.LoadingBar('lime');
									
									DasomEditor.IDE.gitPush({
										path : folderPath,
										message : pushMessageInput.getValue()
									}, {
										error : (errorMsg) => {
											loadingBar.done();
											
											// 오류 발생
											SkyDesktop.Alert({
												msg : errorMsg
											});
										},
										success : () => {
											loadingBar.done();
											SkyDesktop.Noti('푸시했습니다.');
											
											loadDiff();
										}
									});
								}
							}
						}),
						
						H3({
							c : '변경 내역'
						}), list = DIV()]
					}));
					
					loadDiff();
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
