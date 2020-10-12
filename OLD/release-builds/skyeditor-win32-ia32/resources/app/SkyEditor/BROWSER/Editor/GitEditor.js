SkyEditor.GitEditor = CLASS((cls) => {
	
	let gitInfoStore = SkyEditor.STORE('gitInfoStore');
	
	return {
	
		preset : () => {
			return SkyEditor.Editor;
		},
	
		init : (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.folderPath
			
			let folderPath = params.folderPath;
			
			self.setTitle(folderPath.substring(folderPath.lastIndexOf('/') + 1));
			
			self.setIcon(IMG({
				src : SkyEditor.R('icon/git.png')
			}));
			
			// 깃 저장소인지 체크
			SkyEditor.IDE.checkExists({
				path : folderPath + '/.git'
			}, (exists) => {
				
				if (exists === true) {
					
					NEXT([
					(next) => {
						
						// 아이디, 비밀번호 정보가 없으면 정보 추가
						if (gitInfoStore.get(folderPath) === undefined) {
							
							let form;
							SkyDesktop.Confirm({
								okButtonTitle : '저장',
								msg : form = UUI.VALID_FORM({
									errorMsgs : {
										url : {
											notEmpty : '저장소 URL을 입력해주세요.'
										},
										username : {
											notEmpty : '아이디를 입력해주세요.'
										},
										password : {
											notEmpty : '비밀번호를 입력해주세요.'
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
										name : 'url',
										placeholder : '저장소 URL'
									}), INPUT({
										style : {
											marginTop : 10,
											width : 222,
											padding : 8,
											border : '1px solid #999',
											borderRadius : 4
										},
										name : 'username',
										placeholder : '아이디'
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
									})]
								})
							}, () => {
								
								let data = form.getData();
								
								let valid = VALID({
									url : {
										notEmpty : true
									},
									username : {
										notEmpty : true
									},
									password : {
										notEmpty : true
									}
								});
								
								let validResult = valid.check(data);
								
								if (validResult.checkHasError() === true) {
									form.showErrors(validResult.getErrors());
									return false;
								}
								
								else {
									
									gitInfoStore.save({
										name : folderPath,
										value : data
									});
									
									next();
								}
							});
							
						} else {
							next();
						}
					},
					
					() => {
						return () => {
							
							let list;
							
							let gitInfo = gitInfoStore.get(folderPath);
							
							let loadDiff = () => {
								
								list.empty();
								
								let loadingBar = SkyDesktop.LoadingBar('lime');
								
								SkyEditor.IDE.gitDiff({
									url : gitInfo.url,
									path : folderPath,
									username : gitInfo.username,
									password : gitInfo.password
								}, {
									error : (errorMsg) => {
										loadingBar.done();
										
										// 오류 발생
										SkyDesktop.Alert({
											msg : errorMsg
										});
									},
									success : (newFilePaths, updatedFilePaths, movedFilePaths, removedFilePaths) => {
										loadingBar.done();
										
										EACH(updatedFilePaths, (path) => {
											list.append(UUI.BUTTON_H({
												style : {
													padding : 5
												},
												icon : IMG({
													src : SkyEditor.R('icon/edit.png')
												}),
												spacing : 5,
												title : path
											}));
										});
										
										EACH(newFilePaths, (path) => {
											list.append(UUI.BUTTON_H({
												style : {
													padding : 5
												},
												icon : IMG({
													src : SkyEditor.R('icon/add.png')
												}),
												spacing : 5,
												title : path
											}));
										});
										
										EACH(movedFilePaths, (path) => {
											list.append(UUI.BUTTON_H({
												style : {
													padding : 5
												},
												icon : IMG({
													src : SkyEditor.R('icon/move.png')
												}),
												spacing : 5,
												title : path
											}));
										});
										
										EACH(removedFilePaths, (path) => {
											list.append(UUI.BUTTON_H({
												style : {
													padding : 5
												},
												icon : IMG({
													src : SkyEditor.R('icon/delete.png')
												}),
												spacing : 5,
												title : path
											}));
										});
									}
								});
							};
							
							let pushMessageInput;
							
							self.append(DIV({
								style : {
									padding : 10
								},
								c : [
									
								DIV({
									style : {
										padding : 5,
										backgroundColor : '#222'
									},
									c : UUI.BUTTON_H({
										style : {
											padding : 5
										},
										icon : IMG({
											src : SkyEditor.R('icon/setting.png')
										}),
										spacing : 5,
										title : 'Git 정보 변경',
										on : {
											tap : () => {
												
												let form;
												SkyDesktop.Confirm({
													okButtonTitle : '저장',
													msg : form = UUI.VALID_FORM({
														errorMsgs : {
															url : {
																notEmpty : '저장소 URL을 입력해주세요.'
															},
															username : {
																notEmpty : '아이디를 입력해주세요.'
															},
															password : {
																notEmpty : '비밀번호를 입력해주세요.'
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
															name : 'url',
															value : gitInfo.url,
															placeholder : '저장소 URL'
														}), INPUT({
															style : {
																marginTop : 10,
																width : 222,
																padding : 8,
																border : '1px solid #999',
																borderRadius : 4
															},
															name : 'username',
															value : gitInfo.username,
															placeholder : '아이디'
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
															value : gitInfo.password,
															placeholder : '비밀번호'
														})]
													})
												}, () => {
													
													let data = form.getData();
													
													let valid = VALID({
														url : {
															notEmpty : true
														},
														username : {
															notEmpty : true
														},
														password : {
															notEmpty : true
														}
													});
													
													let validResult = valid.check(data);
													
													if (validResult.checkHasError() === true) {
														form.showErrors(validResult.getErrors());
														return false;
													}
													
													else {
														
														gitInfoStore.save({
															name : folderPath,
															value : data
														});
														
														gitInfo = data;
													}
												});
											}
										}
									})
								}),
								
								DIV({
									style : {
										marginTop : 10,
										padding : 5,
										backgroundColor : '#222'
									},
									c : UUI.BUTTON_H({
										style : {
											padding : 5
										},
										icon : IMG({
											src : SkyEditor.R('icon/pull.png')
										}),
										spacing : 5,
										title : '풀',
										on : {
											tap : () => {
												
												let loadingBar = SkyDesktop.LoadingBar('lime');
												
												SkyEditor.IDE.gitPull({
													url : gitInfo.url,
													path : folderPath,
													username : gitInfo.username,
													password : gitInfo.password
												}, {
													error : (errorMsg) => {
														loadingBar.done();
														
														// 오류 발생
														SkyDesktop.Alert({
															msg : errorMsg
														});
													},
													success : () => {
														loadingBar.done();
														SkyDesktop.Noti('풀 받았습니다.');
														
														loadDiff();
													}
												});
											}
										}
									})
								}),
								
								DIV({
									style : {
										marginTop : 10,
										padding : 5,
										backgroundColor : '#222'
									},
									c : [UUI.BUTTON_H({
										style : {
											padding : 5
										},
										icon : IMG({
											src : SkyEditor.R('icon/push.png')
										}),
										spacing : 5,
										title : '푸시',
										on : {
											tap : () => {
												
												let loadingBar = SkyDesktop.LoadingBar('lime');
												
												SkyEditor.IDE.gitPush({
													url : gitInfo.url,
													path : folderPath,
													username : gitInfo.username,
													password : gitInfo.password,
													message : pushMessageInput.getValue()
												}, {
													error : (errorMsg) => {
														loadingBar.done();
														
														// 오류 발생
														SkyDesktop.Alert({
															msg : errorMsg
														});
													},
													success : () => {
														loadingBar.done();
														SkyDesktop.Noti('푸시했습니다.');
														
														pushMessageInput.setValue('no message');
														
														loadDiff();
													}
												});
											}
										}
									}),
									
									H3({
										style : {
											marginTop : 5
										},
										c : '푸시 메시지'
									}),
									pushMessageInput = UUI.FULL_INPUT({
										style : {
											marginTop : 5
										},
										value : 'no message'
									})]
								}),
								
								DIV({
									style : {
										marginTop : 10,
										padding : 5,
										backgroundColor : '#222'
									},
									c : [UUI.BUTTON_H({
										style : {
											padding : 5
										},
										icon : IMG({
											src : SkyEditor.R('icon/refresh.png')
										}),
										isIconRight : true,
										spacing : 10,
										title : '변경 내역',
										on : {
											tap : () => {
												loadDiff();
											}
										}
									}), list = DIV()]
								})]
							}));
							
							loadDiff();
						};
					}]);
				}
				
				else {
					
					SkyDesktop.Alert({
						msg : 'Git 저장소가 아닙니다.'
					});
					
					self.remove();
				}
			});
		}
	};
});
