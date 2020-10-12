/*
 * Loading class
 */
UUI.LOADING = CLASS({

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.style
		//OPTIONAL: params.contentStyle
		//OPTIONAL: params.indicator
		//REQUIRED: params.msg
		//OPTIONAL: params.on

		let style = params.style;
		let contentStyle = params.contentStyle;
		let indicator = params.indicator;
		let msg = params.msg;
		let on = params.on;

		let modal = UUI.MODAL({
			style : COMBINE([{
				textAlign : 'center'
			}, style]),
			contentStyle : contentStyle,
			isCannotClose : true,
			c : UUI.V_CENTER({
				style : {
					height : '100%'
				},
				c : [indicator === undefined ? '' : indicator, P({
					style : indicator === undefined ? {} : {
						marginTop : 10
					},
					c : msg
				})]
			}),
			on : on
		});

		let getNode = self.getNode = () => {
			return modal.getNode();
		};

		let append = self.append = (node) => {
			//REQUIRED: node

			modal.append(node);
		};

		let prepend = self.prepend = (node) => {
			//REQUIRED: node

			modal.prepend(node);
		};

		let after = self.after = (node) => {
			//REQUIRED: node

			modal.after(node);
		};

		let before = self.before = (node) => {
			//REQUIRED: node

			modal.before(node);
		};

		let remove = self.remove = () => {
			modal.remove();
		};

		let empty = self.empty = () => {
			modal.empty();
		};

		let getChildren = self.getChildren = () => {
			return modal.getChildren();
		};

		let addStyle = self.addStyle = (style) => {
			//REQUIRED: style

			modal.addStyle(style);
		};

		let addContentStyle = self.addContentStyle = (style) => {
			//REQUIRED: style

			modal.addContentStyle(style);
		};
	}
});
