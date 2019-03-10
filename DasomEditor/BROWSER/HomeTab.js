DasomEditor.HomeTab = CLASS((cls) => {
	
	let homeTab;
	
	let remove = cls.remove = () => {
		if (homeTab !== undefined) {
			homeTab.remove();
		}
	};
	
	global.addEventListener('message', (event) => {
		if (event.data === '__CLOSE_HOME_TAB') {
			remove();
		}
	}, false);
	
	return {
	
		preset : () => {
			return SkyDesktop.Tab;
		},
		
		params : () => {
			return {
				icon : IMG({
					src : DasomEditor.R('icon/home.png')
				}),
				title : '홈'
			};
		},
		
		init : (inner, self, src) => {
			//REQUIRED: src
			
			self.append(DIV({
				style : {
					width : '100%',
					height : '100%',
					overflow : 'hidden'
				},
				c : IFRAME({
					style : {
						backgroundColor : '#fff',
						width : '100%',
						height : '100%'
					},
					src : src
				})
			}));
			
			if (homeTab !== undefined) {
				homeTab.remove();
			}
			
			homeTab = self;
			
			self.on('remove', () => {
				homeTab = undefined;
			});
		}
	};
});
