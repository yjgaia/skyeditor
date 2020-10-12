/*
 * Icon Button class
 */
UUI.ICON_BUTTON = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.icon
		//OPTIONAL: params.href
		//OPTIONAL: params.target
		//OPTIONAL: params.style
		//OPTIONAL: params.on

		let icon = params.icon;
		let href = params.href;
		let target = params.target;

		let a = A({
			style : {
				cursor : 'pointer',
				textDecoration : 'none',
				touchCallout : 'none',
				userSelect : 'none'
			},
			href : href,
			target : target
		});
		
		let setIcon = self.setIcon = (_icon) => {
			//REQUIRED: icon
			
			if (icon !== _icon && icon !== undefined) {
				icon.remove();
			}
			
			icon = _icon;
			
			a.append(icon);
		};

		if (icon !== undefined) {
			setIcon(icon);
		}

		inner.setDom(a);

		let getIcon = self.getIcon = () => {
			return icon;
		};

		let tap = self.tap = () => {
			EVENT.fireAll({
				node : self,
				name : 'tap'
			});
		};
	}
});
