/*
 * Full-size submit class
 */
UUI.FULL_SUBMIT = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.value
		//OPTIONAL: params.style
		//OPTIONAL: params.inputStyle
		//OPTIONAL: params.on

		let value = params === undefined ? undefined : params.value;
		let inputStyle = params === undefined ? undefined : params.inputStyle;

		let input = INPUT({
			type : 'submit',
			style : {
				display : 'block',
				border : 'none',
				width : '100%',
				padding : '10px 0',
				cursor : 'pointer'
			}
		});

		if (value !== undefined) {
			input.setValue(value);
		}

		inner.setDom(input);
		
		let getValue = self.getValue = () => {
			return input.getValue();
		};

		let setValue = self.setValue = (value) => {
			//REQUIRED: value

			input.setValue(value);
		};

		let addInputStyle = self.addInputStyle = (style) => {
			//REQUIRED: style

			input.addStyle(style);
		};

		if (inputStyle !== undefined) {
			addInputStyle(inputStyle);
		}
	}
});
