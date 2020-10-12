/*
 * Full-size textarea class
 */
UUI.FULL_TEXTAREA = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.name
		//OPTIONAL: params.placeholder
		//OPTIONAL: params.value
		//OPTIONAL: params.style
		//OPTIONAL: params.textareaStyle
		//OPTIONAL: params.on

		let name;
		let placeholder;
		let value;
		let textareaStyle;
		
		if (params !== undefined) {
			name = params.name;
			placeholder = params.placeholder;
			value = params.value;
			textareaStyle = params.textareaStyle;
		}

		let textarea;
		let wrapper = DIV({
			style : {
				padding : 5,
				backgroundColor : '#fff',
				position : 'relative',
				height : 100
			},
			c : textarea = TEXTAREA({
				style : {
					width : '100%',
					height : '100%',
					backgroundColor : 'transparent',
					border : 'none'
				},
				name : name,
				placeholder : placeholder,
				value : value
			})
		});

		inner.setWrapperDom(wrapper);
		inner.setContentDom(textarea);

		let getName = self.getName = () => {
			return name;
		};

		let getValue = self.getValue = () => {
			return textarea.getValue();
		};

		let setValue = self.setValue = (value) => {
			//REQUIRED: value

			let originValue = textarea.getValue();

			textarea.setValue(value);

			if (originValue !== value) {

				EVENT.fireAll({
					node : self,
					name : 'change'
				});
			}
		};

		let select = self.select = () => {
			textarea.select();
		};

		let focus = self.focus = () => {
			textarea.focus();
		};

		let blur = self.blur = () => {
			textarea.blur();
		};
		
		let setPlaceholder = self.setPlaceholder = (placeholder) => {
			//REQUIRED: placeholder
			
			textarea.setPlaceholder(placeholder);
		};

		let addTextareaStyle = self.addTextareaStyle = (style) => {
			//REQUIRED: style

			textarea.addStyle(style);
		};

		if (textareaStyle !== undefined) {
			addTextareaStyle(textareaStyle);
		}

		let on = self.on = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//REQUIRED: eventHandler

			if (eventName === 'focus' || eventName === 'blur' || eventName === 'change' || eventName === 'keydown' || eventName === 'keypress' || eventName === 'keyup') {

				EVENT({
					node : self,
					lowNode : textarea,
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
