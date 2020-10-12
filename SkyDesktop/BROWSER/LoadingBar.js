SkyDesktop.LoadingBar = CLASS({

	init : (inner, self, color) => {
		//OPTIONAL: color
		
		let bar1 = DIV({
			style: {
				position : 'fixed',
				left : 0,
				bottom : 0,
				height : 3,
				backgroundColor : color,
				zIndex : 999999
			}
		}).appendTo(BODY);
		
		ANIMATE({
			node : bar1,
			keyframes : {
				from : {
					width : '0%'
				},
				to : {
					width : '50%'
				}
			},
			duration : 0.5
		});
		
		let bar2 = DIV({
			style: {
				position : 'fixed',
				left : 0,
				bottom : 0,
				height : 3,
				backgroundColor : color,
				zIndex : 999999
			}
		}).appendTo(BODY);
		
		let done = self.done = () => {
			
			ANIMATE({
				node : bar2,
				keyframes : {
					from : {
						width : '0%'
					},
					to : {
						width : '100%'
					}
				},
				duration : 0.5
			}, () => {
				
				bar1.remove();
				
				ANIMATE({
					node : bar2,
					keyframes : {
						from : {
							opacity : 1
						},
						to : {
							opacity : 0
						}
					},
					duration : 0.25
				}, () => {
					bar2.remove();
				});
			});
		};
	}
});
