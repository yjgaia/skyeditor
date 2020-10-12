/*
 * DOM에 페이드 인 애니메이션을 추가합니다.
 */
UANI.FADE_IN = METHOD({

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
				opacity : 0
			},
			to : {
				opacity : 1
			}
		};

		ANIMATE(params, callback);
	}
});
