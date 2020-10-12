/*
 * Full-size select class
 */
UUI.FULL_SELECT = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.name
		//OPTIONAL: params.value
		//REQUIRED: params.options
		//OPTIONAL: params.style
		//OPTIONAL: params.selectStyle

		let name = params.name;
		let value = params.value;
		let options = params.options;
		let selectStyle = params.selectStyle;

		let _select
		let wrapper = DIV({
			style : {
				padding : 5,
				backgroundColor : '#fff',
				position : 'relative'
			},
			c : _select = SELECT({
				style : {
					width : '100%',
					border : 'none',
					background : 'transparent'
				},
				name : name,
				value : value,
				c : options
			})
		});

		inner.setWrapperDom(wrapper);

		let getName = self.getName = () => {
			return name;
		};

		let getValue = self.getValue = () => {
			return _select.getValue();
		};

		let setValue = self.setValue = (value) => {
			//REQUIRED: value

			let originValue = _select.getValue();

			_select.setValue(value);

			if (originValue !== value) {

				EVENT.fireAll({
					node : self,
					name : 'change'
				});
			}
		};

		let select = self.select = () => {
			_select.select();
		};

		let blur = self.blur = () => {
			_select.blur();
		};

		let addSelectStyle = self.addSelectStyle = (style) => {
			//REQUIRED: style

			_select.addStyle(style);
		};

		if (selectStyle !== undefined) {
			addSelectStyle(selectStyle);
		}

		let addOption = self.addOption = (option) => {
			//REQUIRED: option

			_select.append(option);
		};

		let removeAllOptions = self.removeAllOptions = () => {
			_select.empty();
		};

		let on = self.on = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//REQUIRED: eventHandler

			if (eventName === 'focus' || eventName === 'blur' || eventName === 'change' || eventName === 'select' || eventName === 'keydown' || eventName === 'keypress' || eventName === 'keyup') {

				EVENT({
					node : self,
					lowNode : _select,
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
