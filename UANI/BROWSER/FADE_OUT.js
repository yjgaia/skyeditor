/*
 * DOM이 페이드 아웃 효과와 함께 사라지도록 애니메이션을 추가합니다. 
 */
UANI.FADE_OUT = METHOD({

	run : (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.node
		//OPTIONAL: params.duration
		//OPTIONAL: params.timingFunction
		//OPTIONAL: params.delay
		//OPTIONAL: params.iterationCount
		//OPTIONAL: params.direction
		//OPTIONAL: params.playStateduration
		//OPTIONAL: callback

		params = COPY(params);

		params.keyframes = {
			from : {
				opacity : 1
			},
			to : {
				opacity : 0
			}
		};

		ANIMATE(params, callback);
	}
});
