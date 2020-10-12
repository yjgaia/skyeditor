/*
 * Calendar class
 */
UUI.CALENDAR = CLASS({

	preset : () => {
		return UUI.TABLE;
	},

	init : (inner, self, params, selectDateHandlerOrHandlers) => {
		//REQUIRED: params
		//OPTIONAL: params.year
		//OPTIONAL: params.month
		//OPTIONAL: params.date
		//OPTIONAL: params.headerStyle
		//OPTIONAL: params.dayStyle
		//OPTIONAL: params.dateStyle
		//OPTIONAL: params.todayDateStyle
		//OPTIONAL: params.otherMonthDateStyle
		//OPTIONAL: params.selectedDateStyle
		//OPTIONAL: params.leftArrowIcon
		//OPTIONAL: params.rightArrowIcon
		//OPTIONAL: selectDateHandlerOrHandlers
		//OPTIONAL: selectDateHandlerOrHandlers.selectDate
		//OPTIONAL: selectDateHandlerOrHandlers.each

		let year = params.year;
		let month = params.month;
		let date = params.date;
		let headerStyle = params.headerStyle === undefined ? {} : params.headerStyle;
		let dayStyle = params.dayStyle;
		let dateStyle = params.dateStyle;
		let todayDateStyle = params.todayDateStyle;
		let otherMonthDateStyle = params.otherMonthDateStyle;
		let selectedDateStyle = params.selectedDateStyle;
		let leftArrowIcon = params.leftArrowIcon;
		let rightArrowIcon = params.rightArrowIcon;
		
		let nowCal = CALENDAR();
		
		if (year === undefined || month === undefined) {
			
			if (year === undefined) {
				year = nowCal.getYear();
			}
			
			if (month === undefined) {
				month = nowCal.getMonth();
			}
		}
		
		let selectDateHandler;
		let eachHandler;
		
		if (CHECK_IS_DATA(selectDateHandlerOrHandlers) !== true) {
			selectDateHandler = selectDateHandlerOrHandlers;
		} else {
			selectDateHandler = selectDateHandlerOrHandlers.selectDate;
			eachHandler = selectDateHandlerOrHandlers.each;
		}
		
		let firstDateCal;
		let title;
		
		// header
		self.append(TR({
			c : TD({
				colspan : 7,
				style : COMBINE([headerStyle, {
					textAlign : 'center'
				}]),
				c : [title = SPAN(),
				
				// left arrow
				DIV({
					style : {
						flt : 'left',
						cursor : 'pointer',
						userSelect : 'none'
					},
					c : leftArrowIcon === undefined ? '<' : leftArrowIcon,
					on : {
						tap : () => {
							
							month -= 1;
							
							loadDates();
						}
					}
				}),
				
				// right arrow
				DIV({
					style : {
						flt : 'right',
						cursor : 'pointer',
						userSelect : 'none'
					},
					c : rightArrowIcon === undefined ? '>' : rightArrowIcon,
					on : {
						tap : () => {
							
							month += 1;
							
							loadDates();
						}
					}
				}), CLEAR_BOTH()]
			})
		}));
		
		// days
		self.append(TR({
			c : [TD({
				style : dayStyle,
				c : '일'
			}), TD({
				style : dayStyle,
				c : '월'
			}), TD({
				style : dayStyle,
				c : '화'
			}), TD({
				style : dayStyle,
				c : '수'
			}), TD({
				style : dayStyle,
				c : '목'
			}), TD({
				style : dayStyle,
				c : '금'
			}), TD({
				style : dayStyle,
				c : '토'
			})]
		}));
		
		let getYear = self.getYear = () => {
			return firstDateCal.getYear();
		};
		
		let getMonth = self.getMonth = () => {
			return firstDateCal.getMonth();
		};
		
		let loadDates = RAR(() => {
			
			let lastDateCal = CALENDAR(CREATE_DATE({
				year : year,
				month : month + 1,
				date : 0
			}));
			
			let dateCount = 0;
			
			let nowTR;
			let selectedDate;
			
			let selectedDateOriginStyle;
			
			firstDateCal = CALENDAR(CREATE_DATE({
				year : year,
				month : month,
				date : 1
			}));
			
			let startDateCal = CALENDAR(CREATE_DATE({
				year : year,
				month : month,
				date : -(firstDateCal.getDay() - 1)
			}));
			
			title.empty();
			title.append(firstDateCal.getYear() + '년 ' + firstDateCal.getMonth() + '월');
			
			REPEAT(7, (i) => {
				self.removeTR(i);
			});
			
			REPEAT(firstDateCal.getDay(), (i) => {
				
				if (dateCount % 7 === 0) {
					self.addTR({
						key : dateCount / 7,
						tr : nowTR = TR()
					});
				}
				
				let td;
				
				nowTR.append(td = TD({
					style : otherMonthDateStyle === undefined ? dateStyle : otherMonthDateStyle,
					c : startDateCal.getDate() + i,
					on : {
						tap : (e, td) => {
							
							if (selectedDateOriginStyle !== undefined) {
								selectedDate.addStyle(selectedDateOriginStyle);
							}
							
							selectedDate = td;
							selectedDateOriginStyle = otherMonthDateStyle === undefined ? dateStyle : otherMonthDateStyle;
							
							if (selectedDateStyle !== undefined) {
								td.addStyle(selectedDateStyle);
							}
							
							if (selectDateHandler !== undefined) {
								
								selectDateHandler(CALENDAR(CREATE_DATE({
									year : year,
									month : month - 1,
									date : startDateCal.getDate() + i
								})), self);
							}
						}
					}
				}));
				
				if (eachHandler !== undefined) {
					eachHandler(td, CALENDAR(CREATE_DATE({
						year : year,
						month : month - 1,
						date : startDateCal.getDate() + i
					})), self);
				}
				
				dateCount += 1;
			});
			
			REPEAT({
				start : firstDateCal.getDate(),
				end : lastDateCal.getDate()
			}, (d, i) => {
				
				if (dateCount % 7 === 0) {
					self.addTR({
						key : dateCount / 7,
						tr : nowTR = TR()
					});
				}
				
				let td;
				
				nowTR.append(td = TD({
					style : COMBINE([dateStyle,
						todayDateStyle !== undefined &&
						firstDateCal.getYear() === nowCal.getYear() &&
						firstDateCal.getMonth() === nowCal.getMonth() &&
						d === nowCal.getDate() ? todayDateStyle : {}]),
					c : d,
					on : {
						tap : (e, td) => {
							
							if (selectedDateOriginStyle !== undefined) {
								selectedDate.addStyle(selectedDateOriginStyle);
							}
							
							selectedDate = td;
							selectedDateOriginStyle = COMBINE([dateStyle,
								todayDateStyle !== undefined &&
								firstDateCal.getYear() === nowCal.getYear() &&
								firstDateCal.getMonth() === nowCal.getMonth() &&
								d === nowCal.getDate() ? todayDateStyle : {}]);
							
							if (selectedDateStyle !== undefined) {
								td.addStyle(selectedDateStyle);
							}
							
							if (selectDateHandler !== undefined) {
								
								selectDateHandler(CALENDAR(CREATE_DATE({
									year : year,
									month : month,
									date : d
								})), self);
							}
						}
					}
				}));
				
				if (firstDateCal.getYear() === nowCal.getYear() &&
				firstDateCal.getMonth() === nowCal.getMonth() &&
				d === date) {
					
					if (selectedDateOriginStyle !== undefined) {
						selectedDate.addStyle(selectedDateOriginStyle);
					}
					
					selectedDate = td;
					selectedDateOriginStyle = COMBINE([dateStyle,
						todayDateStyle !== undefined &&
						firstDateCal.getYear() === nowCal.getYear() &&
						firstDateCal.getMonth() === nowCal.getMonth() &&
						d === nowCal.getDate() ? todayDateStyle : {}]);
					
					if (selectedDateStyle !== undefined) {
						td.addStyle(selectedDateStyle);
					}
				}
				
				if (eachHandler !== undefined) {
					eachHandler(td, CALENDAR(CREATE_DATE({
						year : year,
						month : month,
						date : d
					})), self);
				}
				
				dateCount += 1;
			});
			
			REPEAT(42 - dateCount, (i) => {
				
				if (dateCount % 7 === 0) {
					self.addTR({
						key : dateCount / 7,
						tr : nowTR = TR()
					});
				}
				
				let td;
				
				nowTR.append(td = TD({
					style : otherMonthDateStyle === undefined ? dateStyle : otherMonthDateStyle,
					c : i + 1,
					on : {
						tap : (e, td) => {
							
							if (selectedDateOriginStyle !== undefined) {
								selectedDate.addStyle(selectedDateOriginStyle);
							}
							
							selectedDate = td;
							selectedDateOriginStyle = otherMonthDateStyle === undefined ? dateStyle : otherMonthDateStyle;
							
							if (selectedDateStyle !== undefined) {
								td.addStyle(selectedDateStyle);
							}
							
							if (selectDateHandler !== undefined) {
								
								selectDateHandler(CALENDAR(CREATE_DATE({
									year : year,
									month : month + 1,
									date : i + 1
								})), self);
							}
						}
					}
				}));
				
				if (eachHandler !== undefined) {
					eachHandler(td, CALENDAR(CREATE_DATE({
						year : year,
						month : month + 1,
						date : i + 1
					})), self);
				}
				
				dateCount += 1;
			});
		});
	}
});
