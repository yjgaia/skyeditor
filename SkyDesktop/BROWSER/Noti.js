SkyDesktop.Noti = METHOD({
	
	run : (content) => {
		
		let panel = UUI.PANEL({
			style : {
				zIndex : 999,
				position : 'fixed',
				right : 10,
				bottom : 10,
				backgroundColor : '#FFFFCC',
				color : '#333',
				borderRadius : 5
			},
			contentStyle : {
				padding : '5px 10px'
			},
			c : content
		}).appendTo(BODY);
		
		UANI.SHOW_SLIDE_UP({
			node : panel
		});
		
		DELAY(2, () => {
			
			UANI.HIDE_SLIDE_DOWN({
				node : panel
			}, panel.remove);
		});
	}
});
