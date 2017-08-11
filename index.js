RUN(() => {
	
	const {shell} = require('electron');
	
	let editorStore = STORE('editorStore');
	let folderOpenedStore = STORE('folderOpened');
	
	let ide = DasomEditor.IDE({
		showHome : (ide) => {
			
			ide.addTab(DasomEditor.HomeTab({
				title : '홈',
				c : DIV({
					style : {
						padding : 10
					},
					c : ['좋은 에디터 ', A({
						style : {
							color : '#59A7FD',
							textDecoration : 'underline'
						},
						c : '다솜 에디터',
						on : {
							tap : () => {
								shell.openExternal('https://github.com/Hanul/DasomEditor');
							}
						}
					})]
				})
			}));
		}
	}).appendTo(BODY);
	
	ide.addTab(DasomEditor.JavaScriptEditor({
		title : 'JavaScript 짱짱맨'
	}));
	
	let loadWorkspaceFiles = () => {
		
		ide.clearFileTree();
		
		let loadFiles = (path, addFile) => {
			
			EACH(FIND_FOLDER_NAMES({
				path : path,
				isSync : true
			}), (folderName) => {
				
				let folder;
				let isOpened = folderOpenedStore.get(path + '/' + folderName);
				
				addFile({
					key : path + '/' + folderName,
					item : folder = SkyDesktop.Folder({
						title : folderName,
						isOpened : isOpened,
						on : {
							
							open : () => {
								
								folderOpenedStore.save({
									name : path + '/' + folderName,
									value : true
								});
								
								loadFiles(path + '/' + folderName, folder.addItem);
							},
							
							close : () => {
								folderOpenedStore.remove(path + '/' + folderName);
							}
						}
					})
				});
			});
			
			EACH(FIND_FILE_NAMES({
				path : path,
				isSync : true
			}), (fileName) => {
				
				addFile({
					key : path + '/' + fileName,
					item : SkyDesktop.File({
						title : fileName
					})
				});
			});
		};
		
		let workspacePath = editorStore.get('workspacePath');
		
		if (workspacePath === undefined) {
			workspacePath = 'workspace';
		}
		
		loadFiles(workspacePath, ide.addFile);
	};
	
	ide.addToolbarButton(SkyDesktop.ToolbarButton({
		icon : IMG({
			src : DasomEditor.R('icon/workspace.png')
		}),
		title : '작업 폴더 지정',
		on : {
			tap : () => {
				
				let fileInput;
				
				SkyDesktop.Confirm({
					msg : [P({
						c : '작업 폴더를 지정해주시기 바랍니다.'
					}), editorStore.get('workspacePath') === undefined ? '' : P({
						c : '현재 작업 폴더: ' + editorStore.get('workspacePath')
					}), DIV({
						style : {
							marginTop : 5
						},
						c : fileInput = INPUT({
							style : {
								width : 222,
								padding : 8,
								backgroundColor : '#e0e1e2',
								border : '1px solid #999',
								borderRadius : 4
							},
							type : 'file'
						})
					})]
				}, () => {
					
					if (fileInput.getEl().files[0] !== undefined) {
						
						editorStore.save({
							name : 'workspacePath',
							value : fileInput.getEl().files[0].path
						});
						
						loadWorkspaceFiles();
					}
				});
				
				// 폴더 선택 가능하도록
				fileInput.getEl().setAttribute('webkitDirectory', 'webkitDirectory');
			}
		}
	}));
	
	loadWorkspaceFiles();
});
