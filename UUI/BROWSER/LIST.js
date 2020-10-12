/*
 * List class
 */
UUI.LIST = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.c
		//OPTIONAL: params.style
		//OPTIONAL: params.on
		//OPTIONAL: params.items
		//OPTIONAL: params.isRequiringClearBoth

		let isRequiringClearBoth = params === undefined ? undefined : params.isRequiringClearBoth;
		let itemStack = [];
		let removeItemHandlers = {};

		let ul;
		let items;
		let clearBoth;

		if (items === undefined) {
			items = {};
		}

		inner.setDom(ul = UL());

		let addItem = self.addItem = (params) => {
			//REQUIRED: params
			//REQUIRED: params.key
			//REQUIRED: params.item
			//OPTIONAL: params.isFirst

			let key = params.key;
			let item = params.item;
			let isFirst = params.isFirst;

			if (items[key] !== undefined) {

				item.insertBefore(items[key]);

				itemStack[FIND({
					array : itemStack,
					value : items[key]
				})] = item;

				items[key].remove();

			} else if (isFirst === true && itemStack.length > 0) {
				item.insertBefore(itemStack[0]);
				itemStack.unshift(item);
			} else {
				self.append(item);
				itemStack.push(item);
			}

			items[key] = item;

			if (isRequiringClearBoth === true) {

				if (clearBoth !== undefined) {
					clearBoth.remove();
				}

				clearBoth = CLEAR_BOTH().appendTo(ul);
			}
			
			item.on('remove', () => {
				
				let handlers = removeItemHandlers[key];
				
				if (handlers !== undefined) {
					EACH(handlers, (handler) => {
						handler();
					});
				}
	
				REMOVE({
					array : itemStack,
					value : item
				});
				REMOVE({
					data : items,
					name : key
				});
				REMOVE({
					data : removeItemHandlers,
					name : key
				});
			});
		};

		if (params !== undefined && params.items !== undefined) {

			EACH(params.items, (item, key) => {
				addItem({
					key : key,
					item : item
				});
			});
		}
		
		let getItems = self.getItems = () => {
			return items;
		};
		
		let sortItems = self.sortItems = (f) => {
			//REQUIRED: f
			
			itemStack.sort(f);
			
			EACH(itemStack, (item) => {
				self.append(item);
			});
		};
		
		let getItem = self.getItem = (key) => {
			//REQUIRED: key
			
			return items[key];
		};

		let removeItem = self.removeItem = (key) => {
			//REQUIRED: key

			let item = items[key];
			
			if (item !== undefined) {
				item.remove();
			}
		};

		let addRemoveItemHandler = self.addRemoveItemHandler = (key, handler) => {
			//REQUIRED: key
			//REQUIRED: handler

			if (removeItemHandlers[key] === undefined) {
				removeItemHandlers[key] = [];
			}

			removeItemHandlers[key].push(handler);
		};

		let removeAllItems = self.removeAllItems = () => {

			EACH(items, (item, key) => {

				let handlers = removeItemHandlers[key];

				item.remove();

				if (handlers !== undefined) {
					EACH(handlers, (handler) => {
						handler();
					});
				}
			});

			items = {};
			itemStack = [];
			removeItemHandlers = {};
		};
	}
});
