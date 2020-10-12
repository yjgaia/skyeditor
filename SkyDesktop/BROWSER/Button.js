SkyDesktop.Button = CLASS({

	preset : () => {
		return UUI.BUTTON_H;
	},

	params : () => {
		
		return {
			style : {
				padding : '11px 15px',
				backgroundColor : '#e0e1e2',
				color : '#333',
				fontWeight : 'bold',
				borderRadius : 4
			},
			spacing : 10,
			isToFixWrapperSize : true,
			on : {
				mouseover : (e, self) => {
					self.addStyle({
						backgroundColor : '#cacbcd'
					});
				},
				mouseout : (e, self) => {
					self.addStyle({
						backgroundColor : '#e0e1e2'
					});
				}
			}
		};
	}
});
