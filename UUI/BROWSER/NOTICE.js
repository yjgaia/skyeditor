/*
 * Notice class
 */
UUI.NOTICE = CLASS({

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.style
		//OPTIONAL: params.contentStyle
		//OPTIONAL: params.isCannotClose
		//OPTIONAL: params.on
		//REQUIRED: params.msg

		let style = params.style;
		let contentStyle = params.contentStyle;
		let isCannotClose = params.isCannotClose;
		let on = params.on;
		let msg = params.msg;

		let modal = UUI.MODAL({
			style : COMBINE([{
				textAlign : 'center'
			}, style]),
			contentStyle : contentStyle,
			isCannotClose : true,
			on : on,
			c : msg
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

		let addContentStyle = self.addContentStyle = (style) => {
			//REQUIRED: style

			modal.addContentStyle(style);
		};

		if (isCannotClose !== true) {
			DELAY(2, () => {
				modal.close();
			});
		}
	}
});
