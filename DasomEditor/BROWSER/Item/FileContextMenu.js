DasomEditor.FileContextMenu = CLASS({

	preset : () => {
		return SkyDesktop.ContextMenu;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.ftpInfo
		//OPTIONAL: params.path
		//REQUIRED: params.folderPath
		
		let ftpInfo = params.ftpInfo;
		
		let path = params.path;
		let folderPath = params.folderPath;
		
		let selectedFileItems = DasomEditor.IDE.getSelectedFileItems();
		
		if (selectedFileItems.length > 0) {
			
			self.append(SkyDesktop.ContextMenuItem({
				title : '열기',
				icon : IMG({
					src : DasomEditor.R('icon/open.png')
				}),
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
			}));
		}
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '새 파일',
			icon : IMG({
				src : SkyDesktop.R('file.png')
			}),
			on : {
				tap : () => {
					
					SkyDesktop.Prompt('파일명을 입력해주시기 바랍니다.', (fileName) => {
						
						if (fileName.trim() !== '') {
							
							RUN((f) => {
								
								// 이미 해당하는 파일이 존재하는지 체크
								DasomEditor.IDE.checkExists({
									ftpInfo : ftpInfo,
									path : folderPath + '/' + fileName
								}, (exists) => {
									
									if (exists === true) {
										
										let extname = '';
										let index = fileName.lastIndexOf('.');
										
										if (index !== -1) {
											extname = fileName.substring(index);
											fileName = fileName.substring(0, index);
										}
										
										fileName = fileName + ' (2)' + extname;
										
										f();
									}
									
									else {
										
										DasomEditor.IDE.saveTab(DasomEditor.IDE.openEditor(DasomEditor.IDE.getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
											ftpInfo : ftpInfo,
											title : fileName,
											path : folderPath + '/' + fileName
										})));
									}
								});
							});
						}
					});
					
					self.remove();
				}
			}
		}));
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '새 폴더',
			icon : IMG({
				src : SkyDesktop.R('folder.png')
			}),
			on : {
				tap : () => {
					
					SkyDesktop.Prompt('폴더명을 입력해주시기 바랍니다.', (folderName) => {
						
						if (folderName.trim() !== '') {
							
							DasomEditor.IDE.createFolder({
								ftpInfo : ftpInfo,
								path : folderPath + '/' + folderName
							});
						}
					});
					
					self.remove();
				}
			}
		}));
		
		if (selectedFileItems.length > 0) {
			
			self.append(SkyDesktop.ContextMenuItem({
				title : '복사',
				icon : IMG({
					src : DasomEditor.R('icon/copy.png')
				}),
				on : {
					tap : () => {
						
						let pathInfos = [];
						
						EACH(selectedFileItems, (selectedFileItem) => {
							pathInfos.push({
								ftpInfo : selectedFileItem.getFTPInfo(),
								path : selectedFileItem.getPath()
							});
						});
						
						DasomEditor.IDE.copy(pathInfos);
					
						self.remove();
					}
				}
			}));
		}
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '붙여넣기',
			icon : IMG({
				src : DasomEditor.R('icon/paste.png')
			}),
			on : {
				tap : () => {
					
					DasomEditor.IDE.paste({
						ftpInfo : ftpInfo,
						folderPath : folderPath
					});
					
					self.remove();
				}
			}
		}));
		
		if (selectedFileItems.length > 0) {
			
			self.append(SkyDesktop.ContextMenuItem({
				title : '삭제',
				icon : IMG({
					src : DasomEditor.R('icon/delete.png')
				}),
				on : {
					tap : () => {
						
						SkyDesktop.Confirm({
							msg : '정말 삭제 하시겠습니까?'
						}, () => {
							
							EACH(selectedFileItems, (selectedFileItem) => {
								DasomEditor.IDE.remove({
									ftpInfo : selectedFileItem.getFTPInfo(),
									path : selectedFileItem.getPath()
								});
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
				icon : IMG({
					src : DasomEditor.R('icon/rename.png')
				}),
				on : {
					tap : () => {
						
						SkyDesktop.Prompt({
							msg : '새 이름을 입력해주시기 바랍니다.',
							value : path.substring(path.lastIndexOf('/') + 1)
						}, (newName) => {
							
							DasomEditor.IDE.deselectFiles();
							
							DasomEditor.IDE.move({
								fromFTPInfo : ftpInfo,
								toFTPInfo : ftpInfo,
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
				icon : IMG({
					src : DasomEditor.R('icon/info.png')
				}),
				on : {
					tap : () => {
						
						DasomEditor.IDE.getInfo({
							ftpInfo : ftpInfo,
							path : path
						}, (info) => {
							
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
					icon : IMG({
						src : DasomEditor.R('icon/history.png')
					}),
					on : {
						tap : () => {
							
							let tab;
							let xButton;
							let historyList;
							
							DasomEditor.IDE.addTab(tab = SkyDesktop.Tab({
								style : {
									position : 'relative'
								},
								size : 30,
								c : [xButton = UUI.ICON_BUTTON({
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
								}), historyList = DIV()],
								on : {
									scroll : () => {
										xButton.addStyle({
											top : 8 + tab.getScrollTop()
										});
									}
								}
							}));
							
							DasomEditor.IDE.load({
								path : path
							}, (content) => {
								
								let history = DasomEditor.IDE.getLocalHistory({
									ftpInfo : ftpInfo,
									path : path
								});
								
								REVERSE_EACH(history, (info) => {
									
									if (info.content !== content) {
										
										let cal = CALENDAR(info.time);
										let title = cal.getYear() + '-' + cal.getMonth(true) + '-' + cal.getDate(true) + ' ' + cal.getHour(true) + ':' + cal.getMinute(true);
										
										historyList.append(DasomEditor.HistoryItem({
											title : title,
											on : {
												doubletap : () => {
													
													DasomEditor.IDE.openEditor(DasomEditor.CompareEditor({
														title : '로컬 저장 기록 비교 (현재 - ' + title + ')',
														path1 : path,
														content1 : content,
														content2 : info.content
													}));
												}
											}
										}));
									}
								});
							});
							
							self.remove();
						}
					}
				}));
			}
		}
		
		if (ftpInfo === undefined && selectedFileItems.length > 0) {
			
			self.append(SkyDesktop.ContextMenuItem({
				title : '검색',
				icon : IMG({
					src : DasomEditor.R('icon/search.png')
				}),
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
					icon : IMG({
						src : DasomEditor.R('icon/compare.png')
					}),
					on : {
						tap : () => {
							
							let path1 = item1.getPath();
							let path2 = item2.getPath();
							
							DasomEditor.IDE.load({
								ftpInfo : item1.getFTPInfo(),
								path : path1
							}, (content1) => {
								
								DasomEditor.IDE.load({
									ftpInfo : item2.getFTPInfo(),
									path : path2
								}, (content2) => {
									
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
		
		if (folderPath.substring(0, folderPath.lastIndexOf('/')) === DasomEditor.IDE.getWorkspacePath()) {
			
			self.append(SkyDesktop.ContextMenuItem({
				title : 'Git 설정',
				icon : IMG({
					src : DasomEditor.R('icon/git.png')
				}),
				on : {
					tap : () => {
						
						DasomEditor.IDE.openEditor(DasomEditor.GitEditor({
							folderPath : folderPath
						}));
						
						self.remove();
					}
				}
			}));
		}
	}
});
