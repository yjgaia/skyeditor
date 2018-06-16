DasomEditor.CreateSelectFolderPopup = METHOD({
	
	run : (folderOpenedStore, callback) => {
		//REQUIRED: folderOpenedStore
		//REQUIRED: callback
		
		let path;
		
		// 폴더 생성
		let createFolderItem = (folderPath, folderName) => {
			
			let folder = DasomEditor.Folder({
				path : folderPath,
				title : folderName,
				isOpened : folderOpenedStore.get(folderPath),
				on : {
					open : () => {
						loadFolders(folderPath, folder, folder.close);
					},
					close : () => {
						folder.removeAllItems();
					},
					tap : () => {
						path = folderPath;
					}
				}
			});
			
			return folder;
		};
		
		let loadFolders = (path, folder, close) => {
			
			DasomEditor.IDE.loadFiles(path, (folderNames, fileNames, isToClose) => {
				
				let total = 0;
				
				RUN((f) => {
					let count = 0;
					
					while (total < folderNames.length) {
						let folderName = folderNames[total];
						
						let folderItem = createFolderItem(path + '/' + folderName, folderName);
						
						if (path === '') {
							
							folderItem.setIcon(IMG({
								src : DasomEditor.R('icon/project.png')
							}));
							
							folderItem.on('open', () => {
								folderItem.setIcon(IMG({
									src : DasomEditor.R('icon/project-opened.png')
								}));
							});
							
							folderItem.on('close', () => {
								folderItem.setIcon(IMG({
									src : DasomEditor.R('icon/project.png')
								}));
							});
						}
						
						folder.addItem({
							key : path + '/' + folderName,
							item : folderItem
						});
						
						total += 1;
						
						count += 1;
						if (path !== '' && count === 50) {
							break;
						}
					}
					
					// 개수가 50개 넘으면 더 불러옴
					if (path !== '' && count === 50) {
						
						folder.addItem({
							key : '__MORE_BUTTON',
							item : DasomEditor.More({
								title : '더 보기...',
								on : {
									tap : () => {
										f();
									}
								}
							})
						});
					}
					
					if (total === folderNames.length + fileNames.length) {
						folder.removeItem('__MORE_BUTTON');
					}
				});
				
				if (isToClose === true) {
					close();
				}
			});
		};
		
		let tree;
		let filenameInput;
		SkyDesktop.Confirm({
			okButtonTitle : '저장',
			style : {
				onDisplayResize : (width, height) => {
					
					if (width > 600) {
						return {
							width : 500
						};
					} else {
						return {
							width : '90%'
						};
					}
				}
			},
			msg : [H2({
				style : {
					fontWeight : 'bold'
				},
				c : '저장할 경로를 선택해주세요.'
			}), tree = SkyDesktop.FileTree({
				style : {
					marginTop : 8,
					overflowY : 'scroll',
					padding : 8,
					backgroundColor : '#000',
					borderRadius : 4,
					textAlign : 'left',
					color : '#fff',
					onDisplayResize : (width, height) => {
						
						if (height > 500) {
							return {
								height : 300
							};
						} else {
							return {
								height : 150
							};
						}
					}
				}
			}), filenameInput = UUI.FULL_INPUT({
				style : {
					marginTop : 10,
					border : '1px solid #999',
					borderRadius : 4,
					fontSize : 18
				},
				placeholder : '파일 명'
			})]
		}, () => {
			if (path === undefined) {
				SkyDesktop.Alert({
					msg : '저장할 경로를 선택해주세요.'
				});
			} else {
				callback(path + '/' + filenameInput.getValue());
			}
		});
		
		let workspaceItem = createFolderItem('', '작업 폴더');
		
		workspaceItem.setIcon(IMG({
			src : DasomEditor.R('icon/project.png')
		}));
		
		workspaceItem.on('open', () => {
			workspaceItem.setIcon(IMG({
				src : DasomEditor.R('icon/project-opened.png')
			}));
		});
		
		workspaceItem.on('close', () => {
			workspaceItem.setIcon(IMG({
				src : DasomEditor.R('icon/project.png')
			}));
		});
		
		tree.addItem({
			key : '',
			item : workspaceItem
		});
		
		loadFolders('', workspaceItem);
		
		workspaceItem.open();
	}
});
