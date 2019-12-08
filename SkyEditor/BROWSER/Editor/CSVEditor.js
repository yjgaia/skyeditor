SkyEditor.CSVEditor = CLASS((cls) => {
	
	const MAX_ROW = 500;
	const MAX_COL = 20;
	
	let getName = cls.getName = () => {
		return 'SkyEditor.CSVEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/csv.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.Editor;
		},
		
		params : () => {
			return {
				mode : 'csv',
				icon : getIcon()
			};
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//OPTIONAL: params.content
			
			let content = params.content;
			
			self.append(DIV({
				style : {
					width : '100%',
					height : '100%',
					overflow : 'hidden'
				},
				c : 'TEST'
			}));
			
			console.log(__PAPA.parse(content).data);
			
			let setContent;
			OVERRIDE(self.setContent, (origin) => {
				
				setContent = self.setContent = (content) => {
					//REQUIRED: content
					
					console.log(content);
					
					try {
						console.log(__PAPA.parse(content).data);
					} catch(e) {
						// ignore.
					}
				};
			});
			
			let getContent;
			OVERRIDE(self.getContent, (origin) => {
				
				getContent = self.getContent = () => {
					try {
						/*__PAPA.unparse({
							data : iframe.getEl().contentWindow.getData()
						})*/
					} catch(e) {
						return '';
					}
				};
			});
		}
	};
});
