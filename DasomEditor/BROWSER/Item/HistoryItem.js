DasomEditor.HistoryItem = CLASS({
	
	preset : () => {
		return UUI.BUTTON_H;
	},

	params : () => {
		
		return {
			style : {
				padding : '2px 5px',
				cursor : 'default'
			},
			icon : IMG({
				src : DasomEditor.R('icon/calendar.png')
			}),
			spacing : 5,
			isToFixWrapperSize : true
		};
	},
	
	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.time
		
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
