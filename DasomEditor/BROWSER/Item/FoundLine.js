DasomEditor.FoundLine = CLASS({

	preset : () => {
		return UUI.BUTTON_H;
	},

	params : () => {
		
		return {
			style : {
				marginLeft : 20,
				padding : '2px 5px',
				cursor : 'default',
				whiteSpace : 'nowrap'
			},
			icon : IMG({
				src : DasomEditor.R('icon/found-line.png')
			}),
			spacing : 5
		};
	},
	
	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.path
		//REQUIRED: params.text
		//REQUIRED: params.lineNumber
		//REQUIRED: params.line
		
		let path = params.path;
		let text = params.text;
		let lineNumber = params.lineNumber;
		let line = params.line;
		
		let titleChildren = [lineNumber, ': '];
		
		while (line.indexOf(text) !== -1) {
			titleChildren.push(line.substring(0, line.indexOf(text)));
			titleChildren.push(SPAN({
				style : {
					backgroundColor : 'red'
				},
				c : text
			}));
			line = line.substring(line.indexOf(text) + text.length);
		}
		titleChildren.push(line);
		
		self.setTitle(SPAN({
			c : titleChildren
		}));
		
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
