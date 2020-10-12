/*
 * Button Horizontal class
 */
UUI.BUTTON_H = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.icon
		//OPTIONAL: params.title
		//OPTIONAL: params.spacing
		//OPTIONAL: params.href
		//OPTIONAL: params.target
		//OPTIONAL: params.style
		//OPTIONAL: params.contentStyle
		//OPTIONAL: params.isIconRight
		//OPTIONAL: params.isToFixWrapperSize
		//OPTIONAL: params.on

		let icon = params.icon;
		let title = params.title;
		let spacing = params.spacing === undefined ? 0 : params.spacing;
		let href = params.href;
		let target = params.target;
		let isIconRight = params.isIconRight;
		let isToFixWrapperSize = params.isToFixWrapperSize;
		
		let style = params.style;
		let contentStyle = params.contentStyle;
		let width;
		if (style !== undefined) {
			width = style.width;
		}

		let iconDom;
		let titleDom;
		let content;
		let a = A({
			style : {
				display : 'block',
				cursor : 'pointer',
				textDecoration : 'none',
				touchCallout : 'none',
				userSelect : 'none',
				color : 'inherit'
			},
			href : href,
			target : target,
			c : content = TABLE({
				style : EXTEND({
					origin : {
						width : '100%'
					},
					extend : contentStyle
				}),
				c : TR({
					style : {
						margin : 0,
						padding : 0
					},
					c : isIconRight === true ? [TD({
						style : {
							margin : 0,
							padding : 0,
							whiteSpace : 'nowrap'
						},
						c : [titleDom = DIV({
							style : {
								flt : 'left'
							}
						}), CLEAR_BOTH()]
					}), TD({
						style : {
							margin : 0,
							padding : 0
						},
						c : [iconDom = DIV({
							style : {
								flt : 'left',
								lineHeight : 0
							}
						}), CLEAR_BOTH()]
					})] : [TD({
						style : {
							margin : 0,
							padding : 0
						},
						c : [iconDom = DIV({
							style : {
								flt : 'left',
								lineHeight : 0
							}
						}), CLEAR_BOTH()]
					}), TD({
						style : {
							margin : 0,
							padding : 0,
							whiteSpace : 'nowrap'
						},
						c : [titleDom = DIV({
							style : {
								flt : 'left'
							}
						}), CLEAR_BOTH()]
					})]
				})
			})
		});
		
		let resize = () => {
			
			if (width === undefined) {
				
				let contentSize = iconDom.getWidth() + titleDom.getWidth();
				
				content.addStyle({
					width : contentSize
				});
				
				if (isToFixWrapperSize === true) {
					a.addStyle({
						width : contentSize
					});
				}
			}
		};
		
		self.on('show', () => {
			resize();
		});

		let setIcon = self.setIcon = (_icon) => {
			//REQUIRED: icon
			
			icon = _icon;
			
			iconDom.empty();
			iconDom.append(icon);

			titleDom.addStyle(isIconRight === true ? {
				paddingRight : spacing
			} : {
				paddingLeft : spacing
			});
			
			EVENT_ONCE({
				node : icon,
				name : 'load'
			}, (e) => {
				resize();
			});
		};

		if (icon !== undefined) {
			setIcon(icon);
		}

		inner.setDom(a);

		let setTitle = self.setTitle = (title) => {
			//REQUIRED: title
			
			titleDom.empty();
			titleDom.append(title);
			
			resize();
		};
		
		if (title !== undefined) {
		    setTitle(title);
		}

		let getTitle = self.getTitle = () => {
			return title;
		};

		let getIcon = self.getIcon = () => {
			return icon;
		};

		let tap = self.tap = () => {
			EVENT.fireAll({
				node : self,
				name : 'tap'
			});
		};
		
		let hideTitle = self.hideTitle = () => {
			titleDom.hide();
		};
		
		let showTitle = self.showTitle = () => {
			titleDom.show();
		};
	}
});
