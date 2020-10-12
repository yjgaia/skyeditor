/*
 * Button class
 */
UUI.BUTTON = CLASS({

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
		//OPTIONAL: params.on

		let icon = params.icon;
		let title = params.title;
		let spacing = params.spacing === undefined ? 0 : params.spacing;
		let href = params.href;
		let target = params.target;
		
		let titleDom;
		
		let a = A({
			style : {
				display : 'block',
				textAlign : 'center',
				cursor : 'pointer',
				textDecoration : 'none',
				touchCallout : 'none',
				userSelect : 'none',
				color : 'inherit'
			},
			href : href,
			target : target
		});

		if (title !== undefined) {
			a.prepend(titleDom = DIV({
				c : title === undefined ? '' : title
			}));
		}
		
		let setIcon = self.setIcon = (_icon) => {
			//REQUIRED: icon
			
			if (icon !== _icon && icon !== undefined) {
				icon.remove();
			}
			
			icon = _icon;
			
			a.prepend(DIV({
				style : {
					marginBottom : title !== undefined ? spacing : 0
				},
				c : icon
			}));
		};

		if (icon !== undefined) {
			setIcon(icon);
		}

		inner.setDom(a);

		let setTitle = self.setTitle = (title) => {
			titleDom.empty();
			titleDom.append(title);
		};

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
			
			icon.addStyle({
				marginBottom : 0
			});
			
			titleDom.hide();
		};
		
		let showTitle = self.showTitle = () => {
			
			icon.addStyle({
				marginBottom : spacing
			});
			
			titleDom.show();
		};
	}
});
