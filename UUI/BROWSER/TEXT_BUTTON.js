/*
 * Text Button class
 */
UUI.TEXT_BUTTON = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.title
		//OPTIONAL: params.href
		//OPTIONAL: params.target
		//OPTIONAL: params.style
		//OPTIONAL: params.on

		let title = params.title;
		let href = params.href;
		let target = params.target;
		
		let span;
		let a = A({
			style : {
				cursor : 'pointer',
				textDecoration : 'none',
				touchCallout : 'none',
				userSelect : 'none'
			},
			href : href,
			target : target,
			c : span = SPAN({
				c : title === undefined ? (href === undefined ? '' : href) : title
			})
		});

		inner.setDom(a);

		let setTitle = self.setTitle = (title) => {
			span.empty();
			span.append(title);
		};

		let tap = self.tap = () => {
			EVENT.fireAll({
				node : self,
				name : 'tap'
			});
		};
	}
});
