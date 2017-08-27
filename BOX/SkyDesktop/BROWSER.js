SkyDesktop.Button=CLASS({preset:()=>{return UUI.BUTTON_H},params:()=>{return{style:{padding:"11px 15px",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",borderRadius:4},spacing:10,on:{mouseover:(e,t)=>{t.addStyle({backgroundColor:"#cacbcd"})},mouseout:(e,t)=>{t.addStyle({backgroundColor:"#e0e1e2"})}}}}}),SkyDesktop.Noti=METHOD({run:e=>{let t=UUI.PANEL({style:{zIndex:999,position:"fixed",right:10,bottom:10,backgroundColor:"#FFFFCC",color:"#333",borderRadius:5},contentStyle:{padding:"5px 10px"},c:e}).appendTo(BODY);UANI.SHOW_SLIDE_UP({node:t}),DELAY(2,()=>{UANI.HIDE_SLIDE_DOWN({node:t},t.remove)})}}),SkyDesktop.Alert=CLASS({preset:()=>{return UUI.ALERT},params:()=>{return{style:{zIndex:999,backgroundColor:"#fff",color:"#333",textAlign:"center",border:"1px solid #333",borderRadius:5,boxShadow:"0 0 5px rgba(0,0,0,0.3)",onDisplayResize:(e,t)=>{return e>300?{width:280}:{width:"90%"}}},contentStyle:{padding:20},buttonStyle:{borderTop:"1px solid #999",padding:"11px 0",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",borderRadius:"0 0 5px 5px"}}},init:(e,t)=>{t.getButton().on("mouseover",(e,t)=>{t.addStyle({backgroundColor:"#cacbcd"})}),t.getButton().on("mouseout",(e,t)=>{t.addStyle({backgroundColor:"#e0e1e2"})})}}),SkyDesktop.Confirm=CLASS({preset:()=>{return UUI.CONFIRM},params:()=>{return{style:{zIndex:999,backgroundColor:"#fff",color:"#333",textAlign:"center",border:"1px solid #333",borderRadius:5,boxShadow:"0 0 5px rgba(0,0,0,0.3)",onDisplayResize:(e,t)=>{return e>300?{width:280}:{width:"90%"}}},contentStyle:{padding:20},okButtonStyle:{flt:"left",borderTop:"1px solid #999",padding:"11px 0",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",width:"50%",borderRadius:"0 0 0 5px"},cancelButtonStyle:{flt:"right",marginLeft:-1,borderLeft:"1px solid #999",borderTop:"1px solid #999",padding:"11px 0",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",width:"50%",borderRadius:"0 0 5px 0"}}},init:(e,t)=>{t.getOkButton().on("mouseover",(e,t)=>{t.addStyle({backgroundColor:"#cacbcd"})}),t.getOkButton().on("mouseout",(e,t)=>{t.addStyle({backgroundColor:"#e0e1e2"})}),t.getCancelButton().on("mouseover",(e,t)=>{t.addStyle({backgroundColor:"#cacbcd"})}),t.getCancelButton().on("mouseout",(e,t)=>{t.addStyle({backgroundColor:"#e0e1e2"})})}}),SkyDesktop.Prompt=CLASS({preset:()=>{return UUI.PROMPT},params:()=>{return{style:{zIndex:999,backgroundColor:"#fff",color:"#333",textAlign:"center",border:"1px solid #333",borderRadius:5,boxShadow:"0 0 5px rgba(0,0,0,0.3)",onDisplayResize:(e,t)=>{return e>300?{width:280}:{width:"90%"}}},contentStyle:{padding:20,paddingBottom:10},formStyle:{padding:20,paddingTop:0},inputStyle:{borderTop:"1px solid #999",padding:8,border:"1px solid #999",borderRadius:4},okButtonStyle:{flt:"left",borderTop:"1px solid #999",padding:"11px 0",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",width:"50%",borderRadius:"0 0 0 5px"},cancelButtonStyle:{flt:"right",marginLeft:-1,borderLeft:"1px solid #999",borderTop:"1px solid #999",padding:"11px 0",backgroundColor:"#e0e1e2",color:"#333",fontWeight:"bold",width:"50%",borderRadius:"0 0 5px 0"}}},init:(e,t,o)=>{CHECK_IS_DATA(o)!==!0&&t.append(o),t.getOkButton().on("mouseover",(e,t)=>{t.addStyle({backgroundColor:"#cacbcd"})}),t.getOkButton().on("mouseout",(e,t)=>{t.addStyle({backgroundColor:"#e0e1e2"})}),t.getCancelButton().on("mouseover",(e,t)=>{t.addStyle({backgroundColor:"#cacbcd"})}),t.getCancelButton().on("mouseout",(e,t)=>{t.addStyle({backgroundColor:"#e0e1e2"})})}}),SkyDesktop.ContextMenu=CLASS(e=>{let t;return{preset:()=>{return UUI.LIST},params:()=>{return{style:{zIndex:999,position:"fixed",backgroundColor:"#F2F2F2",border:"1px solid #ccc",color:"#000"},on:{tap:e=>{e.stop()}}}},init:(e,o,n)=>{let i=n.e;void 0!==t&&t.remove(),t=o,o.addStyle({left:i.getLeft(),top:i.getTop()}),o.appendTo(BODY);let r=EVENT("tap",()=>{t.remove()});o.on("remove",()=>{r.remove()})},afterInit:(e,t)=>{t.getTop()+t.getHeight()>WIN_HEIGHT()&&t.addStyle({top:WIN_HEIGHT()-t.getHeight()})}}}),SkyDesktop.ContextMenuItem=CLASS({preset:()=>{return UUI.BUTTON_H},params:()=>{return{style:{padding:"5px 15px",minWidth:200},spacing:10,on:{mouseover:(e,t)=>{t.addStyle({backgroundColor:"#91C9F7"})},mouseout:(e,t)=>{t.addStyle({backgroundColor:"transparent"})}}}}}),SkyDesktop.File=CLASS({preset:()=>{return UUI.BUTTON_H},params:()=>{return{style:{marginLeft:20,padding:"2px 5px",cursor:"default"},icon:IMG({src:SkyDesktop.R("file.png")}),spacing:5}},init:(e,t,o)=>{let n;void 0!==o&&(n=o.path);let i;t.getPath=(()=>{return n});t.on("mouseover",(e,t)=>{i!==!0&&t.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#003333":"#AFCEFF"})}),t.on("mouseout",(e,t)=>{i!==!0&&t.addStyle({backgroundColor:"transparent"})});t.select=(()=>{t.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#17344D":"#A2C5FF"}),i=!0}),t.checkInSelected=(()=>{return i}),t.unselect=(()=>{t.addStyle({backgroundColor:"transparent"}),i=!1})}}),SkyDesktop.FileTree=CLASS({preset:()=>{return UUI.LIST},params:()=>{return{style:{paddingBottom:50}}},init:(e,t,o)=>{let n;OVERRIDE(t.addItem,e=>{n=t.addItem=(t=>{let n=t.key,i=t.item;i.checkIsInstanceOf(SkyDesktop.File)===!0?i.on("doubletap",()=>{o(n)}):i.checkIsInstanceOf(SkyDesktop.Folder)===!0&&i.setLoad(o),e(t),EVENT.fireAll("resize")})})}}),SkyDesktop.Folder=CLASS({preset:()=>{return UUI.BUTTON_H},params:()=>{return{style:{position:"relative",marginLeft:20,padding:"2px 5px",cursor:"default"},listStyle:{marginLeft:20},icon:IMG({src:SkyDesktop.R("folder.png")}),spacing:5}},init:(e,t,o)=>{let n,i,r;void 0!==o&&(n=o.listStyle,i=o.isOpened,r=o.path);let d,c;t.append(c=UUI.ICON_BUTTON({style:{position:"absolute",left:-12,top:3,color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#444":"#ccc"},icon:FontAwesome.GetIcon("chevron-right"),on:{mouseover:(e,t)=>{t.addStyle({color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#666":"#999"}),e.stop()},mouseout:(e,t)=>{t.addStyle({color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#444":"#ccc"}),e.stop()},tap:e=>{u.checkIsShowing()===!0?s():a(),e.stop()}}}));let u=UUI.LIST({style:n});t.after(u);let a=(t.setLoad=(e=>{d=e}),t.open=(()=>{u.show(),t.setIcon(IMG({src:SkyDesktop.R("folder-opened.png")})),c.setIcon(FontAwesome.GetIcon("chevron-down")),c.addStyle({left:-14,top:1}),t.fireEvent("open")})),s=t.close=(()=>{u.hide(),t.setIcon(IMG({src:SkyDesktop.R("folder.png")})),c.setIcon(FontAwesome.GetIcon("chevron-right")),c.addStyle({left:-12,top:2}),t.fireEvent("close")});i===!0?DELAY(()=>{a()}):u.hide(),t.on("doubletap",()=>{u.checkIsShowing()===!0?s():a()}),t.on("remove",()=>{DELAY(()=>{u.remove()})});let l=t.addItem=(e=>{let t=e.key,o=e.item;o.checkIsInstanceOf(SkyDesktop.File)===!0?o.on("doubletap",()=>{d(t)}):o.checkIsInstanceOf(SkyDesktop.Folder)===!0&&o.setLoad(d),u.addItem(e),EVENT.fireAll("resize")});void 0!==o&&void 0!==o.items&&EACH(o.items,(e,t)=>{l({key:t,item:e})});let p;t.removeItem=(e=>{u.removeItem(e)}),t.removeAllItems=(()=>{u.removeAllItems()}),t.getPath=(()=>{return r});t.on("mouseover",(e,t)=>{p!==!0&&t.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#003333":"#AFCEFF"})}),t.on("mouseout",(e,t)=>{p!==!0&&t.addStyle({backgroundColor:"transparent"})});t.select=(()=>{t.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#17344D":"#A2C5FF"}),p=!0}),t.checkInSelected=(()=>{return p}),t.unselect=(()=>{t.addStyle({backgroundColor:"transparent"}),p=!1})}}),SkyDesktop.HorizontalTabList=CLASS({preset:()=>{return DIV},params:()=>{return{style:{height:"100%",backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#333":"#ccc"}}},init:(e,t,o)=>{let n=[],i=[],r=CLEAR_BOTH(),d=()=>{let e=0,o=0;EACH(n,t=>{void 0===t.getSize()?o+=1:e+=t.getSize(),t.addStyle({width:0,height:0})}),EACH(i,e=>{e.addStyle({height:0})});let r=t.getHeight(),d=e/(n.length-o);e+=d*o,EACH(n,o=>{void 0===o.getSize()&&o.setSize(d),o.addStyle({width:(t.getWidth()-8*(n.length-1))*o.getSize()/e,height:r})}),EACH(i,e=>{e.addStyle({height:r})})},c=t.addTab=(e=>{if(n.length>0){let o,r,d,c=n[n.length-1];t.append(o=DIV({style:{flt:"left",width:8,height:"100%",cursor:"e-resize"},on:{touchstart:t=>{let o=t.getLeft(),n=c.getWidth(),i=e.getWidth();BODY.addStyle({cursor:"e-resize"}),void 0!==r&&r.remove(),r=EVENT("touchmove",t=>{let r=t.getLeft()-o;n+r<100&&(r=100-n),i-r<100&&(r=i-100),c.addStyle({width:n+r}),e.addStyle({width:i-r})}),void 0!==d&&d.remove(),d=EVENT("touchend",()=>{BODY.addStyle({cursor:"auto"}),c.setSize(c.getSize()*c.getWidth()/n),e.setSize(e.getSize()*e.getWidth()/i),r.remove(),r=void 0,d.remove(),d=void 0}),t.stop()}}})),i.push(o)}e.addStyle({flt:"left"}),t.append(e),t.append(r),n.push(e),d()});void 0!==o&&void 0!==o.tabs&&EACH(o.tabs,c),t.on("show",d),DELAY(d);let u=EVENT("resize",d);t.on("remove",()=>{u.remove(),u=void 0})}}),SkyDesktop.Tab=CLASS({preset:()=>{return DIV},params:()=>{return{style:{height:"100%",overflow:"auto",backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#000":"#fff",color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#fff":"#000"}}},init:(e,t,o)=>{let n,i,r,d;void 0!==o&&(n=o.icon,i=o.title,r=o.size,d=o.isCannotClose);t.setIcon=(e=>{n=e,t.fireEvent("iconchange")}),t.getIcon=(()=>{return n}),t.setTitle=(e=>{i=e,t.fireEvent("titlechange")}),t.getTitle=(()=>{return i}),t.setSize=(e=>{r=e}),t.getSize=(()=>{return r}),t.checkIsCannotClose=(()=>{return d})}}),SkyDesktop.TabGroup=CLASS({preset:()=>{return TABLE},params:()=>{return{style:{height:"100%",backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#333":"#ccc"}}},init:(e,t,o)=>{let n;void 0!==o&&(n=o.homeTab);let i,r=[],d=[],c=-1,u=CLEAR_BOTH();TR({c:i=TD({style:{height:27}})}).appendTo(t);let a;TR({c:a=TD({c:n})}).appendTo(t);let s=t.activeTab=(e=>{c=e,EACH(r,e=>{e.addStyle({backgroundColor:"transparent"})}),EACH(d,e=>{e.hide()}),r[e].addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#000":"#fff"}),d[e].show()}),l=(t.getActiveTab=(()=>{return d[c]}),t.getAllTabs=(()=>{return d}),t.removeAllTabs=(()=>{EACH(r,e=>{e.remove()}),EACH(d,e=>{e.remove()}),r=[],d=[],c=-1}),t.addTab=(e=>{let t;i.append(t=UUI.BUTTON_H({style:{padding:"5px 10px",height:17,flt:"left",cursor:"default"},icon:e.getIcon(),spacing:5,on:{mouseover:()=>{c!==FIND({array:d,value:e})&&t.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#003333":"#AFCEFF"})},mouseout:()=>{c!==FIND({array:d,value:e})&&t.addStyle({backgroundColor:"transparent"})},tap:()=>{s(FIND({array:d,value:e}))}}})),i.append(u),r.push(t),e.on("iconchange",()=>{t.setIcon(e.getIcon())}),e.on("titlechange",()=>{t.setTitle(SPAN({c:e.checkIsCannotClose()===!0?e.getTitle():[e.getTitle(),UUI.ICON_BUTTON({style:{marginLeft:10,color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#444":"#ccc"},icon:FontAwesome.GetIcon("times"),on:{mouseover:(e,t)=>{t.addStyle({color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#666":"#999"})},mouseout:(e,t)=>{t.addStyle({color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#444":"#ccc"})},tap:()=>{e.remove()}}})]}))}),e.fireEvent("titlechange"),a.append(e),d.push(e),s(d.length-1),EVENT.fireAll("resize"),e.on("remove",()=>{let t=FIND({array:d,value:e});void 0!==t&&(r[t].remove(),r.splice(t,1),d[t].remove(),d.splice(t,1),t<=c&&(c-1>=0?s(c-1):d.length>0?s(0):c=-1)),e=void 0})}));void 0!==o&&(void 0!==o.tabs&&EACH(o.tabs,l),void 0!==o.activeTabIndex&&s(o.activeTabIndex))}}),SkyDesktop.VerticalTabList=CLASS({preset:()=>{return DIV},params:()=>{return{style:{height:"100%",backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#333":"#ccc"}}},init:(e,t,o)=>{let n=[],i=()=>{let e=0,o=0;EACH(n,t=>{void 0===t.getSize()?o+=1:e+=t.getSize(),t.addStyle({height:0})});let i=e/(n.length-o);e+=i*o,EACH(n,o=>{void 0===o.getSize()&&o.setSize(i),o.addStyle({height:(t.getHeight()-10*(n.length-1))*o.getSize()/e})})},r=t.addTab=(e=>{if(n.length>0){let o,i,r=n[n.length-1];t.append(DIV({style:{height:8,cursor:"n-resize"},on:{touchstart:t=>{let n=t.getTop(),d=r.getHeight(),c=e.getHeight();BODY.addStyle({cursor:"n-resize"}),void 0!==o&&o.remove(),o=EVENT("touchmove",t=>{let o=t.getTop()-n;d+o<100&&(o=100-d),c-o<100&&(o=c-100),r.addStyle({height:d+o}),e.addStyle({height:c-o})}),void 0!==i&&i.remove(),i=EVENT("touchend",()=>{BODY.addStyle({cursor:"auto"}),r.setSize(r.getSize()*r.getHeight()/d),e.setSize(e.getSize()*e.getHeight()/c),o.remove(),o=void 0,i.remove(),i=void 0}),t.stop()}}}))}t.append(e),n.push(e),i()});void 0!==o&&void 0!==o.tabs&&EACH(o.tabs,r),t.on("show",i),DELAY(i);let d=EVENT("resize",i);t.on("remove",()=>{d.remove(),d=void 0})}}),SkyDesktop.Toolbar=CLASS({preset:()=>{return UUI.V_CENTER},params:()=>{return{style:{backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#666":"#ccc",color:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#fff":"#000",height:"100%",borderBottom:"1px solid #999"}}},init:(e,t,o)=>{let n=CLEAR_BOTH(),i=()=>{let e=0;EACH(t.getChildren(),e=>{e.checkIsInstanceOf(SkyDesktop.ToolbarButton)===!0&&e.showTitle()}),EACH(t.getChildren(),t=>{t.checkIsInstanceOf(SkyDesktop.ToolbarButton)===!0&&(e+=t.getWidth())}),t.getWidth()<e&&EACH(t.getChildren(),e=>{e.checkIsInstanceOf(SkyDesktop.ToolbarButton)===!0&&e.hideTitle()})},r=t.addButton=(e=>{t.append(e),t.append(n),i()});void 0!==o&&void 0!==o.buttons&&EACH(o.buttons,r),t.on("show",i),DELAY(i);let d=EVENT("resize",i);t.on("remove",()=>{d.remove(),d=void 0})}}),SkyDesktop.ToolbarButton=CLASS({preset:()=>{return UUI.BUTTON_H},params:()=>{return{style:{flt:"left",padding:"5px 8px"},spacing:5,on:{mouseover:(e,t)=>{t.addStyle({backgroundColor:void 0!==BROWSER_CONFIG.SkyDesktop&&"dark"===BROWSER_CONFIG.SkyDesktop.theme?"#003333":"#AFCEFF"})},mouseout:(e,t)=>{t.addStyle({backgroundColor:"transparent"})}}}}});