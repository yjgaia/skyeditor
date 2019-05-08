DasomEditor.CSVEditor = CLASS((cls) => {
	
	const MAX_ROW = 500;
	const MAX_COL = 20;
	
	let getName = cls.getName = () => {
		return 'DasomEditor.CSVEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/csv.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.Editor;
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
			
			let scrollTop = 0;
			
			let iframe;
			self.append(DIV({
				style : {
					width : '100%',
					height : '100%',
					overflow : 'hidden'
				},
				c : iframe = IFRAME({
					style : {
						backgroundColor : '#fff',
						width : '100%',
						height : '100%'
					},
					src : DasomEditor.R('handsontable/editor.html'),
					on : {
						load : (e, iframe) => {
							try {
								if (iframe.getEl().contentWindow.location.href === 'about:blank') {
									self.remove();
								} else {
									iframe.getEl().contentWindow.save = () => {
										DasomEditor.IDE.saveTab(self);
									}
									if (content === undefined) {
										content = getContent();
									}
									setContent(content);
								}
							} catch(e) {
								// ignore.
							}
						}
					}
				})
			}));
			
			self.on('active', () => {
				try {
					iframe.getEl().focus();
					iframe.getEl().contentWindow.fixScroll();
				} catch(e) {
					// ignore.
				}
			});
			
			let setContent;
			OVERRIDE(self.setContent, (origin) => {
				
				setContent = self.setContent = (content) => {
					//REQUIRED: content
					
					try {
						iframe.getEl().contentWindow.loadData(__PAPA.parse(content).data);
					} catch(e) {
						// ignore.
					}
				};
			});
			
			let getContent;
			OVERRIDE(self.getContent, (origin) => {
				
				getContent = self.getContent = () => {
					try {
						return __PAPA.unparse({
							data : iframe.getEl().contentWindow.getData()
						});
					} catch(e) {
						return '';
					}
				};
			});
		}
	};
});
