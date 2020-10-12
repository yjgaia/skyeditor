/*
 * Font Awesome 브랜드 아이콘을 가져옵니다.
 */
FontAwesome.GetBrandIcon = METHOD({

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
			cls: 'fab fa-' + key,
			style: style
		});

		dom.getEl().setAttribute('aria-hidden', 'true');

		return dom;
	}
});
