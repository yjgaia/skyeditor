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
		let saveHandler;
		let copyHandler;
		let pasteHandler;
		let removeHandler;
		let renameHandler;
		let getInfoHandler;
		
		let editorMap = {};
		let editorSettingStore = DasomEditor.STORE('editorSettingStore');
		let editorOpenedStore = DasomEditor.STORE('editorOpenedStore');
		
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
									saveHandler(activeTab);
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
			
			if (tab.checkIsInstanceOf(DasomEditor.Editor) === true) {
				
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
			
			loadHandler(path, {
				
				error : () => {
					editorOpenedStore.remove(path);
				},
				
				success : (path, content) => {
					
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
				}
			});
		};
		
		let fileTree;
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
								c : fileTree = SkyDesktop.FileTree(loadAndOpenEditor)
							}), SkyDesktop.Tab({
								isCannotClose : true,
								icon : IMG({
									src : DasomEditor.R('icon/ftp.png')
								}),
								title : 'FTP',
								c : 'test'
							})]
						})
					}), SkyDesktop.Tab({
						size : 77,
						c : editorGroup = SkyDesktop.TabGroup()
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
			//REQUIRED: params.save
			//REQUIRED: params.copy
			//REQUIRED: params.paste
			//REQUIRED: params.remove
			//REQUIRED: params.rename
			
			showHomeHandler = params.showHome;
			loadHandler = params.load;
			saveHandler = params.save;
			copyHandler = params.copy;
			pasteHandler = params.paste;
			removeHandler = params.remove;
			renameHandler = params.rename;
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
		
		let save = self.save = (activeTab) => {
			//REQUIRED: activeTab
			
			saveHandler(activeTab);
		};
		
		let copy = self.copy = (path) => {
			//REQUIRED: path
			
			copyHandler(path);
		};
		
		let paste = self.paste = (folderPath) => {
			//REQUIRED: folderPath
			
			pasteHandler(folderPath);
		};
		
		let remove = self.remove = (path) => {
			//REQUIRED: path
			
			SkyDesktop.Confirm({
				msg : '정말 삭제 하시겠습니까?'
			}, () => {
				
				let opendEditor = getOpenedEditor(path);
				if (opendEditor !== undefined) {
					opendEditor.remove();
				}
				
				removeHandler(path);
			});
		};
		
		let rename = self.rename = (params) => {
			//REQUIRED: params
			//REQUIRED: params.path
			//REQUIRED: params.newName
			
			let path = params.path;
			let newName = params.newName;
			
			renameHandler(path, newName);
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
	}
});
