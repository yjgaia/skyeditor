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
			}
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//OPTIONAL: params.content
			
			let content = params.content;
			
			let wrapper;
			let table;
			let editTextarea;
			self.append(wrapper = DIV({
				style : {
					position : 'absolute',
					backgroundColor : '#fff',
					color : '#000',
					width : self.getWidth(),
					height : self.getHeight(),
					overflow : 'scroll'
				},
				c : table = TABLE({
					on : {
						tap : () => {
							if (editTextarea !== undefined) {
								editTextarea.remove();
								editTextarea = undefined;
							}
						}
					}
				})
			}));
			
			let resizeEvent = EVENT('resize', () => {
				DELAY(0.1, () => {
					if (self.checkIsRemoved() !== true) {
						wrapper.addStyle({
							width : self.getWidth(),
							height : self.getHeight()
						});
					}
				});
			});
			
			let tds = [];
			
			let data;
			
			let setContent;
			OVERRIDE(self.setContent, (origin) => {
				
				setContent = self.setContent = (content) => {
					//REQUIRED: content
					
					data = __PAPA.parse(content).data;
					
					table.empty();
					
					REPEAT(MAX_ROW, (i) => {
						let tr = TR().appendTo(table);
						tds[i] = [];
						
						REPEAT(MAX_COL, (j) => {
							
							let value;
							
							let td = TD({
								style : {
									fontWeight : i === 0 || j === 0 ? 'bold' : undefined,
									border : '1px solid #999',
									padding : 5,
									minWidth : 150,
									height : 20
								},
								on : {
									doubletap : () => {
										
										// 편집 모드
										if (editTextarea !== undefined) {
											editTextarea.remove();
										}
										
										let changeHandler = (e, textarea) => {
											
											let value = textarea.getValue();
											
											REPEAT(i + 1, (i2) => {
												if (data[i2] === undefined) {
													data[i2] = [];
												}
											});
											REPEAT(j, (j2) => {
												if (data[i][j2] === undefined) {
													data[i][j2] = '';
												}
											});
											
											data[i][j] = value;
										};
										
										editTextarea = TEXTAREA({
											style : {
												position : 'absolute',
												left : td.getLeft() - wrapper.getLeft(),
												top : td.getTop() - wrapper.getTop(),
												width : td.getWidth(),
												height : td.getHeight()
											},
											value : value,
											on : {
												keydown : changeHandler,
												keyup : changeHandler,
												change : changeHandler,
												remove : (e, textarea) => {
													td.empty();
													td.append(data[i][j]);
												}
											}
										}).appendTo(wrapper);
										
										editTextarea.select();
									}
								}
							}).appendTo(tr);
							
							if (data[i] !== undefined && data[i][j] !== undefined) {
								value = data[i][j];
								td.append(value);
							}
							tds[i][j] = td;
						});
					});
				};
			});
			
			if (content !== undefined) {
				setContent(content);
			}
			
			self.on('remove', () => {
				resizeEvent.remove();
			});
			
			let getContent;
			OVERRIDE(self.getContent, (origin) => {
				
				getContent = self.getContent = () => {
					return __PAPA.unparse(data);
				};
			});
		}
	};
});
