RUN(() => {
	
	const {shell} = require('electron');
	const {dialog} = require('electron').remote;
	
	const FS = require('fs');
	const SEP = require('path').sep;
	
	let exec = require('child_process').exec;
	
	let editorStore = STORE('editorStore');
	let folderOpenedStore = STORE('folderOpened');
	let saveCommandStore = STORE('saveCommandStore');
	
	let ide = DasomEditor.IDE({
		
		showHome : (ide) => {
			
			ide.openEditor(DasomEditor.HomeTab({
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
		},
		
		load : (path, openEditor) => {
			
			READ_FILE(path, (buffer) => {
				openEditor(path, buffer.toString());
			});
		},
		
		save : (activeTab) => {
			
			NEXT([(next) => {
				
				if (activeTab.getPath() === undefined) {
					
					dialog.showSaveDialog((path) => {
						if (path !== undefined) {
							next(path);
						}
					});
				}
				
				else {
					next(activeTab.getPath());
				}
			},
			
			() => {
				return (path) => {
					
					WRITE_FILE({
						path : path,
						content : activeTab.getContent()
					}, () => {
						
						activeTab.setPath(path);
						
						SkyDesktop.Noti('저장하였습니다.');
						
						let i = path.lastIndexOf('/');
						let j = path.lastIndexOf('\\');
						
						let filename = path.substring((j === -1 || i > j ? i : j) + 1);
						activeTab.setTitle(filename);
						
						let extname = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
						
						let Editor = DasomEditor.IDE.getEditor(extname);
						if (Editor !== undefined) {
							activeTab.setIcon(Editor.getIcon());
						}
						
						let command = saveCommandStore.get(extname);
						
						if (command !== undefined) {
							
							command = command.replace(/\{\{folder\}\}/g, path.substring(0, path.lastIndexOf(SEP)));
							command = command.replace(/\{\{path\}\}/g, path);
							
							EACH(command.split('\n'), (command) => {
								
								console.log('저장 시 명령을 실행합니다: ' + command);
								
								exec(command, (error) => {
									if (error !== TO_DELETE) {
										SHOW_ERROR('저장 시 명령 실행', error.toString());
									}
								});
							});
						}
					});
				};
			}]);
		}
		
	}).appendTo(BODY);
	
	let workspaceFileWatcher;
	
	let loadWorkspaceFiles = () => {
		
		ide.clearFileTree();
		
		let createFileWatcher = (path, addItem, removeItem) => {
			
			return FS.watch(path, (eventType, fileName) => {
				
				if (eventType === 'rename') {
					
					CHECK_FILE_EXISTS(path + SEP + fileName, (isExists) => {
						
						if (isExists === true) {
							addItem({
								key : path + SEP + fileName,
								item : DasomEditor.File({
									title : fileName
								})
							});
						}
						
						else {
							removeItem(path + SEP + fileName);
						}
					});
				}
			});
		};
		
		let loadFiles = (path, addItem) => {
			
			let fileWatcher;
			
			EACH(FIND_FOLDER_NAMES({
				path : path,
				isSync : true
			}), (folderName) => {
				
				let folder;
				let isOpened = folderOpenedStore.get(path + SEP + folderName);
				
				addItem({
					key : path + SEP + folderName,
					item : folder = DasomEditor.Folder({
						title : folderName,
						isOpened : isOpened,
						on : {
							
							open : () => {
								
								folderOpenedStore.save({
									name : path + SEP + folderName,
									value : true
								});
								
								loadFiles(path + SEP + folderName, folder.addItem);
								
								if (fileWatcher !== undefined) {
									fileWatcher.close();
								}
								
								fileWatcher = createFileWatcher(path + SEP + folderName, folder.addItem, folder.removeItem);
							},
							
							close : () => {
								
								folderOpenedStore.remove(path + SEP + folderName);
								
								fileWatcher.close();
							}
						}
					})
				});
			});
			
			EACH(FIND_FILE_NAMES({
				path : path,
				isSync : true
			}), (fileName) => {
				
				addItem({
					key : path + SEP + fileName,
					item : DasomEditor.File({
						title : fileName
					})
				});
			});
		};
		
		let workspacePath = editorStore.get('workspacePath');
		
		if (workspacePath === undefined) {
			workspacePath = 'workspace';
		}
		
		loadFiles(workspacePath, ide.addItem);
		
		if (workspaceFileWatcher !== undefined) {
			workspaceFileWatcher.close();
		}
		
		workspaceFileWatcher = createFileWatcher(workspacePath, ide.addItem, ide.removeItem);
	};
	
	ide.addToolbarButton(SkyDesktop.ToolbarButton({
		icon : IMG({
			src : DasomEditor.R('icon/command.png')
		}),
		title : '저장 시 명령',
		on : {
			tap : () => {
				
				let list;
				
				let addForm = (extname, command) => {
					
					let form;
					
					list.append(form = FORM({
						style : {
							marginBottom : 8
						},
						c : TABLE({
							c : TR({
								c : [TD({
									style : {
										width : 70
									},
									c : [UUI.FULL_INPUT({
										style : {
											width : 50,
											border : '1px solid #999',
											borderRadius : 4
										},
										name : 'extname',
										value : extname,
										placeholder : '확장자'
									}), UUI.BUTTON_H({
										style : {
											marginLeft : 7,
											marginTop : 7
										},
										icon : FontAwesome.GetIcon('times'),
										spacing : 5,
										title : '삭제',
										on : {
											tap : () => {
												form.remove();
											}
										}
									})]
								}), TD({
									c : UUI.FULL_TEXTAREA({
										style : {
											border : '1px solid #999',
											borderRadius : 4,
											height : 50
										},
										name : 'command',
										value : command,
										placeholder : '명령 구문'
									})
								})]
							})
						})
					}));
				};
				
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
						c : '저장 시 명령 설정'
					}), list = DIV({
						style : {
							marginTop : 8,
							overflowY : 'scroll',
							padding : 8,
							backgroundColor : '#e0e1e2',
							border : '1px solid #999',
							borderRadius : 4,
							textAlign : 'left',
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
					}), SkyDesktop.Button({
						style : {
							marginTop : 8
						},
						icon : FontAwesome.GetIcon('plus'),
						title : '추가',
						on : {
							tap : () => {
								addForm();
							}
						}
					})]
				}, () => {
					
					saveCommandStore.clear();
					
					EACH(list.getChildren(), (child) => {
						
						let data = child.getData();
						
						if (VALID.notEmpty(data.extname) === true && VALID.notEmpty(data.command) === true) {
							
							saveCommandStore.save({
								name : data.extname,
								value : data.command
							});
						}
					});
				});
				
				EACH(saveCommandStore.all(), (command, extname) => {
					addForm(extname, command);
				});
			}
		}
	}));
	
	ide.addToolbarButton(SkyDesktop.ToolbarButton({
		icon : IMG({
			src : DasomEditor.R('icon/workspace.png')
		}),
		title : '작업 폴더 지정',
		on : {
			tap : () => {
				
				let fileInput;
				
				SkyDesktop.Confirm({
					okButtonTitle : '저장',
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
