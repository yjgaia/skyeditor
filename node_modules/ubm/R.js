FOR_BOX((box) => {

	/*
	 * fullpack용 R override
	 */
	box.R = METHOD((m) => {
		
		let basePath;
		
		let setBasePath = m.setBasePath = (_basePath) => {};
		
		return {

			run : (path, callback) => {
				//REQUIRED: path
				//OPTIONAL: callback
				
				let uri = __R[box.boxName + '/R/' + path];
				
				if (callback !== undefined) {
					GET(uri, callback);
				}
				
				return uri;
			}
		};
	});
});
