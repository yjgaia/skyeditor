DasomEditor.IDE = OBJECT({
	
	preset : () => {
		return TABLE;
	},
	
	params : () => {
		return {
			style : {
				position : 'absolute',
				width : '100%',
				height : '100%'
			}
		};
	},

	init : (inner, self) => {
		
		let showHomeHandler;
		let loadHandler;
		let loadFilesHandler;
		let saveHandler;
		let copyHandler;
		let pasteHandler;
		let removeHandler;
		let moveHandler;
		let getInfoHandler;
		
		let workspacePath;
		
		let editorMap = {};
		let editorSettingStore = DasomEditor.STORE('editorSettingStore');
		let editorOpenedStore = DasomEditor.STORE('editorOpenedStore');
		let localHistoryStore = DasomEditor.STORE('localHistoryStore');
		
		let draggingShadow;
		
		let addEditor = self.addEditor = (params) => {
			//REQUIRED: params
			//REQUIRED: params.extname
			//REQUIRED: params.editor
			
			let extname = params.extname;
			let editor = params.editor;
			
			if (editorMap[extname] === undefined) {
				editorMap[extname] = [];
			}
			
			editorMap[extname].push(editor);
		};
		
		let getEditor = self.getEditor = (extname) => {
			
			let SelectedEditor = DasomEditor.TextEditor;
			
			if (editorSettingStore !== undefined) {
				
				let editorName = editorSettingStore.get(extname);
				
				if (editorMap[extname] !== undefined) {
					EACH(editorMap[extname], (editor) => {
						if (editorName === undefined || editor.getName() === editorName) {
							SelectedEditor = editor;
							return false;
						}
					});
				}
			}
			
			return SelectedEditor;
		};
		
		let getEditorOpenedStore = self.getEditorOpenedStore = () => {
			return editorOpenedStore;
		};
		
		let toolbar;
		self.append(TR({
			c : TD({
				style : {
					height : 28
				},
				c : toolbar = SkyDesktop.Toolbar({
					buttons : [SkyDesktop.ToolbarButton({
						icon : IMG({
							src : DasomEditor.R('icon/home.png')
						}),
						title : '홈',
						on : {
							tap : () => {
								showHomeHandler();
							}
						}
					}), SkyDesktop.ToolbarButton({
						icon : IMG({
							src : SkyDesktop.R('file.png')
						}),
						title : '새 파일',
						on : {
							tap : () => {
								openEditor(DasomEditor.TextEditor({
									title : '제목 없음'
								}));
							}
						}
					}), SkyDesktop.ToolbarButton({
						icon : IMG({
							src : DasomEditor.R('icon/save.png')
						}),
						title : '저장',
						on : {
							tap : () => {
								
								let activeTab = editorGroup.getActiveTab();
								
								if (activeTab.checkIsInstanceOf(DasomEditor.Editor) === true) {
									save(activeTab);
								}
							}
						}
					}), SkyDesktop.ToolbarButton({
						icon : IMG({
							src : DasomEditor.R('icon/setting.png')
						}),
						title : '에디터 설정',
						on : {
							tap : () => {
								
								let list;
								
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
										c : '에디터 설정'
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
									})]
								}, () => {
									
								});
								
								EACH(editorMap, (editors, extname) => {
									
									let editorList = DIV({
										style : {
											padding : '5px 8px',
											backgroundColor : '#fff',
											border : '1px solid #999',
											borderRadius : 4,
											marginBottom : 10
										},
										c : H3({
											style : {
												marginBottom : 5
											},
											c : [SPAN({
												style : {
													fontWeight : 'bold'
												},
												c : extname
											}), ' 파일 에디터 선택']
										})
									}).appendTo(list);
									
									EACH(editors, (editor, i) => {
										
										let input;
										editorList.append(P({
											c : [input = INPUT({
												style : {
													marginTop : 2,
													flt : 'left'
												},
												type : 'radio',
												name : extname,
												value : (editorSettingStore.get(extname) === undefined && i === 0) || editorSettingStore.get(extname) === editor.getName(),
												on : {
													change : () => {
														editorSettingStore.save({
															name : extname,
															value : editor.getName()
														});
													}
												}
											}), UUI.BUTTON_H({
												style : {
													marginLeft : 5,
													flt : 'left'
												},
												icon : editor.getIcon(),
												spacing : 5,
												title : editor.getName(),
												on : {
													tap : () => {
														input.toggleCheck();
													}
												}
											}), CLEAR_BOTH()]
										}));
									});
								});
							}
						}
					})]
				})
			})
		}));
		
		let addToolbarButton = self.addToolbarButton = (toolbarButton) => {
			toolbar.addButton(toolbarButton);
		};
		
		let openEditor = self.openEditor = (tab) => {
			
			editorGroup.addTab(tab);
			
			if (tab.checkIsInstanceOf(DasomEditor.Editor) === true && tab.checkIsInstanceOf(DasomEditor.CompareEditor) !== true) {
				
				tab.on('scroll', RAR((e) => {
					
					editorOpenedStore.save({
						name : tab.getPath(),
						value : tab.getScrollTop()
					});
				}));
				
				tab.on('remove', () => {
					editorOpenedStore.remove(tab.getPath());
				});
			}
			
			return tab;
		};
		
		let closeAllEditors = self.closeAllEditors = () => {
			editorGroup.removeAllTabs();
		};
		
		let loadAndOpenEditor = (path, scrollTop, next) => {
			
			load(path, (content) => {
				
				let fileName = path.substring(path.lastIndexOf('/') + 1);
				
				let editor = openEditor(getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
					title : fileName,
					path : path,
					content : content
				}));
				
				if (scrollTop !== undefined) {
					editor.setScrollTop(scrollTop);
				}
				
				if (next !== undefined) {
					next();
				}
			});
		};
		
		let fileTree;
		let ftpFileTree;
		let tabList;
		
		let editorGroup;
		self.append(TR({
			c : TD({
				c : SkyDesktop.HorizontalTabList({
					tabs : [SkyDesktop.Tab({
						size : 23,
						c : SkyDesktop.TabGroup({
							activeTabIndex : 0,
							tabs : [SkyDesktop.Tab({
								isCannotClose : true,
								icon : IMG({
									src : DasomEditor.R('icon/workspace.png')
								}),
								title : '작업 폴더',
								c : fileTree = SkyDesktop.FileTree(loadAndOpenEditor),
								on : {
									contextmenu : (e) => {
										
										DasomEditor.FileContextMenu({
											folderPath : workspacePath,
											e : e
										});
										
										e.stop();
									}
								}
							}), SkyDesktop.Tab({
								isCannotClose : true,
								icon : IMG({
									src : DasomEditor.R('icon/ftp.png')
								}),
								title : 'FTP',
								c : [UUI.BUTTON_H({
									style : {
										position : 'relative',
										marginLeft : 20,
										padding : '2px 5px'
									},
									icon : IMG({
										src : DasomEditor.R('icon/ftp.png')
									}),
									title : '새 FTP 연결',
									spacing : 5,
									c : UUI.ICON_BUTTON({
										style : {
											position : 'absolute',
											left : -12,
											top : 3,
											color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc'
										},
										icon : FontAwesome.GetIcon('plus'),
										on : {
											mouseover : (e, self) => {
												self.addStyle({
													color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#666' : '#999'
												});
												e.stop();
											},
											mouseout : (e, self) => {
												self.addStyle({
													color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc'
												});
												e.stop();
											}
										}
									}),
									on : {
										tap : (e) => {
											
											let form;
											let privateKeyInput;
											
											SkyDesktop.Confirm({
												okButtonTitle : '저장',
												msg : form = UUI.VALID_FORM({
													errorMsgs : {
														name : {
															notEmpty : '사이트 이름을 입력해주세요.'
														},
														host : {
															notEmpty : '호스트를 입력해주세요.'
														},
														username : {
															notEmpty : '아이디를 입력해주세요.'
														}
													},
													errorMsgStyle : {
														color : 'red'
													},
													c : [INPUT({
														style : {
															width : 222,
															padding : 8,
															border : '1px solid #999',
															borderRadius : 4
														},
														name : 'name',
														placeholder : '사이트 이름'
													}), SELECT({
														style : {
															marginTop : 10,
															width : 240,
															padding : 8,
															border : '1px solid #999',
															borderRadius : 4
														},
														name : 'protocol',
														c : [OPTION({
												            value : 'ftp',
												            c : 'FTP'
												        }), OPTION({
												            value : 'sftp',
												            c : 'SFTP'
												        })],
												        on : {
												        	change : (e, select) => {
												        		if (select.getValue() === 'sftp') {
												        			privateKeyInput.show();
												        		} else {
												        			privateKeyInput.hide();
												        		}
												        	}
												        }
													}), INPUT({
														style : {
															marginTop : 10,
															width : 222,
															padding : 8,
															border : '1px solid #999',
															borderRadius : 4
														},
														name : 'host',
														placeholder : '호스트'
													}), INPUT({
														style : {
															marginTop : 10,
															width : 222,
															padding : 8,
															border : '1px solid #999',
															borderRadius : 4
														},
														name : 'username',
														placeholder : '로그인 아이디'
													}), INPUT({
														style : {
															marginTop : 10,
															width : 222,
															padding : 8,
															border : '1px solid #999',
															borderRadius : 4
														},
														name : 'password',
														placeholder : '비밀번호'
													}), privateKeyInput = DIV({
														style : {
															display : 'none',
															marginTop : 10
														},
														c : [H3({
															c : 'Private Key'
														}), INPUT({
															style : {
																marginTop : 5,
																width : 222,
																padding : 8,
																border : '1px solid #999',
																borderRadius : 4
															},
															name : 'privateKey',
															type : 'file'
														})]
													})]
												})
											}, () => {
												
												let data = form.getData();
												
												if (VALID.notEmpty(data.password) !== true && VALID.notEmpty(data.privateKey) !== true) {
													
													SkyDesktop.Alert({
														msg : '비밀번호를 입력해주세요.'
													});
													
													return false;
												}
												
												else {
													
													let valid = VALID({
														name : {
															notEmpty : true
														},
														host : {
															notEmpty : true
														},
														username : {
															notEmpty : true
														}
													});
													
													let validResult = valid.check(data);
													
													if (validResult.checkHasError() === true) {
														form.showErrors(validResult.getErrors());
														return false;
													}
													
													else {
														
													}
												}
											});
											
											e.stop();
										}
									}
								}), ftpFileTree = SkyDesktop.FileTree(loadAndOpenEditor)]
							})]
						})
					}), SkyDesktop.Tab({
						size : 77,
						c : tabList = SkyDesktop.VerticalTabList({
							tabs : [SkyDesktop.Tab({
								size : 70,
								c : editorGroup = SkyDesktop.TabGroup({
									on : {
										tap : () => {
											deselectFiles();
										}
									}
								})
							})]
						})
					})]
				})
			})
		}));
		
		let addItem = self.addItem = (params) => {
			//REQUIRED: params
			//REQUIRED: params.key
			//REQUIRED: params.item
			
			fileTree.addItem(params);
		};
		
		let getItem = self.getItem = (key) => {
			//REQUIRED: key
			
			return fileTree.getItem(key);
		};
		
		let removeItem = self.removeItem = (key) => {
			//REQUIRED: key
			
			fileTree.removeItem(key);
		};
		
		let clearFileTree = self.clearFileTree = () => {
			fileTree.removeAllItems();
		};
		
		let editorOpenedInfos = [];
		EACH(editorOpenedStore.all(), (scrollTop, path) => {
			editorOpenedInfos.push({
				path : path,
				scrollTop : scrollTop
			});
		});
		
		let init = self.init = (params) => {
			//REQUIRED: params
			//REQUIRED: params.showHome
			//REQUIRED: params.load
			//REQUIRED: params.loadFiles
			//REQUIRED: params.save
			//REQUIRED: params.copy
			//REQUIRED: params.paste
			//REQUIRED: params.remove
			//REQUIRED: params.move
			
			showHomeHandler = params.showHome;
			loadHandler = params.load;
			loadFilesHandler = params.loadFiles;
			saveHandler = params.save;
			copyHandler = params.copy;
			pasteHandler = params.paste;
			removeHandler = params.remove;
			moveHandler = params.move;
			getInfoHandler = params.getInfo;
			
			self.appendTo(BODY);
			
			if (editorOpenedInfos.length === 0) {
				showHomeHandler();
			} else {
				
				NEXT(editorOpenedInfos, (editorOpenedInfo, next) => {
					loadAndOpenEditor(editorOpenedInfo.path, editorOpenedInfo.scrollTop, next);
				});
			}
		};
		
		let load = self.load = (path, callback) => {
			//REQUIRED: path
			//REQUIRED: callback
			
			loadHandler(path, {
				
				error : () => {
					editorOpenedStore.remove(path);
				},
				
				success : (content) => {
					callback(content);
				}
			});
		};
		
		let loadFiles = self.loadFiles = (path, callback) => {
			//REQUIRED: path
			//REQUIRED: callback
			
			let loadingBar = SkyDesktop.LoadingBar('lime');
			
			loadFilesHandler(path, (folderNames, fileNames) => {
				
				loadingBar.done();
				
				callback(folderNames, fileNames);
			});
		};
		
		let getLocalHistory = self.getLocalHistory = (path) => {
			//REQUIRED: path
			
			return localHistoryStore.get(path);
		};
		
		let innerSave = (path, content, callback) => {
			
			// 로컬 히스토리 저장
			// 파일의 용량이 1mb 미만인 경우에만 저장, 최대 100개
			if (content.length < 1024 * 1024) {
				
				let history = getLocalHistory(path);
				
				if (history === undefined) {
					history = [];
				}
				
				if (history[history.length - 1].content !== content) {
					
					history.push({
						time : new Date(),
						content : content
					});
					
					if (history.length > 100) {
						history.splice(0, 1);
					}
					
					localHistoryStore.save({
						name : path,
						value : history
					});
				}
			}
			
			saveHandler(path, content, callback);
		};
		
		let save = self.save = (activeTab) => {
			//REQUIRED: activeTab
			
			if (activeTab.checkIsInstanceOf(DasomEditor.CompareEditor) === true) {
				
				innerSave(activeTab.getPath1(), activeTab.getContent1(), () => {
					
					if (activeTab.getPath2() !== undefined) {
						
						innerSave(activeTab.getPath2(), activeTab.getContent2(), () => {
							SkyDesktop.Noti('저장하였습니다.');
						});
					}
					
					else {
						SkyDesktop.Noti('저장하였습니다.');
					}
				});
			}
			
			else {
				
				innerSave(activeTab.getPath(), activeTab.getContent(), (path) => {
					
					activeTab.setPath(path);
					
					let fileName = path.substring(path.lastIndexOf('/') + 1);
					activeTab.setTitle(fileName);
					
					let extname = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
					
					let Editor = DasomEditor.IDE.getEditor(extname);
					if (Editor !== undefined) {
						activeTab.setIcon(Editor.getIcon());
					}
					
					SkyDesktop.Noti('저장하였습니다.');
				});
			}
		};
		
		let copy = self.copy = (paths) => {
			//REQUIRED: paths
			
			copyHandler(paths);
		};
		
		let paste = self.paste = (folderPath) => {
			//REQUIRED: folderPath
			
			pasteHandler(folderPath);
		};
		
		let remove = self.remove = (path) => {
			//REQUIRED: path
			
			let openedEditor = getOpenedEditor(path);
			if (openedEditor !== undefined) {
				openedEditor.remove();
			}
			
			let selectedItem = fileTree.getItem(path);
			
			if (selectedItem !== undefined) {
				deselectFile(selectedItem);
			}
			
			removeHandler(path);
		};
		
		let move = self.move = (params) => {
			//REQUIRED: params
			//REQUIRED: params.from
			//REQUIRED: params.to
			
			let from = params.from;
			let to = params.to;
			
			if (to.indexOf(from) === -1) {
				
				moveHandler(from, to, () => {
					
					let openedEditor = getOpenedEditor(from);
					if (openedEditor !== undefined) {
						openedEditor.setPath(to);
						openedEditor.setTitle(to.substring(to.lastIndexOf('/') + 1));
					}
					
					let selectedItem = fileTree.getItem(to);
					
					if (selectedItem === undefined) {
						EACH(fileTree.getItems(), (item) => {
							if (item.checkIsInstanceOf(SkyDesktop.Folder) === true) {
								let _item = item.getItem(to);
								if (_item !== undefined) {
									selectedItem = _item;
									return false;
								}
							}
						});
					}
					
					if (selectedItem !== undefined) {
						selectedItem.select();
					}
				});
			}
		};
		
		let getInfo = self.getInfo = (path, callback) => {
			//REQUIRED: path
			//REQUIRED: callback
			
			getInfoHandler(path, callback);
		};
		
		let getOpenedEditor = self.getOpenedEditor = (path) => {
			//REQUIRED: path
			
			let editor;
			
			EACH(editorGroup.getAllTabs(), (tab) => {
				if (tab.checkIsInstanceOf(DasomEditor.Editor) === true && tab.getPath() === path) {
					editor = tab;
				}
			});
			
			return editor;
		};
		
		let selectedFileItems = [];
		
		let selectMultipleFile = self.selectMultipleFile = (fileItem) => {
			//REQUIRED: fileItem
			
			if (CHECK_IS_IN({
				array : selectedFileItems,
				value : fileItem
			}) !== true) {
				selectedFileItems.push(fileItem);
			}
			
			fileItem.select();
		};
		
		let deselectFiles = self.deselectFiles = () => {
			
			EACH(selectedFileItems, (selectedFileItem) => {
				if (selectedFileItem.checkIsShowing() === true) {
					selectedFileItem.deselect();
				}
			});
			
			selectedFileItems = [];
		};
		
		let selectFile = self.selectFile = (fileItem) => {
			//REQUIRED: fileItem
			
			deselectFiles();
			
			selectedFileItems.push(fileItem);
			
			fileItem.select();
		};
		
		let deselectFile = self.deselectFile = (fileItem) => {
			//REQUIRED: fileItem
			
			REMOVE({
				array : selectedFileItems,
				value : fileItem
			});
			
			fileItem.deselect();
		};
		
		let selectFileRange = self.selectFileRange = (fileItem) => {
			//REQUIRED: fileItem
			
			let last = selectedFileItems[selectedFileItems.length - 1];
			
			if (last !== undefined && fileItem !== last) {
				
				let from;
				let to;
				
				if (fileItem.getTop() < last.getTop()) {
					from = fileItem;
					to = last;
				} else {
					from = last;
					to = fileItem;
				}
				
				selectedFileItems = [];
				
				selectMultipleFile(from);
				
				let f = (fileItems) => {
					
					EACH(fileItems, (fileItem) => {
						
						if (from.getTop() < fileItem.getTop() && fileItem.getTop() < to.getTop()) {
							selectMultipleFile(fileItem);
						}
						
						if (fileItem.checkIsInstanceOf(DasomEditor.Folder) === true) {
							f(fileItem.getItems());
						}
					});
				};
				
				f(fileTree.getItems());
				
				selectMultipleFile(to);
			}
		};
		
		let getSelectedFileItems = self.getSelectedFileItems = () => {
			return selectedFileItems;
		}
		
		let isControlMode;
		
		EVENT('keydown', (e) => {
			
			if (isControlMode === true) {
				
				let key = e.getKey().toLowerCase();
				
				// 새 파일
				if (key === 'n') {
					
					openEditor(DasomEditor.TextEditor({
						title : '제목 없음'
					}));
				}
				
				// 복사
				else if (key === 'c') {
					
					let paths = [];
					
					EACH(selectedFileItems, (selectedFileItem) => {
						paths.push(selectedFileItem.getPath());
					});
					
					DasomEditor.IDE.copy(paths);
				}
				
				// 붙혀넣기
				else if (key === 'v') {
					if (selectedFileItems.length > 0) {
						DasomEditor.IDE.paste(selectedFileItems[selectedFileItems.length - 1].getFolderPath());
					}
				}
				
				// 현재 탭 종료
				else if (key === 'w') {
					
					if (editorGroup.getActiveTab() !== undefined) {
						editorGroup.getActiveTab().remove();
					}
				}
				
				// 현재 탭 저장
				else if (key === 's') {
					
					if (editorGroup.getActiveTab() !== undefined) {
						
						let activeTab = editorGroup.getActiveTab();
						
						save(activeTab);
					}
				}
				
				// 검색
				else if (key === 'h') {
					if (selectedFileItems.length > 0) {
						search();
					}
				}
			}
			
			if (e.getKey() === 'Control') {
				isControlMode = true;
			}
			
			// 삭제
			if (e.getKey() === 'Delete') {
				
				if (selectedFileItems.length > 0) {
					
					SkyDesktop.Confirm({
						msg : '정말 삭제 하시겠습니까?'
					}, () => {
						
						EACH(selectedFileItems, (selectedFileItem) => {
							DasomEditor.IDE.remove(selectedFileItem.getPath());
						});
					});
				}
			}
			
			// 열기
			if (e.getKey() === 'Enter') {
				
				if (selectedFileItems.length > 0) {
					
					EACH(selectedFileItems, (selectedFileItem) => {
						if (selectedFileItem.checkIsInstanceOf(DasomEditor.Folder) === true) {
							selectedFileItem.open();
						} else if (selectedFileItem.checkIsInstanceOf(DasomEditor.File) === true) {
							selectedFileItem.fireEvent('doubletap');
						}
					});
				}
			}
			
			// 파일명 변경
			if (e.getKey() === 'F2') {
				
				if (selectedFileItems.length === 1) {
					
					let selectedFileItem = selectedFileItems[0];
					let path = selectedFileItem.getPath();
					
					SkyDesktop.Prompt({
						msg : '새 이름을 입력해주시기 바랍니다.',
						value : path.substring(path.lastIndexOf('/') + 1)
					}, (newName) => {
						
						deselectFiles();
						
						move({
							from : path,
							to : path.substring(0, path.lastIndexOf('/')) + '/' + newName
						});
					});
				}
			}
			
			// 아래 키, 위 키
			if (selectedFileItems.length > 0) {
				
				if (e.getKey() === 'ArrowUp') {
					
					let lastItem = selectedFileItems[selectedFileItems.length - 1];
					
					let brotherItem;
					EACH(lastItem.getParent().getChildren(), (item) => {
						if (item.checkIsInstanceOf(DasomEditor.File) === true || item.checkIsInstanceOf(DasomEditor.Folder) === true) {
							if (item === lastItem) {
								return false;
							}
							brotherItem = item;
						}
					});
					
					items = undefined;
					
					if (brotherItem === undefined) {
						
						if (lastItem.getParent() !== fileTree) {
							
							let folder;
							EACH(lastItem.getParent().getParent().getChildren(), (child) => {
								if (child === lastItem.getParent()) {
									return false;
								}
								folder = child;
							});
								
							if (folder !== undefined) {
								
								deselectFile(lastItem);
								
								selectFile(folder);
							}
						}
					}
					
					else {
						
						deselectFile(lastItem);
						
						if (brotherItem.checkIsInstanceOf(DasomEditor.Folder) === true && COUNT_PROPERTIES(brotherItem.getItems()) > 0) {
							
							EACH(brotherItem.getItems(), (item) => {
								REVERSE_EACH(item.getParent().getChildren(), (item) => {
									if (item.checkIsInstanceOf(DasomEditor.File) === true || item.checkIsInstanceOf(DasomEditor.Folder) === true) {
										selectFile(item);
										return false;
									}
								});
								return false;
							});
						}
						
						else {
							selectFile(brotherItem);
						}
					}
					
					e.stopDefault();
				}
				
				else if (e.getKey() === 'ArrowDown') {
					
					let lastItem = selectedFileItems[selectedFileItems.length - 1];
					
					// 폴더고 열려 있을 때
					if (lastItem.checkIsInstanceOf(DasomEditor.Folder) === true && COUNT_PROPERTIES(lastItem.getItems()) > 0) {
						
						EACH(lastItem.getItems(), (item) => {
							EACH(item.getParent().getChildren(), (item) => {
								if (item.checkIsInstanceOf(DasomEditor.File) === true || item.checkIsInstanceOf(DasomEditor.Folder) === true) {
									selectFile(item);
									return false;
								}
							});
							return false;
						});
					}
					
					else {
						
						let brotherItem;
						REVERSE_EACH(lastItem.getParent().getChildren(), (item) => {
							if (item.checkIsInstanceOf(DasomEditor.File) === true || item.checkIsInstanceOf(DasomEditor.Folder) === true) {
								if (item === lastItem) {
									return false;
								}
								brotherItem = item;
							}
						});
						
						items = undefined;
						
						if (brotherItem === undefined) {
							
							if (lastItem.getParent() !== fileTree) {
								
								let folder;
								REVERSE_EACH(lastItem.getParent().getParent().getChildren(), (child) => {
									if (child === lastItem.getParent()) {
										return false;
									}
									folder = child;
								});
								
								if (folder !== undefined) {
									
									deselectFile(lastItem);
									
									selectFile(folder);
								}
							}
						}
						
						else {
							
							deselectFile(lastItem);
							
							selectFile(brotherItem);
						}
					}
					
					e.stopDefault();
				}
				
				else if (e.getKey() === 'ArrowLeft') {
					
					let lastItem = selectedFileItems[selectedFileItems.length - 1];
					
					// 폴더고 열려 있을 때
					if (lastItem.checkIsInstanceOf(DasomEditor.Folder) === true && COUNT_PROPERTIES(lastItem.getItems()) > 0) {
						lastItem.fireEvent('doubletap');
					}
					
					else {
						
						let folder;
						EACH(lastItem.getParent().getParent().getChildren(), (child) => {
							if (child === lastItem.getParent()) {
								return false;
							}
							folder = child;
						});
						
						if (folder !== undefined) {
							
							deselectFile(lastItem);
							
							selectFile(folder);
						}
					}
					
					e.stopDefault();
				}
				
				else if (e.getKey() === 'ArrowRight') {
					
					let lastItem = selectedFileItems[selectedFileItems.length - 1];
					
					// 폴더고 열려 있을 때
					if (lastItem.checkIsInstanceOf(DasomEditor.Folder) === true && COUNT_PROPERTIES(lastItem.getItems()) > 0) {
						
						EACH(lastItem.getItems(), (item) => {
							EACH(item.getParent().getChildren(), (item) => {
								if (item.checkIsInstanceOf(DasomEditor.File) === true || item.checkIsInstanceOf(DasomEditor.Folder) === true) {
									selectFile(item);
									return false;
								}
							});
							return false;
						});
					}
					
					else if (lastItem.checkIsInstanceOf(DasomEditor.Folder) === true) {
						lastItem.fireEvent('doubletap');
					}
					
					e.stopDefault();
				}
			}
		});
		
		EVENT('keyup', (e) => {
			if (e.getKey() === 'Control') {
				isControlMode = false;
			}
		});
		
		let setDraggingShadow = self.setDraggingShadow = (_draggingShadow) => {
			//REQUIRED: draggingShadow
			
			draggingShadow = _draggingShadow;
		};
		
		let getDraggingShadow = self.getDraggingShadow = () => {
			return draggingShadow;
		};
		
		EVENT('touchmove', (e) => {
			if (draggingShadow !== undefined) {
				draggingShadow.addStyle({
					left : e.getLeft() + 10,
					top : e.getTop() + 10
				});
			}
		});
		
		EVENT('touchend', () => {
			DELAY(() => {
				if (draggingShadow !== undefined) {
					draggingShadow.remove();
					draggingShadow = undefined;
				}
			});
		});
		
		let setWorkspacePath = self.setWorkspacePath = (_workspacePath) => {
			//REQUIRED: workspacePath
			
			workspacePath = _workspacePath;
		};
		
		let getWorkspacePath = self.getWorkspacePath = () => {
			return workspacePath;
		};
		
		let addTab = self.addTab = (tab) => {
			//REQUIRED: tab
			
			tabList.addTab(tab);
		};
		
		let search = self.search = () => {
			
			SkyDesktop.Prompt({
				msg : '검색할 문자열을 입력해주세요.'
			}, (text) => {
				
				if (text !== '') {
					
					let tab;
					let fileTree;
					
					let foundInfos = [];
					
					addTab(tab = SkyDesktop.Tab({
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
						}), A({
							style : {
								position : 'absolute',
								right : 30,
								top : 7,
								color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#666' : '#ccc',
								zIndex : 999
							},
							c : '전체 변경',
							on : {
								mouseover : (e, self) => {
									self.addStyle({
										color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#999' : '#999'
									});
								},
								mouseout : (e, self) => {
									self.addStyle({
										color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#666' : '#ccc'
									});
								},
								tap : () => {
									
									SkyDesktop.Prompt({
										msg : '변경할 문자열을 입력해주세요.'
									}, (changeText) => {
										
										let loadingBar = SkyDesktop.LoadingBar('lime');
										
										NEXT(foundInfos, [(info, next) => {
											innerSave(info.path, info.content.replace(new RegExp(text, 'g'), changeText), () => {
												next();
											});
										}, () => {
											return () => {
												SkyDesktop.Noti('모두 저장하였습니다.');
												loadingBar.done();
											};
										}]);
										
										tab.remove();
									});
								}
							}
						}), fileTree = SkyDesktop.FileTree(loadAndOpenEditor)]
					}));
					
					let isFirst = true;
					
					let search = (folderPath, folderNames, fileNames) => {
						
						EACH(folderNames, (folderName) => {
							loadFiles(folderPath + '/' + folderName, (folderNames, fileNames) => {
								search(folderPath + '/' + folderName, folderNames, fileNames)
							});
						});
						
						EACH(fileNames, (fileName) => {
							
							let path = folderPath + '/' + fileName;
							
							load(path, (content) => {
								
								foundInfos.push({
									path : path,
									content : content
								});
								
								let foundLineInfos = [];
								
								EACH(content.split('\n'), (line, lineNumber) => {
									lineNumber += 1;
									
									if (line.indexOf(text) !== -1) {
										foundLineInfos.push({
											lineNumber : lineNumber,
											line : line
										});
									}
								});
								
								if (foundLineInfos.length > 0) {
									
									let foundFile;
									
									fileTree.addItem({
										key : path,
										item : foundFile = DasomEditor.FoundFile({
											path : path,
											title : path.substring(path.lastIndexOf('/') + 1),
											isOpened : isFirst
										})
									});
									
									isFirst = false;
									
									EACH(foundLineInfos, (info) => {
										foundFile.addItem({
											key : path + ':' + info.lineNumber,
											item : DasomEditor.FoundLine({
												path : path,
												text : text,
												lineNumber : info.lineNumber,
												line : info.line.trim(),
												on : {
													doubletap : () => {
														loadAndOpenEditor(path, (info.lineNumber - 1) * 17);
													}
												}
											})
										});
									});
								}
							});
						});
					};
					
					EACH(selectedFileItems, (item) => {
						
						if (item.checkIsInstanceOf(DasomEditor.Folder) === true) {
							loadFiles(item.getPath(), (folderNames, fileNames) => {
								search(item.getPath(), folderNames, fileNames)
							});
						}
						
						else if (item.checkIsInstanceOf(DasomEditor.File) === true) {
							search(item.getFolderPath(), [], [item.getTitle()]);
						}
					});
				}
			});
		};
	}
});
