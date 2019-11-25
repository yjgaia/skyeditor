SkyEditorServer.APIRoom = OBJECT({

	init : (inner, self) => {
		
		const FS = require('fs');
		const Rimraf = require('rimraf');
		
		let workspacePath = NODE_CONFIG.SkyEditorServer.workspacePath;
		
		SkyEditorServer.ROOM('API', (clientInfo, on, off, send, broadcastExceptMe) => {
			
			// 인증하기
			on('auth', (password, ret) => {
				if (NODE_CONFIG.SkyEditorServer.password === password) {
					clientInfo.isAuthed = true;
					clientInfo.roles = ['user'];
					ret(true);
				} else {
					ret(false);
				}
			});
			
			// 파일 목록을 로드합니다.
			on('loadFiles', (path, ret) => {
				if (clientInfo.isAuthed === true && path !== undefined) {
					
					let realPath = workspacePath + path;
					
					let folderNames = [];
					let fileNames = [];
					
					FS.readdir(realPath, (error, names) => {
						
						if (error !== TO_DELETE) {
							ret({
								errorMsg : error.toString()
							});
						} else {
							
							PARALLEL(names, [
							(name, done) => {
		
								if (name !== '.' && name !== '..' && name !== '.git') {
		
									FS.stat(realPath + '/' + name, (error, stats) => {
		
										if (error !== TO_DELETE) {
											ret({
												errorMsg : error.toString()
											});
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
								ret({
									folderNames : folderNames,
									fileNames : fileNames
								});
							}]);
						}
					});
				}
			});
			
			// 파일 내용을 불러옵니다.
			on('load', (path, ret) => {
				if (clientInfo.isAuthed === true && path !== undefined) {
					
					let realPath = workspacePath + path;
					
					READ_FILE(realPath, {
						notExists : () => {
							ret({
								errorMsg : 'NOT EXISTS'
							});
						},
						error : (error) => {
							ret({
								errorMsg : error.toString()
							});
						},
						success : (buffer) => {
							ret({
								content : buffer.toString()
							});
						}
					});
				}
			});
			
			// 파일이 존재하는지 확인합니다.
			on('checkExists', (path, ret) => {
				if (clientInfo.isAuthed === true && path !== undefined) {
					
					let realPath = workspacePath + path;
					
					CHECK_FILE_EXISTS(realPath, ret);
				}
			});
			
			// 파일의 정보를 가져옵니다.
			on('getInfo', (path, ret) => {
				if (clientInfo.isAuthed === true && path !== undefined) {
					
					let realPath = workspacePath + path;
					
					GET_FILE_INFO(realPath, {
						notExists : () => {
							ret({
								errorMsg : 'NOT EXISTS'
							});
						},
						error : (error) => {
							ret({
								errorMsg : error.toString()
							});
						},
						success : (info) => {
							ret({
								info : info
							});
						}
					});
				}
			});
			
			// 파일의 내용을 저장합니다.
			on('save', (params, ret) => {
				if (clientInfo.isAuthed === true && params !== undefined && params.path !== undefined && params.content !== undefined) {
					
					let path = params.path;
					let content = params.content;
					
					let realPath = workspacePath + params.path;
					
					// 이미 존재하는지 체크
					CHECK_FILE_EXISTS(realPath, (exists) => {
						
						WRITE_FILE({
							path : realPath,
							content : content
						}, {
							error : (error) => {
								ret({
									errorMsg : error.toString()
								});
							},
							success : () => {
								
								if (exists !== true) {
									
									// 존재하지 않던 파일이면 알림
									SkyEditorServer.BROADCAST({
										roomName : 'Folder' + path.substring(0, path.lastIndexOf('/')),
										methodName : 'newFile',
										data : path.substring(path.lastIndexOf('/') + 1)
									});
								}
								
								ret({});
							}
						});
					});
				}
			});
			
			// 파일을 삭제합니다.
			on('remove', (path, ret) => {
				if (clientInfo.isAuthed === true && path !== undefined) {
					
					let realPath = workspacePath + path;
					
					CHECK_IS_FOLDER(realPath, (isFolder) => {
						
						if (isFolder === true) {
							
							Rimraf(realPath, (error) => {
								
								if (error !== TO_DELETE) {
									ret({
										errorMsg : error.toString()
									});
								}
								
								else {
									
									SkyEditorServer.BROADCAST({
										roomName : 'Folder' + path,
										methodName : 'remove'
									});
									
									ret({});
								}
							});
						}
						
						else {
							
							REMOVE_FILE(realPath, {
								error : (error) => {
									ret({
										errorMsg : error.toString()
									});
								},
								success : () => {
									
									SkyEditorServer.BROADCAST({
										roomName : 'File' + path,
										methodName : 'remove'
									});
									
									ret({});
								}
							});
						}
					});
				}
			});
			
			// 폴더를 생성합니다.
			on('createFolder', (path, ret) => {
				if (clientInfo.isAuthed === true && path !== undefined) {
					
					let realPath = workspacePath + path;
					
					// 이미 존재하는지 체크
					CHECK_FILE_EXISTS(realPath, (exists) => {
						
						CREATE_FOLDER(realPath, {
							error : (error) => {
								ret({
									errorMsg : error.toString()
								});
							},
							success : () => {
								
								if (exists !== true) {
									
									// 존재하지 않던 폴더면 알림
									SkyEditorServer.BROADCAST({
										roomName : 'Folder' + path.substring(0, path.lastIndexOf('/')),
										methodName : 'newFolder',
										data : path.substring(path.lastIndexOf('/') + 1)
									});
								}
								
								ret({});
							}
						});
					});
				}
			});
			
			// 파일의 위치를 변경합니다.
			on('move', (params, ret) => {
				if (clientInfo.isAuthed === true && params !== undefined && params.from !== undefined && params.to !== undefined) {
					
					let from = params.from;
					let to = params.to;
					
					let realFrom = workspacePath + from;
					let realTo = workspacePath + to;
					
					// 이미 존재하는지 체크
					CHECK_FILE_EXISTS(realTo, (exists) => {
						CHECK_IS_FOLDER(realFrom, (isFolder) => {
							
							MOVE_FILE({
								from : realFrom,
								to : realTo
							}, {
								notExists : () => {
									ret({
										errorMsg : 'NOT EXISTS'
									});
								},
								error : (error) => {
									ret({
										errorMsg : error.toString()
									});
								},
								success : () => {
									
									// 파일
									if (isFolder !== true) {
										
										SkyEditorServer.BROADCAST({
											roomName : 'File' + from,
											methodName : 'remove'
										});
										
										if (exists !== true) {
											
											// 존재하지 않던 파일이면 알림
											SkyEditorServer.BROADCAST({
												roomName : 'Folder' + to.substring(0, to.lastIndexOf('/')),
												methodName : 'newFile',
												data : to.substring(to.lastIndexOf('/') + 1)
											});
										}
									}
									
									// 폴더
									else {
										
										SkyEditorServer.BROADCAST({
											roomName : 'Folder' + from,
											methodName : 'remove'
										});
										
										if (exists !== true) {
											
											// 존재하지 않던 폴더면 알림
											SkyEditorServer.BROADCAST({
												roomName : 'Folder' + to.substring(0, to.lastIndexOf('/')),
												methodName : 'newFolder',
												data : to.substring(to.lastIndexOf('/') + 1)
											});
										}
									}
									
									ret({});
								}
							});
						});
					});
				}
			});
			
			// 파일을 복사합니다.
			on('clone', (params, ret) => {
				if (clientInfo.isAuthed === true && params !== undefined && params.from !== undefined && params.to !== undefined) {
					
					let from = params.from;
					let to = params.to;
					
					let realFrom = workspacePath + from;
					let realTo = workspacePath + to;
					
					// 이미 존재하는지 체크
					CHECK_FILE_EXISTS(realTo, (exists) => {
						
						CHECK_IS_FOLDER(realFrom, (isFolder) => {
							
							if (isFolder === true) {
								COPY_FOLDER({
									from : realFrom,
									to : realTo
								}, {
									notExists : () => {
										ret({
											errorMsg : 'NOT EXISTS'
										});
									},
									error : (error) => {
										ret({
											errorMsg : error.toString()
										});
									},
									success : () => {
										
										if (exists !== true) {
											
											// 존재하지 않던 폴더면 알림
											SkyEditorServer.BROADCAST({
												roomName : 'Folder' + to.substring(0, to.lastIndexOf('/')),
												methodName : 'newFolder',
												data : to.substring(to.lastIndexOf('/') + 1)
											});
										}
										
										ret({});
									}
								});
							}
							
							else {
								COPY_FILE({
									from : realFrom,
									to : realTo
								}, {
									notExists : () => {
										ret({
											errorMsg : 'NOT EXISTS'
										});
									},
									error : (error) => {
										ret({
											errorMsg : error.toString()
										});
									},
									success : () => {
										
										if (exists !== true) {
											
											// 존재하지 않던 파일이면 알림
											SkyEditorServer.BROADCAST({
												roomName : 'Folder' + to.substring(0, to.lastIndexOf('/')),
												methodName : 'newFile',
												data : to.substring(to.lastIndexOf('/') + 1)
											});
										}
										
										ret({});
									}
								});
							}
						});
					});
				}
			});
			
			// 폴더인지 확인합니다.
			on('checkIsFolder', (path, ret) => {
				if (clientInfo.isAuthed === true && path !== undefined) {
					
					let realPath = workspacePath + path;
					
					CHECK_IS_FOLDER(realPath, ret);
				}
			});
			
			on('gitClone', (params, ret) => {
				if (clientInfo.isAuthed === true && params !== undefined && params.path !== undefined) {
					
					let path = params.path;
					let realPath = workspacePath + path;
					
					UGIT.CLONE({
						url : params.url,
						path : realPath,
						username : params.username,
						password : params.password
					}, {
						error : (errorMsg) => {
							ret({
								errorMsg : errorMsg
							});
						},
						success : () => {
							
							// 존재하지 않던 폴더면 알림
							SkyEditorServer.BROADCAST({
								roomName : 'Folder' + path.substring(0, path.lastIndexOf('/')),
								methodName : 'newFolder',
								data : path.substring(path.lastIndexOf('/') + 1)
							});
							
							ret({});
						}
					});
				}
			});
			
			on('gitDiff', (params, ret) => {
				if (clientInfo.isAuthed === true && params !== undefined && params.path !== undefined) {
					
					let realPath = workspacePath + params.path;
					
					UGIT.DIFF({
						url : params.url,
						path : realPath,
						username : params.username,
						password : params.password
					}, {
						error : (errorMsg) => {
							ret({
								errorMsg : errorMsg
							});
						},
						success : (newFilePaths, updatedFilePaths, movedFilePaths, removedFilePaths) => {
							ret({
								newFilePaths : newFilePaths,
								updatedFilePaths : updatedFilePaths,
								movedFilePaths : movedFilePaths,
								removedFilePaths : removedFilePaths
							});
						}
					});
				}
			});
			
			on('gitPull', (params, ret) => {
				if (clientInfo.isAuthed === true && params !== undefined && params.path !== undefined) {
					
					let realPath = workspacePath + params.path;
					
					UGIT.PULL({
						url : params.url,
						path : realPath,
						username : params.username,
						password : params.password
					}, {
						error : (errorMsg) => {
							ret({
								errorMsg : errorMsg
							});
						},
						success : () => {
							ret({});
						}
					});
				}
			});
			
			on('gitPush', (params, ret) => {
				if (clientInfo.isAuthed === true && params !== undefined && params.path !== undefined) {
					
					let realPath = workspacePath + params.path;
					
					UGIT.PUSH({
						url : params.url,
						path : realPath,
						username : params.username,
						password : params.password,
						message : params.message
					}, {
						error : (errorMsg) => {
							ret({
								errorMsg : errorMsg
							});
						},
						success : () => {
							ret({});
						}
					});
				}
			});
		});
	}
});
