/*
 * Table class
 */
UUI.TABLE = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.c
		//OPTIONAL: params.style
		//OPTIONAL: params.trs
		//OPTIONAL: params.on

		let trs = params === undefined ? undefined : params.trs;
		
		let trStack = [];
		let removeTRHandlers = {};

		if (trs === undefined) {
			trs = {};
		}

		let table;
		inner.setDom(table = TABLE());

		let addTR = self.addTR = (params) => {
			//REQUIRED: params
			//REQUIRED: params.key
			//REQUIRED: params.tr
			//OPTIONAL: params.isFirst

			let key = params.key;
			let tr = params.tr;
			let isFirst = params.isFirst;

			if (trs[key] !== undefined) {

				tr.insertBefore(trs[key]);

				trStack[FIND({
					array : trStack,
					value : trs[key]
				})] = tr;

				trs[key].remove();

			} else if (isFirst === true && trStack.length > 0) {
				tr.insertBefore(trStack[0]);
				trStack.unshift(tr);
			} else {
				self.append(tr);
				trStack.push(tr);
			}

			trs[key] = tr;
			
			tr.on('remove', () => {
				
				let handlers = removeTRHandlers[key];
	
				if (handlers !== undefined) {
					EACH(handlers, (handler) => {
						handler();
					});
				}
	
				REMOVE({
					array : trStack,
					value : tr
				});
				REMOVE({
					data : trs,
					name : key
				});
				REMOVE({
					data : removeTRHandlers,
					name : key
				});
			});
		};

		EACH(trs, (tr, key) => {
			trStack.push(tr);
			self.append(tr);
		});

		let removeTR = self.removeTR = (key) => {
			//REQUIRED: key

			let tr = trs[key];
			
			if (tr !== undefined) {
				tr.remove();
			}
		};

		let addRemoveTRHandler = self.addRemoveTRHandler = (key, handler) => {
			//REQUIRED: key
			//REQUIRED: handler

			if (removeTRHandlers[key] === undefined) {
				removeTRHandlers[key] = [];
			}

			removeTRHandlers[key].push(handler);
		};

		let removeAllTRs = self.removeAllTRs = () => {

			EACH(trs, (tr, key) => {

				let handlers = removeTRHandlers[key];

				tr.remove();

				if (handlers !== undefined) {
					EACH(handlers, (handler) => {
						handler();
					});
				}
			});

			trs = {};
			trStack = [];
			removeTRHandlers = {};
		};
	}
});
