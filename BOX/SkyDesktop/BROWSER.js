SkyDesktop.Button=CLASS({preset:()=>{return UUI.BUTTON_H},params:()=>{return{style:{padding:"11px 15px",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",borderRadius:4},spacing:10,on:{mouseover:(e,o)=>{o.addStyle({backgroundColor:"#cacbcd"})},mouseout:(e,o)=>{o.addStyle({backgroundColor:"#e0e1e2"})}}}}}),SkyDesktop.LoadingBar=CLASS({init:(e,o,t)=>{let n=DIV({style:{position:"fixed",left:0,bottom:0,height:3,backgroundColor:t,zIndex:999999}}).appendTo(BODY);ANIMATE({node:n,keyframes:{from:{width:"0%"},to:{width:"50%"}},duration:.5});let i=DIV({style:{position:"fixed",left:0,bottom:0,height:3,backgroundColor:t,zIndex:999999}}).appendTo(BODY);o.done=(()=>{ANIMATE({node:i,keyframes:{from:{width:"0%"},to:{width:"100%"}},duration:.5},()=>{n.remove(),ANIMATE({node:i,keyframes:{from:{opacity:1},to:{opacity:0}},duration:.25},()=>{i.remove()})})})}}),SkyDesktop.Noti=METHOD({run:e=>{let o=UUI.PANEL({style:{zIndex:999,position:"fixed",right:10,bottom:10,backgroundColor:"#FFFFCC",color:"#333",borderRadius:5},contentStyle:{padding:"5px 10px"},c:e}).appendTo(BODY);UANI.SHOW_SLIDE_UP({node:o}),DELAY(2,()=>{UANI.HIDE_SLIDE_DOWN({node:o},o.remove)})}}),SkyDesktop.Alert=CLASS({preset:()=>{return UUI.ALERT},params:()=>{return{style:{zIndex:999,backgroundColor:"#fff",color:"#333",textAlign:"center",border:"1px solid #333",borderRadius:5,boxShadow:"0 0 5px rgba(0,0,0,0.3)",onDisplayResize:(e,o)=>{return e>300?{width:280}:{width:"90%"}}},contentStyle:{padding:20},buttonStyle:{borderTop:"1px solid #999",padding:"11px 0",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",borderRadius:"0 0 5px 5px"}}},init:(e,o)=>{o.getButton().on("mouseover",(e,o)=>{o.addStyle({backgroundColor:"#cacbcd"})}),o.getButton().on("mouseout",(e,o)=>{o.addStyle({backgroundColor:"#e0e1e2"})})}}),SkyDesktop.Confirm=CLASS({preset:()=>{return UUI.CONFIRM},params:()=>{return{style:{zIndex:999,backgroundColor:"#fff",color:"#333",textAlign:"center",border:"1px solid #333",borderRadius:5,boxShadow:"0 0 5px rgba(0,0,0,0.3)",onDisplayResize:(e,o)=>{return e>300?{width:280}:{width:"90%"}}},contentStyle:{padding:20},okButtonStyle:{flt:"left",borderTop:"1px solid #999",padding:"11px 0",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",width:"50%",borderRadius:"0 0 0 5px"},cancelButtonStyle:{flt:"right",marginLeft:-1,borderLeft:"1px solid #999",borderTop:"1px solid #999",padding:"11px 0",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",width:"50%",borderRadius:"0 0 5px 0"}}},init:(e,o)=>{o.getOkButton().on("mouseover",(e,o)=>{o.addStyle({backgroundColor:"#cacbcd"})}),o.getOkButton().on("mouseout",(e,o)=>{o.addStyle({backgroundColor:"#e0e1e2"})}),o.getCancelButton().on("mouseover",(e,o)=>{o.addStyle({backgroundColor:"#cacbcd"})}),o.getCancelButton().on("mouseout",(e,o)=>{o.addStyle({backgroundColor:"#e0e1e2"})})}}),SkyDesktop.Prompt=CLASS({preset:()=>{return UUI.PROMPT},params:()=>{return{style:{zIndex:999,backgroundColor:"#fff",color:"#333",textAlign:"center",border:"1px solid #333",borderRadius:5,boxShadow:"0 0 5px rgba(0,0,0,0.3)",onDisplayResize:(e,o)=>{return e>300?{width:280}:{width:"90%"}}},contentStyle:{padding:20,paddingBottom:10},formStyle:{padding:20,paddingTop:0},inputStyle:{borderTop:"1px solid #999",padding:8,border:"1px solid #999",borderRadius:4},okButtonStyle:{flt:"left",borderTop:"1px solid #999",padding:"11px 0",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",width:"50%",borderRadius:"0 0 0 5px"},cancelButtonStyle:{flt:"right",marginLeft:-1,borderLeft:"1px solid #999",borderTop:"1px solid #999",padding:"11px 0",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",width:"50%",borderRadius:"0 0 5px 0"}}},init:(e,o,t)=>{CHECK_IS_DATA(t)!==!0&&o.append(t),o.getOkButton().on("mouseover",(e,o)=>{o.addStyle({backgroundColor:"#cacbcd"})}),o.getOkButton().on("mouseout",(e,o)=>{o.addStyle({backgroundColor:"#e0e1e2"})}),o.getCancelButton().on("mouseover",(e,o)=>{o.addStyle({backgroundColor:"#cacbcd"})}),o.getCancelButton().on("mouseout",(e,o)=>{o.addStyle({backgroundColor:"#e0e1e2"})})}}),SkyDesktop.ContextMenu=CLASS(e=>{let o;return{preset:()=>{return UUI.LIST},params:()=>{return{style:{zIndex:999,position:"fixed",backgroundColor:"#F2F2F2",border:"1px solid #ccc",color:"#000"},on:{tap:e=>{e.stop()}}}},init:(e,t,n)=>{let i=n.e;void 0!==o&&o.remove(),o=t,t.addStyle({left:i.getLeft(),top:i.getTop()}),t.appendTo(BODY);let r=EVENT("tap",()=>{o.remove()}),d=EVENT("keydown",e=>{"Escape"===e.getKey()&&o.remove()});t.on("remove",()=>{r.remove(),d.remove()})},afterInit:(e,o)=>{o.getTop()+o.getHeight()>WIN_HEIGHT()&&o.addStyle({top:WIN_HEIGHT()-o.getHeight()})}}}),SkyDesktop.ContextMenuItem=CLASS({preset:()=>{return UUI.BUTTON_H},params:()=>{return{style:{padding:"5px 15px",minWidth:200},spacing:10,on:{mouseover:(e,o)=>{o.addStyle({backgroundColor:"#91C9F7"})},mouseout:(e,o)=>{o.addStyle({backgroundColor:"transparent"})}}}}}),SkyDesktop.File=CLASS({preset:()=>{return UUI.BUTTON_H},params:()=>{return{style:{marginLeft:20,padding:"2px 5px",cursor:"default",whiteSpace:"nowrap"},icon:IMG({src:SkyDesktop.R("file.png")}),spacing:5}},init:(e,o,t)=>{let n;void 0!==t&&(n=t.path);let i;o.getPath=(()=>{return n});o.on("mouseover",(e,o)=>{i!==!0&&o.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#003333":"#AFCEFF"})}),o.on("mouseout",(e,o)=>{i!==!0&&o.addStyle({backgroundColor:"transparent"})});o.select=(()=>{o.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#17344D":"#A2C5FF"}),i=!0}),o.checkInSelected=(()=>{return i}),o.deselect=(()=>{o.addStyle({backgroundColor:"transparent"}),i=!1})}}),SkyDesktop.FileTree=CLASS({preset:()=>{return UUI.LIST},params:()=>{return{style:{paddingBottom:50}}},init:(e,o,t)=>{let n,i=()=>{o.sortItems((e,o)=>{return e.checkIsInstanceOf(SkyDesktop.File)===!0&&o.checkIsInstanceOf(SkyDesktop.Folder)===!0?1:e.checkIsInstanceOf(SkyDesktop.Folder)===!0&&o.checkIsInstanceOf(SkyDesktop.File)===!0?-1:e.getTitle().toLowerCase().localeCompare(o.getTitle().toLowerCase())})};OVERRIDE(o.addItem,e=>{n=o.addItem=(o=>{let n=o.key,r=o.item;void 0!==t&&(r.checkIsInstanceOf(SkyDesktop.File)===!0?r.on("doubletap",()=>{t(n)}):r.checkIsInstanceOf(SkyDesktop.Folder)===!0&&r.setLoad(t)),e(o),i(),EVENT.fireAll("resize")})});let r;OVERRIDE(o.removeItem,e=>{r=o.removeItem=(o=>{e(o),i()})})}}),SkyDesktop.Folder=CLASS({preset:()=>{return UUI.BUTTON_H},params:()=>{return{style:{position:"relative",marginLeft:20,padding:"2px 5px",cursor:"default",whiteSpace:"nowrap"},listStyle:{marginLeft:20},icon:IMG({src:SkyDesktop.R("folder.png")}),spacing:5}},init:(e,o,t)=>{let n,i,r;void 0!==t&&(n=t.listStyle,i=t.isOpened,r=t.path);let d,c;o.append(c=UUI.ICON_BUTTON({style:{position:"absolute",left:-12,top:3,color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#444":"#ccc"},icon:FontAwesome.GetIcon("chevron-right"),on:{mouseover:(e,o)=>{o.addStyle({color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#666":"#999"}),e.stop()},mouseout:(e,o)=>{o.addStyle({color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#444":"#ccc"}),e.stop()},tap:e=>{a.checkIsShowing()===!0?s():u(),e.stop()}}}));let a=UUI.LIST({style:n});o.after(a);let u=(o.setLoad=(e=>{d=e}),o.open=(()=>{a.show(),o.setIcon(IMG({src:SkyDesktop.R("folder-opened.png")})),c.setIcon(FontAwesome.GetIcon("chevron-down")),c.addStyle({left:-14,top:1}),o.fireEvent("open")})),s=o.close=(()=>{a.hide(),o.setIcon(IMG({src:SkyDesktop.R("folder.png")})),c.setIcon(FontAwesome.GetIcon("chevron-right")),c.addStyle({left:-12,top:2}),o.fireEvent("close")});i===!0?DELAY(()=>{u()}):a.hide(),o.on("doubletap",()=>{a.checkIsShowing()===!0?s():u()}),o.on("remove",()=>{DELAY(()=>{a.remove()})});let l=()=>{a.sortItems((e,o)=>{return e.checkIsInstanceOf(SkyDesktop.File)===!0&&o.checkIsInstanceOf(SkyDesktop.File)===!0||e.checkIsInstanceOf(SkyDesktop.Folder)===!0&&o.checkIsInstanceOf(SkyDesktop.Folder)===!0?e.getTitle().toLowerCase().localeCompare(o.getTitle().toLowerCase()):e.checkIsInstanceOf(SkyDesktop.File)===!0&&o.checkIsInstanceOf(SkyDesktop.Folder)===!0?1:e.checkIsInstanceOf(SkyDesktop.Folder)===!0&&o.checkIsInstanceOf(SkyDesktop.File)===!0?-1:0})},p=o.addItem=(e=>{let o=e.key,t=e.item;void 0!==d&&(t.checkIsInstanceOf(SkyDesktop.File)===!0?t.on("doubletap",()=>{d(o)}):t.checkIsInstanceOf(SkyDesktop.Folder)===!0&&t.setLoad(d)),a.addItem(e),l(),EVENT.fireAll("resize")});void 0!==t&&void 0!==t.items&&EACH(t.items,(e,o)=>{p({key:o,item:e})});let f;o.getItems=(()=>{return a.getItems()}),o.getItem=(e=>{return a.getItem(e)}),o.removeItem=(e=>{a.removeItem(e),l()}),o.removeAllItems=(()=>{a.removeAllItems()}),o.getPath=(()=>{return r});o.on("mouseover",(e,o)=>{f!==!0&&o.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#003333":"#AFCEFF"})}),o.on("mouseout",(e,o)=>{f!==!0&&o.addStyle({backgroundColor:"transparent"})});o.select=(()=>{o.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#17344D":"#A2C5FF"}),f=!0}),o.checkInSelected=(()=>{return f}),o.deselect=(()=>{o.addStyle({backgroundColor:"transparent"}),f=!1})}}),SkyDesktop.HorizontalTabList=CLASS({preset:()=>{return DIV},params:()=>{return{style:{height:"100%",backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#333":"#ccc"}}},init:(e,o,t)=>{let n=[],i=[],r=CLEAR_BOTH(),d=()=>{let e=0,t=0;EACH(n,o=>{void 0===o.getSize()?t+=1:e+=o.getSize(),o.addStyle({width:0,height:0})}),EACH(i,e=>{e.addStyle({height:0})});let r=o.getHeight(),d=e/(n.length-t);e+=d*t,EACH(n,t=>{void 0===t.getSize()&&t.setSize(d),t.addStyle({width:(o.getWidth()-8*(n.length-1))*t.getSize()/e,height:r})}),EACH(i,e=>{e.addStyle({height:r})})},c=o.addTab=(e=>{let t;if(n.length>0){let r,d,c=n[n.length-1];o.append(t=DIV({style:{flt:"left",width:8,height:"100%",cursor:"e-resize"},on:{touchstart:o=>{let t=o.getLeft(),n=c.getWidth(),i=e.getWidth();BODY.addStyle({cursor:"e-resize"}),void 0!==r&&r.remove(),r=EVENT("touchmove",o=>{let r=o.getLeft()-t;n+r<100&&(r=100-n),i-r<100&&(r=i-100),c.addStyle({width:n+r}),e.addStyle({width:i-r})}),void 0!==d&&d.remove(),d=EVENT("touchend",()=>{BODY.addStyle({cursor:"auto"}),c.setSize(c.getSize()*c.getWidth()/n),e.setSize(e.getSize()*e.getWidth()/i),r.remove(),r=void 0,d.remove(),d=void 0}),o.stop()}}})),i.push(t)}e.addStyle({flt:"left"}),o.append(e),o.append(r),n.push(e),d(),e.on("remove",()=>{REMOVE({array:n,value:e}),void 0!==t&&(REMOVE({array:i,value:t}),t.remove()),e=void 0,t=void 0,d()})});void 0!==t&&void 0!==t.tabs&&EACH(t.tabs,c),o.on("show",d),DELAY(d);let a=EVENT("resize",d);o.on("remove",()=>{a.remove(),a=void 0})}}),SkyDesktop.Tab=CLASS({preset:()=>{return DIV},params:()=>{return{style:{height:"100%",overflow:"auto",backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#000":"#fff",color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#fff":"#000"}}},init:(e,o,t)=>{let n,i,r,d;void 0!==t&&(n=t.icon,i=t.title,r=t.size,d=t.isCannotClose);o.setIcon=(e=>{n=e,o.fireEvent("iconchange")}),o.getIcon=(()=>{return n}),o.setTitle=(e=>{i=e,o.fireEvent("titlechange")}),o.getTitle=(()=>{return i}),o.setSize=(e=>{r=e}),o.getSize=(()=>{return r}),o.checkIsCannotClose=(()=>{return d})}}),SkyDesktop.TabGroup=CLASS({preset:()=>{return TABLE},params:()=>{return{style:{height:"100%",backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#333":"#ccc"}}},init:(e,o,t)=>{let n;void 0!==t&&(n=t.homeTab);let i,r=[],d=[],c=-1,a=CLEAR_BOTH();TR({c:i=TD({style:{height:27}})}).appendTo(o);let u;TR({c:u=TD({c:n})}).appendTo(o);let s=o.activeTab=(e=>{c=e,EACH(r,e=>{e.addStyle({backgroundColor:"transparent"})}),EACH(d,e=>{e.hide()}),r[e].addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#000":"#fff"}),d[e].show()}),l=(o.getActiveTab=(()=>{return d[c]}),o.getAllTabs=(()=>{return d}),o.removeAllTabs=(()=>{EACH(r,e=>{e.remove()}),EACH(d,e=>{e.remove()}),r=[],d=[],c=-1}),o.addTab=(e=>{let o;i.append(o=UUI.BUTTON_H({style:{padding:"5px 10px",height:17,flt:"left",cursor:"default"},icon:e.getIcon(),spacing:5,on:{mouseover:()=>{c!==FIND({array:d,value:e})&&o.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#003333":"#AFCEFF"})},mouseout:()=>{c!==FIND({array:d,value:e})&&o.addStyle({backgroundColor:"transparent"})},tap:()=>{s(FIND({array:d,value:e}))}}})),i.append(a),r.push(o),e.on("iconchange",()=>{o.setIcon(e.getIcon())}),e.on("titlechange",()=>{o.setTitle(SPAN({c:e.checkIsCannotClose()===!0?e.getTitle():[e.getTitle(),UUI.ICON_BUTTON({style:{marginLeft:10,color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#444":"#ccc"},icon:FontAwesome.GetIcon("times"),on:{mouseover:(e,o)=>{o.addStyle({color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#666":"#999"})},mouseout:(e,o)=>{o.addStyle({color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#444":"#ccc"})},tap:()=>{e.remove()}}})]}))}),e.fireEvent("titlechange"),u.append(e),d.push(e),s(d.length-1),EVENT.fireAll("resize"),e.on("remove",()=>{let o=FIND({array:d,value:e});void 0!==o&&(r[o].remove(),r.splice(o,1),d[o].remove(),d.splice(o,1),o<=c&&(c-1>=0?s(c-1):d.length>0?s(0):c=-1)),e=void 0})}));void 0!==t&&(void 0!==t.tabs&&EACH(t.tabs,l),void 0!==t.activeTabIndex&&s(t.activeTabIndex))}}),SkyDesktop.VerticalTabList=CLASS({preset:()=>{return DIV},params:()=>{return{style:{height:"100%",backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#333":"#ccc"}}},init:(e,o,t)=>{let n=[],i=()=>{DELAY(()=>{let e=0,t=0;EACH(n,o=>{void 0===o.getSize()?t+=1:e+=o.getSize(),o.addStyle({height:0})});let i=e/(n.length-t);e+=i*t,EACH(n,t=>{void 0===t.getSize()&&t.setSize(i),t.addStyle({height:(o.getHeight()-10*(n.length-1))*t.getSize()/e})})})},r=o.addTab=(e=>{let t;if(n.length>0){let i,r,d=n[n.length-1];o.append(t=DIV({style:{height:8,cursor:"n-resize"},on:{touchstart:o=>{let t=o.getTop(),n=d.getHeight(),c=e.getHeight();BODY.addStyle({cursor:"n-resize"}),void 0!==i&&i.remove(),i=EVENT("touchmove",o=>{let i=o.getTop()-t;n+i<100&&(i=100-n),c-i<100&&(i=c-100),d.addStyle({height:n+i}),e.addStyle({height:c-i})}),void 0!==r&&r.remove(),r=EVENT("touchend",()=>{BODY.addStyle({cursor:"auto"}),d.setSize(d.getSize()*d.getHeight()/n),e.setSize(e.getSize()*e.getHeight()/c),i.remove(),i=void 0,r.remove(),r=void 0}),o.stop()}}}))}o.append(e),n.push(e),i(),e.on("remove",()=>{REMOVE({array:n,value:e}),void 0!==t&&t.remove(),e=void 0,t=void 0,i()})});void 0!==t&&void 0!==t.tabs&&EACH(t.tabs,r),o.on("show",i),i();let d=EVENT("resize",i);o.on("remove",()=>{d.remove(),d=void 0})}}),SkyDesktop.Toolbar=CLASS({preset:()=>{return UUI.V_CENTER},params:()=>{return{style:{backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#666":"#ccc",color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#fff":"#000",height:"100%",borderBottom:"1px solid #999"}}},init:(e,o,t)=>{let n=CLEAR_BOTH(),i=()=>{let e=0;EACH(o.getChildren(),e=>{e.checkIsInstanceOf(SkyDesktop.ToolbarButton)===!0&&e.showTitle()}),EACH(o.getChildren(),o=>{o.checkIsInstanceOf(SkyDesktop.ToolbarButton)===!0&&(e+=o.getWidth())}),o.getWidth()<e&&EACH(o.getChildren(),e=>{e.checkIsInstanceOf(SkyDesktop.ToolbarButton)===!0&&e.hideTitle()})},r=o.addButton=(e=>{o.append(e),o.append(n),i()});void 0!==t&&void 0!==t.buttons&&EACH(t.buttons,r),o.on("show",i),DELAY(i);let d=EVENT("resize",i);o.on("remove",()=>{d.remove(),d=void 0})}}),SkyDesktop.ToolbarButton=CLASS({preset:()=>{return UUI.BUTTON_H},params:()=>{return{style:{flt:"left",padding:"5px 8px"},spacing:5,on:{mouseover:(e,o)=>{o.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#003333":"#AFCEFF"})},mouseout:(e,o)=>{o.addStyle({backgroundColor:"transparent"})}}}}});