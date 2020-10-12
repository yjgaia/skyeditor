/*
 * DOM이 오른쪽에서 왼쪽으로 사라지도록 슬라이드 애니메이션을 추가합니다.
 */
UANI.HIDE_SLIDE_LEFT = METHOD((m) => {
	
	let savedWidths = {};

	let getSavedWidths = m.getSavedWidths = () => {
		return savedWidths;
	};

	return {

		run : (params, callback) => {
			//REQUIRED: params
			//REQUIRED: params.node
			//OPTIONAL: params.width
			//OPTIONAL: params.duration
			//OPTIONAL: params.timingFunction
			//OPTIONAL: params.delay
			//OPTIONAL: params.iterationCount
			//OPTIONAL: params.direction
			//OPTIONAL: params.playStateduration
			//OPTIONAL: callback

			let node = params.node;
			let width = params.width;

			let marginLeft;
			let originWidth = node.getInnerWidth();
			let originMarginLeft = node.getStyle('marginLeft');

			params = COPY(params);

			marginLeft = UANI.SHOW_SLIDE_LEFT.getSavedMarginLefts()[node.id];

			if (marginLeft === undefined) {
				marginLeft = 0;
			}

			savedWidths[node.id] = originWidth;

			params.keyframes = {
				from : {
					width : originWidth,
					marginLeft : originMarginLeft === undefined ? 0 : originMarginLeft,
					overflow : 'hidden'
				},
				to : {
					marginLeft : -(width === undefined ? originWidth : width) - marginLeft,
					overflow : 'hidden'
				}
			};

			ANIMATE(params, callback);
		}
	};
});
