DasomEditorServer.Home = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let editorStore = DasomEditorServer.STORE('editorStore');
		let folderOpenedStore = DasomEditorServer.STORE('folderOpenedStore');
		let ftpInfoStore = DasomEditorServer.STORE('ftpInfoStore');
		
		let apiRoom = DasomEditorServer.ROOM('API');
		
		NEXT([
		
		// 인증 유지 확인
		(next) => {
			
			if (editorStore.get('password') !== undefined) {
				
				apiRoom.send({
					methodName : 'auth',
					data : editorStore.get('password')
				}, (isAuthed) => {
					if (isAuthed === true) {
						next.next();
					} else {
						next();
					}
				});
				
			} else {
				next();	
			}
		},
		
		// 인증 처리
		(next) => {
			return () => {
				
				let form;
				let modal = UUI.MODAL({
					style : {
						zIndex : 999,
						backgroundColor : '#fff',
						color : '#333',
						textAlign : 'center',
						border : '1px solid #333',
						borderRadius : 5,
						boxShadow : '0 0 5px rgba(0,0,0,0.3)',
						onDisplayResize : (width, height) => {
		
							if (width > 300) {
								return {
									width : 280
								};
							} else {
								return {
									width : '90%'
								};
							}
						}
					},
					c : [DIV({
						style : {
							padding : 20,
							paddingBottom : 10
						},
						c : ['비밀번호를 입력해주세요.', form = FORM({
							style : {
								marginTop : 10
							},
							c : [UUI.FULL_INPUT({
								style : {
									borderTop : '1px solid #999',
									padding : 8,
									border : '1px solid #999',
									borderRadius : 4
								},
								name : 'password',
								type : 'password',
								placeholder : '비밀번호'
							}), UUI.FULL_CHECKBOX({
								style : {
									padding : 8
								},
								name : 'isRememberMe',
								label : '인증을 유지합니다.'
							})],
							on : {
								submit : (e) => {
									
									let data = form.getData();
									
									apiRoom.send({
										methodName : 'auth',
										data : data.password
									}, (isAuthed) => {
										if (isAuthed === true) {
											
											// 인증 유지
											if (data.isRememberMe === true) {
												editorStore.save({
													name : 'password',
													value : data.password
												});
											}
											
											modal.close();
											next();
										}
									});
								}
							}
						})]
					}), UUI.BUTTON({
						style : {
							borderTop : '1px solid #999',
							padding : '11px 0',
							backgroundColor : '#e0e1e2',
							color : '#333',
							fontWeight : 'bold',
							borderRadius : '0 0 0 5px'
						},
						title : '접속',
						on : {
							tap : () => {
								form.submit();
							}
						}
					})]
				});
			};
		},
		
		() => {
			return () => {
				
				// 새로고침 이전 메시지
				BROWSER_CONFIG.beforeUnloadMessage = MSG({
					ko : '페이지를 이동하려 합니다.\n\n서버가 재시작 되었거나 인터넷이 끊어졌을 수 있습니다. 작성중인 내용을 다른곳에 저장하고 새로고침해 주시기 바랍니다.'
				});
				
				// 새로고침 중단
				window.addEventListener('beforeunload', (e) => {
					e.returnValue = null;
					return null;
				});
				
				DasomEditor.IDE.init({
					
					// 홈 화면 띄우기
					showHome : () => {
						DasomEditor.IDE.openEditor(DasomEditor.HomeTab(BROWSER_CONFIG.DasomEditor.homepage + '?version=' + CONFIG.version));
					},
					
					// 파일 목록을 불러옵니다.
					loadFiles : (path, errorHandler, callback) => {
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						let folderNames = [];
						let fileNames = [];
						
						apiRoom.send({
							methodName : 'loadFiles',
							data : path
						}, (result) => {
							if (result.errorMsg !== undefined) {
								errorHandler(result.errorMsg);
							} else {
								callback(result.folderNames, result.fileNames);
							}
						});
					},
					
					// 단일 파일의 내용을 불러옵니다.
					load : (path, errorHandler, callback) => {
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						apiRoom.send({
							methodName : 'load',
							data : path
						}, (result) => {
							if (result.errorMsg !== undefined) {
								errorHandler(result.errorMsg);
							} else {
								callback(result.content);
							}
						});
					},
					
					// 파일이 존재하는지 확인합니다.
					checkExists : (path, callback) => {
						//REQUIRED: path
						//REQUIRED: callback
						
						apiRoom.send({
							methodName : 'checkExists',
							data : path
						}, callback);
					},
					
					// 파일의 정보를 가져옵니다.
					getInfo : (path, errorHandler, callback) => {
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						apiRoom.send({
							methodName : 'getInfo',
							data : path
						}, (result) => {
							if (result.errorMsg !== undefined) {
								errorHandler(result.errorMsg);
							} else {
								callback(result.info);
							}
						});
					},
					
					// 파일의 내용을 저장합니다.
					save : (path, content, errorHandler, callback, isFindAndReplace) => {
						//OPTIONAL: path
						//REQUIRED: content
						//REQUIRED: errorHandler
						//OPTIONAL: callback
						//OPTIONAL: isFindAndReplace
						
						NEXT([(next) => {
							
							if (path === undefined) {
								
								//TODO:
							}
							
							else {
								next(path);
							}
						},
						
						() => {
							return (path) => {
								
								apiRoom.send({
									methodName : 'save',
									data : {
										path : path,
										content : content
									}
								}, (result) => {
									if (result.errorMsg !== undefined) {
										errorHandler(result.errorMsg);
									} else {
										callback(path);
									}
								});
							};
						}]);
					},
					
					// 폴더를 생성합니다.
					createFolder : (path, errorHandler, callback) => {
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// 파일의 위치를 변경합니다.
					move : (from, to, errorHandler, callback) => {
						//REQUIRED: from
						//REQUIRED: to
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// 파일을 복사합니다.
					clone : (from, to, errorHandler, callback) => {
						//REQUIRED: from
						//REQUIRED: to
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// 파일을 삭제합니다.
					remove : (path, errorHandler, callback) => {
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// 새 FTP 정보를 생성합니다.
					ftpNew : (ftpInfo, errorHandler, existedHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: errorHandler
						//REQUIRED: existedHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP 정보를 파기합니다.
					ftpDestroy : (ftpInfo, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP에 연결합니다.
					ftpConnect : (ftpInfo, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP로부터 파일 목록을 가져옵니다.
					ftpLoadFiles : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP로부터 파일의 내용을 불러옵니다.
					ftpLoad : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP로부터 파일의 정보를 가져옵니다.
					ftpGetInfo : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP에 파일이 존재하는지 확인합니다.
					ftpCheckExists : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP에 파일을 저장합니다.
					ftpSave : (ftpInfo, path, content, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: content
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP에 폴더를 생성합니다.
					ftpCreateFolder : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP에서 파일을 이동합니다.
					ftpMove : (fromFTPInfo, toFTPInfo, from, to, errorHandler, callback) => {
						//REQUIRED: fromFTPInfo
						//REQUIRED: toFTPInfo
						//REQUIRED: from
						//REQUIRED: to
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP에서 파일을 복사합니다.
					ftpClone : (fromFTPInfo, toFTPInfo, from, to, errorHandler, callback) => {
						//REQUIRED: fromFTPInfo
						//REQUIRED: toFTPInfo
						//REQUIRED: from
						//REQUIRED: to
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// FTP에서 파일을 삭제합니다.
					ftpRemove : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// 경로를 클립보드에 복사합니다.
					copy : (pathInfos) => {
						//REQUIRED: pathInfos
						
						//TODO:
					},
					
					// 클립보드에서 복사한 경로를 붙혀넣기합니다.
					paste : (ftpInfo, folderPath, errorHandler, callback) => {
						//OPTIONAL: ftpInfo
						//REQUIRED: folderPath
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						//TODO:
					},
					
					// 파일의 크기가 너무 클 때
					overFileSize : (path) => {
						//REQUIRED: path
						
						//TODO:
					},
					
					// Git으로부터 저장소를 복사합니다.
					gitClone : (params, handlers) => {
						//REQUIRED: params
						//REQUIRED: handlers
						
						//TODO:
					},
					
					// 원격 저장소와의 차이를 가져옵니다.
					gitDiff : (params, handlers) => {
						//REQUIRED: params
						//REQUIRED: handlers
						
						//TODO:
					},
					
					// Git으로부터 Pull 합니다.
					gitPull : (params, handlers) => {
						//REQUIRED: params
						//REQUIRED: handlers
						
						//TODO:
					},
					
					// Git에 Push 합니다.
					gitPush : (params, handlers) => {
						//REQUIRED: params
						//REQUIRED: handlers
						
						//TODO:
					}
				});
				
				// 로그아웃 메뉴 추가
				DasomEditor.IDE.addToolbarButton(SkyDesktop.ToolbarButton({
					icon : IMG({
						src : DasomEditor.R('icon/logout.png')
					}),
					title : '로그아웃',
					on : {
						tap : () => {
							editorStore.remove('password');
							location.reload();
						}
					}
				}));
				
				// 워크스페이스 파일들을 불러옵니다.
				RUN(() => {
					
					// 파일 변경을 감지하는 룸을 생성합니다.
					let createFileWatchingRoom = (path, addItem, removeItem) => {
						
						let room = DasomEditorServer.ROOM('File/' + path);
						
						//TODO:
						
						return room;
						/*
						return FS.watch(path, (eventType, fileName) => {
							
							if (eventType === 'rename') {
								
								CHECK_FILE_EXISTS(path + '/' + fileName, (exists) => {
									
									if (exists === true) {
										
										CHECK_IS_FOLDER(path + '/' + fileName, (isFolder) => {
											
											if (isFolder === true) {
												
												let folderItem = createFolderItem(path + '/' + fileName, fileName);
												
												if (path === workspacePath) {
													
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
												
												addItem({
													key : path + '/' + fileName,
													item : folderItem
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
											opendEditor.remove();
										}
									}
								});
							}
						});*/
					};
					
					// 폴더 생성
					let createFolderItem = (path, folderName) => {
						
						let isOpened = folderOpenedStore.get(path);
						
						let fileWatchingRoom;
						
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
									
									loadFolderFiles(path, folder, folder.close);
									
									if (fileWatchingRoom !== undefined) {
										fileWatchingRoom.exit();
									}
									
									fileWatchingRoom = createFileWatchingRoom(path, folder.addItem, folder.removeItem);
								},
								
								close : () => {
									
									folderOpenedStore.remove(path);
									
									fileWatchingRoom.exit();
									
									folder.removeAllItems();
								}
							}
						});
						
						return folder;
					};
					
					let loadFolderFiles = (path, folder, close) => {
						
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
								
								if (path !== '' && count < 50) {
									
									while (total - folderNames.length < fileNames.length) {
										let fileName = fileNames[total - folderNames.length];
										
										folder.addItem({
											key : path + '/' + fileName,
											item : DasomEditor.File({
												path : path + '/' + fileName,
												title : fileName
											})
										});
										
										total += 1;
										
										count += 1;
										if (path !== '' && count === 50) {
											break;
										}
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
					
					loadFolderFiles('', DasomEditor.IDE);
				});
				
				// FTP 정보 로드
				EACH(ftpInfoStore.all(), (ftpInfo) => {
					DasomEditor.IDE.addFTPItem(ftpInfo);
				});
			};
		}])
	}
});
