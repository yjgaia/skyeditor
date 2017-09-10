DasomEditor.FileContextMenu = CLASS({

	preset : () => {
		return SkyDesktop.ContextMenu;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.path
		//REQUIRED: params.folderPath
		
		let path = params.path;
		let folderPath = params.folderPath;
		
		let selectedFileItems = DasomEditor.IDE.getSelectedFileItems();
		
		if (selectedFileItems.length > 0) {
			
			self.append(SkyDesktop.ContextMenuItem({
				title : '열기',
				on : {
					tap : () => {
						
						EACH(selectedFileItems, (selectedFileItem) => {
							if (selectedFileItem.checkIsInstanceOf(DasomEditor.Folder) === true) {
								selectedFileItem.open();
							} else if (selectedFileItem.checkIsInstanceOf(DasomEditor.File) === true) {
								selectedFileItem.fireEvent('doubletap');
							}
						});
						
						self.remove();
					}
				}
			}))
		}
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '새 파일',
			on : {
				tap : () => {
					
					SkyDesktop.Prompt('파일명을 입력해주시기 바랍니다.', (fileName) => {
						
						if (fileName.trim() !== '') {
							
							DasomEditor.IDE.save(DasomEditor.IDE.openEditor(DasomEditor.IDE.getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
								title : fileName,
								path : folderPath + '/' + fileName
							})));
						}
					});
					
					self.remove();
				}
			}
		}))
		
		if (selectedFileItems.length > 0) {
			
			self.append(SkyDesktop.ContextMenuItem({
				title : '복사',
				on : {
					tap : () => {
						
						let paths = [];
						
						EACH(selectedFileItems, (selectedFileItem) => {
							paths.push(selectedFileItem.getPath());
						});
						
						DasomEditor.IDE.copy(paths);
					
						self.remove();
					}
				}
			}));
		}
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '붙여넣기',
			on : {
				tap : () => {
					
					DasomEditor.IDE.paste(folderPath);
					
					self.remove();
				}
			}
		}));
		
		if (selectedFileItems.length > 0) {
			
			self.append(SkyDesktop.ContextMenuItem({
				title : '삭제',
				on : {
					tap : () => {
						
						SkyDesktop.Confirm({
							msg : '정말 삭제 하시겠습니까?'
						}, () => {
							
							EACH(selectedFileItems, (selectedFileItem) => {
								DasomEditor.IDE.remove(selectedFileItem.getPath());
							});
						});
						
						self.remove();
					}
				}
			}));
		}
		
		if (path !== undefined && selectedFileItems.length === 1) {
			
			self.append(SkyDesktop.ContextMenuItem({
				title : '이름 변경',
				on : {
					tap : () => {
						
						SkyDesktop.Prompt({
							msg : '새 이름을 입력해주시기 바랍니다.',
							value : path.substring(path.lastIndexOf('/') + 1)
						}, (newName) => {
							
							DasomEditor.IDE.deselectFiles();
							
							DasomEditor.IDE.move({
								from : path,
								to : path.substring(0, path.lastIndexOf('/')) + '/' + newName
							});
						});
						
						self.remove();
					}
				}
			}));
			
			self.append(SkyDesktop.ContextMenuItem({
				title : '파일 정보',
				on : {
					tap : () => {
						
						DasomEditor.IDE.getInfo(path, (info) => {
							
							let createTimeCal = CALENDAR(info.createTime);
							let lastUpdateTimeCal = CALENDAR(info.lastUpdateTime);
							
							let table;
							SkyDesktop.Alert({
								style : {
									onDisplayResize : (width, height) => {
					
										if (width > 400) {
											return {
												width : 380
											};
										} else {
											return {
												width : '90%'
											};
										}
									}
								},
								msg : table = TABLE({
									style : {
										textAlign : 'left'
									},
									c : [TR({
										c : [TH({
											style : {
												width : 90
											},
											c : '경로'
										}), TD({
											style : {
												wordBreak : 'break-all'
											},
											c : path
										})]
									}), TR({
										c : [TH({
											style : {
												width : 60
											},
											c : '파일 생성일'
										}), TD({
											style : {
												wordBreak : 'break-all'
											},
											c : createTimeCal.getYear() + '년 ' + createTimeCal.getMonth() + '월 ' + createTimeCal.getDate() + '일 ' + createTimeCal.getHour() + '시 ' + createTimeCal.getMinute() + '분'
										})]
									}), TR({
										c : [TH({
											style : {
												width : 60
											},
											c : '최종 수정일'
										}), TD({
											style : {
												wordBreak : 'break-all'
											},
											c : lastUpdateTimeCal.getYear() + '년 ' + lastUpdateTimeCal.getMonth() + '월 ' + lastUpdateTimeCal.getDate() + '일 ' + lastUpdateTimeCal.getHour() + '시 ' + lastUpdateTimeCal.getMinute() + '분'
										})]
									})]
								})
							});
							
							if (info.size !== undefined) {
								
								table.append(TR({
									c : [TH({
										style : {
											width : 60
										},
										c : '파일 크기'
									}), TD({
										style : {
											wordBreak : 'break-all'
										},
										c : Math.ceil(info.size / 1000) + 'KB'
									})]
								}));
							}
						});
						
						self.remove();
					}
				}
			}));
			
			if (selectedFileItems[0].checkIsInstanceOf(DasomEditor.File) === true) {
				
				self.append(SkyDesktop.ContextMenuItem({
					title : '로컬 저장 기록 보기',
					on : {
						tap : () => {
							
							let tab;
							let historyList;
							
							DasomEditor.IDE.addTab(tab = SkyDesktop.Tab({
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
								}), historyList = DIV()]
							}));
							
							let history = DasomEditor.IDE.getLocalHistory(path);
							
							REVERSE_EACH(history, (info) => {
								
								let cal = CALENDAR(info.time);
								let title = cal.getYear() + '-' + cal.getMonth(true) + '-' + cal.getDate(true) + ' ' + cal.getHour(true) + ':' + cal.getMinute(true);
								
								historyList.append(DasomEditor.HistoryItem({
									title : title,
									on : {
										doubletap : () => {
											
											DasomEditor.IDE.load(path, (content) => {
												
												DasomEditor.IDE.openEditor(DasomEditor.CompareEditor({
													title : '로컬 저장 기록 비교 (현재 - ' + title + ')',
													path1 : path,
													content1 : content,
													content2 : info.content
												}));
											});
										}
									}
								}));
							});
							
							self.remove();
						}
					}
				}));
			}
		}
		
		if (selectedFileItems.length > 0) {
			
			self.append(SkyDesktop.ContextMenuItem({
				title : '검색',
				on : {
					tap : () => {
						
						DasomEditor.IDE.search();
						
						self.remove();
					}
				}
			}));
		}
		
		if (selectedFileItems.length >= 2) {
			
			let item1;
			let item2;
			
			EACH(selectedFileItems, (item) => {
				if (item.checkIsInstanceOf(DasomEditor.File) === true) {
					if (item1 === undefined) {
						item1 = item;
					} else {
						item2 = item;
						return false;
					}
				}
			});
			
			if (item2 !== undefined) {
				
				self.append(SkyDesktop.ContextMenuItem({
					title : '두 파일 비교',
					on : {
						tap : () => {
							
							let path1 = item1.getPath();
							let path2 = item2.getPath();
							
							DasomEditor.IDE.load(path1, (content1) => {
								DasomEditor.IDE.load(path2, (content2) => {
									
									let fileName1 = path1.substring(path1.lastIndexOf('/') + 1);
									let fileName2 = path2.substring(path2.lastIndexOf('/') + 1);
									
									DasomEditor.IDE.openEditor(DasomEditor.CompareEditor({
										title : '두 파일 비교 (' + fileName1 + ' - ' + fileName2 + ')',
										path1 : path1,
										content1 : content1,
										path2 : path2,
										content2 : content2
									}));
								});
							});
							
							self.remove();
						}
					}
				}));
			}
		}
	}
});
