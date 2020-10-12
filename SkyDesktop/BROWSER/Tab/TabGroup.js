SkyDesktop.TabGroup = CLASS({
	
	preset : () => {
		return TABLE;
	},
	
	params : () => {
		return {
			style : {
				height : '100%',
				backgroundColor : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#333' : '#ccc'
			}
		};
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.homeTab
		//OPTIONAL: params.tabs
		//OPTIONAL: params.activeTabIndex
		
		let homeTab;
		
		if (params !== undefined) {
			homeTab = params.homeTab;
		}
		
		let tabTitles = [];
		let tabs = [];
		let history = [];
		
		let activeTabIndex = -1;
		
		let clearBoth = CLEAR_BOTH();
		
		let tabTitleGroup;
		TR({
			c : tabTitleGroup = TD({
				style : {
					height : 27,
					userSelect : 'none',
					MozUserSelect : 'none'
				}
			})
		}).appendTo(self);
		
		let content;
		TR({
			c : content = TD({
				style : {
					height : '100%'
				},
				c : homeTab
			})
		}).appendTo(self);
		
		let activeTab = self.activeTab = (tabIndex) => {
			
			EACH(tabTitles, (tabTitle) => {
				tabTitle.addStyle({
					backgroundColor : 'transparent'
				});
			});
			
			EACH(tabs, (tab, i) => {
				tab.hide();
				if (i === activeTabIndex) {
					tab.fireEvent('deactive');
				}
			});
			
			activeTabIndex = tabIndex;
			
			tabTitles[tabIndex].addStyle({
				backgroundColor : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#000' : '#fff'
			});
			
			tabs[tabIndex].show();
			
			tabs[tabIndex].fireEvent('active');
			
			history.push(tabs[tabIndex]);
		};
		
		let getActiveTab = self.getActiveTab = () => {
			return tabs[activeTabIndex];
		};
		
		let getActiveTabIndex = self.getActiveTabIndex = () => {
			return activeTabIndex;
		};
		
		let getAllTabs = self.getAllTabs = () => {
			return tabs;
		};
		
		let removeAllTabs = self.removeAllTabs = () => {
			
			let isNotToClose = false;
			
			EACH(tabs, (tab) => {
				if (tab.fireEvent('close') === false) {
					isNotToClose = true;
					return false;
				}
			});
			
			if (isNotToClose !== true) {
				
				EACH(tabs, (tab) => {
					tab.remove();
				});
				
				tabTitles = [];
				tabs = [];
				
				activeTabIndex = -1;
			}
		};
		
		let addTab = self.addTab = (tab) => {
			
			let tabTitle;
			let originColor;
			
			let touchmoveEvent;
			let touchendEvent;
			
			tabTitleGroup.append(tabTitle = UUI.BUTTON_H({
				style : {
					padding : '5px 10px',
					height : 17,
					flt : 'left',
					cursor : 'default'
				},
				icon : tab.getIcon(),
				spacing : 5,
				on : {
					touchstart : (e) => {
						e.stopDefault();
						
						touchmoveEvent = EVENT('touchmove', (e) => {
							
							if (e.getLeft() < tabTitle.getLeft()) {
								
								let prev = tabTitleGroup.getChildren()[FIND({
									array : tabTitleGroup.getChildren(),
									value : tabTitle
								}) - 1];
								
								if (prev !== undefined && e.getLeft() < prev.getLeft() + prev.getWidth() / 2) {
									
									let tabIndex = FIND({
										array : tabTitles,
										value : tabTitle
									});
									
									let prevIndex = FIND({
										array : tabTitles,
										value : prev
									});
									
									tabTitle.insertBefore(prev);
									
									let t = tabs[tabIndex];
									tabs[tabIndex] = tabs[prevIndex];
									tabs[prevIndex] = t;
									
									t = tabTitles[tabIndex];
									tabTitles[tabIndex] = tabTitles[prevIndex];
									tabTitles[prevIndex] = t;
									
									activeTab(prevIndex);
								}
							}
							
							if (e.getLeft() > tabTitle.getLeft() + tabTitle.getWidth()) {
								
								let next = tabTitleGroup.getChildren()[FIND({
									array : tabTitleGroup.getChildren(),
									value : tabTitle
								}) + 1];
								
								if (next !== undefined && next.checkIsInstanceOf(CLEAR_BOTH) !== true && e.getLeft() > next.getLeft() - next.getWidth() / 2) {
									
									let tabIndex = FIND({
										array : tabTitles,
										value : tabTitle
									});
									
									let nextIndex = FIND({
										array : tabTitles,
										value : next
									});
									
									tabTitle.insertAfter(next);
									
									let t = tabs[tabIndex];
									tabs[tabIndex] = tabs[nextIndex];
									tabs[nextIndex] = t;
									
									t = tabTitles[tabIndex];
									tabTitles[tabIndex] = tabTitles[nextIndex];
									tabTitles[nextIndex] = t;
									
									activeTab(nextIndex);
								}
							}
						});
						
						touchendEvent = EVENT('touchend', () => {
							
							if (touchmoveEvent !== undefined) {
								touchmoveEvent.remove();
								touchmoveEvent = undefined;
							}
							
							if (touchendEvent !== undefined) {
								touchendEvent.remove();
								touchendEvent = undefined;
							}
						});
					},
					doubletap : () => {
						self.fireEvent('titledoubletap');
					},
					mouseover : () => {
						
						if (activeTabIndex !== FIND({
							array : tabs,
							value : tab
						})) {
							
							tabTitle.addStyle({
								backgroundColor : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#003333' : '#AFCEFF'
							});
						}
					},
					mouseout : () => {
						
						if (activeTabIndex !== FIND({
							array : tabs,
							value : tab
						})) {
							
							tabTitle.addStyle({
								backgroundColor : 'transparent'
							});
						}
					},
					tap : () => {
						activeTab(FIND({
							array : tabs,
							value : tab
						}));
					},
					contextmenu : (e) => {
						
						let contextMenu = SkyDesktop.ContextMenu({
							e : e,
							c : [SkyDesktop.ContextMenuItem({
								title : '닫기',
								on : {
									tap : () => {
										
										if (tab.fireEvent('close') !== false) {
											tab.remove();
										}
										
										contextMenu.remove();
									}
								}
							}), SkyDesktop.ContextMenuItem({
								title : '나머지 모두 닫기',
								on : {
									tap : () => {
										
										let nowTab = tab;
										let isNotToClose = false;
										
										EACH(tabs, (tab) => {
											if (tab !== nowTab && tab.fireEvent('close') === false) {
												isNotToClose = true;
												return false;
											}
										});
										
										if (isNotToClose !== true) {
										
											EACH(tabs, (tab) => {
												if (tab !== nowTab) {
													tab.remove();
												}
											});
										}
										
										contextMenu.remove();
									}
								}
							}), SkyDesktop.ContextMenuItem({
								title : '전부 닫기',
								on : {
									tap : () => {
										
										removeAllTabs();
										
										contextMenu.remove();
									}
								}
							})]
						});
						
						e.stop();
					}
				}
			}));
			
			tabTitleGroup.append(clearBoth);
			
			tabTitles.push(tabTitle);
			
			tab.on('iconchange', () => {
				tabTitle.setIcon(tab.getIcon());
			});
			
			tab.on('titlechange', () => {
				
				tabTitle.setTitle(SPAN({
					c : tab.checkIsCannotClose() === true ? tab.getTitle() : [tab.getTitle(), UUI.ICON_BUTTON({
						style : {
							marginLeft : 10,
							color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc'
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
								
								if (tab.fireEvent('close') !== false) {
									tab.remove();
								}
							}
						}
					})]
				}));
			});
			
			tab.fireEvent('titlechange');
			
			content.append(tab);
			
			tabs.push(tab);
			
			activeTab(tabs.length - 1);
			
			tab.on('remove', () => {
				
				let tabIndex = FIND({
					array : tabs,
					value : tab
				});
				
				if (tabIndex !== undefined) {
					
					tabTitles[tabIndex].remove();
					tabTitles.splice(tabIndex, 1);
					
					tabs[tabIndex].remove();
					tabs.splice(tabIndex, 1);
					
					// 활성화된 탭이면 히스토리에서 찾기
					if (tabIndex === activeTabIndex) {
						
						history.pop();
						
						if (history.length > 0 && FIND({
							array : tabs,
							value : history[history.length - 1]
						}) !== undefined) {
							activeTab(FIND({
								array : tabs,
								value : history[history.length - 1]
							}));
						}
						
						else if (activeTabIndex - 1 >= 0) {
							activeTab(activeTabIndex - 1);
						} else if (tabs.length > 0) {
							activeTab(0);
						} else {
							activeTabIndex = -1;
						}
					}
					
					else if (tabIndex < activeTabIndex) {
						
						if (activeTabIndex - 1 >= 0) {
							activeTab(activeTabIndex - 1);
						} else if (tabs.length > 0) {
							activeTab(0);
						} else {
							activeTabIndex = -1;
						}
					}
				}
				
				// 히스토리에서 제거
				history.splice(FIND({
					array : history,
					value : tab
				}), 1);
				
				tab = undefined;
			});
		};
		
		if (params !== undefined) {
			if (params.tabs !== undefined) {
				EACH(params.tabs, addTab);
			}
			if (params.activeTabIndex !== undefined) {
				activeTab(params.activeTabIndex);
			}
		}
	}
});
