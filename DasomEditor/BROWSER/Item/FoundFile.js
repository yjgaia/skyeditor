DasomEditor.FoundFile = CLASS({

	preset : () => {
		return SkyDesktop.File;
	},

	params : () => {
		
		return {
			style : {
				position : 'relative'
			}
		};
	},
	
	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.title
		
		let title = params.title;
		
		let Editor = DasomEditor.IDE.getEditor(title.substring(title.lastIndexOf('.') + 1).toLowerCase());
		
		if (Editor !== undefined) {
			self.setIcon(Editor.getIcon());
		}
		
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
		
		self.on('remove', () => {
			DELAY(() => {
				list.remove();
			});
		});
		
		let addItem = self.addItem = (params) => {
			//REQUIRED: params
			//REQUIRED: params.key
			//REQUIRED: params.item
			
			list.addItem(params);
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
