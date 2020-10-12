/*
 * Font Awesome 아이콘을 가져옵니다.
 */
FontAwesome.GetIcon = METHOD((m) => {

	let fontStyleEl = document.createElement('style');
	fontStyleEl.type = 'text/css';
	fontStyleEl.appendChild(document.createTextNode('@import url(/FontAwesome/R/css/all.min.css);'));
	document.getElementsByTagName('head')[0].appendChild(fontStyleEl);

	return {

		run: (keyOrParams) => {
			//REQUIRED: keyOrParams
			//OPTIONAL: keyOrParams.style
			//REQUIRED: keyOrParams.key

			let key;
			let style;

			if (CHECK_IS_DATA(keyOrParams) !== true) {
				key = keyOrParams;
			} else {
				key = keyOrParams.key;
				style = keyOrParams.style;
			}

			let dom = DOM({
				tag: 'i',
				cls: 'fa fa-' + key,
				style: style
			});

			dom.getEl().setAttribute('aria-hidden', 'true');

			return dom;
		}
	};
});
