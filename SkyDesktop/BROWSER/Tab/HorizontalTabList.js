SkyDesktop.HorizontalTabList = CLASS({
	
	preset : () => {
		return TABLE;
	},
	
	params : () => {
		return {
			style : {
				height : '100%'
			}
		};
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.tabs
		
		let tr = TR().appendTo(self);
		
		let tabs = [];
		let tds = [];
		let dividers = [];
		
		let resizeTabsSize = () => {

			EACH(tds, (td) => {
				td.addStyle({
					width : 0
				});
			});
			
			let totalWidth = self.getWidth();
			
			let totalSize = 0;
			let noSizeCount = 0;
			
			EACH(tabs, (tab) => {
				if (tab.getSize() === undefined) {
					noSizeCount += 1;
				} else {
					totalSize += tab.getSize();
				}
			});
			
			let avgSize = totalSize / (tabs.length - noSizeCount);
			
			totalSize += avgSize * noSizeCount;
			
			EACH(tabs, (tab, i) => {
				
				let width = totalWidth * (tab.getSize() === undefined ? avgSize : tab.getSize()) / totalSize;
				
				tab.setToWidth(width);
				
				tds[i].addStyle({
					width : width
				});
			});
			
			EACH(dividers, (divider, i) => {
				
				divider.addStyle({
					left : tds[i].getLeft() + tds[i].getWidth(),
					top : self.getTop(),
					height : self.getHeight()
				});
			});
		};
		
		let addTab = self.addTab = (tab) => {
			
			tabs.push(tab);
			
			let td;
			
			tr.append(td = TD({
				style : {
					height : '100%'
				},
				c : tab
			}));
			
			tds.push(td);
			
			let divider;
			
			if (tabs.length > 1) {
				
				tab.addStyle({
					marginLeft : 6
				});
				
				let beforeTab = tabs[tabs.length - 2];
				let beforeTd = tds[tds.length - 2];
				
				let touchmoveEvent;
				let touchendEvent;
				
				self.append(divider = DIV({
					style : {
						position : 'absolute',
						top : 0,
						width : 6,
						cursor : 'e-resize',
						backgroundColor : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#333' : '#ccc'
					},
					on : {
						touchstart : (e) => {
							
							let startLeft = e.getLeft();
							let beforeTdOriginWidth = beforeTd.getWidth();
							let tdOriginWidth = td.getWidth();
							
							BODY.addStyle({
								cursor : 'e-resize'
							});
							
							if (touchmoveEvent !== undefined) {
								touchmoveEvent.remove();
							}
							
							touchmoveEvent = EVENT('touchmove', (e) => {
								let diff = e.getLeft() - startLeft;
								
								if (beforeTdOriginWidth + diff < 100) {
									diff = 100 - beforeTdOriginWidth;
								}
								
								if (tdOriginWidth - diff < 100) {
									diff = tdOriginWidth - 100;
								}
								
								beforeTd.addStyle({
									width : beforeTdOriginWidth + diff
								});
								
								beforeTab.setToWidth(beforeTdOriginWidth + diff);
								
								td.addStyle({
									width : tdOriginWidth - diff
								});
								
								tab.setToWidth(tdOriginWidth - diff);
								
								divider.addStyle({
									left : beforeTd.getLeft() + beforeTd.getWidth()
								});
							});
							
							if (touchendEvent !== undefined) {
								touchendEvent.remove();
							}
							
							touchendEvent = EVENT('touchend', () => {
								
								BODY.addStyle({
									cursor : 'auto'
								});
								
								beforeTab.setSize(beforeTab.getSize() * beforeTd.getWidth() / beforeTdOriginWidth);
								
								tab.setSize(tab.getSize() * td.getWidth() / tdOriginWidth);
								
								touchmoveEvent.remove();
								touchmoveEvent = undefined;
								
								touchendEvent.remove();
								touchendEvent = undefined;
							});
							
							e.stop();
						}
					}
				}));
				
				dividers.push(divider);
			}
			
			tab.on('remove', () => {
				
				REMOVE({
					array : tabs,
					value : tab
				});
				
				REMOVE({
					array : tds,
					value : td
				});
				
				td.remove();
				
				if (divider !== undefined) {
					
					REMOVE({
						array : dividers,
						value : divider
					});
					
					divider.remove();
				}
				
				resizeTabsSize();
			});
			
			resizeTabsSize();
		};
		
		if (params !== undefined && params.tabs !== undefined) {
			EACH(params.tabs, addTab);
		}
		
		let resizeEvent = EVENT('resize', resizeTabsSize);
		
		self.on('remove', () => {
			resizeEvent.remove();
			resizeEvent = undefined;
		});
		
		self.on('show', resizeTabsSize);
		
		let getAllTabs = self.getAllTabs = () => {
			return tabs;
		};
	}
});
