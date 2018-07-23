DasomEditorServer.SolidityEditor = CLASS((cls) => {
	
	let contractInfoStore;
	
	let getName = cls.getName = () => {
		return 'DasomEditor.SolidityEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/solidity.png')
		});
	};
	
	if (global.web3 !== undefined) {
		web3 = new Web3(web3.currentProvider);
	}
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'solidity',
				icon : getIcon()
			};
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
					
					let code = self.getContent();
						
					if (code !== '') {
						
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
												if (line.substring(i + 1, i + 4) === '../') {
													start = i + 1;
												} else {
													start = i + 3;
												}
											} else {
												end = i;
												break;
											}
										}
									}
									
									if (start !== undefined && end !== undefined) {
										
										let importPath = line.substring(start, end);
										
										let path;
										
										if (importPath.substring(0, 3) === '../') {
											importPath = importPath.substring(3);
											path = folderPath.substring(0, folderPath.lastIndexOf('/') + 1) + importPath;
										} else {
											path = folderPath + '/' + importPath;
										}
										
										importFileInfos.push({
											path : path,
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
							
							let loadingBar = SkyDesktop.LoadingBar('lime');
							
							console.log('Solidity 코드(' + fileName + ')를 컴파일합니다.');
							
							let errorTab;
							
							// 저장되어 있던 계약 제거
							contractInfoStore.remove(path);
							
							DasomEditorServer.EthereumContractModel.compileSolidityCode({
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
					}
				});
				
				let deployButton;
				let testButton;
				let networkButton;
				
				self.on('active', () => {
					
					if (deployButton === undefined) {
						
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
									
									if (web3.eth.accounts.length === 0) {
										SkyDesktop.Alert({
											msg : '메타마스크가 잠겨있습니다. 메타마스크에 로그인해주시기 바랍니다.'
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
																				DasomEditorServer.EthereumContractModel.create({
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
									
									DasomEditorServer.EthereumContractModel.find({
										filter : {
											path : path
										}
									}, (contracts) => {
										
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
																				
																				DasomEditorServer.EthereumContractModel.create({
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
										
										EACH(contracts, (contractInfo) => {
											
											menu.append(SkyDesktop.ContextMenuItem({
												title : contractInfo.address + ' (' + contractInfo.name + ')',
												icon : IMG({
													src : DasomEditor.R('icon/contract.png')
												}),
												on : {
													tap : () => {
														
														let list;
														
														SkyDesktop.Alert({
															style : {
																onDisplayResize : (width, height) => {
												
																	if (width > 600) {
																		return {
																			width : 500
																		};
																	} else {
																		return {
																			width : '90%'
																		};
																	}
																}
															},
															msg : [H2({
																style : {
																	fontWeight : 'bold'
																},
																c : contractInfo.name + ' 테스트'
															}), list = DIV({
																style : {
																	marginTop : 8,
																	overflowY : 'scroll',
																	padding : 8,
																	backgroundColor : '#e0e1e2',
																	border : '1px solid #999',
																	borderRadius : 4,
																	textAlign : 'left',
																	onDisplayResize : (width, height) => {
																		return {
																			height : height * 0.6
																		};
																	}
																}
															})]
														});
														
														EACH(contractInfo.abi, (funcInfo) => {
															if (funcInfo.type !== 'constructor') {
																
																let inputList;
																let wrapper = DIV({
																	style : {
																		padding : '5px 8px',
																		backgroundColor : '#fff',
																		border : '1px solid #999',
																		borderRadius : 4,
																		marginBottom : 10
																	},
																	c : [H3({
																		style : {
																			fontWeight : 'bold',
																			marginBottom : 5
																		},
																		c : funcInfo.name
																	}), FORM({
																		c : [inputList = DIV(), UUI.FULL_SUBMIT({
																			style : {
																				borderRadius : 4
																			},
																			value : '실행'
																		})],
																		on : {
																			submit : () => {
																				
																				let showError = (errorMsg) => {
																					let errorPanel;
																					inputList.after(errorPanel = P({
																						style : {
																							color : 'red',
																							marginBottom : 5
																						},
																						c : errorMsg
																					}));
																					DELAY(3, () => {
																						errorPanel.remove();
																					});
																				};
																				
																				let ether;
																				let args = [];
																				EACH(inputList.getChildren(), (input) => {
																					if (input.getName() === '__ETHER') {
																						ether = web3.toWei(input.getValue(), 'ether');
																					} else {
																						args.push(input.getValue());
																					}
																				});
																				
																				args.push({
																					value : ether
																				});
																				
																				// 계약 실행
																				let contract = web3.eth.contract(contractInfo.abi).at(contractInfo.address);
																				
																				args.push((error, result) => {
																					if (error !== TO_DELETE) {
																						showError(error.toString());
																					} else {
																						
																						if (/^0x([A-Fa-f0-9]{64})$/.test(result) === true) {
																							
																							let loadingBar = SkyDesktop.LoadingBar('lime');
																							
																							let retry = RAR(() => {
																								web3.eth.getTransactionReceipt(result, (error, result) => {
																									if (error !== TO_DELETE) {
																										loadingBar.done();
																										showError(error.toString());
																									} else if (result === TO_DELETE) {
																										retry();
																									} else {
																										loadingBar.done();
																										
																										let resultPanel;
																										wrapper.append(resultPanel = P({
																											style : {
																												marginTop : 5
																											},
																											c : '트랜잭션이 완료되었습니다.'
																										}));
																										DELAY(3, () => {
																											resultPanel.remove();
																										});
																									}
																								});
																							});
																						}
																						
																						else {
																							
																							if (CHECK_IS_ARRAY(result) === true) {
																								EACH(result, (value, i) => {
																									if (value.toNumber !== undefined) {
																										result[i] = value.toNumber();
																									}
																								});
																							}
																							
																							let resultPanel;
																							wrapper.append(resultPanel = P({
																								style : {
																									marginTop : 5
																								},
																								c : '실행 결과: ' + JSON.stringify(result)
																							}));
																							DELAY(3, () => {
																								resultPanel.remove();
																							});
																						}
																					}
																				});
																				
																				try {
																					
																					contract[funcInfo.name].apply(contract, args);
																					
																				} catch(error) {
																					showError(error.toString());
																				}
																			}
																		}
																	})]
																}).appendTo(list);
																
																EACH(funcInfo.inputs, (inputInfo) => {
																	UUI.FULL_INPUT({
																		style : {
																			border : '1px solid #999',
																			borderRadius : 4,
																			marginBottom : 5
																		},
																		placeholder : (inputInfo.name === '' ? '?' : inputInfo.name) + ' (' + inputInfo.type + ')'
																	}).appendTo(inputList);
																});
																
																UUI.FULL_INPUT({
																	style : {
																		border : '1px solid #999',
																		borderRadius : 4,
																		marginBottom : 5,
																		backgroundColor : '#ccc'
																	},
																	name : '__ETHER',
																	placeholder : '보낼 이더'
																}).appendTo(inputList);
															}
														});
														
														menu.remove();
													},
													
													contextmenu : (e) => {
														
														let menu = SkyDesktop.ContextMenu({
															e : e
														});
														
														menu.append(SkyDesktop.ContextMenuItem({
															title : '계약 주소 복사',
															on : {
																tap : () => {
																	
																	let textarea = TEXTAREA({
																		style : {
																			position : 'fixed',
																			left : -999999,
																			top : -999999
																		},
																		value : contractInfo.address
																	}).appendTo(BODY);
																	
																	textarea.getEl().select();
																	document.execCommand('copy');
																	
																	textarea.remove();
																	
																	menu.remove();
																}
															}
														}));
														
														menu.append(SkyDesktop.ContextMenuItem({
															title : 'ABI 복사',
															on : {
																tap : () => {
																	
																	let textarea = TEXTAREA({
																		style : {
																			position : 'fixed',
																			left : -999999,
																			top : -999999
																		},
																		value : JSON.stringify(contractInfo.abi)
																	}).appendTo(BODY);
																	
																	textarea.getEl().select();
																	document.execCommand('copy');
																	
																	textarea.remove();
																	
																	menu.remove();
																}
															}
														}));
														
														e.stop();
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
					}
				});
				
				let removeToolbarButtons = () => {
					
					// 도구 메뉴 제거
					DasomEditor.IDE.removeToolbarButton(deployButton);
					DasomEditor.IDE.removeToolbarButton(testButton);
					DasomEditor.IDE.removeToolbarButton(networkButton);
					
					deployButton = undefined;
					testButton = undefined;
					networkButton = undefined;
				};
				
				self.on('deactive', removeToolbarButtons);
				self.on('remove', removeToolbarButtons);
			}
		}
	};
});
