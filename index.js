RUN(() => {
	
	const {shell} = require('electron');
	
	let editorStore = STORE('editorStore');
	
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
	
	let loadWorkspaceFiles = () => {
		
		let loadFiles = (path, addFile) => {
			
			EACH(FIND_FOLDER_NAMES({
				path : path,
				isSync : true
			}), (folderName) => {
				
				let folder;
				
				addFile({
					key : path + '/' + folderName,
					item : folder = SkyDesktop.Folder({
						title : folderName,
						on : {
							tap : () => {
								loadFiles(path + '/' + folderName, folder.addItem);
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
		
		loadFiles(editorStore.get('workspacePath'), ide.addFile);
	};
	
	let selectWorkspacePath = () => {
		
		let fileInput;
		
		let modal = UUI.MODAL({
			style : {
				padding : 10,
				width : 280,
				backgroundColor : '#fff',
				color : '#000',
				zIndex : 999,
				borderRadius : 4
			},
			c : [P({
				c : '작업 폴더를 지정해주시기 바랍니다.'
			}), editorStore.get('workspacePath') === undefined ? '' : P({
				c : '현재 작업 폴더: ' + editorStore.get('workspacePath')
			}), DIV({
				style : {
					marginTop : 5
				},
				c : fileInput = INPUT({
					style : {
						padding : 8,
						width : 262,
						border : '1px solid #000',
						borderRadius : 4
					},
					type : 'file'
				})
			}), DIV({
				style : {
					marginTop : 10
				},
				c : [SkyDesktop.Button({
					style : {
						padding : '11px 54px',
						flt : 'left'
					},
					title : '저장',
					on : {
						tap : () => {
							
							if (fileInput.getEl().files[0] !== undefined) {
								editorStore.save({
									name : 'workspacePath',
									value : fileInput.getEl().files[0].path
								});
								loadWorkspaceFiles();
								modal.close();
							}
							
							else if (editorStore.get('workspacePath') === undefined) {
								alert('작업 폴더는 반드시 지정해야 합니다.');
							} else {
								modal.close();
							}
						}
					}
				}), SkyDesktop.Button({
					style : {
						padding : '11px 54px',
						flt : 'right'
					},
					title : '취소',
					on : {
						tap : () => {
							if (editorStore.get('workspacePath') === undefined) {
								alert('작업 폴더는 반드시 지정해야 합니다.');
							} else {
								modal.close();
							}
						}
					}
				}), CLEAR_BOTH()]
			})]
		});
		
		// 폴더 선택 가능하도록
		fileInput.getEl().setAttribute('webkitDirectory', 'webkitDirectory');
	};
	
	ide.addToolbarButton(SkyDesktop.ToolbarButton({
		icon : IMG({
			src : DasomEditor.R('icon/workspace.png')
		}),
		title : '작업 폴더 지정',
		on : {
			tap : () => {
				selectWorkspacePath();
			}
		}
	}));
	
	if (editorStore.get('workspacePath') === undefined) {
		
		alert('작업 폴더가 지정되어 있지 않습니다. 작업 폴더를 지정합니다.');
		
		selectWorkspacePath();
	}
	
	else {
		loadWorkspaceFiles();
	}
});
