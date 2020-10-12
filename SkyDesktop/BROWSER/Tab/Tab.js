SkyDesktop.Tab = CLASS({

	preset : () => {
		return DIV;
	},
	
	params : () => {
		return {
			style : {
				height : '100%',
				backgroundColor : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#000' : '#fff',
				color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#fff' : '#000',
				overflow : 'auto'
			}
		};
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.icon
		//OPTIONAL: params.title
		//OPTIONAL: params.size
		//OPTIONAL: params.isCannotClose
		
		let icon;
		let title;
		let size;
		let isCannotClose;
		
		if (params !== undefined) {
			icon = params.icon;
			title = params.title;
			size = params.size;
			isCannotClose = params.isCannotClose;
		}

		let toWidth;
		let toHeight;
		
		let setIcon = self.setIcon = (_icon) => {
			//REQUIRED: icon
			
			icon = _icon;
			
			self.fireEvent('iconchange');
		};
		
		let getIcon = self.getIcon = () => {
			return icon;
		};
		
		let setTitle = self.setTitle = (_title) => {
			//REQUIRED: title
			
			title = _title;
			
			self.fireEvent('titlechange');
		};
		
		let getTitle = self.getTitle = () => {
			return title;
		};
		
		let setSize = self.setSize = (_size) => {
			//REQUIRED: size
			
			size = _size;
			
			// TabList의 크기 Fix
			EVENT.fireAll('resize');
		};
		
		let getSize = self.getSize = () => {
			return size;
		};
		
		let checkIsCannotClose = self.checkIsCannotClose = () => {
			return isCannotClose;
		};
		
		let setToWidth = self.setToWidth = (_toWidth) => {
			//REQUIRED: toWidth
			
			toWidth = _toWidth;

			self.fireEvent('settowidth');
		};
		
		let getToWidth = self.getToWidth = () => {
			return toWidth;
		};
		
		let setToHeight = self.setToHeight = (_toHeight) => {
			//REQUIRED: toHeight
			
			toHeight = _toHeight;

			self.fireEvent('settoheight');
		};
		
		let getToHeight = self.getToHeight = () => {
			return toHeight;
		};
	}
});
