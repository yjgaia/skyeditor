/*
 * Full-size upload form class
 */
UUI.FULL_UPLOAD_FORM = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params, handlers) => {
		//REQUIRED: params
		//REQUIRED: params.box
		//OPTIONAL: params.accept
		//OPTIONAL: params.isMultiple
		//OPTIONAL: params.style
		//OPTIONAL: params.formStyle
		//OPTIONAL: params.inputStyle
		//OPTIONAL: params.uploadingStyle
		//OPTIONAL: params.on
		//OPTIONAL: handlers
		//OPTIONAL: handlers.success
		//OPTIONAL: handlers.overSizeFile

		let box = params.box;
		let accept = params.accept;
		let isMultiple = params.isMultiple;
		let callbackURL = params.callbackURL !== undefined ? params.callbackURL : (BROWSER_CONFIG.isSecure === true ? 'https://' : 'http://') + BROWSER_CONFIG.host + ':' + BROWSER_CONFIG.port + '/__CORS_CALLBACK';
		let formStyle = params.formStyle;
		let inputStyle = params.inputStyle;
		let uploadingStyle = params.uploadingStyle;
		
		let successHandler;
		let overSizeFileHandler;
		
		if (handlers !== undefined) {
			successHandler = handlers.success;
			overSizeFileHandler = handlers.overSizeFile;
		}
		
		let uploadProgressRoom;
		
		let form;
		let input;
		let iframe;
		let uploading;
		let uploadingProgress;
		let wrapper = DIV({
			style : {
				padding : 5,
				background : '#FFF',
				position : 'relative'
			},
			c : [iframe = IFRAME({
				style : {
					display : 'none'
				},
				name : '__UPLOAD_FORM_' + self.id
			}), uploading = UUI.V_CENTER({
				style : {
					display : 'none',
					position : 'absolute',
					top : 0,
					left : 0,
					backgroundColor : 'rgba(0, 0, 0, 0.5)',
					color : '#fff',
					textAlign : 'center'
				},
				c : ['Uploading...', uploadingProgress = SPAN({
					style : {
						marginLeft : 10
					}
				})]
			})]
		});

		GET({
			isSecure : BROWSER_CONFIG.isSecure,
			port : BROWSER_CONFIG.port,
			uri : '__UPLOAD_SERVER_HOST?defaultHost=' + BROWSER_CONFIG.host
		}, (host) => {
			
			let uploadKey = RANDOM_STR(20);

			iframe.after(form = FORM({
				action : (BROWSER_CONFIG.isSecure === true ? 'https://' : 'http://') + host + ':' + BROWSER_CONFIG.port + '/__UPLOAD?boxName=' + box.boxName + '&callbackURL=' + callbackURL + '&uploadKey=' + uploadKey,
				target : '__UPLOAD_FORM_' + self.id,
				method : 'POST',
				enctype : 'multipart/form-data',
				style : formStyle,
				c : [input = INPUT({
					type : 'file',
					name : 'file',
					accept : accept,
					isMultiple : isMultiple,
					style : COMBINE([{
						width : '100%',
						height : '100%',
						color : '#000',
						border : 'none'
					}, inputStyle])
				}), INPUT({
					type : 'submit',
					style : {
						visibility : 'hidden',
						position : 'absolute'
					}
				})]
			}));

			EVENT({
				node : input,
				name : 'change'
			}, (e) => {

				if (input.getValue() !== '') {
					
					uploading.addStyle({
						width : wrapper.getWidth(),
						height : wrapper.getHeight()
					});
					
					uploading.show();
					
					if (uploadProgressRoom !== undefined) {
						uploadProgressRoom.exit();
					}
					uploadProgressRoom = box.ROOM('uploadProgressRoom/' + uploadKey);
					uploadProgressRoom.on('progress', (info) => {
						uploadingProgress.empty();
						uploadingProgress.append('(' + info.bytesRecieved + '/' + info.bytesExpected + ')');
					});

					if (form !== undefined) {
						form.submit();
					}
				}
			});
		});

		EVENT({
			node : iframe,
			name : 'load'
		}, (e) => {

			let frame = global['__UPLOAD_FORM_' + self.id];
			let fileDataSetStr = frame !== undefined ? frame.fileDataSetStr : undefined;
			let maxUploadFileMB = frame !== undefined ? frame.maxUploadFileMB : undefined;

			let originValue;

			if (maxUploadFileMB !== undefined) {

				if (overSizeFileHandler !== undefined) {
					overSizeFileHandler(maxUploadFileMB);
				}

				originValue = input.getValue();

				input.setValue('');

				if (originValue !== '') {

					EVENT.fireAll({
						node : self,
						name : 'change'
					});
				}

			} else if (fileDataSetStr !== undefined) {

				let fileDataSet = PARSE_STR(decodeURIComponent(fileDataSetStr));

				EACH(fileDataSet, (fileData, i) => {
					fileDataSet[i] = UNPACK_DATA(fileData);
				});

				if (successHandler !== undefined) {
					successHandler(isMultiple !== true ? fileDataSet[0] : fileDataSet, self);
				}

				originValue = input.getValue();

				input.setValue('');

				if (originValue !== '') {

					EVENT.fireAll({
						node : self,
						name : 'change'
					});
				}
			}

			uploading.hide();
			
			if (uploadProgressRoom !== undefined) {
				uploadProgressRoom.exit();
				uploadProgressRoom = undefined;
			}
		});

		inner.setWrapperDom(wrapper);

		let select = self.select = () => {

			if (input !== undefined) {

				input.select();

				EVENT.fireAll({
					node : self,
					name : 'select'
				});

				EVENT.fireAll({
					node : self,
					name : 'focus'
				});
			}
		};

		let addFormStyle = self.addFormStyle = (style) => {
			//REQUIRED: style

			if (form !== undefined) {
				form.addStyle(style);
			} else {
				EXTEND({
					origin : formStyle,
					extend : style
				});
			}
		};

		if (formStyle !== undefined) {
			addFormStyle(formStyle);
		}

		let addInputStyle = self.addInputStyle = (style) => {
			//REQUIRED: style

			if (input !== undefined) {
				input.addStyle(style);
			} else {
				EXTEND({
					origin : inputStyle,
					extend : style
				});
			}
		};

		if (inputStyle !== undefined) {
			addInputStyle(inputStyle);
		}

		let addUploadingStyle = self.addUploadingStyle = (style) => {
			//REQUIRED: style

			uploading.addStyle(style);
		};

		if (uploadingStyle !== undefined) {
			addUploadingStyle(uploadingStyle);
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
