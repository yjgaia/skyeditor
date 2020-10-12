/*
 * Modal class
 */
UUI.MODAL = CLASS({

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.c
		//OPTIONAL: params.style
		//OPTIONAL: params.contentStyle
		//OPTIONAL: params.xStyle
		//OPTIONAL: params.xIcon
		//OPTIONAL: params.isCannotClose

		let children = params === undefined ? undefined : params.c;
		let style = params === undefined ? undefined : params.style;
		let contentStyle = params === undefined ? undefined : params.contentStyle;
		let xStyle = params === undefined ? undefined : params.xStyle;
		let xIcon = params === undefined ? undefined : params.xIcon;
		let isCannotClose = params === undefined ? undefined : params.isCannotClose;

		let content;
		let wrapper = DIV({
			style : {
				position : 'fixed',
				zIndex : 9999999
			},
			c : [ content = DIV(), xIcon === undefined ? '' : UUI.ICON_BUTTON({
				style : COMBINE([{
					lineHeight : 0,
					position : 'absolute'
				}, xStyle === undefined ? {
					top : -10,
					right : -10
				} : xStyle]),
				icon : xIcon,
				on : {
					tap : (e) => {
						close();
					},
					mouseover : () => {
						addStyle({
							opacity : 0.8
						});
					},
					mouseout : () => {
						addStyle({
							opacity : 1
						});
					}
				}
			})]
		}).appendTo(BODY);

		let moveToCenter = RAR(() => {

			let left = (WIN_WIDTH() - wrapper.getWidth()) / 2;
			let top = (WIN_HEIGHT() - wrapper.getHeight()) / 2;

			wrapper.addStyle({
				left : left < 0 ? 0 : left,
				top : top < 0 ? 0 : top
			});

			let find = (children) => {
				EACH(children, (child) => {

					if (child.type === IMG) {
						EVENT({
							node : child,
							name : 'load'
						}, () => {
							moveToCenter();
						});
					}

					if (child.getChildren !== undefined) {
						find(child.getChildren());
					}
				});
			};

			find(wrapper.getChildren());
		});
		
		DELAY(() => {
			moveToCenter();
		});

		wrapper.on('show', moveToCenter);

		wrapper.on('append', moveToCenter);

		let resizeEvent = EVENT({
			name : 'resize'
		}, moveToCenter);

		let escEvent = EVENT({
			name : 'keydown'
		}, (e) => {
			if (e.getKey() === 'Escape' && isCannotClose !== true) {
				close();
			}
		});

		wrapper.on('remove', () => {
			resizeEvent.remove();
			escEvent.remove();
		});

		let getNode = self.getNode = () => {
			return wrapper;
		};

		let append = self.append = (node) => {
			//REQUIRED: node

			content.append(node);
			moveToCenter();
		};

		if (children !== undefined) {

			if (CHECK_IS_ARRAY(children) === true) {

				EACH(children, (child, i) => {
					append(child);
				});

			} else {
				append(children);
			}
		}

		let prepend = self.prepend = (node) => {
			//REQUIRED: node

			content.prepend(node);
			moveToCenter();
		};

		let after = self.after = (node) => {
			//REQUIRED: node

			wrapper.after(node);
			moveToCenter();
		};

		let before = self.before = (node) => {
			//REQUIRED: node

			wrapper.before(node);
			moveToCenter();
		};

		let remove = self.remove = () => {
			wrapper.remove();
		};

		let empty = self.empty = () => {
			content.empty();
		};

		let getChildren = self.getChildren = () => {
			return content.getChildren();
		};

		let addStyle = self.addStyle = (style) => {
			//REQUIRED: style

			wrapper.addStyle(style);
			moveToCenter();
		};

		if (style !== undefined) {
			addStyle(style);
		}

		let addContentStyle = self.addContentStyle = (style) => {
			//REQUIRED: style

			content.addStyle(style);
			moveToCenter();
		};

		if (contentStyle !== undefined) {
			addContentStyle(contentStyle);
		}

		let on = self.on = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//REQUIRED: eventHandler
			
			wrapper.on(eventName, eventHandler);
		};

		let close = self.close = () => {

			if (EVENT.fireAll({
				node : wrapper,
				name : 'close'
			}) !== false) {
				remove();
			}
		};
		
		let getLeft = self.getLeft = () => {
			return wrapper.getLeft();
		};
		
		let getTop = self.getTop = () => {
			return wrapper.getTop();
		};
	},

	afterInit : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.c
		//OPTIONAL: params.style
		//OPTIONAL: params.contentStyle
		//OPTIONAL: params.xStyle
		//OPTIONAL: params.xIcon
		//OPTIONAL: params.isCannotClose
		//OPTIONAL: params.on

		let on;

		// init params.
		if (params !== undefined && CHECK_IS_DATA(params) === true) {
			on = params.on;
		}

		if (on !== undefined) {
			EACH(on, (handler, name) => {
				self.on(name, handler);
			});
		}
	}
});
