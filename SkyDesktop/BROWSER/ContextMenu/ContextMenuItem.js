SkyDesktop.ContextMenuItem = CLASS({

	preset : () => {
		return DIV;
	},

	params : () => {
		
		return {
			style : {
				padding : '5px 15px',
				minWidth : 200,
				cursor : 'pointer'
			},
			on : {
				mouseover : (e, self) => {
					self.addStyle({
						backgroundColor : '#91C9F7'
					});
				},
				mouseout : (e, self) => {
					self.addStyle({
						backgroundColor : 'transparent'
					});
				}
			}
		};
	},
	
	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.icon
		//OPTIONAL: params.title
		
		let icon = params.icon;
		let title = params.title;
		
		self.append(UUI.BUTTON_H({
			icon : icon,
			spacing : 10,
			title : title
		}));
	}
});
