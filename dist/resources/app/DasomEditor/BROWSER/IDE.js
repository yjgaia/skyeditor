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
		let createFolderHandler;
		let removeHandler;
		let moveHandler;
		let getInfoHandler;
		
		let ftpNewHandler;
		let ftpDestroyHandler;
		let ftpListHandler;
		let ftpConnectHandler;
		let ftpLoadHandler;
		let ftpLoadFilesHandler;
		let ftpSaveHandler;
		let ftpCreateFolderHandler;
		let ftpRemoveHandler;
		let ftpMoveHandler;
		let ftpGetInfoHandler;
		
		let copyHandler;
		let pasteHandler;
		
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
			
			if (
			tab.checkIsInstanceOf(DasomEditor.Editor) === true &&
			tab.checkIsInstanceOf(DasomEditor.CompareEditor) !== true &&
			tab.getFTPInfo() === undefined) {
				
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
		
		let loadAndOpenEditor = (path, scrollTop, findText) => {
			
			load({
				path : path
			}, (content) => {
				
				let fileName = path.substring(path.lastIndexOf('/') + 1);
				
				let editor = openEditor(getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
					title : fileName,
					path : path,
					content : content
				}));
				
				if (scrollTop !== undefined) {
					editor.setScrollTop(scrollTop);
				}
				
				if (findText !== undefined) {
					editor.setFindText(findText);
				}
			});
		};
		
		let fileTree;
		let ftpFileTree;
		let tabList;
		
		let leftTab;
		let savedLeftTabSize;
		let fileTreeTab;
		let editorGroup;
		self.append(TR({
			c : TD({
				c : SkyDesktop.HorizontalTabList({
					tabs : [leftTab = SkyDesktop.Tab({
						size : 23,
						c : SkyDesktop.TabGroup({
							activeTabIndex : 0,
							tabs : [fileTreeTab = SkyDesktop.Tab({
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
                                style : {
                                    onDisplayResize : () => {
                                        return leftTab !== undefined ? {
                                            width : leftTab.getWidth() - 1,
                                            overflowX : 'auto'
                                        } : {};
                                    }
                                },
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
											let privateKey;
											let privateKeyInput;
											
											SkyDesktop.Confirm({
												okButtonTitle : '저장',
												msg : form = UUI.VALID_FORM({
													errorMsgs : {
														title : {
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
														name : 'title',
														placeholder : '사이트 이름'
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
														name : 'port',
														placeholder : '포트 번호'
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
														type : 'password',
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
															type : 'file',
															on : {
																change : (e) => {
																	
																	let fileReader = new FileReader();
																	fr.readAsText(e.getFiles()[0]);
																	fileReader.onload = (e) => {
																		privateKey = e.target.result;
																	};
																}
															}
														})]
													})]
												})
											}, () => {
												
												let data = form.getData();
												
												if (VALID.notEmpty(data.password) !== true && privateKey === undefined) {
													
													SkyDesktop.Alert({
														msg : '비밀번호를 입력해주세요.'
													});
													
													return false;
												}
												
												else {
													
													data.privateKey = privateKey;
													
													let valid = VALID({
														title : {
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
														
														let loadingBar = SkyDesktop.LoadingBar('lime');
														
														ftpNew(data, () => {
															
															addFTPItem(data);
															
															loadingBar.done();
														});
													}
												}
											});
											
											e.stop();
										}
									}
								}), ftpFileTree = SkyDesktop.FileTree()]
							})]
						})
					}), SkyDesktop.Tab({
						size : 77,
						c : tabList = SkyDesktop.VerticalTabList({
							tabs : [SkyDesktop.Tab({
								size : 70,
								c : editorGroup = SkyDesktop.TabGroup({
									on : {
										titledoubletap : () => {
											if (savedLeftTabSize === undefined) {
												savedLeftTabSize = leftTab.getSize();
												leftTab.setSize(0);
											} else {
												leftTab.setSize(savedLeftTabSize);
												savedLeftTabSize = undefined;
											}
										},
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
		
		EVENT('resize', () => {
			DELAY(() => {
				fileTreeTab.addStyle({
					width : leftTab.getWidth() - 1,
					overflowX : 'auto'
				});
			});
		});
		
		let addItem = self.addItem = (params) => {
			//REQUIRED: params
			//REQUIRED: params.key
			//REQUIRED: params.item
			
			fileTree.addItem(params);
		};
		
		let addFTPItem = self.addFTPItem = (ftpInfo) => {
			//REQUIRED: ftpInfo
			
			let item;
			
			ftpFileTree.addItem({
				key : ftpInfo.username + '@' + ftpInfo.host,
				item : item = DasomEditor.FTPItem(ftpInfo)
			});
			
			item.on('open', () => {
				
				let loadingBar = SkyDesktop.LoadingBar('lime');
				
				ftpConnectHandler(ftpInfo, () => {
					loadingBar.done();
					SkyDesktop.Alert({
						msg : ftpInfo.title + ' 접속에 실패하였습니다.'
					});
					item.close();
				}, () => {
					loadingBar.done();
					ftpLoadFiles(ftpInfo, item, '.');
				});
			});
		};
		
		let getFTPItem = self.getFTPItem = (ftpInfo, path) => {
			//REQUIRED: ftpInfo
			//REQUIRED: path
			
			let nowPath = '';
			let item;
			
			EACH(path.split('/'), (subPath) => {
				
				if (nowPath === '' && subPath === '.') {
					nowPath = subPath;
					item = ftpFileTree.getItem(ftpInfo.username + '@' + ftpInfo.host);
				}
				
				else {
					nowPath += '/' + subPath;
					item = item.getItem(nowPath);
				}
			});
			
			return item;
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
			//REQUIRED: params.createFolder
			//REQUIRED: params.remove
			//REQUIRED: params.move
			//REQUIRED: params.ftpNew
			//REQUIRED: params.ftpList
			//REQUIRED: params.ftpLoad
			//REQUIRED: params.ftpLoadFiles
			//REQUIRED: params.ftpSave
			//REQUIRED: params.ftpCreateFolder
			//REQUIRED: params.ftpRemove
			//REQUIRED: params.ftpMove
			//REQUIRED: params.copy
			//REQUIRED: params.paste
			
			showHomeHandler = params.showHome;
			
			loadHandler = params.load;
			loadFilesHandler = params.loadFiles;
			saveHandler = params.save;
			createFolderHandler = params.createFolder;
			removeHandler = params.remove;
			moveHandler = params.move;
			getInfoHandler = params.getInfo;
			
			ftpNewHandler = params.ftpNew;
			ftpDestroyHandler = params.ftpDestroy;
			ftpListHandler = params.ftpList;
			ftpConnectHandler = params.ftpConnect;
			ftpLoadHandler = params.ftpLoad;
			ftpLoadFilesHandler = params.ftpLoadFiles;
			ftpSaveHandler = params.ftpSave;
			ftpCreateFolderHandler = params.ftpCreateFolder;
			ftpRemoveHandler = params.ftpRemove;
			ftpMoveHandler = params.ftpMove;
			ftpGetInfoHandler = params.ftpGetInfo;
			
			copyHandler = params.copy;
			pasteHandler = params.paste;
			
			self.appendTo(BODY);
			
			if (editorOpenedInfos.length === 0) {
				showHomeHandler();
			} else {
				
				NEXT(editorOpenedInfos, (editorOpenedInfo, next) => {

					let path = editorOpenedInfo.path;
					
					loadHandler(path,

					// 파일을 찾지 못함
					() => {
						editorOpenedStore.remove(path);
						next();
					},

					(content) => {
						
						let fileName = path.substring(path.lastIndexOf('/') + 1);
						
						let editor = openEditor(getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
							title : fileName,
							path : path,
							content : content
						}));
						
						editor.setScrollTop(editorOpenedInfo.scrollTop);
						
						next();
					});
				});
			}
		};
		
		let loadFiles = self.loadFiles = (path, callback) => {
			//REQUIRED: path
			//REQUIRED: callback
			
			let loadingBar = SkyDesktop.LoadingBar('lime');
			
			loadFilesHandler(path, () => {
				SkyDesktop.Alert({
					msg : path + '의 파일 목록을 불러오는데 실패하였습니다.'
				});
			}, (folderNames, fileNames) => {
				loadingBar.done();
				callback(folderNames, fileNames);
			});
		};
		
		let load = self.load = (params, callback) => {
			//REQUIRED: params
			//OPTIONAL: params.ftpInfo
			//REQUIRED: params.path
			//REQUIRED: callback
			
			let ftpInfo = params.ftpInfo;
			let path = params.path;
			
			if (ftpInfo !== undefined) {
				
				let loadingBar = SkyDesktop.LoadingBar('lime');
				
				ftpLoadHandler(ftpInfo, path, () => {
					loadingBar.done();
					SkyDesktop.Alert({
						msg : 'FTP로부터 파일을 불러오는데 실패하였습니니다.'
					});
				}, (content) => {
					loadingBar.done();
					callback(content);
				});
			}
			
			else {
				
				loadHandler(path, () => {
					SkyDesktop.Alert({
						msg : '파일을 불러오는데 실패하였습니니다.'
					});
				}, callback);
			}
		};
		
		let innerSave = (ftpInfo, path, content, callback) => {
			
			// 로컬 히스토리 저장
			// 파일의 용량이 1mb 미만인 경우에만 저장, 최대 100개
			if (content.length < 1024 * 1024) {
				
				let history = getLocalHistory({
					ftpInfo : ftpInfo,
					path : path
				});
				
				if (history === undefined) {
					history = [];
				}
				
				if (history.length === 0 || history[history.length - 1].content !== content) {
					
					history.push({
						time : new Date(),
						content : content
					});
					
					if (history.length > 100) {
						history.splice(0, 1);
					}
					
					localHistoryStore.save({
						name : STRINGIFY({
							ftpInfo : ftpInfo,
							path : path
						}),
						value : history
					});
				}
			}
			
			if (ftpInfo !== undefined) {
				
				let loadingBar = SkyDesktop.LoadingBar('lime');
				
				ftpSaveHandler(ftpInfo, path, content, () => {
					loadingBar.done();
					SkyDesktop.Alert({
						msg : 'FTP로 파일을 저장하는데 실패하였습니니다.'
					});
				}, () => {
					loadingBar.done();
					
					let fileName = path.substring(path.lastIndexOf('/') + 1);
					
					getFTPItem(ftpInfo, path.substring(0, path.lastIndexOf('/'))).addItem({
						key : path,
						item : DasomEditor.File({
							ftpInfo : ftpInfo,
							path : path,
							title : fileName,
							on : {
								doubletap : () => {
									
									let loadingBar = SkyDesktop.LoadingBar('lime');
									
									ftpLoadHandler(ftpInfo, path, () => {
										loadingBar.done();
										SkyDesktop.Alert({
											msg : path + '의 파일 목록을 불러오는데 실패하였습니다.'
										});
									}, (content) => {
										loadingBar.done();
										
										openEditor(getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
											ftpInfo : ftpInfo,
											title : fileName,
											path : path,
											content : content
										}));
									});
								}
							}
						})
					});
					
					callback(path);
				});
			}
			
			else {
				saveHandler(path, content, () => {
					SkyDesktop.Alert({
						msg : '파일 저장에 실패하였습니니다.'
					});
				}, callback);
			}
		};
		
		let save = self.save = (activeTab) => {
			//REQUIRED: activeTab
			//REQUIRED: callback
			
			if (activeTab.checkIsInstanceOf(DasomEditor.CompareEditor) === true) {
				
				innerSave(activeTab.getFTPInfo(), activeTab.getPath1(), activeTab.getContent1(), () => {
					
					if (activeTab.getPath2() !== undefined) {
						
						innerSave(activeTab.getFTPInfo(), activeTab.getPath2(), activeTab.getContent2(), () => {
							SkyDesktop.Noti('저장하였습니다.');
						});
					}
					
					else {
						SkyDesktop.Noti('저장하였습니다.');
					}
				});
			}
			
			else {
				
				innerSave(activeTab.getFTPInfo(), activeTab.getPath(), activeTab.getContent(), (path) => {
					
					activeTab.setPath(path);
					
					let fileName = path.substring(path.lastIndexOf('/') + 1);
					
					let extname = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
					
					let Editor = getEditor(extname);
					if (Editor !== undefined) {
						activeTab.setIcon(Editor.getIcon());
					}
					
					SkyDesktop.Noti('저장하였습니다.');
					
					activeTab.setOriginContent(activeTab.getContent());
					activeTab.setTitle(fileName);
					
					if (activeTab.getFTPInfo() === undefined) {
						
						editorOpenedStore.save({
							name : activeTab.getPath(),
							value : activeTab.getScrollTop()
						});
					}
				});
			}
		};
		
		let createFolder = self.createFolder = (params) => {
			//REQUIRED: params
			//OPTIONAL: params.ftpInfo
			//REQUIRED: params.path
			
			let ftpInfo = params.ftpInfo;
			let path = params.path;
			
			if (ftpInfo !== undefined) {
				
				let loadingBar = SkyDesktop.LoadingBar('lime');
				
				ftpCreateFolderHandler(ftpInfo, path, () => {
					loadingBar.done();
					SkyDesktop.Alert({
						msg : 'FTP로 폴더를 생성하는데 실패하였습니니다.'
					});
				}, () => {
					loadingBar.done();
					
					let item;
					let folderName = path.substring(path.lastIndexOf('/') + 1);
					
					getFTPItem(ftpInfo, path.substring(0, path.lastIndexOf('/'))).addItem({
						key : path,
						item : item = DasomEditor.Folder({
							ftpInfo : ftpInfo,
							path : path,
							title : folderName,
							on : {
								open : () => {
									ftpLoadFiles(ftpInfo, item, path);
								}
							}
						})
					});
				});
			}
			
			else {
				createFolderHandler(path, () => {
					SkyDesktop.Alert({
						msg : '폴더 생성에 실패하였습니니다.'
					});
				}, () => {});
			}
		};
		
		let copy = self.copy = (pathInfos) => {
			//REQUIRED: pathInfos
			
			copyHandler(pathInfos);
		};
		
		let paste = self.paste = (params) => {
			//REQUIRED: params
			//OPTIONAL: params.ftpInfo
			//REQUIRED: params.folderPath
			
			let ftpInfo = params.ftpInfo;
			let folderPath = params.folderPath;
			
			let loadingBar = SkyDesktop.LoadingBar('lime');
			
			pasteHandler(ftpInfo, folderPath, () => {
				SkyDesktop.Alert({
					msg : '붙여넣기에 실패하였습니니다.'
				});
			}, (ftpFolderPaths, ftpFilePaths) => {
				
				loadingBar.done();
				
				if (ftpInfo !== undefined) {
					
					EACH(ftpFolderPaths, (path) => {
						
						let item;
						let folderName = path.substring(path.lastIndexOf('/') + 1);
						
						getFTPItem(ftpInfo, path.substring(0, path.lastIndexOf('/'))).addItem({
							key : path,
							item : item = DasomEditor.Folder({
								ftpInfo : ftpInfo,
								path : path,
								title : folderName,
								on : {
									open : () => {
										ftpLoadFiles(ftpInfo, item, path);
									}
								}
							})
						});
					});
					
					EACH(ftpFilePaths, (path) => {
						
						let fileName = path.substring(path.lastIndexOf('/') + 1);
						
						getFTPItem(ftpInfo, path.substring(0, path.lastIndexOf('/'))).addItem({
							key : path,
							item : DasomEditor.File({
								ftpInfo : ftpInfo,
								path : path,
								title : fileName,
								on : {
									doubletap : () => {
										
										let loadingBar = SkyDesktop.LoadingBar('lime');
										
										ftpLoadHandler(ftpInfo, path, () => {
											loadingBar.done();
											SkyDesktop.Alert({
												msg : path + '의 파일 목록을 불러오는데 실패하였습니다.'
											});
										}, (content) => {
											loadingBar.done();
											
											openEditor(getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
												ftpInfo : ftpInfo,
												title : fileName,
												path : path,
												content : content
											}));
										});
									}
								}
							})
						});
					});
				} 
			});
		};
		
		let remove = self.remove = (params) => {
			//REQUIRED: params
			//OPTIONAL: params.ftpInfo
			//REQUIRED: params.path
			
			let ftpInfo = params.ftpInfo;
			let path = params.path;
			
			let openedEditor = getOpenedEditor(path);
			if (openedEditor !== undefined) {
				openedEditor.remove();
			}
			
			let selectedItem = fileTree.getItem(path);
			
			if (selectedItem !== undefined) {
				deselectFile(selectedItem);
			}
			
			if (ftpInfo !== undefined) {
				
				let loadingBar = SkyDesktop.LoadingBar('lime');
				
				ftpRemoveHandler(ftpInfo, path, () => {
					loadingBar.done();
					SkyDesktop.Alert({
						msg : 'FTP에서 파일을 삭제하는데 실패하였습니니다.'
					});
				}, () => {
					loadingBar.done();
					
					getFTPItem(ftpInfo, path.substring(0, path.lastIndexOf('/'))).removeItem(path);
				});
			}
			
			else {
				removeHandler(path, () => {
					SkyDesktop.Alert({
						msg : '파일 삭제에 실패하였습니니다.'
					});
				}, () => {});
			}
		};
		
		let move = self.move = (params) => {
			//REQUIRED: params
			//OPTIONAL: params.fromFTPInfo
			//OPTIONAL: params.toFTPInfo
			//REQUIRED: params.from
			//REQUIRED: params.to
			
			let fromFTPInfo = params.fromFTPInfo;
			let toFTPInfo = params.toFTPInfo;
			let from = params.from;
			let to = params.to;
			
			if (fromFTPInfo !== undefined || toFTPInfo !== undefined) {
				
				ftpMoveHandler(fromFTPInfo, toFTPInfo, from, to, () => {
					SkyDesktop.Alert({
						msg : 'FTP에서 파일 이동에 실패하였습니니다.'
					});
				}, () => {
					
					let openedEditor = getOpenedEditor(from);
					if (openedEditor !== undefined) {
						openedEditor.setFTPInfo(toFTPInfo);
						openedEditor.setPath(to);
						openedEditor.setTitle(to.substring(to.lastIndexOf('/') + 1));
					}
					
					let fromParentItem = getFTPItem(fromFTPInfo, from.substring(0, from.lastIndexOf('/')));
					
					if (fromParentItem.getItem(from).checkIsInstanceOf(DasomEditor.Folder) === true) {
						
						let item;
						let folderName = to.substring(to.lastIndexOf('/') + 1);
						
						getFTPItem(toFTPInfo, to.substring(0, to.lastIndexOf('/'))).addItem({
							key : to,
							item : item = DasomEditor.Folder({
								ftpInfo : toFTPInfo,
								path : to,
								title : folderName,
								on : {
									open : () => {
										ftpLoadFiles(toFTPInfo, item, to);
									}
								}
							})
						});
					}
					
					else {
						
						let fileName = to.substring(to.lastIndexOf('/') + 1);
						
						getFTPItem(toFTPInfo, to.substring(0, to.lastIndexOf('/'))).addItem({
							key : to,
							item : DasomEditor.File({
								ftpInfo : toFTPInfo,
								path : to,
								title : fileName,
								on : {
									doubletap : () => {
										
										let loadingBar = SkyDesktop.LoadingBar('lime');
										
										ftpLoadHandler(toFTPInfo, to, () => {
											loadingBar.done();
											SkyDesktop.Alert(to + '의 파일 목록을 불러오는데 실패하였습니다.');
										}, (content) => {
											loadingBar.done();
											
											openEditor(getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
												ftpInfo : toFTPInfo,
												title : fileName,
												path : to,
												content : content
											}));
										});
									}
								}
							})
						});
					}
					
					fromParentItem.removeItem(from);
				});
			}
			
			else {
				
				moveHandler(from, to, () => {
					SkyDesktop.Alert({
						msg : '파일 이동에 실패하였습니니다.'
					});
				}, () => {
					
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
					
					else {
						selectedItem.select();
					}
				});
			}
		};
		
		let getInfo = self.getInfo = (params, callback) => {
			//REQUIRED: params
			//OPTIONAL: params.ftpInfo
			//REQUIRED: params.path
			//REQUIRED: callback
			
			let ftpInfo = params.ftpInfo;
			let path = params.path;
			
			if (ftpInfo !== undefined) {
				
				let loadingBar = SkyDesktop.LoadingBar('lime');
				
				ftpGetInfoHandler(ftpInfo, path, () => {
					loadingBar.done();
					SkyDesktop.Alert({
						msg : 'FTP로부터 파일 정보를 가져오는데에 실패하였습니니다.'
					});
				}, (fileInfo) => {
					loadingBar.done();
					callback(fileInfo);
				});
			}
			
			else {
				getInfoHandler(path, () => {
					SkyDesktop.Alert({
						msg : '파일 정보를 가져오는데에 실패하였습니니다.'
					});
				}, callback);
			}
		};
		
		let getLocalHistory = self.getLocalHistory = (params) => {
			//REQUIRED: params
			//OPTIONAL: params.ftpInfo
			//REQUIRED: params.path
			//REQUIRED: callback
			
			let ftpInfo = params.ftpInfo;
			let path = params.path;
			
			return localHistoryStore.get(STRINGIFY({
				ftpInfo : ftpInfo,
				path : path
			}));
		};
		
		let ftpNew = self.ftpNew = (ftpInfo, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: callback
			
			ftpNewHandler(ftpInfo, () => {
				SkyDesktop.Alert({
					msg : 'FTP 정보 생성에 실패하였습니다.'
				});
			}, () => {
				SkyDesktop.Alert({
					msg : '이미 존재하는 FTP 정보입니다.'
				});
			}, callback);
		};
		
		let ftpDestroy = self.ftpDestroy = (ftpInfo, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: callback
			
			ftpDestroyHandler(ftpInfo, () => {
				SkyDesktop.Alert({
					msg : 'FTP 정보 삭제에 실패하였습니다.'
				});
			}, callback);
		};
		
		let ftpLoadFiles = (ftpInfo, parentItem, path) => {
			
			let loadingBar = SkyDesktop.LoadingBar('lime');
			
			ftpLoadFilesHandler(ftpInfo, path, () => {
				loadingBar.done();
				SkyDesktop.Alert({
					msg : path + '의 파일 목록을 불러오는데 실패하였습니다.'
				});
			}, (folderNames, fileNames) => {
				loadingBar.done();
				
				EACH(folderNames, (folderName) => {
					
					let item;
					
					parentItem.addItem({
						key : path + '/' + folderName,
						item : item = DasomEditor.Folder({
							ftpInfo : ftpInfo,
							path : path + '/' + folderName,
							title : folderName,
							on : {
								open : () => {
									ftpLoadFiles(ftpInfo, item, path + '/' + folderName);
								}
							}
						})
					});
				});
				
				EACH(fileNames, (fileName) => {
					
					parentItem.addItem({
						key : path + '/' + fileName,
						item : DasomEditor.File({
							ftpInfo : ftpInfo,
							path : path + '/' + fileName,
							title : fileName,
							on : {
								doubletap : () => {
									
									let loadingBar = SkyDesktop.LoadingBar('lime');
									
									ftpLoadHandler(ftpInfo, path + '/' + fileName, () => {
										loadingBar.done();
										SkyDesktop.Alert({
											msg : path + '/' + fileName + '의 파일 목록을 불러오는데 실패하였습니다.'
										});
									}, (content) => {
										loadingBar.done();
										
										openEditor(getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
											ftpInfo : ftpInfo,
											title : fileName,
											path : path + '/' + fileName,
											content : content
										}));
									});
								}
							}
						})
					});
				});
			});
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
				
				let ftpInfo = fileItem.getFTPInfo();
				
				f(ftpInfo !== undefined ? ftpFileTree.getItem(ftpInfo.username + '@' + ftpInfo.host).getItems() : fileTree.getItems());
				
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
					
					let pathInfos = [];
					
					EACH(selectedFileItems, (selectedFileItem) => {
						pathInfos.push({
							ftpInfo : selectedFileItem.getFTPInfo(),
							path : selectedFileItem.getPath()
						});
					});
					
					copy(pathInfos);
				}
				
				// 붙혀넣기
				else if (key === 'v') {
					if (selectedFileItems.length > 0) {
						paste({
							ftpInfo : selectedFileItems[selectedFileItems.length - 1].getFTPInfo(),
							folderPath : selectedFileItems[selectedFileItems.length - 1].getFolderPath()
						});
					}
				}
				
				// 현재 탭 종료
				else if (key === 'w') {
					
					if (editorGroup.getActiveTab() !== undefined) {
						if (editorGroup.getActiveTab().fireEvent('close') !== false) {
							editorGroup.getActiveTab().remove();
						}
					}
				}
				
				// 현재 탭 저장
				else if (key === 's') {
					
					if (editorGroup.getActiveTab() !== undefined) {
						save(editorGroup.getActiveTab());
					}
				}
				
				// 검색
				else if (key === 'h') {
					if (selectedFileItems.length > 0) {
						search();
					}
				}
				
				// 좌측 탭으로 이동
				else if (e.getKey() === 'ArrowLeft') {
					let activeTabIndex = editorGroup.getActiveTabIndex();
					if (activeTabIndex > 0) {
						editorGroup.activeTab(activeTabIndex - 1);
					}
				}
				
				// 우측 탭으로 이동
				else if (e.getKey() === 'ArrowRight') {
					let activeTabIndex = editorGroup.getActiveTabIndex();
					if (activeTabIndex < editorGroup.getAllTabs().length - 1) {
						editorGroup.activeTab(activeTabIndex + 1);
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
							remove({
								ftpInfo : selectedFileItem.getFTPInfo(),
								path : selectedFileItem.getPath()
							});
						});
					});
				}
			}
			
			// 열기
			if (e.getKey() === 'Enter') {
				
				if (UUI.CONFIRM.getCount() === 0 && selectedFileItems.length > 0) {
					
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
							fromFTPInfo : selectedFileItem.getFTPInfo(),
							toFTPInfo : selectedFileItem.getFTPInfo(),
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
			}, (findText) => {
				
				if (findText !== '') {
					
					let tab;
					let fileTree;
					
					let foundInfos = [];
					
					addTab(tab = SkyDesktop.Tab({
						style : {
							position : 'relative',
							overflow : 'hidden'
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
									EVENT.fireAll('resize');
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
											innerSave(undefined, info.path, info.content.replace(new RegExp(findText, 'g'), changeText), () => {
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
					
					fileTree.addStyle({
						height : '100%',
						overflowY : 'scroll',
						paddingBottom : 0
					});
					
					let search = (folderPath, folderNames, fileNames) => {
						
						EACH(folderNames, (folderName) => {
							loadFiles(folderPath + '/' + folderName, (folderNames, fileNames) => {
								search(folderPath + '/' + folderName, folderNames, fileNames)
							});
						});
						
						EACH(fileNames, (fileName) => {
							
							let path = folderPath + '/' + fileName;
							
							load({
								path : path
							}, (content) => {
								
								foundInfos.push({
									path : path,
									content : content
								});
								
								let foundLineInfos = [];
								
								EACH(content.split('\n'), (line, lineNumber) => {
									lineNumber += 1;
									
									if (line.toLowerCase().indexOf(findText.toLowerCase()) !== -1) {
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
											title : path.substring(path.lastIndexOf('/') + 1)
										})
									});
									
									EACH(foundLineInfos, (info) => {
										foundFile.addItem({
											key : path + ':' + info.lineNumber,
											item : DasomEditor.FoundLine({
												path : path,
												findText : findText,
												lineNumber : info.lineNumber,
												line : info.line.trim(),
												on : {
													doubletap : () => {
														loadAndOpenEditor(path, (info.lineNumber - 1 - 10) * 17, findText);
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
						
						if (item.getFTPInfo() === undefined) {
							
							if (item.checkIsInstanceOf(DasomEditor.Folder) === true) {
								loadFiles(item.getPath(), (folderNames, fileNames) => {
									search(item.getPath(), folderNames, fileNames)
								});
							}
							
							else if (item.checkIsInstanceOf(DasomEditor.File) === true) {
								search(item.getFolderPath(), [], [item.getTitle()]);
							}
						}
					});
				}
			});
		};
	}
});