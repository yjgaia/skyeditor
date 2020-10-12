/*
 * Prompt class
 */
UUI.PROMPT = CLASS((cls) => {
	
	let promptCount = 0;
	
	let getCount = cls.getCount = () => {
		return promptCount;
	};
	
	return {
		
		init : (inner, self, params, callbackOrhandlers) => {
			//REQUIRED: params
			//OPTIONAL: params.style
			//OPTIONAL: params.contentStyle
			//OPTIONAL: params.formStyle
			//OPTIONAL: params.inputStyle
			//OPTIONAL: params.okButtonStyle
			//OPTIONAL: params.cancelButtonStyle
			//OPTIONAL: params.on
			//REQUIRED: params.msg
			//OPTIONAL: params.value
			//REQUIRED: callbackOrhandlers
			//REQUIRED: callbackOrhandlers.ok
			//OPTIONAL: callbackOrhandlers.cancel
	
			let style = params.style;
			let contentStyle = params.contentStyle;
			let formStyle = params.formStyle;
			let inputStyle = params.inputStyle;
			let okButtonStyle = params.okButtonStyle;
			let cancelButtonStyle = params.cancelButtonStyle;
			let on = params.on;
			let msg = params.msg;
			let value = params.value;
			
			let okHandler;
			let cancelHandler;
			
			if (CHECK_IS_DATA(callbackOrhandlers) !== true) {
				okHandler = callbackOrhandlers;
			} else {
				okHandler = callbackOrhandlers.ok;
				cancelHandler = callbackOrhandlers.cancel;
			}
			
			let content;
			let form;
			let input;
			let okButton;
			let cancelButton;
			let modal = UUI.MODAL({
				style : COMBINE([{
					textAlign : 'center'
				}, style]),
				on : on,
				c : [content = P({
					style : contentStyle,
					c : msg
				}), form = FORM({
					style : formStyle,
					c : input = UUI.FULL_INPUT({
						style : inputStyle,
						value : value,
						on : {
							keydown : (e) => {
								if (e.getKey() !== 'Escape') {
									e.stopBubbling();
								}
							}
						}
					}),
					on : {
						submit : (e) => {
							if (okHandler(input.getValue()) !== false) {
								remove();
							}
						}
					}
				}), okButton = UUI.BUTTON({
					style : okButtonStyle,
					title : MSG({
						en : 'Ok',
						ko : '확인'
					}),
					on : {
						tap : () => {
							form.submit();
						}
					}
				}), cancelButton = UUI.BUTTON({
					style : cancelButtonStyle,
					title : MSG({
						en : 'Close',
						ko : '닫기'
					}),
					on : {
						tap : () => {
							if (cancelHandler !== undefined) {
								cancelHandler();
							}
							remove();
						}
					}
				}), CLEAR_BOTH()]
			});
			
			input.select();
			
			promptCount += 1;
			modal.on('remove', () => {
				promptCount -= 1;
			});
			
			let getNode = self.getNode = () => {
				return modal.getNode();
			};
	
			let append = self.append = (node) => {
				//REQUIRED: node
	
				content.append(node);
			};
	
			let prepend = self.prepend = (node) => {
				//REQUIRED: node
	
				content.prepend(node);
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
				content.empty();
			};
	
			let getChildren = self.getChildren = () => {
				return content.getChildren();
			};
			
			let getOkButton = self.getOkButton = () => {
				return okButton;
			};
			
			let getCancelButton = self.getCancelButton = () => {
				return cancelButton;
			};
			
			let addContentStyle = self.addContentStyle = (style) => {
				//REQUIRED: style
	
				content.addContentStyle(style);
			};
	
			let addInputStyle = self.addInputStyle = (style) => {
				//REQUIRED: style
	
				input.addStyle(style);
			};
			
			let addOkButtonStyle = self.addOkButtonStyle = (style) => {
				//REQUIRED: style
				
				okButton.addStyle(style);
			};
			
			let addCancelButtonStyle = self.addCancelButtonStyle = (style) => {
				//REQUIRED: style
				
				cancelButton.addStyle(style);
			};
		}
	};
});
