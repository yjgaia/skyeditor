DasomEditor.FoundLine = CLASS({

	preset : () => {
		return UUI.BUTTON_H;
	},

	params : () => {
		
		return {
			style : {
				marginLeft : 20,
				padding : '2px 5px',
				cursor : 'default'
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
		//REQUIRED: params.findText
		//REQUIRED: params.lineNumber
		//REQUIRED: params.line
		//OPTIONAL: params.isToCheckCase
		
		let path = params.path;
		let findText = params.findText;
		let lineNumber = params.lineNumber;
		let line = params.line;
		let isToCheckCase = params.isToCheckCase;
		
		let titleChildren = [lineNumber, ': '];
		
		let lineLowerCase = isToCheckCase === true ? line : line.toLowerCase();
		let findTextLowerCase = isToCheckCase === true ? findText : findText.toLowerCase();
		
		while (lineLowerCase.indexOf(findTextLowerCase) !== -1) {
			
			let foundIndex = lineLowerCase.indexOf(findTextLowerCase);
			let foundText = line.substring(foundIndex, foundIndex + findTextLowerCase.length);
			
			titleChildren.push(line.substring(0, foundIndex));
			titleChildren.push(SPAN({
				style : {
					backgroundColor : 'red'
				},
				c : foundText
			}));
			
			line = line.substring(foundIndex + findTextLowerCase.length);
			lineLowerCase = lineLowerCase.substring(foundIndex + findTextLowerCase.length);
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
