/*
 * Validatable form class
 */
UUI.VALID_FORM = CLASS({

	preset : () => {
		return FORM;
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.errorMsgs
		//OPTIONAL: params.on
		//OPTIONAL: params.c
		//OPTIONAL: params.style
		//OPTIONAL: params.errorMsgStyle

		let errorMsgs = params === undefined ? undefined : params.errorMsgs;
		let errorMsgStyle = params === undefined ? undefined : params.errorMsgStyle;
		let delays = [];

		self.on('remove', () => {
			EACH(delays, (delay) => {
				delay.remove();
			});
		});

		let showErrors = self.showErrors = (_errors) => {
			//REQUIRED: _errors

			let errors = COPY(_errors);

			let f = (node) => {

				EACH(node.getChildren(), (child) => {
					
					if (child.getValue !== undefined && child.getName !== undefined) {

						let name = child.getName();
						let error = errors[name];

						if (error !== undefined && errorMsgs !== undefined) {
							let errorMsg = errorMsgs[name][error.type];

							if ( typeof errorMsg === 'function') {
								if (error.validParam !== undefined) {
									errorMsg = errorMsg(error.validParam);
								} else {
									errorMsg = errorMsg(error.validParams);
								}
							}
							
							let errorMsgP;
							child.after(errorMsgP = P({
								style : errorMsgStyle,
								c : errorMsg
							}));

							REMOVE({
								data : errors,
								name : name
							});

							delays.push(DELAY(3, (delay) => {
								errorMsgP.remove();

								REMOVE({
									array : delays,
									value : delay
								});
							}));
						}
					}

					f(child);
				});
			};

			f(self);
		};

		let getErrorMsgs = self.getErrorMsgs = (errors) => {
			//REQUIRED: errors

			let msgs = {};
			
			EACH(errors, (error, name) => {
				
				if (errorMsgs !== undefined) {
					let errorMsg = errorMsgs[name][error.type];

					if ( typeof errorMsg === 'function') {
						if (error.validParam !== undefined) {
							errorMsg = errorMsg(error.validParam);
						} else {
							errorMsg = errorMsg(error.validParams);
						}
					}

					msgs[name] = errorMsg;
				}
			});

			return msgs;
		};
		
		let getErrorMsgStyle = self.getErrorMsgStyle = () => {
			return errorMsgStyle;
		};
	}
});
