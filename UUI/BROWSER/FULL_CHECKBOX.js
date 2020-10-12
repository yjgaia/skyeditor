/*
 * Full-size checkbox class
 */
UUI.FULL_CHECKBOX = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.name
		//REQUIRED: params.label
		//OPTIONAL: params.spacing
		//OPTIONAL: params.value
		//OPTIONAL: params.style
		//OPTIONAL: params.inputStyle
		//OPTIONAL: params.on

		let name = params.name;
		let label = params.label;
		let spacing = params.spacing === undefined ? 0 : params.spacing;
		let value = params.value;
		let inputStyle = params.inputStyle;

		let input;
		let wrapper = DIV({
			style : {
				position : 'relative'
			},
			c : [ input = INPUT({
				style : {
					flt : 'left',
					marginTop : 5,
					marginRight : 5
				},
				name : name,
				type : 'checkbox',
				value : value
			}), SPAN({
				style : {
					marginLeft : spacing,
					flt : 'left',
					cursor : 'pointer'
				},
				c : label,
				on : {
					tap : (e) => {

						input.toggleCheck();

						EVENT.fireAll({
							node : self,
							name : 'change'
						});
					}
				}
			}), CLEAR_BOTH()]
		});

		inner.setWrapperDom(wrapper);

		let getName = self.getName = () => {
			return name;
		};

		let getValue = self.getValue = () => {
			return input.getValue();
		};

		let setValue = self.setValue = (value) => {
			//REQUIRED: value

			let checked = input.checkIsChecked();

			input.setValue(value);

			if (value === true) {

				if (checked !== true) {

					EVENT.fireAll({
						node : self,
						name : 'change'
					});
				}

			} else {

				if (checked === true) {

					EVENT.fireAll({
						node : self,
						name : 'change'
					});
				}
			}
		};

		let select = self.select = () => {

			input.select();

			EVENT.fireAll({
				node : self,
				name : 'select'
			});

			EVENT.fireAll({
				node : self,
				name : 'focus'
			});
		};

		let blur = self.blur = () => {

			input.blur();

			EVENT.fireAll({
				node : self,
				name : 'blur'
			});
		};

		let addInputStyle = self.addInputStyle = (style) => {
			//REQUIRED: style

			input.addStyle(style);
		};

		if (inputStyle !== undefined) {
			addInputStyle(inputStyle);
		}

		let on = self.on = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//REQUIRED: eventHandler

			if (eventName === 'focus' || eventName === 'blur' || eventName === 'change' || eventName === 'keydown' || eventName === 'keypress' || eventName === 'keyup') {

				EVENT({
					node : self,
					lowNode : input,
					name : eventName
				}, eventHandler);

			} else {

				EVENT({
					node : self,
					lowNode : wrapper,
					name : eventName
				}, eventHandler);
			}
		};

		let toggleCheck = self.toggleCheck = (e) => {

			let checked = input.toggleCheck();

			EVENT.fireAll({
				node : self,
				name : 'change'
			});

			return checked;
		};

		let checkIsChecked = self.checkIsChecked = () => {
			return input.checkIsChecked();
		};

		EVENT({
			node : self,
			lowNode : input,
			name : 'keyup'
		}, (e) => {
			if (e !== undefined && e.getKey() === ' ') {
				DELAY(() => {
					EVENT.fireAll({
						node : self,
						name : 'change'
					});
				});
			}
		});
	}
});
