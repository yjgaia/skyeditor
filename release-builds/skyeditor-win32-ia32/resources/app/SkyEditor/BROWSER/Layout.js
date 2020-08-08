SkyEditor.Layout = CLASS((cls) => {
	
	let content;
	
	let getContent = cls.getContent = () => {
		return content;
	};
	
	return {
	
		preset : () => {
			return VIEW;
		},
	
		init : (inner, self) => {
			
			let layout = DIV({
			}).appendTo(BODY);
			
			inner.on('close', () => {
				layout.remove();
				content = undefined;
			});
		}
	};
});
