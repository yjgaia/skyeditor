/*
 * Vertical center class
 */
UUI.V_CENTER = CLASS({

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
		
		let content;
		let wrapper = TABLE({
			style : {
				width : '100%',
				margin : 0,
				padding : 0
			},
			c : TR({
				style : {
					margin : 0,
					padding : 0
				},
				c : content = TD({
					style : {
						width : '100%',
						height : '100%',
						margin : 0,
						padding : 0
					}
				})
			})
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
