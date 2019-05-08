DasomEditor.More = CLASS({

	preset : () => {
		return UUI.BUTTON_H;
	},

	params : () => {
		
		return {
			style : {
				marginLeft : 20,
				padding : '2px 5px',
				whiteSpace : 'nowrap'
			},
			isToFixWrapperSize : true
		};
	}
});
