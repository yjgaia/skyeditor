SkyEditor.FTPItem = CLASS({

	preset : () => {
		return UUI.BUTTON_H;
	},

	params : () => {
		
		return {
			style : {
				position : 'relative',
				marginLeft : 20,
				padding : '2px 5px',
				cursor : 'default'
			},
			icon : IMG({
				src : SkyEditor.R('icon/ftp.png')
			}),
			spacing : 5,
			isToFixWrapperSize : true
		};
	},
	
	init : (inner, self, ftpInfo) => {
		//REQUIRED: ftpInfo
		
		let openListButton;
		self.append(openListButton = UUI.ICON_BUTTON({
			style : {
				position : 'absolute',
				left : -12,
				top : 3,
				color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc'
			},
			icon : FontAwesome.GetIcon('chevron-right'),
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
				},
				tap : (e) => {
					if (list.checkIsShowing() === true) {
						close();
					} else {
						open();
					}
					e.stop();
				}
			}
		}));
		
		let list = UUI.LIST({
			style : {
				marginLeft : 20
			}
		});
		
		self.after(list);
		
		let open = self.open = () => {
			
			list.show();
			
			openListButton.setIcon(FontAwesome.GetIcon('chevron-down'));
			openListButton.addStyle({
				left : -14,
				top : 1,
			});
			
			self.fireEvent('open');
		};
		
		let close = self.close = () => {
			
			list.hide();
			
			openListButton.setIcon(FontAwesome.GetIcon('chevron-right'));
			openListButton.addStyle({
				left : -12,
				top : 2,
			});
			
			self.fireEvent('close');
		};
		
		list.hide();
		
		self.on('doubletap', () => {
			if (list.checkIsShowing() === true) {
				close();
			} else {
				open();
			}
		});
		
		self.on('remove', () => {
			DELAY(() => {
				list.remove();
			});
		});

		let sortItems = () => {
			list.sortItems((a, b) => {
				if ((a.checkIsInstanceOf(SkyDesktop.File) === true && b.checkIsInstanceOf(SkyDesktop.File) === true) || (a.checkIsInstanceOf(SkyDesktop.Folder) === true && b.checkIsInstanceOf(SkyDesktop.Folder) === true)) {
					return a.getTitle().toLowerCase().localeCompare(b.getTitle().toLowerCase());
				} else {
					if (a.checkIsInstanceOf(SkyDesktop.File) === true && b.checkIsInstanceOf(SkyDesktop.Folder) === true) {
						return 1;
					} else if (a.checkIsInstanceOf(SkyDesktop.Folder) === true && b.checkIsInstanceOf(SkyDesktop.File) === true) {
						return -1;
					} else if (a.checkIsInstanceOf(SkyDesktop.File) !== true && a.checkIsInstanceOf(SkyDesktop.Folder) !== true) {
						return 1;
					} else if (b.checkIsInstanceOf(SkyDesktop.File) !== true && b.checkIsInstanceOf(SkyDesktop.Folder) !== true) {
						return -1;
					} else {
						return 0;
					}
				}
			});
		};
		
		let addItem = self.addItem = (params) => {
			//REQUIRED: params
			//REQUIRED: params.key
			//REQUIRED: params.item
			
			list.addItem(params);
			sortItems();
		};

		let getItems = self.getItems = () => {
			return list.getItems();
		};

		let getItem = self.getItem = (key) => {
			//REQUIRED: key
			
			return list.getItem(key);
		};
		
		let removeItem = self.removeItem = (key) => {
			//REQUIRED: key

			list.removeItem(key);
			sortItems();
		};
		
		let removeAllItems = self.removeAllItems = () => {
			list.removeAllItems();
		};
		
		let isSelected;
		
		self.on('mouseover', (e, self) => {
			if (isSelected !== true) {
				self.addStyle({
					backgroundColor : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#003333' : '#AFCEFF'
				});
			}
		});
		
		self.on('mouseout', (e, self) => {
			if (isSelected !== true) {
				self.addStyle({
					backgroundColor : 'transparent'
				});
			}
		});
		
		self.on('contextmenu', (e) => {
			
			let contextMenu = SkyDesktop.ContextMenu({
				e : e,
				c : [SkyDesktop.ContextMenuItem({
					title : '정보 수정',
					on : {
						tap : () => {
							
							let form;
							let privateKey = ftpInfo.privateKey;
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
										value : ftpInfo.title,
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
										value : ftpInfo.host,
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
										value : ftpInfo.port,
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
										value : ftpInfo.protocol,
										c : [OPTION({
								            value : 'ftp',
								            c : 'FTP'
								        }), OPTION({
								            value : 'sftp',
								            c : 'SFTP'
								        })],
								        on : {
								        	change : (e, select) => {
								        		if (privateKeyInput !== undefined) {
									        		if (select.getValue() === 'sftp') {
									        			privateKeyInput.show();
									        		} else {
									        			privateKeyInput.hide();
									        		}
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
										value : ftpInfo.username,
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
										value : ftpInfo.password,
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
												change : (e, input) => {
													
													let fileReader = new FileReader();
													fileReader.readAsText(input.getFiles()[0]);
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
										
										SkyEditor.IDE.ftpDestroy(ftpInfo, () => {
											
											SkyEditor.IDE.ftpNew(data, () => {
												
												self.setTitle(data.title);
												
												close();
												
												ftpInfo = data;
												
												loadingBar.done();
											});
										});
									}
								}
							});
							
							contextMenu.remove();
						}
					}
				}), SkyDesktop.ContextMenuItem({
					title : '삭제',
					on : {
						tap : () => {
							
							SkyDesktop.Confirm({
								msg : '정말 삭제 하시겠습니까?'
							}, () => {
								
								let loadingBar = SkyDesktop.LoadingBar('lime');
								
								SkyEditor.IDE.ftpDestroy(ftpInfo, () => {
									
									loadingBar.done();
									
									self.remove();
								});
							});
							
							contextMenu.remove();
						}
					}
				})]
			});
			
			e.stop();
		});
		
		let select = self.select = () => {
			self.addStyle({
				backgroundColor : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#17344D' : '#A2C5FF'
			});
			isSelected = true;
		};
		
		let checkIsSelected = self.checkInSelected = () => {
			return isSelected;
		};
		
		let deselect = self.deselect = () => {
			self.addStyle({
				backgroundColor : 'transparent'
			});
			isSelected = false;
		};
	}
});
