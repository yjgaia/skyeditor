SkyDesktop.Toolbar = CLASS({

	preset : () => {
		return UUI.V_CENTER;
	},

	params : () => {
		
		return {
			style : {
				backgroundColor : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#555' : '#ccc',
				color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#fff' : '#000',
				height : '100%',
				borderBottom : '1px solid #999'
			}
		};
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.buttons
		
		let clearBoth = CLEAR_BOTH();
		
		let resize = () => {
			
			let totalWidth = 0;
			
			EACH(self.getChildren(), (child) => {
				if (child.checkIsInstanceOf(SkyDesktop.ToolbarButton) === true) {
					child.showTitle();
				}
			});
			
			EACH(self.getChildren(), (child) => {
				if (child.checkIsInstanceOf(SkyDesktop.ToolbarButton) === true) {
					totalWidth += child.getWidth();
				}
			});
			
			if (self.getWidth() < totalWidth) {
				EACH(self.getChildren(), (child) => {
					if (child.checkIsInstanceOf(SkyDesktop.ToolbarButton) === true) {
						child.hideTitle();
					}
				});
			}
		};
		
		let addButton = self.addButton = (button) => {
			
			self.append(button);
			self.append(clearBoth);
			
			resize();
		};
		
		let removeButton = self.removeButton = (button) => {
			
			button.remove();
			
			resize();
		};
		
		if (params !== undefined && params.buttons !== undefined) {
			EACH(params.buttons, addButton);
		}
		
		self.on('show', resize);
		
		let resizeEvent = EVENT('resize', resize);
		
		self.on('remove', () => {
			resizeEvent.remove();
			resizeEvent = undefined;
		});
	}
});
