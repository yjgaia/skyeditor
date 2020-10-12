SkyDesktop.Confirm = CLASS({

	preset : () => {
		return UUI.CONFIRM;
	},

	params : () => {
		
		return {
			style : {
				zIndex : 999,
				backgroundColor : '#fff',
				color : '#333',
				textAlign : 'center',
				border : '1px solid #333',
				borderRadius : 5,
				boxShadow : '0 0 5px rgba(0,0,0,0.3)',
				onDisplayResize : (width, height) => {

					if (width > 300) {
						return {
							width : 280
						};
					} else {
						return {
							width : '90%'
						};
					}
				}
			},
			contentStyle : {
				padding : 20
			},
			okButtonStyle : {
				flt : 'left',
				borderTop : '1px solid #999',
				padding : '11px 0',
				backgroundColor : '#e0e1e2',
				color : '#333',
				fontWeight : 'bold',
				width : '50%',
				borderRadius : '0 0 0 5px'
			},
			cancelButtonStyle : {
				flt : 'right',
				marginLeft : -1,
				borderLeft : '1px solid #999',
				borderTop : '1px solid #999',
				padding : '11px 0',
				backgroundColor : '#e0e1e2',
				color : '#333',
				fontWeight : 'bold',
				width : '50%',
				borderRadius : '0 0 5px 0'
			}
		};
	},

	init : (inner, self) => {
		
		self.getOkButton().on('mouseover', (e, button) => {
			button.addStyle({
				backgroundColor : '#cacbcd'
			});
		});
		
		self.getOkButton().on('mouseout', (e, button) => {
			button.addStyle({
				backgroundColor : '#e0e1e2'
			});
		});
		
		self.getCancelButton().on('mouseover', (e, button) => {
			button.addStyle({
				backgroundColor : '#cacbcd'
			});
		});
		
		self.getCancelButton().on('mouseout', (e, button) => {
			button.addStyle({
				backgroundColor : '#e0e1e2'
			});
		});
	}
});
