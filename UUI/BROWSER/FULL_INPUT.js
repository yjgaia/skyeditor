/*
 * Full-size input class
 */
UUI.FULL_INPUT = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.name
		//OPTIONAL: params.type
		//OPTIONAL: params.placeholder
		//OPTIONAL: params.value
		//OPTIONAL: params.capture
		//OPTIONAL: params.accept
		//OPTIONAL: params.style
		//OPTIONAL: params.inputStyle
		//OPTIONAL: params.isOffAutocomplete
		//OPTIONAL: params.isOffAutocapitalize
		//OPTIONAL: params.on

		let name = params.name;
		let type = params.type;
		let placeholder = params.placeholder;
		let capture = params.capture;
		let accept = params.accept;
		let value = params.value;
		let inputStyle = params.inputStyle;
		let isOffAutocomplete = params.isOffAutocomplete;
		let isOffAutocapitalize = params.isOffAutocapitalize;

		let input;
		let wrapper = DIV({
			style : {
				padding : 5,
				backgroundColor : '#fff'
			},
			c : DIV({
				style : {
					position : 'relative'
				},
				c : [

				// span
				SPAN({
					style : {
						visibility : 'hidden'
					},
					c : '.'
				}),

				// input
				input = INPUT({
					style : {
						position : 'absolute',
						left : 0,
						top : 0,
						width : '100%',
						border : 'none',
						background : type === 'date' || type === 'datetime' || type === 'datetime-local' || type === 'month' || type === 'time' || type === 'week' ? undefined : 'transparent'
					},
					name : name,
					type : type,
					value : value,
					capture : capture,
					accept : accept,
					placeholder : placeholder,
					isOffAutocomplete : isOffAutocomplete,
					isOffAutocapitalize : isOffAutocapitalize
				})]
			}),
			on : {
				tap : () => {

					input.focus();

					EVENT.fireAll({
						node : self,
						name : 'focus'
					});
				}
			}
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

			let originValue = input.getValue();

			input.setValue(value);

			if (originValue !== value) {

				EVENT.fireAll({
					node : self,
					name : 'change'
				});
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

		let focus = self.focus = () => {

			input.focus();

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
		
		let setPlaceholder = self.setPlaceholder = (placeholder) => {
			//REQUIRED: placeholder
			
			input.setPlaceholder(placeholder);
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
	}
});
