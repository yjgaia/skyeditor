SkyDesktop.Folder = CLASS({

	preset : () => {
		return UUI.BUTTON_H;
	},

	params : () => {
		
		return {
			style : {
				position : 'relative',
				marginLeft : 20,
				padding : '2px 5px',
				cursor : 'default',
				whiteSpace : 'nowrap',
				userSelect : 'none',
				MozUserSelect : 'none'
			},
			listStyle : {
				marginLeft : 20
			},
			icon : IMG({
				src : SkyDesktop.R('folder.png')
			}),
			spacing : 5,
			isToFixWrapperSize : true
		};
	},
	
	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.listStyle
		//OPTIONAL: params.path
		//OPTIONAL: params.isOpened
		//OPTIONAL: params.isToNotSort
		
		let listStyle;
		let path;
		let isOpened;
		let isToNotSort;
		
		if (params !== undefined) {
			listStyle = params.listStyle;
			path = params.path;
			isOpened = params.isOpened;
			isToNotSort = params.isToNotSort;
		}
		
		let load;
		
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
				},
				mouseout : (e, self) => {
					self.addStyle({
						color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc'
					});
				},
				tap : (e) => {
					if (list.checkIsShowing() === true) {
						close();
					} else {
						open();
					}
				}
			}
		}));
		
		let list = UUI.LIST({
			style : listStyle
		});
		
		self.after(list);
		
		let setLoad = self.setLoad = (_load) => {
			load = _load;
		};
		
		let open = self.open = () => {
			
			list.show();
			
			self.setIcon(IMG({
				src : SkyDesktop.R('folder-opened.png')
			}));
			
			openListButton.setIcon(FontAwesome.GetIcon('chevron-down'));
			openListButton.addStyle({
				left : -14,
				top : 1,
			});
			
			self.fireEvent('open');
		};
		
		let close = self.close = () => {
			
			list.hide();
			
			self.setIcon(IMG({
				src : SkyDesktop.R('folder.png')
			}));
			
			openListButton.setIcon(FontAwesome.GetIcon('chevron-right'));
			openListButton.addStyle({
				left : -12,
				top : 2,
			});
			
			self.fireEvent('close');
		};
		
		if (isOpened === true) {
			DELAY(() => {
				open();
			});
		} else {
			list.hide();
		}
		
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
			
			let key = params.key;
			let item = params.item;
			
			if (load !== undefined) {
				
				if (item.checkIsInstanceOf(SkyDesktop.File) === true) {
					item.on('doubletap', (e) => {
						load(key);
					});
				}
				
				else if (item.checkIsInstanceOf(SkyDesktop.Folder) === true) {
					item.setLoad(load);
				}
			}

			list.addItem(params);
			
			if (isToNotSort !== true) {
				sortItems();
			}
		};

		if (params !== undefined && params.items !== undefined) {

			EACH(params.items, (item, key) => {
				addItem({
					key : key,
					item : item
				});
			});
		}

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
			
			if (isToNotSort !== true) {
				sortItems();
			}
		};
		
		let removeAllItems = self.removeAllItems = () => {
			list.removeAllItems();
		};
		
		let getPath = self.getPath = () => {
			return path;
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
