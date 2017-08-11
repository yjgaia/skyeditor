DasomEditor.IDE = CLASS((cls) => {
	
	let editorMap = {};
	
	let addEditor = cls.addEditor = (params) => {
		//REQUIRED: params
		//REQUIRED: params.extname
		//REQUIRED: params.editor
		
		let extname = params.extname;
		let editor = params.editor;
		
		if (editorMap[extname] === undefined) {
			editorMap[extname] = [];
		}
		
		editorMap[extname].push(editor);
	};
	
	return {
	
		preset : () => {
			return TABLE;
		},
		
		params : () => {
			return {
				style : {
					position : 'absolute',
					width : '100%',
					height : '100%'
				}
			};
		},
	
		init : (inner, self, handlers) => {
			//REQUIRED: handlers
			//OPTIONAL: handlers.showHome
			//REQUIRED: handlers.save
			
			let editorSettingStore = DasomEditor.STORE('editorSettingStore');
			
			let showHome = handlers.showHome;
			
			let toolbar;
			self.append(TR({
				c : TD({
					style : {
						height : 28
					},
					c : toolbar = SkyDesktop.Toolbar({
						buttons : [SkyDesktop.ToolbarButton({
							icon : IMG({
								src : DasomEditor.R('icon/home.png')
							}),
							title : '홈',
							on : {
								tap : () => {
									showHome(self);
								}
							}
						}), SkyDesktop.ToolbarButton({
							icon : IMG({
								src : SkyDesktop.R('file.png')
							}),
							title : '새 파일',
							on : {
								tap : () => {
									addTab(DasomEditor.TextEditor({
										title : '제목 없음'
									}));
								}
							}
						}), SkyDesktop.ToolbarButton({
							icon : IMG({
								src : DasomEditor.R('icon/save.png')
							}),
							title : '저장',
							on : {
								tap : () => {
									SkyDesktop.Noti('저장하였습니다.');
								}
							}
						}), SkyDesktop.ToolbarButton({
							icon : IMG({
								src : DasomEditor.R('icon/setting.png')
							}),
							title : '에디터 설정',
							on : {
								tap : () => {
									
									let list;
									
									SkyDesktop.Confirm({
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
											c : '에디터 설정'
										}), list = DIV({
											style : {
												marginTop : 5,
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
															height : '90%'
														};
													}
												}
											}
										})]
									}, () => {
										
									});
									
									EACH(editorMap, (editors, extname) => {
										
										let editorList = DIV({
											style : {
												padding : '5px 8px',
												backgroundColor : '#fff',
												border : '1px solid #999',
												borderRadius : 4,
												marginBottom : 10
											},
											c : H3({
												style : {
													marginBottom : 5
												},
												c : [SPAN({
													style : {
														fontWeight : 'bold'
													},
													c : extname
												}), ' 파일 에디터 선택']
											})
										}).appendTo(list);
										
										EACH(editors, (editor, i) => {
											
											let input;
											editorList.append(P({
												c : [input = INPUT({
													style : {
														marginTop : 2,
														flt : 'left'
													},
													type : 'radio',
													name : extname,
													value : (editorSettingStore.get(extname) === undefined && i === 0) || editorSettingStore.get(extname) === editor.getName(),
													on : {
														change : () => {
															editorSettingStore.save({
																name : extname,
																value : editor.getName()
															});
														}
													}
												}), UUI.BUTTON_H({
													style : {
														marginLeft : 5,
														flt : 'left'
													},
													icon : editor.getIcon(),
													spacing : 5,
													title : editor.getName(),
													on : {
														tap : () => {
															input.toggleCheck();
														}
													}
												}), CLEAR_BOTH()]
											}));
										});
									});
								}
							}
						})]
					})
				})
			}));
			
			let addToolbarButton = self.addToolbarButton = (toolbarButton) => {
				toolbar.addButton(toolbarButton);
			};
			
			let fileTree;
			let tabGroup;
			self.append(TR({
				c : TD({
					c : SkyDesktop.HorizontalTabList({
						tabs : [SkyDesktop.Tab({
							size : 23,
							c : fileTree = SkyDesktop.FileTree()
						}), SkyDesktop.Tab({
							size : 77,
							c : tabGroup = SkyDesktop.TabGroup()
						})]
					})
				})
			}));
			
			let addFile = self.addFile = (file) => {
				fileTree.addItem(file);
			};
			
			let clearFileTree = self.clearFileTree = (file) => {
				fileTree.removeAllItems();
			};
			
			let addTab = self.addTab = (tab) => {
				tabGroup.addTab(tab);
			};
			
			if (showHome !== undefined) {
				showHome(self);
			}
		}
	};
});
