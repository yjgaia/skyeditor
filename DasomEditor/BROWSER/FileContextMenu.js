DasomEditor.FileContextMenu = CLASS({

	preset : () => {
		return SkyDesktop.ContextMenu;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.path
		//REQUIRED: params.folderPath
		
		let path = params.path;
		let folderPath = params.folderPath;
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '새 파일',
			on : {
				tap : () => {
					
					SkyDesktop.Prompt('파일명을 입력해주시기 바랍니다.', (fileName) => {
						
						DasomEditor.IDE.save(DasomEditor.IDE.openEditor(DasomEditor.IDE.getEditor(fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase())({
							title : fileName,
							path : folderPath + '/' + fileName
						})));
					});
					
					self.remove();
				}
			}
		}))
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '복사',
			on : {
				tap : () => {
					
					DasomEditor.IDE.copy(path);
				
					self.remove();
				}
			}
		}));
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '붙여넣기',
			on : {
				tap : () => {
					
					DasomEditor.IDE.paste(folderPath);
					
					self.remove();
				}
			}
		}));
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '삭제',
			on : {
				tap : () => {
					
					DasomEditor.IDE.remove(path);
					
					self.remove();
				}
			}
		}));
		
		self.append(SkyDesktop.ContextMenuItem({
			title : '이름 변경',
			on : {
				tap : () => {
					
					SkyDesktop.Prompt({
						msg : '새 이름을 입력해주시기 바랍니다.',
						value : path.substring(path.lastIndexOf('/') + 1)
					}, (newName) => {
						
						DasomEditor.IDE.rename({
							path : path,
							newName : newName
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
	}
});
