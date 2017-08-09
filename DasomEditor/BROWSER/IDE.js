DasomEditor.IDE = CLASS({

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
		
		let addTab = self.addTab = (tab) => {
			tabGroup.addTab(tab);
		};
		
		if (showHome !== undefined) {
			showHome(self);
		}
	}
});
