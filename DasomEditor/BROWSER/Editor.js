DasomEditor.Editor = CLASS({

	preset : () => {
		return SkyDesktop.Tab;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.path
		//OPTIONAL: params.content
		
		let path = params.path;
		let content = params.content;
		
		let getPath = self.getPath = () => {
			return path;
		};
		
		let getContent = self.getContent = () => {
			return content;
		};
	}
});
