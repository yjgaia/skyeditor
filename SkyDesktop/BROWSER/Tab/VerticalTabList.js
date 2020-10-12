SkyDesktop.VerticalTabList = CLASS({
	
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
		
		let tabs = [];
		let trs = [];
		let tds = [];
		let dividers = [];
		
		let resizeTabsSize = () => {

			EACH(tds, (td) => {
				td.addStyle({
					height : 0
				});
			});
			
			let totalHeight = self.getHeight();
			
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
				
				let height = totalHeight * (tab.getSize() === undefined ? avgSize : tab.getSize()) / totalSize;
				
				tab.setToHeight(height);
				
				tds[i].addStyle({
					height : height
				});
			});
			
			EACH(dividers, (divider, i) => {
				
				divider.addStyle({
					left : self.getLeft(),
					top : tds[i].getTop() + tds[i].getHeight(),
					width : self.getWidth()
				});
			});
		};
		
		let addTab = self.addTab = (tab) => {
			
			tabs.push(tab);
			
			let tr;
			let td;
			
			self.append(tr = TR({
				c : td = TD({
					style : {
						width : '100%'
					},
					c : tab
				})
			}));
			
			trs.push(tr);
			tds.push(td);
			
			let divider;
			
			if (tabs.length > 1) {
				
				tab.addStyle({
					marginTop : 6
				});
				
				let beforeTab = tabs[tabs.length - 2];
				let beforeTd = tds[tds.length - 2];
				
				let touchmoveEvent;
				let touchendEvent;
				
				self.append(divider = DIV({
					style : {
						position : 'absolute',
						top : 0,
						height : 6,
						cursor : 'n-resize',
						backgroundColor : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#333' : '#ccc'
					},
					on : {
						touchstart : (e) => {
							
							let startTop = e.getTop();
							let beforeTdOriginHeight = beforeTd.getHeight();
							let tdOriginHeight = td.getHeight();
							
							BODY.addStyle({
								cursor : 'n-resize'
							});
							
							if (touchmoveEvent !== undefined) {
								touchmoveEvent.remove();
							}
							
							touchmoveEvent = EVENT('touchmove', (e) => {
								let diff = e.getTop() - startTop;
								
								if (beforeTdOriginHeight + diff < 100) {
									diff = 100 - beforeTdOriginHeight;
								}
								
								if (tdOriginHeight - diff < 100) {
									diff = tdOriginHeight - 100;
								}
								
								beforeTd.addStyle({
									height : beforeTdOriginHeight + diff
								});
								
								beforeTab.setToHeight(beforeTdOriginHeight + diff);
								
								td.addStyle({
									height : tdOriginHeight - diff
								});
								
								tab.setToHeight(tdOriginHeight - diff);
								
								divider.addStyle({
									top : beforeTd.getTop() + beforeTd.getHeight()
								});
							});
							
							if (touchendEvent !== undefined) {
								touchendEvent.remove();
							}
							
							touchendEvent = EVENT('touchend', () => {
								
								BODY.addStyle({
									cursor : 'auto'
								});
								
								beforeTab.setSize(beforeTab.getSize() * beforeTd.getHeight() / beforeTdOriginHeight);
								
								tab.setSize(tab.getSize() * td.getHeight() / tdOriginHeight);
								
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
					array : trs,
					value : tr
				});
				
				REMOVE({
					array : tds,
					value : td
				});
				
				tr.remove();
				
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
