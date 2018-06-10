DasomEditor.SolidityEditor = CLASS((cls) => {
	
	let contractInfoStore;
	
	let getName = cls.getName = () => {
		return 'DasomEditor.SolidityEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/solidity.png')
		});
	};
	
	cls.findContracts = (path, callback) => {
		//REQUIRED: path
		//REQUIRED: callback
		
		// 구현해야합니다.
	};
	
	cls.saveContract = (data, callback) => {
		//REQUIRED: data
		//REQUIRED: callback
		
		// 구현해야합니다.
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'solidity',
				icon : getIcon()
			}
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//OPTIONAL: params.ftpInfo
			//REQUIRED: params.path
			
			let ftpInfo = params.ftpInfo;
			let path = params.path;
			
			// 메타마스크 연동이 되어있고, 로컬인 경우
			if (global.web3 !== undefined && ftpInfo === undefined) {
				
				let folderPath = path.substring(0, path.lastIndexOf('/'));
				let fileName = path.substring(path.lastIndexOf('/') + 1);
				
				if (contractInfoStore === undefined) {
					contractInfoStore = DasomEditor.STORE('contractInfoStore');
				}
				
				// 코드를 저장하면 자동으로 컴파일
				self.on('save', () => {
					
					let loadingBar = SkyDesktop.LoadingBar('lime');
					
					let code = self.getContent();
					
					let importCodes = {};
					
					let loadImportFiles = (code, folderPath, importBasePath, callback) => {
						
						let importFileInfos = [];
						
						// 코드를 분석하여 import 구문을 찾습니다.
						EACH(code.split('\n'), (line) => {
							line = line.trim();
							if (line.substring(0, 7) === 'import ') {
								let start, end;
								for (let i = 7; i < line.length; i += 1) {
									if (line[i] === '"') {
										if (start === undefined) {
											start = i + 3;
										} else {
											end = i;
											break;
										}
									}
								}
								
								if (start !== undefined && end !== undefined) {
									
									let importPath = line.substring(start, end);
									
									importFileInfos.push({
										path : folderPath + '/' + importPath,
										importPath : (importBasePath === '' ? '' : importBasePath + '/') + importPath
									});
								}
							}
						});
						
						NEXT(importFileInfos, [
						(importFileInfo, next) => {
							
							let path = importFileInfo.path;
							let importPath = importFileInfo.importPath;
							
							if (importCodes[importPath] !== undefined) {
								next();
							}
							
							else {
								
								DasomEditor.IDE.load({
									ftpInfo : ftpInfo,
									path : path
								}, (code) => {
									importCodes[importPath] = code;
									
									// 이 코드의 import 파일들도 불러옵니다.
									loadImportFiles(code, path.substring(0, path.lastIndexOf('/')), importPath.substring(0, importPath.lastIndexOf('/')), next);
								});
							}
						},
						
						() => {
							return callback;
						}]);
					};
					
					loadImportFiles(code, folderPath, '', () => {
						
						console.log('Solidity 코드(' + fileName + ')를 컴파일합니다.');
						
						let errorTab;
						
						// 저장되어 있던 계약 제거
						contractInfoStore.remove(path);
						
						Solc.Compile({
							code : code,
							importCodes : importCodes
						}, {
							error : (errorMsg) => {
								loadingBar.done();
								
								SHOW_ERROR('컴파일 오류', errorMsg);
								
								if (errorTab === undefined) {
									
									DasomEditor.IDE.addTab(errorTab = SkyDesktop.Tab({
										style : {
											position : 'relative'
										},
										size : 30,
										c : [UUI.ICON_BUTTON({
											style : {
												position : 'absolute',
												right : 10,
												top : 8,
												color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc',
												zIndex : 999
											},
											icon : FontAwesome.GetIcon('times'),
											on : {
												mouseover : (e, self) => {
													self.addStyle({
														color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#666' : '#999'
													});
												},
												mouseout : (e, self) => {
													self.addStyle({
														color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc'
													});
												},
												tap : () => {
													
													errorTab.remove();
													errorTab = undefined;
													
													EVENT.fireAll('resize');
												}
											}
										}), H2({
											style : {
												padding : 10
											},
											c : 'Solidity 컴파일'
										}), P({
											style : {
												padding : 10,
												paddingTop : 0,
												color : 'red'
											},
											c : '컴파일 오류가 발생했습니다. 오류 메시지: ' + errorMsg
										})]
									}));
								}
								
								else {
									errorTab.append(P({
										style : {
											padding : 10,
											paddingTop : 0,
											color : 'red'
										},
										c : '컴파일 오류가 발생했습니다. 오류 메시지: ' + errorMsg
									}));
								}
							},
							success : (contractInfos) => {
								loadingBar.done();
								
								// 컴파일 결과 저장
								contractInfoStore.save({
									name : path,
									value : contractInfos
								});
								
								console.log('Solidity 코드(' + fileName + ') 컴파일을 완료하였습니다.', contractInfos);
								SkyDesktop.Noti('컴파일을 완료하였습니다.');
							}
						});
					});
				});
				
				let deployButton;
				let testButton;
				let networkButton;
				
				self.on('active', () => {
					
					// 도구 메뉴 추가
					DasomEditor.IDE.addToolbarButton(deployButton = SkyDesktop.ToolbarButton({
						icon : IMG({
							src : DasomEditor.R('icon/deploy.png')
						}),
						title : '계약 배포하기',
						on : {
							tap : (e) => {
								
								let contractInfos = contractInfoStore.get(path);
								if (contractInfos === undefined) {
									SkyDesktop.Alert({
										msg : '배포하기 전에, 먼저 파일을 저장하여 컴파일을 수행해주시기 바랍니다.'
									});
								}
								
								else {
									DELAY(() => {
										
										let menu = SkyDesktop.ContextMenu({
											e : e
										});
										
										EACH(contractInfos, (contractInfo, name) => {
											
											menu.append(SkyDesktop.ContextMenuItem({
												title : name,
												icon : IMG({
													src : DasomEditor.R('icon/contract.png')
												}),
												on : {
													tap : () => {
														
														let abi = JSON.parse(contractInfo.interface);
														
														// 계약 생성
														let Contract = web3.eth.contract(abi);
														
														let errorTab;
														let showError = (errorMsg) => {
															
															SHOW_ERROR('배포 오류', errorMsg);
															
															if (errorTab === undefined) {
																
																DasomEditor.IDE.addTab(errorTab = SkyDesktop.Tab({
																	style : {
																		position : 'relative'
																	},
																	size : 30,
																	c : [UUI.ICON_BUTTON({
																		style : {
																			position : 'absolute',
																			right : 10,
																			top : 8,
																			color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc',
																			zIndex : 999
																		},
																		icon : FontAwesome.GetIcon('times'),
																		on : {
																			mouseover : (e, self) => {
																				self.addStyle({
																					color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#666' : '#999'
																				});
																			},
																			mouseout : (e, self) => {
																				self.addStyle({
																					color : BROWSER_CONFIG.SkyDesktop !== undefined && BROWSER_CONFIG.SkyDesktop.theme === 'dark' ? '#444' : '#ccc'
																				});
																			},
																			tap : () => {
																				
																				errorTab.remove();
																				errorTab = undefined;
																				
																				EVENT.fireAll('resize');
																			}
																		}
																	}), H2({
																		style : {
																			padding : 10
																		},
																		c : 'Solidity 계약 배포'
																	}), P({
																		style : {
																			padding : 10,
																			paddingTop : 0,
																			color : 'red'
																		},
																		c : '배포 오류가 발생했습니다. 오류 메시지: ' + errorMsg
																	})]
																}));
															}
															
															else {
																errorTab.append(P({
																	style : {
																		padding : 10,
																		paddingTop : 0,
																		color : 'red'
																	},
																	c : '배포 오류가 발생했습니다. 오류 메시지: ' + errorMsg
																}));
															}
														};
														
														NEXT([
														(next) => {
															
															let inputInfos;
															EACH(abi, (info) => {
																if (info.type === 'constructor') {
																	inputInfos = info.inputs;
																}
															});
															
															if (inputInfos === undefined || inputInfos.length === 0) {
																next([]);
															} else {
																
																// 파라미터 입력
																let form;
																let inputs = [];
																SkyDesktop.Confirm({
																	okButtonTitle : '배포',
																	msg : form = UUI.VALID_FORM()
																}, () => {
																	let args = [];
																	EACH(inputs, (input) => {
																		args.push(input.getValue());
																	});
																	next(args);
																});
																
																EACH(inputInfos, (inputInfo, i) => {
																	inputs.push(INPUT({
																		style : {
																			marginTop : i === 0 ? 0 : 10,
																			width : 222,
																			padding : 8,
																			border : '1px solid #999',
																			borderRadius : 4
																		},
																		placeholder : inputInfo.name + ' (' + inputInfo.type + ')'
																	}).appendTo(form));
																});
															}
														},
														
														(next) => {
															return (args) => {
																
																let getDataArgs = COPY(args);
																getDataArgs.push({
																	data : contractInfo.bytecode
																});
																
																try {
																	
																	// 가스 량 계산
																	web3.eth.estimateGas({
																		data : Contract.new.getData.apply(Contract.new, getDataArgs)
																	}, (error, gasEstimate) => {
																		if (error !== TO_DELETE) {
																			showError(error.toString());
																		} else {
																			next(args, gasEstimate);
																		}
																	});
																	
																} catch(error) {
																	showError(error.toString());
																}
															};
														},
														
														(next) => {
															return (args, gasEstimate) => {
																
																let contractArgs = COPY(args);
																
																let loadingBar = SkyDesktop.LoadingBar('lime');
																
																contractArgs.push({
																	from : web3.eth.accounts[0],
																	data : contractInfo.bytecode,
																	gas : gasEstimate
																});
																
																contractArgs.push((error, contract) => {
																	if (error !== TO_DELETE) {
																		loadingBar.done();
																		showError(error.toString());
																	} else {
																		
																		// 배포 완료
																		if (contract.address !== undefined) {
																			
																			// 배포 내역 저장 (abi도 함께 저장합니다.)
																			cls.saveContract({
																				path : path,
																				name : name,
																				address : contract.address,
																				abi : abi
																			}, () => {
																				
																				loadingBar.done();
																				SkyDesktop.Noti('계약을 배포하였습니다.');
																			});
																		}
																	}
																});
																
																Contract.new.apply(Contract, contractArgs);
															};
														}]);
														
														menu.remove();
													}
												}
											}));
										});
									});
								}
							}
						}
					}));
					
					DasomEditor.IDE.addToolbarButton(testButton = SkyDesktop.ToolbarButton({
						icon : IMG({
							src : DasomEditor.R('icon/test.png')
						}),
						title : '계약 테스트',
						on : {
							tap : (e) => {
								
								cls.findContracts(path, (contracts) => {
									
									let menu = SkyDesktop.ContextMenu({
										e : e
									});
									
									menu.append(SkyDesktop.ContextMenuItem({
										title : '주소로 계약 추가',
										icon : IMG({
											src : DasomEditor.R('icon/contract-add.png')
										}),
										on : {
											tap : (e) => {
												
												menu.remove();
												
												DELAY(() => {
													
													let contractInfos = contractInfoStore.get(path);
													if (contractInfos === undefined) {
														SkyDesktop.Alert({
															msg : '주소로 계약을 추가하기 전에, 먼저 파일을 저장하여 컴파일을 수행해주시기 바랍니다.'
														});
													}
													
													else {
														
														let menu = SkyDesktop.ContextMenu({
															e : e
														});
														
														EACH(contractInfos, (contractInfo, name) => {
															
															menu.append(SkyDesktop.ContextMenuItem({
																title : name,
																icon : IMG({
																	src : DasomEditor.R('icon/contract.png')
																}),
																on : {
																	tap : () => {
																		
																		SkyDesktop.Prompt({
																			msg : '주소를 입력해주시기 바랍니다.'
																		}, (address) => {
																			
																			cls.saveContract({
																				path : path,
																				name : name,
																				address : address,
																				abi : JSON.parse(contractInfo.interface)
																			}, () => {
																				SkyDesktop.Noti('계약을 추가하였습니다.');
																			});
																		});
																		
																		menu.remove();
																	}
																}
															}));
														});
													}
												});
											}
										}
									}));
									
									EACH(contracts, (contract) => {
										
										menu.append(SkyDesktop.ContextMenuItem({
											title : contract.address + ' (' + contract.name + ')',
											icon : IMG({
												src : DasomEditor.R('icon/contract.png')
											}),
											on : {
												tap : () => {
													
													//TODO:
													
													menu.remove();
												}
											}
										}));
									});
								});
							}
						}
					}));
					
					let networkTitle;
					DasomEditor.IDE.addToolbarButton(networkButton = SkyDesktop.ToolbarButton({
						style : {
							cursor : 'default'
						},
						icon : IMG({
							src : DasomEditor.R('icon/network.png')
						}),
						title : networkTitle = SPAN({
							c : 'Checking Network ..........'
						})
					}));
					
					web3.version.getNetwork((err, netId) => {
						networkTitle.empty();
						if (netId === '1') {
							networkTitle.append('Main Ethereum Network');
						} else if (netId === '3') {
							networkTitle.append('Ropsten Test Network');
						} else if (netId === '4') {
							networkTitle.append('Rinkeby Test Network');
						} else if (netId === '42') {
							networkTitle.append('Kovan Test Network');
						} else {
							networkTitle.append('Unknown Network');
						}
					});
				});
				
				let removeToolbarButtons = () => {
					
					// 도구 메뉴 제거
					DasomEditor.IDE.removeToolbarButton(deployButton);
					DasomEditor.IDE.removeToolbarButton(testButton);
					DasomEditor.IDE.removeToolbarButton(networkButton);
				};
				
				self.on('deactive', removeToolbarButtons);
				self.on('remove', removeToolbarButtons);
			}
		}
	};
});
