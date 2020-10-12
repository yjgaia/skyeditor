OVERRIDE(SkyEditorServer.FTPModel, (origin) => {
	
	SkyEditorServer.FTPModel = OBJECT({

		preset : () => {
			return origin;
		},

		init : (inner, self) => {
			
			SkyEditorServer.ROOM(self.getName(), (clientInfo, on, off, send, broadcastExceptMe) => {
				
				let ftpConnectors = {};
				
				// FTP에 연결합니다.
				on('connect', (ftpInfo, ret) => {
					if (clientInfo.isAuthed === true && ftpInfo !== undefined) {
						
						let ftpConnector = ftpConnectors[ftpInfo.host];
						
						if (ftpConnector === undefined) {
							ftpConnector = ftpConnectors[ftpInfo.host] = SkyEditor.FTPConnector(ftpInfo, {
								error : (errorMsg) => {
									if (errorMsg === undefined) {
										errorMsg = 'connect Error!';
									}
									ret({
										errorMsg : errorMsg
									});
								},
								success : () => {
									ret({});
								}
							});
						}
						
						else {
							ret({});
						}
					}
				});
				
				// FTP로부터 파일 목록을 가져옵니다.
				on('loadFiles', (params, ret) => {
					if (clientInfo.isAuthed === true && params !== undefined && params.ftpInfo !== undefined && params.path !== undefined) {
						
						let ftpInfo = params.ftpInfo;
						let path = params.path;
						
						let ftpConnector = ftpConnectors[ftpInfo.host];
						
						if (ftpConnector !== undefined) {
							
							ftpConnector.loadFiles(path, {
								error : (errorMsg) => {
									if (errorMsg === undefined) {
										errorMsg = 'loadFiles Error!';
									}
									ret({
										errorMsg : errorMsg
									});
								},
								success : (folderNames, fileNames) => {
									ret({
										folderNames : folderNames,
										fileNames : fileNames
									});
								}
							});
						}
					}
				});
				
				// FTP로부터 파일의 내용을 불러옵니다.
				on('loadFile', (params, ret) => {
					if (clientInfo.isAuthed === true && params !== undefined && params.ftpInfo !== undefined && params.path !== undefined) {
						
						let ftpInfo = params.ftpInfo;
						let path = params.path;
						
						let ftpConnector = ftpConnectors[ftpInfo.host];
						
						if (ftpConnector !== undefined) {
							
							ftpConnector.load(path, {
								error : (errorMsg) => {
									if (errorMsg === undefined) {
										errorMsg = 'loadFile Error!';
									}
									ret({
										errorMsg : errorMsg
									});
								},
								success : (buffer) => {
									ret({
										content : buffer.toString()
									});
								}
							});
						}
					}
				});
				
				// FTP로부터 파일의 정보를 가져옵니다.
				on('getFileInfo', (params, ret) => {
					if (clientInfo.isAuthed === true && params !== undefined && params.ftpInfo !== undefined && params.path !== undefined) {
						
						let ftpInfo = params.ftpInfo;
						let path = params.path;
						
						let ftpConnector = ftpConnectors[ftpInfo.host];
						
						if (ftpConnector !== undefined) {
							
							ftpConnector.getInfo(path, {
								error : (errorMsg) => {
									if (errorMsg === undefined) {
										errorMsg = 'getFileInfo Error!';
									}
									ret({
										errorMsg : errorMsg
									});
								},
								success : (info) => {
									ret({
										info : info
									});
								}
							});
						}
					}
				});
				
				// FTP에 파일이 존재하는지 확인합니다.
				on('checkFileExists', (params, ret) => {
					if (clientInfo.isAuthed === true && params !== undefined && params.ftpInfo !== undefined && params.path !== undefined) {
						
						let ftpInfo = params.ftpInfo;
						let path = params.path;
						
						let ftpConnector = ftpConnectors[ftpInfo.host];
						
						if (ftpConnector !== undefined) {
							
							ftpConnector.checkExists(path, (exists) => {
								ret({
									exists : exists
								});
							});
						}
					}
				});
				
				// FTP에 파일을 저장합니다.
				on('saveFile', (params, ret) => {
					if (clientInfo.isAuthed === true && params !== undefined && params.ftpInfo !== undefined && params.path !== undefined && params.content !== undefined) {
						
						let ftpInfo = params.ftpInfo;
						let path = params.path;
						let content = params.content;
						
						let ftpConnector = ftpConnectors[ftpInfo.host];
						
						if (ftpConnector !== undefined) {
							
							ftpConnector.save({
								path : path,
								content : content
							}, {
								error : (errorMsg) => {
									if (errorMsg === undefined) {
										errorMsg = 'saveFile Error!';
									}
									ret({
										errorMsg : errorMsg
									});
								},
								success : () => {
									ret({});
								}
							});
						}
					}
				});
				
				// FTP에 폴더를 생성합니다.
				on('createFolder', (params, ret) => {
					if (clientInfo.isAuthed === true && params !== undefined && params.ftpInfo !== undefined && params.path !== undefined) {
						
						let ftpInfo = params.ftpInfo;
						let path = params.path;
						
						let ftpConnector = ftpConnectors[ftpInfo.host];
						
						if (ftpConnector !== undefined) {
							
							ftpConnector.createFolder(path, {
								error : (errorMsg) => {
									if (errorMsg === undefined) {
										errorMsg = 'createFolder Error!';
									}
									ret({
										errorMsg : errorMsg
									});
								},
								success : () => {
									ret({});
								}
							});
						}
					}
				});
				
				// FTP에서 파일을 이동합니다.
				on('moveFile', (params, ret) => {
					if (clientInfo.isAuthed === true && params !== undefined && params.fromFTPInfo !== undefined && params.toFTPInfo !== undefined && params.from !== undefined && params.to !== undefined) {
						
						let fromFTPInfo = params.fromFTPInfo;
						let toFTPInfo = params.toFTPInfo;
						let from = params.from;
						let to = params.to;
						
						let fromFTPConnector = ftpConnectors[fromFTPInfo.host];
						let toFTPConnector = ftpConnectors[toFTPInfo.host];
						
						if (fromFTPConnector !== undefined && toFTPConnector !== undefined) {
							
							if (fromFTPConnector === toFTPConnector) {
								
								fromFTPConnector.move({
									from : from,
									to : to
								}, {
									error : (errorMsg) => {
										if (errorMsg === undefined) {
											errorMsg = 'moveFile Error!';
										}
										ret({
											errorMsg : errorMsg
										});
									},
									success : () => {
										ret({});
									}
								});
							}
							
							else {
								
								fromFTPConnector.load(from, {
									error : (errorMsg) => {
										if (errorMsg === undefined) {
											errorMsg = 'moveFile Error!';
										}
										ret({
											errorMsg : errorMsg
										});
									},
									notExists : () => {
										ret({
											errorMsg : 'moveFile not exists error!'
										});
									},
									success : (buffer) => {
										
										toFTPConnector.save({
											path : to,
											buffer : buffer
										}, {
											error : (errorMsg) => {
												if (errorMsg === undefined) {
													errorMsg = 'moveFile Error!';
												}
												ret({
													errorMsg : errorMsg
												});
											},
											success : () => {
												
												fromFTPConnector.remove(from, {
													error : (errorMsg) => {
														if (errorMsg === undefined) {
															errorMsg = 'moveFile Error!';
														}
														ret({
															errorMsg : errorMsg
														});
													},
													notExists : () => {
														ret({
															errorMsg : 'moveFile not exists error!'
														});
													},
													success : () => {
														ret({});
													}
												});
											}
										});
									}
								});
							}
						}
					}
				});
				
				// FTP에서 파일을 복사합니다.
				on('cloneFile', (params, ret) => {
					if (clientInfo.isAuthed === true && params !== undefined && params.fromFTPInfo !== undefined && params.toFTPInfo !== undefined && params.from !== undefined && params.to !== undefined) {
						
						let fromFTPInfo = params.fromFTPInfo;
						let toFTPInfo = params.toFTPInfo;
						let from = params.from;
						let to = params.to;
						
						let fromFTPConnector = ftpConnectors[fromFTPInfo.host];
						let toFTPConnector = ftpConnectors[toFTPInfo.host];
						
						if (fromFTPConnector !== undefined && toFTPConnector !== undefined) {
							
							if (fromFTPConnector === toFTPConnector) {
								
								fromFTPConnector.checkIsFolder(from, {
									error : (errorMsg) => {
										if (errorMsg === undefined) {
											errorMsg = 'cloneFile Error!';
										}
										ret({
											errorMsg : errorMsg
										});
									},
									success : (isFolder) => {
										
										if (isFolder === true) {
											
											fromFTPConnector.copyFolder({
												from : from,
												to : to
											}, {
												error : (errorMsg) => {
													if (errorMsg === undefined) {
														errorMsg = 'cloneFile Error!';
													}
													ret({
														errorMsg : errorMsg
													});
												},
												success : () => {
													ret({});
												}
											});
										}
										
										else {
											
											fromFTPConnector.copyFile({
												from : from,
												to : to
											}, {
												error : (errorMsg) => {
													if (errorMsg === undefined) {
														errorMsg = 'cloneFile Error!';
													}
													ret({
														errorMsg : errorMsg
													});
												},
												success : () => {
													ret({});
												}
											});
										}
									}
								});
							}
							
							else {
								
								fromFTPConnector.checkIsFolder(from, {
									error : (errorMsg) => {
										if (errorMsg === undefined) {
											errorMsg = 'cloneFile Error!';
										}
										ret({
											errorMsg : errorMsg
										});
									},
									success : (isFolder) => {
										
										if (isFolder === true) {
											
											let f = (from, to) => {
												
												// 폴더의 내용들을 읽어들임
												fromFTPConnector.loadFiles(from, {
													error : (errorMsg) => {
														if (errorMsg === undefined) {
															errorMsg = 'cloneFile Error!';
														}
														ret({
															errorMsg : errorMsg
														});
													},
													success : (folderNames, fileNames) => {
														
														// 폴더는 다시 반복
														EACH(folderNames, (folderName) => {
															f(from + '/' + folderName, to + '/' + folderName);
														});
														
														// 파일은 내용을 불러와 복사
														NEXT(fileNames, (fileName, next) => {
															
															fromFTPConnector.load(from + '/' + fileName, {
																error : (errorMsg) => {
																	if (errorMsg === undefined) {
																		errorMsg = 'cloneFile Error!';
																	}
																	ret({
																		errorMsg : errorMsg
																	});
																},
																notExists : () => {
																	ret({
																		errorMsg : 'cloneFile not exists error!'
																	});
																},
																success : (buffer) => {
																	
																	toFTPConnector.save({
																		path : to + '/' + fileName,
																		buffer : buffer
																	}, {
																		error : (errorMsg) => {
																			if (errorMsg === undefined) {
																				errorMsg = 'cloneFile Error!';
																			}
																			ret({
																				errorMsg : errorMsg
																			});
																		},
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
												error : (errorMsg) => {
													if (errorMsg === undefined) {
														errorMsg = 'cloneFile Error!';
													}
													ret({
														errorMsg : errorMsg
													});
												},
												notExists : () => {
													ret({
														errorMsg : 'cloneFile not exists error!'
													});
												},
												success : (buffer) => {
													
													toFTPConnector.save({
														path : to,
														buffer : buffer
													}, {
														error : (errorMsg) => {
															if (errorMsg === undefined) {
																errorMsg = 'cloneFile Error!';
															}
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
										}
									}
								});
							}
						}
					}
				});
				
				// FTP에서 파일을 삭제합니다.
				on('removeFile', (params, ret) => {
					if (clientInfo.isAuthed === true && params !== undefined && params.ftpInfo !== undefined && params.path !== undefined) {
						
						let ftpInfo = params.ftpInfo;
						let path = params.path;
						let content = params.content;
						
						let ftpConnector = ftpConnectors[ftpInfo.host];
						
						if (ftpConnector !== undefined) {
							
							ftpConnector.remove(path, {
								error : (errorMsg) => {
									if (errorMsg === undefined) {
										errorMsg = 'removeFile Error!';
									}
									ret({
										errorMsg : errorMsg
									});
								},
								success : () => {
									ret({});
								}
							});
						}
					}
				});
				
				// 폴더인지 확인합니다.
				on('checkIsFolder', (params, ret) => {
					if (clientInfo.isAuthed === true && params !== undefined && params.ftpInfo !== undefined && params.path !== undefined) {
						
						let ftpInfo = params.ftpInfo;
						let path = params.path;
						
						let ftpConnector = ftpConnectors[ftpInfo.host];
						
						if (ftpConnector !== undefined) {
							
							ftpConnector.checkIsFolder(path, {
								error : (errorMsg) => {
									if (errorMsg === undefined) {
										errorMsg = 'checkIsFolder Error!';
									}
									ret({
										errorMsg : errorMsg
									});
								},
								success : (isFolder) => {
									ret({
										isFolder : isFolder
									});
								}
							});
						}
					}
				});
				
				on('__DISCONNECTED', () => {
					EACH(ftpConnectors, (ftpConnector) => {
						ftpConnector.disconnect();
					});
				});
			});
		}
	});
});
