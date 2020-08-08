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
					src : SkyEditor.R('handsontable/editor.html'),
					on : {
						load : (e, iframe) => {
							try {
								if (iframe.getEl().contentWindow.location.href === 'about:blank') {
									self.remove();
								} else {
									iframe.getEl().contentWindow.save = () => {
										SkyEditor.IDE.saveTab(self);
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
						if (content === '') {
							content = ',';
						}
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
						
						let lines = __PAPA.unparse({
							data : iframe.getEl().contentWindow.getData()
						});
						
						let content = '';
						lines.split('\n').forEach((line) => {
							line = line.trim();
							for (let i = line.length - 1; i >= 0; i -= 1) {
								if (line[i] !== ',') {
									line = line.substring(0, i + 1);
									break;
								}
								if (i === 0) {
									line = '';
								}
							}
							content += line + '\n';
						});
						
						return content.trim();
						
					} catch(e) {
						return '';
					}
				};
			});
		}
	};
});
