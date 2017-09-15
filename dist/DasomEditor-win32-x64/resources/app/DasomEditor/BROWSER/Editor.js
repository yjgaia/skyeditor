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
		
		let setPath = self.setPath = (_path) => {
			//REQUIRED: path
			
			let editorOpenedStore = DasomEditor.IDE.getEditorOpenedStore();
			
			editorOpenedStore.remove(path);
			
			path = _path;
			
			editorOpenedStore.save({
				name : path,
				value : true
			});
		};
		
		let getContent = self.getContent = () => {
			return content;
		};
		
		let setScrollTop = self.setScrollTop = (scrollTop) => {
			//REQUIRED: scrollTop
		};
	}
});
