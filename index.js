RUN(() => {
	
	let startFilePath = require('electron').remote.process.argv[1];
	
	let config = JSON.parse(READ_FILE({
		path : 'config.json',
		isSync : true
	}).toString());
	
	TITLE(config.name);
	
	const {shell, clipboard} = require('electron');
	const {dialog} = require('electron').remote;
	const ipcRenderer = require('electron').ipcRenderer;
	
	const FS = require('fs');
	const Path = require('path');
	const SEP = Path.sep;
	
	const Rimraf = require('rimraf');
	const exec = require('child_process').exec;
	
	let editorStore = STORE('editorStore');
	let folderOpenedStore = STORE('folderOpenedStore');
	let ftpInfoStore = STORE('ftpInfoStore');
	let saveCommandStore = STORE('saveCommandStore');
	
	ipcRenderer.send('winConfig', editorStore.get('winConfig'));
	ipcRenderer.on('winConfig', (e, winConfig) => {
		editorStore.save({
			name : 'winConfig',
			value : winConfig
		});
	});
	
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
	
	let clipboardPathInfos = [];
	
	DasomEditor.IDE.init({
		
		// 홈 화면 띄우기
		showHome : () => {
			DasomEditor.IDE.openEditor(DasomEditor.HomeTab(config.homepage + '?version=' + config.version));
		},
		
		// 파일 목록을 불러옵니다.
		loadFiles : (path, errorHandler, callback) => {
			//REQUIRED: path
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let folderNames = [];
			let fileNames = [];
			
			FS.readdir(path, (error, names) => {
				
				if (error !== TO_DELETE) {
					errorHandler(error.toString());
				} else {
					
					PARALLEL(names, [
					(name, done) => {

						if (name !== '.' && name !== '..' && name !== '.git') {

							FS.stat(path + '/' + name, (error, stats) => {

								if (error !== TO_DELETE) {
									errorHandler(error.toString());
								} else {

									if (stats.isDirectory() === true) {
										folderNames.push(name);
									} else {
										fileNames.push(name);
									}

									done();
								}
							});

						} else {
							done();
						}
					},

					() => {
						callback(folderNames, fileNames);
					}]);
				}
			});
		},
		
		// 단일 파일의 내용을 불러옵니다.
		load : (path, errorHandler, callback) => {
			//REQUIRED: path
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			READ_FILE(path, {
				notExists : errorHandler,
				error : errorHandler,
				success : (buffer) => {
					callback(buffer.toString());
				}
			});
		},
		
		// 파일이 존재하는지 확인합니다.
		checkExists : (path, callback) => {
			//REQUIRED: path
			//REQUIRED: callback
			
			CHECK_FILE_EXISTS(path, callback);
		},
		
		// 파일의 정보를 가져옵니다.
		getInfo : (path, errorHandler, callback) => {
			//REQUIRED: path
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			GET_FILE_INFO(path, {
				notExists : errorHandler,
				error : errorHandler,
				success : callback
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
					}, {
						error : errorHandler,
						success : () => {
							
							// 검색 후 변경이 아닐때만 저장 시 명령 실행
							if (isFindAndReplace !== true) {
								
								let fileName = path.substring(path.lastIndexOf('/') + 1);
								
								let extname = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
								
								let command = saveCommandStore.get(extname);
								
								if (command !== undefined && VALID.notEmpty(content) === true) {
									
									let folderPath = path.substring(0, path.lastIndexOf('/'));
									
									let workspacePath = DasomEditor.IDE.getWorkspacePath();
									
									let projectFolderPath = folderPath.substring(workspacePath.length + 1);
									projectFolderPath = workspacePath + '/' + projectFolderPath.substring(0, projectFolderPath.indexOf('/'));
									
									command = command.replace(/\{\{workspace\}\}/g, workspacePath);
									command = command.replace(/\{\{projectFolder\}\}/g, projectFolderPath);
									command = command.replace(/\{\{folder\}\}/g, folderPath);
									command = command.replace(/\{\{path\}\}/g, path);
									
									let errorTab;
									
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
												
												if (errorTab === undefined) {
													
													DasomEditor.IDE.addTab(errorTab = SkyDesktop.Tab({
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
																	
																	errorTab.remove();
																	errorTab = undefined;
																	
																	EVENT.fireAll('resize');
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
												
												else {
													errorTab.append(P({
														style : {
															padding : 10,
															paddingTop : 0,
															color : 'red'
														},
														c : '오류가 발생했습니다. 오류 메시지: ' + message
													}));
												}
											}
										});
									});
								}
							}
							
							if (callback !== undefined) {
								callback(path);
							}
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
			
			CREATE_FOLDER(path, {
				error : errorHandler,
				success : callback
			});
		},
		
		// 파일의 위치를 변경합니다.
		move : (from, to, errorHandler, callback) => {
			//REQUIRED: from
			//REQUIRED: to
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			MOVE_FILE({
				from : from,
				to : to
			}, {
				notExists : errorHandler,
				error : errorHandler,
				success : callback
			});
		},
		
		// 파일을 복사합니다.
		clone : (from, to, errorHandler, callback) => {
			//REQUIRED: from
			//REQUIRED: to
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			CHECK_IS_FOLDER(from, (isFolder) => {
				
				if (isFolder === true) {
					COPY_FOLDER({
						from : from,
						to : to
					}, {
						notExists : errorHandler,
						error : errorHandler,
						success : callback
					});
				}
				
				else {
					COPY_FILE({
						from : from,
						to : to
					}, {
						notExists : errorHandler,
						error : errorHandler,
						success : callback
					});
				}
			});
		},
		
		// 파일을 삭제합니다.
		remove : (path, errorHandler, callback) => {
			//REQUIRED: path
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			CHECK_IS_FOLDER(path, (isFolder) => {
				
				if (isFolder === true) {
					Rimraf(path, (error) => {
						if (error !== TO_DELETE) {
							errorHandler(error.toString());
						} else {
							callback();
						}
					});
				}
				
				else {
					REMOVE_FILE(path, {
						error : errorHandler,
						success : callback
					});
				}
			});
		},
		
		// 새 FTP 정보를 생성합니다.
		ftpNew : (ftpInfo, errorHandler, existedHandler, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: errorHandler
			//REQUIRED: existedHandler
			//REQUIRED: callback
			
			if (ftpInfoStore.get(ftpInfo.username + '@' + ftpInfo.host) !== undefined) {
				existedHandler();
			}
			
			else {
				
				ftpInfoStore.save({
					name : ftpInfo.username + '@' + ftpInfo.host,
					value : ftpInfo
				});
				
				callback();
			}
		},
		
		// FTP 정보를 파기합니다.
		ftpDestroy : (ftpInfo, errorHandler, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			ftpInfoStore.remove(ftpInfo.username + '@' + ftpInfo.host);
			
			callback();
		},
		
		// FTP에 연결합니다.
		ftpConnect : (ftpInfo, errorHandler, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector === undefined) {
				ftpConnector = ftpConnectors[ftpInfo.host] = DasomEditor.FTPConnector(ftpInfo, {
					error : errorHandler,
					success : callback
				});
			}
			
			else {
				callback();
			}
		},
		
		// FTP로부터 파일 목록을 가져옵니다.
		ftpLoadFiles : (ftpInfo, path, errorHandler, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: path
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				ftpConnector.loadFiles(path, {
					error : errorHandler,
					success : callback
				});
			}
		},
		
		// FTP로부터 파일의 내용을 불러옵니다.
		ftpLoad : (ftpInfo, path, errorHandler, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: path
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				ftpConnector.load(path, {
					error : errorHandler,
					success : (buffer) => {
						callback(buffer.toString());
					}
				});
			}
		},
		
		// FTP로부터 파일의 정보를 가져옵니다.
		ftpGetInfo : (ftpInfo, path, errorHandler, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: path
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				ftpConnector.getInfo(path, {
					error : errorHandler,
					success : callback
				});
			}
		},
		
		// FTP에 파일이 존재하는지 확인합니다.
		ftpCheckExists : (ftpInfo, path, errorHandler, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: path
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				ftpConnector.checkExists(path, callback);
			}
		},
		
		// FTP에 파일을 저장합니다.
		ftpSave : (ftpInfo, path, content, errorHandler, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: path
			//REQUIRED: content
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				ftpConnector.save({
					path : path,
					content : content
				}, {
					error : errorHandler,
					success : callback
				});
			}
		},
		
		// FTP에 폴더를 생성합니다.
		ftpCreateFolder : (ftpInfo, path, errorHandler, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: path
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				ftpConnector.createFolder(path, {
					error : errorHandler,
					success : callback
				});
			}
		},
		
		// FTP에서 파일을 이동합니다.
		ftpMove : (fromFTPInfo, toFTPInfo, from, to, errorHandler, callback) => {
			//REQUIRED: fromFTPInfo
			//REQUIRED: toFTPInfo
			//REQUIRED: from
			//REQUIRED: to
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let fromFTPConnector = ftpConnectors[fromFTPInfo.host];
			let toFTPConnector = ftpConnectors[toFTPInfo.host];
			
			if (fromFTPConnector !== undefined && toFTPConnector !== undefined) {
				
				if (fromFTPConnector === toFTPConnector) {
					
					fromFTPConnector.move({
						from : from,
						to : to
					}, {
						error : errorHandler,
						success : callback
					});
				}
				
				else {
					
					fromFTPConnector.load(from, {
						error : errorHandler,
						notExists : errorHandler,
						success : (buffer) => {
							
							toFTPConnector.save({
								path : to,
								buffer : buffer
							}, {
								error : errorHandler,
								success : () => {
									
									fromFTPConnector.remove(from, {
										error : errorHandler,
										notExists : errorHandler,
										success : callback
									});
								}
							});
						}
					});
				}
			}
		},
		
		// FTP에서 파일을 복사합니다.
		ftpClone : (fromFTPInfo, toFTPInfo, from, to, errorHandler, callback) => {
			//REQUIRED: fromFTPInfo
			//REQUIRED: toFTPInfo
			//REQUIRED: from
			//REQUIRED: to
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let fromFTPConnector = ftpConnectors[fromFTPInfo.host];
			let toFTPConnector = ftpConnectors[toFTPInfo.host];
			
			if (fromFTPConnector !== undefined && toFTPConnector !== undefined) {
				
				if (fromFTPConnector === toFTPConnector) {
					
					fromFTPConnector.checkIsFolder(from, {
						error : errorHandler,
						success : (isFolder) => {
							
							if (isFolder === true) {
								
								fromFTPConnector.copyFolder({
									from : from,
									to : to
								}, {
									error : errorHandler,
									success : callback
								});
							}
							
							else {
								
								fromFTPConnector.copyFile({
									from : from,
									to : to
								}, {
									error : errorHandler,
									success : callback
								});
							}
						}
					});
				}
				
				else {
					
					fromFTPConnector.checkIsFolder(from, {
						error : errorHandler,
						success : (isFolder) => {
							
							if (isFolder === true) {
								
								let f = (from, to) => {
									
									// 폴더의 내용들을 읽어들임
									fromFTPConnector.loadFiles(from, {
										error : errorHandler,
										success : (folderNames, fileNames) => {
											
											// 폴더는 다시 반복
											EACH(folderNames, (folderName) => {
												f(from + '/' + folderName, to + '/' + folderName);
											});
											
											// 파일은 내용을 불러와 복사
											NEXT(fileNames, (fileName, next) => {
												
												fromFTPConnector.load(from + '/' + fileName, {
													error : errorHandler,
													notExists : errorHandler,
													success : (buffer) => {
														
														toFTPConnector.save({
															path : to + '/' + fileName,
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
								
								f(from, to);
							}
							
							else {
								
								fromFTPConnector.load(from, {
									error : errorHandler,
									notExists : errorHandler,
									success : (buffer) => {
										
										toFTPConnector.save({
											path : to,
											buffer : buffer
										}, {
											error : errorHandler,
											success : callback
										});
									}
								});
							}
						}
					});
				}
			}
		},
		
		// FTP에서 파일을 삭제합니다.
		ftpRemove : (ftpInfo, path, errorHandler, callback) => {
			//REQUIRED: ftpInfo
			//REQUIRED: path
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			let ftpConnector = ftpConnectors[ftpInfo.host];
			
			if (ftpConnector !== undefined) {
				
				ftpConnector.remove(path, {
					error : errorHandler,
					success : callback
				});
			}
		},
		
		// 경로를 클립보드에 복사합니다.
		copy : (pathInfos) => {
			//REQUIRED: pathInfos
			
			clipboardPathInfos = pathInfos;
			
			let text = '';
			
			EACH(pathInfos, (pathInfo, i) => {
				if (i > 0) {
					text += '\n';
				}
				let fileName = Path.basename(pathInfo.path);
				if (fileName.indexOf('.') !== -1) {
					fileName = fileName.substring(0, fileName.indexOf('.'));
				}
				text += fileName;
			});
			
			clipboard.writeText(text);
		},
		
		// 클립보드에서 복사한 경로를 붙혀넣기합니다.
		paste : (ftpInfo, folderPath, errorHandler, callback) => {
			//OPTIONAL: ftpInfo
			//REQUIRED: folderPath
			//REQUIRED: errorHandler
			//REQUIRED: callback
			
			// -> FTP로
			if (ftpInfo !== undefined) {
				
				let toFTPConnector = ftpConnectors[ftpInfo.host];
				
				if (toFTPConnector !== undefined) {
					
					let ftpFolderPaths = [];
					let ftpFilePaths = [];
					
					NEXT(clipboardPathInfos, [
					(clipboardPathInfo, next) => {
						
						let path = fixPath(clipboardPathInfo.path);
						
						let fileName = path.substring(path.lastIndexOf('/') + 1);
						
						// FTP -> FTP
						if (clipboardPathInfo.ftpInfo !== undefined) {
							
							let fromFTPConnector = ftpConnectors[clipboardPathInfo.ftpInfo.host];
							
							RUN((f) => {
								
								NEXT([
								(next) => {
									
									// 이미 존재하는가?
									toFTPConnector.checkExists(folderPath + '/' + fileName, (isExists) => {
										
										if (isExists === true) {
											
											// 같은 폴더면 (2)를 붙힙니다.
											if (fromFTPConnector === toFTPConnector && path.substring(0, path.lastIndexOf('/')) === folderPath) {
												
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
										
										fromFTPConnector.checkIsFolder(path, {
											error : errorHandler,
											success : (isFolder) => {
												
												// 폴더 복사
												if (isFolder === true) {
													
													if (fromFTPConnector === toFTPConnector) {
														
														ftpFolderPaths.push(folderPath + '/' + fileName);
														
														toFTPConnector.copyFolder({
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
															fromFTPConnector.loadFiles(path, {
																error : errorHandler,
																success : (folderNames, fileNames) => {
																	
																	// 폴더는 다시 반복
																	EACH(folderNames, (folderName) => {
																		f(path + '/' + folderName, folderPath + '/' + folderName);
																	});
																	
																	// 파일은 내용을 불러와 복사
																	NEXT(fileNames, (fileName, next) => {
																		
																		fromFTPConnector.load(path + '/' + fileName, {
																			error : errorHandler,
																			notExists : errorHandler,
																			success : (buffer) => {
																				
																				toFTPConnector.save({
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
													
													if (fromFTPConnector === toFTPConnector) {
														
														toFTPConnector.copyFile({
															from : path,
															to : folderPath + '/' + fileName
														}, {
															error : errorHandler,
															success : next
														});
													}
													
													else {
														
														fromFTPConnector.load(path, {
															error : errorHandler,
															notExists : errorHandler,
															success : (buffer) => {
																
																toFTPConnector.save({
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
									toFTPConnector.checkExists(folderPath + '/' + fileName, (isExists) => {
										
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
										
										CHECK_IS_FOLDER(path, (isFolder) => {
											
											// 폴더 복사
											if (isFolder === true) {
												// 로컬 -> FTP 폴더 복사
												
												f = (path, folderPath) => {
													
													// 폴더는 다시 반복
													FIND_FOLDER_NAMES(path, {
														error : errorHandler,
														success : EACH((folderName) => {
															f(path + '/' + folderName, folderPath + '/' + folderName);
														})
													});
													
													// 파일은 내용을 불러와 복사
													FIND_FILE_NAMES(path, {
														error : errorHandler,
														success : (fileNames) => {
															
															NEXT(fileNames, (fileName, next) => {
																
																READ_FILE(path + '/' + fileName, {
																	error : errorHandler,
																	notExists : errorHandler,
																	success : (buffer) => {
																		
																		toFTPConnector.save({
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
											
											// 파일 복사
											else {
												
												ftpFilePaths.push(folderPath + '/' + fileName);
												
												READ_FILE(path, {
													error : errorHandler,
													notExists : errorHandler,
													success : (buffer) => {
														
														toFTPConnector.save({
															path : folderPath + '/' + fileName,
															buffer : buffer
														}, {
															error : errorHandler,
															success : next
														});
													}
												});
											}
										});
									};
								}]);
							});
						}
					},
					
					() => {
						return () => {
							callback(ftpFolderPaths, ftpFilePaths);
						};
					}]);
				}
			}
			
			// -> 로컬로
			else {
				
				NEXT(clipboardPathInfos, [
				(clipboardPathInfo, next) => {
					
					let path = fixPath(clipboardPathInfo.path);
					
					let fileName = path.substring(path.lastIndexOf('/') + 1);
					
					// FTP -> 로컬
					if (clipboardPathInfo.ftpInfo !== undefined) {
						
						let fromFTPConnector = ftpConnectors[clipboardPathInfo.ftpInfo.host];
						
						RUN((f) => {
							
							NEXT([
							(next) => {
								
								// 이미 존재하는가?
								CHECK_FILE_EXISTS(folderPath + '/' + fileName, (isExists) => {
									
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
									
									fromFTPConnector.checkIsFolder(path, {
										error : errorHandler,
										success : (isFolder) => {
											
											// 폴더 복사
											if (isFolder === true) {
												// FTP -> 로컬 폴더 복사
												
												f = (path, folderPath) => {
													
													// 폴더의 내용들을 읽어들임
													fromFTPConnector.loadFiles(path, {
														error : errorHandler,
														success : (folderNames, fileNames) => {
															
															// 폴더는 다시 반복
															EACH(folderNames, (folderName) => {
																f(path + '/' + folderName, folderPath + '/' + folderName);
															});
															
															// 파일은 내용을 불러와 복사
															NEXT(fileNames, (fileName, next) => {
																fromFTPConnector.load(path + '/' + fileName, {
																	error : errorHandler,
																	notExists : errorHandler,
																	success : (buffer) => {
																		
																		WRITE_FILE({
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
												
												next();
											}
											
											// 파일 복사
											else {
												
												fromFTPConnector.load(path, {
													error : errorHandler,
													notExists : errorHandler,
													success : (buffer) => {
														
														WRITE_FILE({
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
								CHECK_FILE_EXISTS(folderPath + '/' + fileName, (isExists) => {
									
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
									
									CHECK_IS_FOLDER(path, (isFolder) => {
										
										// 폴더 복사
										if (isFolder === true) {
											
											COPY_FOLDER({
												from : path,
												to : folderPath + '/' + fileName
											}, {
												error : errorHandler,
												success : next
											});
										}
										
										// 파일 복사
										else {
											
											COPY_FILE({
												from : path,
												to : folderPath + '/' + fileName
											}, {
												error : errorHandler,
												success : next
											});
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
			
			if (ftpInfo !== undefined) {
				SkyDesktop.Alert({
					msg : '파일의 크기가 너무 커 열 수 없습니다.'
				});
			}
			
			else {
				
				SkyDesktop.Confirm({
					msg : '파일의 크기가 너무 커 열 수 없습니다. 탐색기에서 보시겠습니까?'
				}, () => {
					shell.showItemInFolder(path);
				});
			}
		},
		
		// Git으로부터 저장소를 복사합니다.
		gitClone : (params, handlers) => {
			//REQUIRED: params
			//REQUIRED: handlers
			
			UGIT.CLONE(params, handlers);
		},
		
		// 원격 저장소와의 차이를 가져옵니다.
		gitDiff : (params, handlers) => {
			//REQUIRED: params
			//REQUIRED: handlers
			
			UGIT.DIFF(params, handlers);
		},
		
		// Git으로부터 Pull 합니다.
		gitPull : (params, handlers) => {
			//REQUIRED: params
			//REQUIRED: handlers
			
			UGIT.PULL(params, handlers);
		},
		
		// Git에 Push 합니다.
		gitPush : (params, handlers) => {
			//REQUIRED: params
			//REQUIRED: handlers
			
			UGIT.PUSH(params, handlers);
		}
	});
	
	// 탐색기에서 보기 메뉴 추가
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
							
							shell.showItemInFolder(folderPath + '/.');
							
							self.remove();
						}
					}
				}));
			}
		});
	});
	
	// 저장 시 명령 메뉴 추가
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
	
	// 워크스페이스 폴더 지정 메뉴 추가
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
	
	// 개발자 도구 메뉴 추가
	DasomEditor.IDE.addToolbarButton(SkyDesktop.ToolbarButton({
		icon : IMG({
			src : DasomEditor.R('icon/devtool.png')
		}),
		title : '개발자 도구',
		on : {
			tap : () => {
				ipcRenderer.send('toggleDevTool');
			}
		}
	}));
	
	// 드래그 앤 드롭으로 파일 열기
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
	
	let workspaceFileWatcher;
	
	// 워크스페이스 파일들을 불러옵니다.
	let loadWorkspaceFiles = RAR(() => {
		
		DasomEditor.IDE.clearFileTree();
		
		// 파일 변경을 감지하는 와처를 생성합니다.
		let createFileWatcher = (path, addItem, removeItem) => {
			
			return FS.watch(path, (eventType, fileName) => {
				
				if (eventType === 'rename') {
					
					CHECK_FILE_EXISTS(path + '/' + fileName, (exists) => {
						
						if (exists === true) {
							
							CHECK_IS_FOLDER(path + '/' + fileName, (isFolder) => {
								
								// 새 폴더 생성
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
								
								// 새 파일 생성
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
						
						// 파일 혹은 폴더 제거
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
			});
		};
		
		// 폴더 생성
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
						
						loadFolderFiles(path, folder, folder.close);
						
						if (fileWatcher !== undefined) {
							fileWatcher.close();
						}
						
						fileWatcher = createFileWatcher(path, folder.addItem, folder.removeItem);
					},
					
					close : () => {
						
						folderOpenedStore.remove(path);
						
						fileWatcher.close();
						
						folder.removeAllItems();
					}
				}
			});
			
			return folder;
		};
		
		// 폴더의 파일들을 로드합니다.
		let loadFolderFiles = (path, folder, close) => {
			
			DasomEditor.IDE.loadFiles(path, (folderNames, fileNames, isToClose) => {
				
				let total = 0;
				
				RUN((f) => {
					let count = 0;
					
					while (total < folderNames.length) {
						let folderName = folderNames[total];
						
						let folderItem = createFolderItem(path + '/' + folderName, folderName);
						
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
						
						folder.addItem({
							key : path + '/' + folderName,
							item : folderItem
						});
						
						total += 1;
						
						count += 1;
						if (path !== workspacePath && count === 50) {
							break;
						}
					}
					
					if (count < 50) {
						
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
							if (path !== workspacePath && count === 50) {
								break;
							}
						}
					}
					
					// 개수가 50개 넘으면 더 불러옴
					if (path !== workspacePath && count === 50) {
						
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
		
		let workspacePath = editorStore.get('workspacePath');
		
		if (workspacePath === undefined) {
			workspacePath = 'workspace';
		}
		
		DasomEditor.IDE.setWorkspacePath(workspacePath);
		
		loadFolderFiles(workspacePath, DasomEditor.IDE);
		
		if (workspaceFileWatcher !== undefined) {
			workspaceFileWatcher.close();
		}
		
		workspaceFileWatcher = createFileWatcher(workspacePath, DasomEditor.IDE.addItem, DasomEditor.IDE.removeItem);
	});
	
	// FTP 정보 로드
	EACH(ftpInfoStore.all(), (ftpInfo) => {
		DasomEditor.IDE.addFTPItem(ftpInfo);
	});
});
