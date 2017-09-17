RUN(() => {
	
	const {shell, clipboard} = require('electron');
	const {dialog} = require('electron').remote;
	
	const FS = require('fs');
	const SEP = require('path').sep;
	
	let exec = require('child_process').exec;
	
	let editorStore = STORE('editorStore');
	let folderOpenedStore = STORE('folderOpenedStore');
	let ftpInfoStore = STORE('ftpInfoStore');
	let saveCommandStore = STORE('saveCommandStore');
	
	let ftpConnectors = {};
	
	let fixPath = (path) => {
		if (SEP !== '/') {
			return path.replace(new RegExp('\\' + SEP, 'g'), '/');
		}
		return path;
	};
	
	let changeToOSPath = (path) => {
		return path.replace(new RegExp('/', 'g'), SEP);
	};
	
	DasomEditor.IDE.init({
		
		showHome : () => {
			
			DasomEditor.IDE.openEditor(DasomEditor.HomeTab({
				title : '홈',
				c : DIV({
					style : {
						padding : 10
					},
					c : [P({
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
					}), P({
						c : ['문제 발생 시 ', A({
							style : {
								color : '#59A7FD',
								textDecoration : 'underline'
							},
							c : 'Issue',
							on : {
								tap : () => {
									shell.openExternal('https://github.com/Hanul/DasomEditor/issues');
								}
							}
						}), '남겨주세요.']
					})]
				})
			}));
		},
		
		save : (path, content, callback) => {
			
			NEXT([(next) => {
				
				if (path === undefined) {
					
					dialog.showSaveDialog((path) => {
						if (path !== undefined) {
							next(path);
						}
					});
				}
				
				else {
					next(path);
				}
			},
			
			() => {
				return (path) => {
					
					WRITE_FILE({
						path : path,
						content : content
					}, () => {
						
						let fileName = path.substring(path.lastIndexOf('/') + 1);
						
						let extname = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
						
						let command = saveCommandStore.get(extname);
						
						if (command !== undefined && VALID.notEmpty(content) === true) {
							
							let folderPath = path.substring(0, path.lastIndexOf('/'));
							
							command = command.replace(/\{\{workspace\}\}/g, DasomEditor.IDE.getWorkspacePath());
							command = command.replace(/\{\{folder\}\}/g, folderPath);
							command = command.replace(/\{\{path\}\}/g, path);
							
							EACH(command.split('\n'), (command) => {
								
								console.log('저장 시 명령을 실행합니다: ' + command);
								
								exec(command, {
									cwd : folderPath
								}, (error, stdout, stderr) => {
									if (error !== TO_DELETE) {
										
										let message = stdout;
										if (message === '') {
											message = stderr;
										}
										
										SHOW_ERROR('저장 시 명령 실행', message);
										
										let tab;
										
										DasomEditor.IDE.addTab(tab = SkyDesktop.Tab({
											style : {
												position : 'relative'
											},
											size : 30,
											c : [UUI.ICON_BUTTON({
												style : {
													position : 'absolute',
													right : 10,
													top : 8,
													color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc',
													zIndex : 999
												},
												icon : FontAwesome.GetIcon('times'),
												on : {
													mouseover : (e, self) => {
														self.addStyle({
															color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#666' : '#999'
														});
													},
													mouseout : (e, self) => {
														self.addStyle({
															color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc'
														});
													},
													tap : () => {
														tab.remove();
													}
												}
											}), H2({
												style : {
													padding : 10
												},
												c : '저장 시 명령 실행'
											}), P({
												style : {
													padding : 10,
													paddingTop : 0,
													color : 'red'
												},
												c : '오류가 발생했습니다. 오류 메시지: ' + message
											})]
										}));
									}
								});
							});
						}
						
						callback(path);
					});
				};
			}]);
		},
		
		createFolder : (path) => {
			
			CREATE_FOLDER(path);
		},
		
		load : (path, handlers) => {
			
			READ_FILE(path, {
				error : handlers.error,
				success : (buffer) => {
					handlers.success(buffer.toString());
				}
			});
		},
		
		loadFiles : (path, callback) => {
			
			FIND_FOLDER_NAMES(path, (folderNames) => {
				
				FIND_FILE_NAMES(path, (fileNames) => {
					
					callback(folderNames, fileNames);
				});
			});
		},
		
		getInfo : (path, callback) => {
			GET_FILE_INFO(path, callback);
		},
		
		move : (from, to, callback) => {
			
			MOVE_FILE({
				from : from,
				to : to
			}, callback);
		},
		
		remove : (path) => {
			
			CHECK_IS_FOLDER(path, (isFolder) => {
				
				if (isFolder === true) {
					REMOVE_FOLDER(path);
				}
				
				else {
					REMOVE_FILE(path);
				}
			});
		},
		
		ftpNew : (ftpInfo, callback) => {
			
			let infos = ftpInfoStore.get('infos');
			
			if (infos === undefined) {
				infos = []
			}
			
			infos.push(ftpInfo);
			
			ftpInfoStore.save({
				name : 'infos',
				value : infos
			});
			
			callback();
		},
		
		ftpConnect : (ftpInfo, handlers) => {
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector === undefined) {
				ftpConnector = ftpConnectors[ftpInfo.host] = DasomEditor.FTPConnector(ftpInfo, handlers);
			}
			
			else {
				handlers.success();
			}
		},
		
		ftpSave : (ftpInfo, path, content, callback) => {
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				
			}
		},
		
		ftpLoad : (ftpInfo, path, handlers) => {
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				ftpConnector.load(path, handlers);
			}
		},
		
		ftpLoadFiles : (ftpInfo, path, handlers) => {
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				ftpConnector.loadFiles(path, handlers);
			}
		},
		
		ftpGetInfo : (ftpInfo, path, callback) => {
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				
			}
		},
		
		ftpMove : (ftpInfo, from, to, callback) => {
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				
			}
		},
		
		ftpRemove : (ftpInfo, path) => {
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				
			}
		},
		
		copy : (paths) => {
			
			clipboard.writeText(STRINGIFY({
				paths : paths
			}));
		},
		
		paste : (folderPath) => {
			
			let clipboardPaths;
			let clipboardPath = clipboard.read('public.file-url');
			
			if (VALID.notEmpty(clipboardPath) !== true) {
				clipboardPath = clipboard.read('FileNameW');
				if (VALID.notEmpty(clipboardPath) === true) {
					clipboardPath = clipboardPath.replace(new RegExp(String.fromCharCode(0), 'g'), '');
				}
			}
			
			if (VALID.notEmpty(clipboardPath) === true) {
				clipboardPaths = [clipboardPath];
			}
			
			else {
				let info = PARSE_STR(clipboard.readText());
				if (info !== undefined && info.paths !== undefined) {
					clipboardPaths = info.paths;
				}
			}
			
			EACH(clipboardPaths, (clipboardPath) => {
				
				clipboardPath = fixPath(clipboardPath);
				
				let fileName = clipboardPath.substring(clipboardPath.lastIndexOf('/') + 1);
				
				RUN((f) => {
					
					CHECK_FILE_EXISTS(folderPath + '/' + fileName, (isExists) => {
						
						if (isExists === true) {
							
							let extname = '';
							let index = fileName.lastIndexOf('.');
							
							if (index !== -1) {
								extname = fileName.substring(index);
								fileName = fileName.substring(0, index);
							}
							
							fileName = fileName + ' (2)' + extname;
							
							f();
						}
						
						else {
							
							CHECK_IS_FOLDER(clipboardPath, (isFolder) => {
								
								// 폴더 복사
								if (isFolder === true) {
									
									COPY_FOLDER({
										from : clipboardPath,
										to : folderPath + '/' + fileName
									});
								}
								
								// 파일 복사
								else {
									
									READ_FILE(clipboardPath, {
										notExists : () => {
											// ignore.
										},
										success : (buffer) => {
											
											let content = buffer.toString();
											
											WRITE_FILE({
												path : folderPath + '/' + fileName,
												content : content
											});
										}
									});
								}
							});
						}
					});
				});
			});
		}
	});
	
	let workspaceFileWatcher;
	
	let loadWorkspaceFiles = () => {
		
		DasomEditor.IDE.clearFileTree();
		
		let createFileWatcher = (path, addItem, removeItem) => {
			
			return FS.watch(path, (eventType, fileName) => {
				
				if (eventType === 'rename') {
					
					CHECK_FILE_EXISTS(path + '/' + fileName, (isExists) => {
						
						if (isExists === true) {
							
							CHECK_IS_FOLDER(path + '/' + fileName, (isFolder) => {
								
								if (isFolder === true) {
									addItem({
										key : path + '/' + fileName,
										item : createFolderItem(path + '/' + fileName, fileName)
									});
								}
								
								else {
									addItem({
										key : path + '/' + fileName,
										item : DasomEditor.File({
											path : path + '/' + fileName,
											title : fileName
										})
									});
								}
							});
						}
						
						else {
							
							folderOpenedStore.remove(path + '/' + fileName);
							
							removeItem(path + '/' + fileName);
							
							let opendEditor = DasomEditor.IDE.getOpenedEditor(path + '/' + fileName);
							if (opendEditor !== undefined) {
								//TODO: 저장되지 않은 에디터로 설정
							}
						}
					});
				}
			});
		};
		
		let createFolderItem = (path, folderName) => {
			
			let isOpened = folderOpenedStore.get(path);
			
			let fileWatcher;
			
			let folder = DasomEditor.Folder({
				path : path,
				title : folderName,
				isOpened : isOpened,
				on : {
					
					open : () => {
						
						folderOpenedStore.save({
							name : path,
							value : true
						});
						
						loadFiles(path, folder.addItem);
						
						if (fileWatcher !== undefined) {
							fileWatcher.close();
						}
						
						fileWatcher = createFileWatcher(path, folder.addItem, folder.removeItem);
					},
					
					close : () => {
						
						folderOpenedStore.remove(path);
						
						fileWatcher.close();
					}
				}
			});
			
			return folder;
		};
		
		let loadFiles = (path, addItem) => {
			
			DasomEditor.IDE.loadFiles(path, (folderNames, fileNames) => {
				
				EACH(folderNames, (folderName) => {
					
					addItem({
						key : path + '/' + folderName,
						item : createFolderItem(path + '/' + folderName, folderName)
					});
				});
				
				EACH(fileNames, (fileName) => {
					
					addItem({
						key : path + '/' + fileName,
						item : DasomEditor.File({
							path : path + '/' + fileName,
							title : fileName
						})
					});
				});
			});
		};
		
		let workspacePath = editorStore.get('workspacePath');
		
		if (workspacePath === undefined) {
			workspacePath = 'workspace';
		}
		
		DasomEditor.IDE.setWorkspacePath(workspacePath);
		
		loadFiles(workspacePath, DasomEditor.IDE.addItem);
		
		if (workspaceFileWatcher !== undefined) {
			workspaceFileWatcher.close();
		}
		
		workspaceFileWatcher = createFileWatcher(workspacePath, DasomEditor.IDE.addItem, DasomEditor.IDE.removeItem);
	};
	
	DasomEditor.IDE.addToolbarButton(SkyDesktop.ToolbarButton({
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
	
	DasomEditor.IDE.addToolbarButton(SkyDesktop.ToolbarButton({
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
						
						let workspacePath = fixPath(fileInput.getEl().files[0].path);
						
						editorStore.save({
							name : 'workspacePath',
							value : workspacePath
						});
						
						DasomEditor.IDE.setWorkspacePath(workspacePath);
						
						DasomEditor.IDE.closeAllEditors();
						
						DasomEditor.IDE.getEditorOpenedStore().clear();
						
						loadWorkspaceFiles();
					}
				});
				
				// 폴더 선택 가능하도록
				fileInput.getEl().setAttribute('webkitDirectory', 'webkitDirectory');
			}
		}
	}));
	
	loadWorkspaceFiles();
	
	OVERRIDE(DasomEditor.FileContextMenu, (origin) => {
		
		DasomEditor.FileContextMenu = CLASS({
			
			preset : () => {
				return origin;
			},
		
			init : (inner, self, params) => {
				//REQUIRED: params
				//OPTIONAL: params.path
				//REQUIRED: params.folderPath
				
				let path = params.path;
				let folderPath = params.folderPath;
				
				self.append(SkyDesktop.ContextMenuItem({
					title : '탐색기에서 보기',
					icon : IMG({
						src : DasomEditor.R('icon/explorer.png')
					}),
					on : {
						tap : () => {
							
							shell.showItemInFolder(path === undefined ? DasomEditor.IDE.getWorkspacePath() : path);
							
							self.remove();
						}
					}
				}));
			}
		});
	});
	
	EVENT('dragover', (e) => {
		e.stop();
	});
	
	EVENT('drop', (e) => {
		
		EACH(e.getFiles(), (file) => {
			
			let reader = new FileReader();
			reader.onload = (e) => {
				
				DasomEditor.IDE.openEditor(DasomEditor.IDE.getEditor(file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase())({
					title : file.name,
					path : fixPath(file.path),
					content : e.target.result
				}));
			};
			reader.readAsText(file);
		});
		
		e.stop();
	});
	
	let infos = ftpInfoStore.get('infos');
	
	if (infos !== undefined) {
		EACH(infos, (info) => {
			DasomEditor.IDE.addFTPItem(info);
		});
	}
});
