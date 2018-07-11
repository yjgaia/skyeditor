DasomEditorServer.Home = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let editorStore = DasomEditorServer.STORE('editorStore');
		let folderOpenedStore = DasomEditorServer.STORE('folderOpenedStore');
		
		let apiRoom = DasomEditorServer.ROOM('API');
		
		let clipboardPathInfos = [];
		
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
										
										else {
											SkyDesktop.Alert({
												msg : '비밀번호가 틀렸습니다.'
											});
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
					save : (path, content, buffer, errorHandler, callback, isFindAndReplace) => {
						//OPTIONAL: path
						//OPTIONAL: content
						//OPTIONAL: buffer
						//REQUIRED: errorHandler
						//OPTIONAL: callback
						//OPTIONAL: isFindAndReplace
						
						NEXT([(next) => {
							
							if (path === undefined) {
								
								// 저장 위치 선택 창 띄우기
								DasomEditor.CreateSelectFolderPopup(folderOpenedStore, next);
							}
							
							else {
								next(path);
							}
						},
						
						() => {
							return (path) => {
								
								//TODO: 버퍼 저장 구현해야함
								
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
						
						apiRoom.send({
							methodName : 'createFolder',
							data : path
						}, (result) => {
							if (result.errorMsg !== undefined) {
								errorHandler(result.errorMsg);
							} else {
								callback();
							}
						});
					},
					
					// 파일의 위치를 변경합니다.
					move : (from, to, errorHandler, callback) => {
						//REQUIRED: from
						//REQUIRED: to
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						apiRoom.send({
							methodName : 'move',
							data : {
								from : from,
								to : to
							}
						}, (result) => {
							if (result.errorMsg !== undefined) {
								errorHandler(result.errorMsg);
							} else {
								callback();
							}
						});
					},
					
					// 파일을 복사합니다.
					clone : (from, to, errorHandler, callback) => {
						//REQUIRED: from
						//REQUIRED: to
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						apiRoom.send({
							methodName : 'clone',
							data : {
								from : from,
								to : to
							}
						}, (result) => {
							if (result.errorMsg !== undefined) {
								errorHandler(result.errorMsg);
							} else {
								callback();
							}
						});
					},
					
					// 파일을 삭제합니다.
					remove : (path, errorHandler, callback) => {
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						apiRoom.send({
							methodName : 'remove',
							data : path
						}, (result) => {
							if (result.errorMsg !== undefined) {
								errorHandler(result.errorMsg);
							} else {
								callback();
							}
						});
					},
					
					// 새 FTP 정보를 생성합니다.
					ftpNew : (ftpInfo, errorHandler, existedHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: errorHandler
						//REQUIRED: existedHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.checkExists(ftpInfo.username + '@' + ftpInfo.host, (exists) => {
							
							if (exists === true) {
								existedHandler();
							}
							
							else {
								
								DasomEditorServer.FTPModel.create({
									id : ftpInfo.username + '@' + ftpInfo.host,
									title : ftpInfo.title,
									host : ftpInfo.host,
									port : ftpInfo.port,
									protocol : ftpInfo.protocol,
									username : ftpInfo.username,
									password : ftpInfo.password,
									privateKey : ftpInfo.privateKey
								}, () => {
									callback();
								});
							}
						});
					},
					
					// FTP 정보를 파기합니다.
					ftpDestroy : (ftpInfo, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.remove(ftpInfo.username + '@' + ftpInfo.host, {
							notExists : errorHandler,
							error : errorHandler,
							success : callback
						});
					},
					
					// FTP에 연결합니다.
					ftpConnect : (ftpInfo, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.connect(ftpInfo, {
							error : errorHandler,
							success : callback
						});
					},
					
					// FTP로부터 파일 목록을 가져옵니다.
					ftpLoadFiles : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.loadFiles({
							ftpInfo : ftpInfo,
							path : path
						}, {
							error : errorHandler,
							success : callback
						});
					},
					
					// FTP로부터 파일의 내용을 불러옵니다.
					ftpLoad : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.loadFile({
							ftpInfo : ftpInfo,
							path : path
						}, {
							error : errorHandler,
							success : callback
						});
					},
					
					// FTP로부터 파일의 정보를 가져옵니다.
					ftpGetInfo : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.getFileInfo({
							ftpInfo : ftpInfo,
							path : path
						}, {
							error : errorHandler,
							success : callback
						});
					},
					
					// FTP에 파일이 존재하는지 확인합니다.
					ftpCheckExists : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.checkFileExists({
							ftpInfo : ftpInfo,
							path : path
						}, {
							error : errorHandler,
							success : callback
						});
					},
					
					// FTP에 파일을 저장합니다.
					ftpSave : (ftpInfo, path, content, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: content
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.saveFile({
							ftpInfo : ftpInfo,
							path : path,
							content : content
						}, {
							error : errorHandler,
							success : callback
						});
					},
					
					// FTP에 폴더를 생성합니다.
					ftpCreateFolder : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.createFolder({
							ftpInfo : ftpInfo,
							path : path
						}, {
							error : errorHandler,
							success : callback
						});
					},
					
					// FTP에서 파일을 이동합니다.
					ftpMove : (fromFTPInfo, toFTPInfo, from, to, errorHandler, callback) => {
						//REQUIRED: fromFTPInfo
						//REQUIRED: toFTPInfo
						//REQUIRED: from
						//REQUIRED: to
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.moveFile({
							fromFTPInfo : fromFTPInfo,
							toFTPInfo : toFTPInfo,
							from : from,
							to : to
						}, {
							error : errorHandler,
							success : callback
						});
					},
					
					// FTP에서 파일을 복사합니다.
					ftpClone : (fromFTPInfo, toFTPInfo, from, to, errorHandler, callback) => {
						//REQUIRED: fromFTPInfo
						//REQUIRED: toFTPInfo
						//REQUIRED: from
						//REQUIRED: to
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.cloneFile({
							fromFTPInfo : fromFTPInfo,
							toFTPInfo : toFTPInfo,
							from : from,
							to : to
						}, {
							error : errorHandler,
							success : callback
						});
					},
					
					// FTP에서 파일을 삭제합니다.
					ftpRemove : (ftpInfo, path, errorHandler, callback) => {
						//REQUIRED: ftpInfo
						//REQUIRED: path
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						DasomEditorServer.FTPModel.removeFile({
							ftpInfo : ftpInfo,
							path : path
						}, {
							error : errorHandler,
							success : callback
						});
					},
					
					// 경로를 클립보드에 복사합니다.
					copy : (pathInfos) => {
						//REQUIRED: pathInfos
						
						clipboardPathInfos = pathInfos;
						
						if (pathInfos.length > 0) {
							
							let text = '';
							
							EACH(pathInfos, (pathInfo, i) => {
								if (i > 0) {
									text += '\n';
								}
								let fileName = pathInfo.path.substring(pathInfo.path.lastIndexOf('/') + 1);
								if (fileName.indexOf('.') !== -1) {
									fileName = fileName.substring(0, fileName.indexOf('.'));
								}
								text += fileName;
							});
							
							let textarea = TEXTAREA({
								style : {
									position : 'fixed',
									left : -999999,
									top : -999999
								},
								value : text
							}).appendTo(BODY);
							
							textarea.getEl().select();
							document.execCommand('copy');
							
							textarea.remove();
						}
					},
					
					// 클립보드에서 복사한 경로를 붙혀넣기합니다.
					paste : (ftpInfo, folderPath, errorHandler, callback) => {
						//OPTIONAL: ftpInfo
						//REQUIRED: folderPath
						//REQUIRED: errorHandler
						//REQUIRED: callback
						
						// -> FTP로
						if (ftpInfo !== undefined) {
							
							let ftpFolderPaths = [];
							let ftpFilePaths = [];
							
							NEXT(clipboardPathInfos, [
							(clipboardPathInfo, next) => {
								
								let path = clipboardPathInfo.path;
								
								let fileName = path.substring(path.lastIndexOf('/') + 1);
								
								// FTP -> FTP
								if (clipboardPathInfo.ftpInfo !== undefined) {
									
									RUN((f) => {
										
										NEXT([
										(next) => {
											
											// 이미 존재하는가?
											DasomEditorServer.FTPModel.checkFileExists({
												ftpInfo : ftpInfo,
												path : folderPath + '/' + fileName
											}, (isExists) => {
												
												if (isExists === true) {
													
													// 같은 폴더면 (2)를 붙힙니다.
													if (clipboardPathInfo.ftpInfo === ftpInfo && path.substring(0, path.lastIndexOf('/')) === folderPath) {
														
														let extname = '';
														let index = fileName.lastIndexOf('.');
														
														if (index !== -1) {
															extname = fileName.substring(index);
															fileName = fileName.substring(0, index);
														}
														
														fileName = fileName + ' (2)' + extname;
														
														f();
													}
													
													// 덮어씌울지 물어봅니다.
													else {
														SkyDesktop.Confirm({
															msg : fileName + '이(가) 존재합니다. 덮어쓰시겠습니까?'
														}, {
															ok : () => {
																next();
															},
															cancel : () => {
																callback();
															}
														});
													}
												}
												
												else {
													next();
												}
											});
										},
										
										() => {
											return () => {
												
												DasomEditorServer.FTPModel.checkIsFolder({
													ftpInfo : clipboardPathInfo.ftpInfo,
													path : path
												}, {
													error : errorHandler,
													success : (isFolder) => {
														
														// 폴더 복사
														if (isFolder === true) {
															
															if (clipboardPathInfo.ftpInfo === ftpInfo) {
																
																ftpFolderPaths.push(folderPath + '/' + fileName);
																
																DasomEditorServer.FTPModel.copyFolder({
																	ftpInfo : ftpInfo,
																	from : path,
																	to : folderPath + '/' + fileName
																}, {
																	error : errorHandler,
																	success : next
																});
															}
															
															else {
																// 다른 FTP 끼리 폴더 복사
																
																f = (path, folderPath) => {
																	
																	// 폴더의 내용들을 읽어들임
																	DasomEditorServer.FTPModel.loadFiles({
																		ftpInfo : clipboardPathInfo.ftpInfo,
																		path : path
																	}, {
																		error : errorHandler,
																		success : (folderNames, fileNames) => {
																			
																			// 폴더는 다시 반복
																			EACH(folderNames, (folderName) => {
																				f(path + '/' + folderName, folderPath + '/' + folderName);
																			});
																			
																			// 파일은 내용을 불러와 복사
																			NEXT(fileNames, (fileName, next) => {
																				
																				DasomEditorServer.FTPModel.load({
																					ftpInfo : clipboardPathInfo.ftpInfo,
																					path : path + '/' + fileName
																				}, {
																					error : errorHandler,
																					notExists : errorHandler,
																					success : (buffer) => {
																						
																						DasomEditorServer.FTPModel.saveFile({
																							ftpInfo : ftpInfo,
																							path : folderPath + '/' + fileName,
																							buffer : buffer
																						}, {
																							error : errorHandler,
																							success : next
																						});
																					}
																				});
																			});
																		}
																	});
																};
																f(path, folderPath + '/' + fileName);
																
																ftpFolderPaths.push(folderPath + '/' + fileName);
																
																next();
															}
														}
														
														// 파일 복사
														else {
															
															ftpFilePaths.push(folderPath + '/' + fileName);
															
															if (clipboardPathInfo.ftpInfo === ftpInfo) {
																DasomEditorServer.FTPModel.copyFile({
																	ftpInfo : ftpInfo,
																	from : path,
																	to : folderPath + '/' + fileName
																}, {
																	error : errorHandler,
																	success : next
																});
															}
															
															else {
																
																DasomEditorServer.FTPModel.load({
																	ftpInfo : clipboardPathInfo.ftpInfo,
																	path : path
																}, {
																	error : errorHandler,
																	notExists : errorHandler,
																	success : (buffer) => {
																		
																		DasomEditorServer.FTPModel.saveFile({
																			ftpInfo : ftpInfo,
																			path : folderPath + '/' + fileName,
																			buffer : buffer
																		}, {
																			error : errorHandler,
																			success : next
																		});
																	}
																});
															}
														}
													}
												});
											};
										}]);
									});
								}
								
								// 로컬 -> FTP
								else {
									
									RUN((f) => {
										
										NEXT([
										(next) => {
											
											// 이미 존재하는가?
											DasomEditorServer.FTPModel.checkFileExists({
												ftpInfo : ftpInfo,
												path : folderPath + '/' + fileName
											}, {
												error : errorHandler,
												success : (isExists) => {
													
													if (isExists === true) {
														
														// 같은 폴더면 (2)를 붙힙니다.
														if (path.substring(0, path.lastIndexOf('/')) === folderPath) {
															
															let extname = '';
															let index = fileName.lastIndexOf('.');
															
															if (index !== -1) {
																extname = fileName.substring(index);
																fileName = fileName.substring(0, index);
															}
															
															fileName = fileName + ' (2)' + extname;
															
															f();
														}
														
														// 덮어씌울지 물어봅니다.
														else {
															SkyDesktop.Confirm({
																msg : fileName + '이(가) 존재합니다. 덮어쓰시겠습니까?'
															}, {
																ok : () => {
																	next();
																},
																cancel : () => {
																	callback();
																}
															});
														}
													}
													
													else {
														next();
													}
												}
											});
										},
										
										(next) => {
											return () => {
												
												apiRoom.send({
													methodName : 'checkIsFolder',
													data : path
												}, (isFolder) => {
													
													// 폴더 복사
													if (isFolder === true) {
														// 로컬 -> FTP 폴더 복사
														
														f = (path, folderPath) => {
															
															// 폴더는 다시 반복
															apiRoom.send({
																methodName : 'loadFiles',
																data : path
															}, (result) => {
																if (result.errorMsg !== undefined) {
																	errorHandler(result.errorMsg);
																} else {
																	
																	EACH(result.folderNames, (folderName) => {
																		f(path + '/' + folderName, folderPath + '/' + folderName);
																	});
																	
																	NEXT(result.fileNames, (fileName, next) => {
																		
																		apiRoom.send({
																			methodName : 'load',
																			data : path + '/' + fileName
																		}, (result) => {
																			if (result.errorMsg !== undefined) {
																				errorHandler(result.errorMsg);
																			} else {
																				DasomEditorServer.FTPModel.saveFile({
																					ftpInfo : ftpInfo,
																					path : folderPath + '/' + fileName,
																					content : result.content
																				}, {
																					error : errorHandler,
																					success : next
																				});
																			}
																		});
																	});
																}
															});
														};
														f(path, folderPath + '/' + fileName);
														
														ftpFolderPaths.push(folderPath + '/' + fileName);
														
														next();
													}
													
													// 파일 복사
													else {
														
														ftpFilePaths.push(folderPath + '/' + fileName);
														
														apiRoom.send({
															methodName : 'load',
															data : path
														}, (result) => {
															if (result.errorMsg !== undefined) {
																errorHandler(result.errorMsg);
															} else {
																DasomEditorServer.FTPModel.saveFile({
																	ftpInfo : ftpInfo,
																	path : folderPath + '/' + fileName,
																	content : result.content
																}, {
																	error : errorHandler,
																	success : next
																});
															}
														});
													}
												});
											};
										},
										
										() => {
											return () => {
												callback(ftpFolderPaths, ftpFilePaths);
											};
										}]);
									});
								}
							}]);
						}
						
						// -> 로컬로
						else {
							
							NEXT(clipboardPathInfos, [
							(clipboardPathInfo, next) => {
								
								let path = clipboardPathInfo.path;
								
								let fileName = path.substring(path.lastIndexOf('/') + 1);
								
								// FTP -> 로컬
								if (clipboardPathInfo.ftpInfo !== undefined) {
									
									RUN((f) => {
										
										NEXT([
										(next) => {
											
											// 이미 존재하는가?
											apiRoom.send({
												methodName : 'checkExists',
												data : folderPath + '/' + fileName
											}, (isExists) => {
												
												if (isExists === true) {
													
													// 같은 폴더면 (2)를 붙힙니다.
													if (path.substring(0, path.lastIndexOf('/')) === folderPath) {
														
														let extname = '';
														let index = fileName.lastIndexOf('.');
														
														if (index !== -1) {
															extname = fileName.substring(index);
															fileName = fileName.substring(0, index);
														}
														
														fileName = fileName + ' (2)' + extname;
														
														f();
													}
													
													// 덮어씌울지 물어봅니다.
													else {
														SkyDesktop.Confirm({
															msg : fileName + '이(가) 존재합니다. 덮어쓰시겠습니까?'
														}, {
															ok : () => {
																next();
															},
															cancel : () => {
																callback();
															}
														});
													}
												}
												
												else {
													next();
												}
											});
										},
										
										() => {
											return () => {
												
												DasomEditorServer.FTPModel.checkIsFolder({
													ftpInfo : clipboardPathInfo.ftpInfo,
													path : path
												}, {
													error : errorHandler,
													success : (isFolder) => {
														
														// 폴더 복사
														if (isFolder === true) {
															// FTP -> 로컬 폴더 복사
															
															apiRoom.send({
																methodName : 'createFolder',
																data : folderPath + '/' + fileName
															}, (result) => {
																if (result.errorMsg !== undefined) {
																	errorHandler(result.errorMsg);
																} else {
																	
																	f = (path, folderPath) => {
																		
																		// 폴더의 내용들을 읽어들임
																		DasomEditorServer.FTPModel.loadFiles({
																			ftpInfo : clipboardPathInfo.ftpInfo,
																			path : path
																		}, {
																			error : errorHandler,
																			success : (folderNames, fileNames) => {
																				
																				// 폴더는 다시 반복
																				EACH(folderNames, (folderName) => {
																					f(path + '/' + folderName, folderPath + '/' + folderName);
																				});
																				
																				// 파일은 내용을 불러와 복사
																				NEXT(fileNames, (fileName, next) => {
																					
																					DasomEditorServer.FTPModel.loadFile({
																						ftpInfo : clipboardPathInfo.ftpInfo,
																						path : path + '/' + fileName
																					}, {
																						error : errorHandler,
																						notExists : errorHandler,
																						success : (content) => {
																							
																							apiRoom.send({
																								methodName : 'save',
																								data : {
																									path : folderPath + '/' + fileName,
																									content : content
																								}
																							}, (result) => {
																								if (result.errorMsg !== undefined) {
																									errorHandler(result.errorMsg);
																								} else {
																									next();
																								}
																							});
																						}
																					});
																				});
																			}
																		});
																	};
																	f(path, folderPath + '/' + fileName);
																	
																	next();
																}
															});
														}
														
														// 파일 복사
														else {
															
															DasomEditorServer.FTPModel.loadFile({
																ftpInfo : clipboardPathInfo.ftpInfo,
																path : path
															}, {
																error : errorHandler,
																notExists : errorHandler,
																success : (content) => {
																	
																	apiRoom.send({
																		methodName : 'save',
																		data : {
																			path : folderPath + '/' + fileName,
																			content : content
																		}
																	}, (result) => {
																		if (result.errorMsg !== undefined) {
																			errorHandler(result.errorMsg);
																		} else {
																			next();
																		}
																	});
																}
															});
														}
													}
												});
											};
										}]);
									});
								}
								
								// 로컬 -> 로컬
								else {
									
									RUN((f) => {
										
										NEXT([
										(next) => {
											
											// 이미 존재하는가?
											apiRoom.send({
												methodName : 'checkExists',
												data : folderPath + '/' + fileName
											}, (isExists) => {
												
												if (isExists === true) {
													
													// 같은 폴더면 (2)를 붙힙니다.
													if (path.substring(0, path.lastIndexOf('/')) === folderPath) {
														
														let extname = '';
														let index = fileName.lastIndexOf('.');
														
														if (index !== -1) {
															extname = fileName.substring(index);
															fileName = fileName.substring(0, index);
														}
														
														fileName = fileName + ' (2)' + extname;
														
														f();
													}
													
													// 덮어씌울지 물어봅니다.
													else {
														SkyDesktop.Confirm({
															msg : fileName + '이(가) 존재합니다. 덮어쓰시겠습니까?'
														}, {
															ok : () => {
																next();
															},
															cancel : () => {
																callback();
															}
														});
													}
												}
												
												else {
													next();
												}
											});
										},
										
										() => {
											return () => {
												
												apiRoom.send({
													methodName : 'clone',
													data : {
														from : path,
														to : folderPath + '/' + fileName
													}
												}, (result) => {
													if (result.errorMsg !== undefined) {
														errorHandler(result.errorMsg);
													} else {
														next();
													}
												});
											};
										}]);
									});
								}
							},
							
							() => {
								return () => {
									callback();
								};
							}]);
						}
					},
					
					// 파일의 크기가 너무 클 때
					overFileSize : (ftpInfo, path) => {
						//OPTIONAL: ftpInfo
						//REQUIRED: path
						
						SkyDesktop.Confirm({
							msg : '파일의 크기가 너무 커 열 수 없습니다. 다운로드 하시겠습니까?'
						}, () => {
							
							NEXT([
							(next) => {
								
								if (ftpInfo !== undefined) {
									
									DasomEditorServer.FTPModel.loadFile({
										ftpInfo : ftpInfo,
										path : path
									}, {
										error : () => {
											// ignore.
										},
										notExists : () => {
											// ignore.
										},
										success : next
									});
									
								} else {
									
									apiRoom.send({
										methodName : 'load',
										data : path
									}, (result) => {
										if (result.errorMsg === undefined) {
											next(result.content);
										}
									});
								}
							},
							
							() => {
								return (content) => {
									
									let el = document.createElement('a');
									el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
									el.setAttribute('download', path.substring(path.lastIndexOf('/') + 1));
									
									el.style.display = 'none';
									document.body.appendChild(el);
									
									el.click();
									
									document.body.removeChild(el);
								};
							}]);
						});
					},
					
					// Git으로부터 저장소를 복사합니다.
					gitClone : (params, handlers) => {
						//REQUIRED: params
						//REQUIRED: handlers
						
						apiRoom.send({
							methodName : 'gitClone',
							data : params
						}, (result) => {
							if (result.errorMsg !== undefined) {
								handlers.error(result.errorMsg);
							} else {
								handlers.success();
							}
						});
					},
					
					// 원격 저장소와의 차이를 가져옵니다.
					gitDiff : (params, handlers) => {
						//REQUIRED: params
						//REQUIRED: handlers
						
						apiRoom.send({
							methodName : 'gitDiff',
							data : params
						}, (result) => {
							if (result.errorMsg !== undefined) {
								handlers.errorHandler(result.errorMsg);
							} else {
								handlers.success(result.newFilePaths, result.updatedFilePaths, result.movedFilePaths, result.removedFilePaths);
							}
						});
					},
					
					// Git으로부터 Pull 합니다.
					gitPull : (params, handlers) => {
						//REQUIRED: params
						//REQUIRED: handlers
						
						apiRoom.send({
							methodName : 'gitPull',
							data : params
						}, (result) => {
							if (result.errorMsg !== undefined) {
								handlers.errorHandler(result.errorMsg);
							} else {
								handlers.success();
							}
						});
					},
					
					// Git에 Push 합니다.
					gitPush : (params, handlers) => {
						//REQUIRED: params
						//REQUIRED: handlers
						
						apiRoom.send({
							methodName : 'gitPush',
							data : params
						}, (result) => {
							if (result.errorMsg !== undefined) {
								handlers.errorHandler(result.errorMsg);
							} else {
								handlers.success();
							}
						});
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
					
					// 폴더 생성
					let createFolderItem = (path, folderName) => {
						
						let isOpened = folderOpenedStore.get(path);
						
						// 폴더 관리 룸
						let room = DasomEditorServer.ROOM('Folder' + path);
						
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
								},
								
								close : () => {
									
									folderOpenedStore.remove(path);
									
									folder.removeAllItems();
								},
								
								remove : () => {
									room.exit();
									room = undefined;
								}
							}
						});
						
						// 새 폴더 생성
						room.on('newFolder', (folderName) => {
							
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
						});
						
						// 새 파일 생성
						room.on('newFile', (fileName) => {
							folder.addItem({
								key : path + '/' + fileName,
								item : createFileItem(path + '/' + fileName, fileName)
							});
						});
						
						// 폴더 제거
						room.on('remove', () => {
							
							folderOpenedStore.remove(path);
							
							folder.remove();
						});
						
						return folder;
					};
					
					// 파일 생성
					let createFileItem = (path, fileName) => {
						
						// 파일 관리 룸
						let room = DasomEditorServer.ROOM('File' + path);
						
						let file = DasomEditor.File({
							path : path,
							title : fileName
						});
						
						file.on('remove', () => {
							room.exit();
							room = undefined;
						});
						
						// 파일 제거
						room.on('remove', () => {
							
							let opendEditor = DasomEditor.IDE.getOpenedEditor(path);
							if (opendEditor !== undefined) {
								opendEditor.remove();
							}
							
							file.remove();
						});
						
						return file;
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
								
								if (count < 50) {
									
									while (total - folderNames.length < fileNames.length) {
										let fileName = fileNames[total - folderNames.length];
										
										folder.addItem({
											key : path + '/' + fileName,
											item : createFileItem(path + '/' + fileName, fileName)
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
					
					// 워크스페이스 관리 룸
					let room = DasomEditorServer.ROOM('Folder/');
					
					DasomEditor.IDE.setWorkspacePath('');
					
					// 워크스페이스 관리 룸
					let workspaceRoom = DasomEditorServer.ROOM('Folder');
					
					// 새 폴더 생성
					workspaceRoom.on('newFolder', (folderName) => {
						
						let folderItem = createFolderItem('/' + folderName, folderName);
						
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
						
						DasomEditor.IDE.addItem({
							key : '/' + folderName,
							item : folderItem
						});
					});
					
					// 새 파일 생성
					workspaceRoom.on('newFile', (fileName) => {
						DasomEditor.IDE.addItem({
							key : '/' + fileName,
							item : createFileItem('/' + fileName, fileName)
						});
					});
				});
				
				// FTP 정보 로드
				DasomEditorServer.FTPModel.find(EACH((ftpInfo) => {
					DasomEditor.IDE.addFTPItem(ftpInfo);
				}));
			};
		}])
	}
});
