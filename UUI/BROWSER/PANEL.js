/*
 * Panel(wrapper layer + content layer) class
 */
UUI.PANEL = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.c
		//OPTIONAL: params.style
		//OPTIONAL: params.contentStyle
		//OPTIONAL: params.on

		let contentStyle = params === undefined ? undefined : params.contentStyle;

		let wrapper;
		let content;
		wrapper = DIV({
			c : content = DIV()
		});

		inner.setWrapperDom(wrapper);
		inner.setContentDom(content);

		let addContentStyle = self.addContentStyle = (style) => {
			//REQUIRED: style

			content.addStyle(style);
		};

		if (contentStyle !== undefined) {
			addContentStyle(contentStyle);
		}
	}
});
