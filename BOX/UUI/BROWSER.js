UUI.ALERT=CLASS(e=>{let t=0;e.getCount=(()=>{return t});return{init:(e,n,o)=>{let i,d,r=o.style,a=o.contentStyle,c=o.buttonStyle,u=o.on,l=o.msg,f=UUI.MODAL({style:COMBINE([{textAlign:"center"},r]),on:u,c:[i=P({style:a,c:l}),d=UUI.BUTTON({style:c,title:MSG({en:"Close",ko:"닫기"}),on:{tap:()=>{p()}}})]}),s=EVENT("keydown",e=>{("Enter"===e.getKey()||"TEXTAREA"!==document.activeElement.tagName&&"INPUT"!==document.activeElement.tagName&&" "===e.getKey())&&(d.fireEvent("tap"),e.stop())});t+=1,f.on("remove",()=>{s.remove(),t-=1});let p=(n.getNode=(()=>{return f.getNode()}),n.append=(e=>{i.append(e)}),n.prepend=(e=>{i.prepend(e)}),n.after=(e=>{f.after(e)}),n.before=(e=>{f.before(e)}),n.remove=(()=>{f.remove()}));n.empty=(()=>{i.empty()}),n.getChildren=(()=>{return i.getChildren()}),n.getButton=(()=>{return d}),n.addContentStyle=(e=>{i.addContentStyle(e)}),n.addButtonStyle=(e=>{d.addStyle(e)})}}}),UUI.BUTTON=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o,i=n.icon,d=n.title,r=void 0===n.spacing?0:n.spacing,a=n.href,c=n.target,u=A({style:{display:"block",textAlign:"center",cursor:"pointer",textDecoration:"none",touchCallout:"none",userSelect:"none",color:"inherit"},href:a,target:c});void 0!==d&&u.prepend(o=DIV({c:void 0===d?"":d}));let l=t.setIcon=(e=>{i!==e&&void 0!==i&&i.remove(),i=e,u.prepend(DIV({style:{marginBottom:void 0!==d?r:0},c:i}))});void 0!==i&&l(i),e.setDom(u);t.setTitle=(e=>{o.empty(),o.append(e)}),t.getTitle=(()=>{return d}),t.getIcon=(()=>{return i}),t.tap=(()=>{EVENT.fireAll({node:t,name:"tap"})}),t.hideTitle=(()=>{i.addStyle({marginBottom:0}),o.hide()}),t.showTitle=(()=>{i.addStyle({marginBottom:r}),o.show()})}}),UUI.BUTTON_H=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o,i=n.icon,d=n.title,r=void 0===n.spacing?0:n.spacing,a=n.href,c=n.target,u=n.isIconRight,l=n.isToFixWrapperSize,f=n.style,s=n.contentStyle;void 0!==f&&(o=f.width);let p,E,g,y=A({style:{display:"block",cursor:"pointer",textDecoration:"none",touchCallout:"none",userSelect:"none",color:"inherit"},href:a,target:c,c:g=TABLE({style:EXTEND({origin:{width:"100%"},extend:s}),c:TR({style:{margin:0,padding:0},c:u===!0?[TD({style:{margin:0,padding:0,whiteSpace:"nowrap"},c:[E=DIV({style:{flt:"left"}}),CLEAR_BOTH()]}),TD({style:{margin:0,padding:0},c:[p=DIV({style:{flt:"left",lineHeight:0}}),CLEAR_BOTH()]})]:[TD({style:{margin:0,padding:0},c:[p=DIV({style:{flt:"left",lineHeight:0}}),CLEAR_BOTH()]}),TD({style:{margin:0,padding:0,whiteSpace:"nowrap"},c:[E=DIV({style:{flt:"left"}}),CLEAR_BOTH()]})]})})}),m=()=>{if(void 0===o){let e=p.getWidth()+E.getWidth();g.addStyle({width:e}),l===!0&&y.addStyle({width:e})}};t.on("show",()=>{m()});let v=t.setIcon=(e=>{i=e,p.empty(),p.append(i),E.addStyle(u===!0?{paddingRight:r}:{paddingLeft:r}),EVENT_ONCE({node:i,name:"load"},e=>{m()})});void 0!==i&&v(i),e.setDom(y);let T=t.setTitle=(e=>{E.empty(),E.append(e),m()});void 0!==d&&T(d);t.getTitle=(()=>{return d}),t.getIcon=(()=>{return i}),t.tap=(()=>{EVENT.fireAll({node:t,name:"tap"})}),t.hideTitle=(()=>{E.hide()}),t.showTitle=(()=>{E.show()})}}),UUI.CALENDAR=CLASS({preset:()=>{return UUI.TABLE},init:(e,t,n,o)=>{let i=n.year,d=n.month,r=n.date,a=void 0===n.headerStyle?{}:n.headerStyle,c=n.dayStyle,u=n.dateStyle,l=n.todayDateStyle,f=n.otherMonthDateStyle,s=n.selectedDateStyle,p=n.leftArrowIcon,E=n.rightArrowIcon,g=CALENDAR();void 0!==i&&void 0!==d||(void 0===i&&(i=g.getYear()),void 0===d&&(d=g.getMonth()));let y,m;CHECK_IS_DATA(o)!==!0?y=o:(y=o.selectDate,m=o.each);let v,T;t.append(TR({c:TD({colspan:7,style:COMBINE([a,{textAlign:"center"}]),c:[T=SPAN(),DIV({style:{flt:"left",cursor:"pointer",userSelect:"none"},c:void 0===p?"<":p,on:{tap:()=>{d-=1,S()}}}),DIV({style:{flt:"right",cursor:"pointer",userSelect:"none"},c:void 0===E?">":E,on:{tap:()=>{d+=1,S()}}}),CLEAR_BOTH()]})})),t.append(TR({c:[TD({style:c,c:"일"}),TD({style:c,c:"월"}),TD({style:c,c:"화"}),TD({style:c,c:"수"}),TD({style:c,c:"목"}),TD({style:c,c:"금"}),TD({style:c,c:"토"})]}));let S=(t.getYear=(()=>{return v.getYear()}),t.getMonth=(()=>{return v.getMonth()}),RAR(()=>{let e,n,o,a=CALENDAR(CREATE_DATE({year:i,month:d+1,date:0})),c=0;v=CALENDAR(CREATE_DATE({year:i,month:d,date:1}));let p=CALENDAR(CREATE_DATE({year:i,month:d,date:-(v.getDay()-1)}));T.empty(),T.append(v.getYear()+"년 "+v.getMonth()+"월"),REPEAT(7,e=>{t.removeTR(e)}),REPEAT(v.getDay(),r=>{c%7===0&&t.addTR({key:c/7,tr:e=TR()});let a;e.append(a=TD({style:void 0===f?u:f,c:p.getDate()+r,on:{tap:(e,a)=>{void 0!==o&&n.addStyle(o),n=a,o=void 0===f?u:f,void 0!==s&&a.addStyle(s),void 0!==y&&y(CALENDAR(CREATE_DATE({year:i,month:d-1,date:p.getDate()+r})),t)}}})),void 0!==m&&m(a,CALENDAR(CREATE_DATE({year:i,month:d-1,date:p.getDate()+r})),t),c+=1}),REPEAT({start:v.getDate(),end:a.getDate()},(a,f)=>{c%7===0&&t.addTR({key:c/7,tr:e=TR()});let p;e.append(p=TD({style:COMBINE([u,void 0!==l&&v.getYear()===g.getYear()&&v.getMonth()===g.getMonth()&&a===g.getDate()?l:{}]),c:a,on:{tap:(e,r)=>{void 0!==o&&n.addStyle(o),n=r,o=COMBINE([u,void 0!==l&&v.getYear()===g.getYear()&&v.getMonth()===g.getMonth()&&a===g.getDate()?l:{}]),void 0!==s&&r.addStyle(s),void 0!==y&&y(CALENDAR(CREATE_DATE({year:i,month:d,date:a})),t)}}})),v.getYear()===g.getYear()&&v.getMonth()===g.getMonth()&&a===r&&(void 0!==o&&n.addStyle(o),n=p,o=COMBINE([u,void 0!==l&&v.getYear()===g.getYear()&&v.getMonth()===g.getMonth()&&a===g.getDate()?l:{}]),void 0!==s&&p.addStyle(s)),void 0!==m&&m(p,CALENDAR(CREATE_DATE({year:i,month:d,date:a})),t),c+=1}),REPEAT(42-c,r=>{c%7===0&&t.addTR({key:c/7,tr:e=TR()});let a;e.append(a=TD({style:void 0===f?u:f,c:r+1,on:{tap:(e,a)=>{void 0!==o&&n.addStyle(o),n=a,o=void 0===f?u:f,void 0!==s&&a.addStyle(s),void 0!==y&&y(CALENDAR(CREATE_DATE({year:i,month:d+1,date:r+1})),t)}}})),void 0!==m&&m(a,CALENDAR(CREATE_DATE({year:i,month:d+1,date:r+1})),t),c+=1})}))}}),UUI.CONFIRM=CLASS(e=>{let t=0;e.getCount=(()=>{return t});return{init:(e,n,o,i)=>{let d,r,a=o.style,c=o.contentStyle,u=o.okButtonStyle,l=o.okButtonTitle,f=o.cancelButtonStyle,s=o.on,p=o.msg,E=o.target,g=o.href;CHECK_IS_DATA(i)!==!0?d=i:(d=i.ok,r=i.cancel);let y,m,v,T=UUI.MODAL({style:COMBINE([{textAlign:"center"},a]),on:s,c:[y=P({style:c,c:p}),m=UUI.BUTTON({style:u,target:E,href:g,title:void 0!==l?l:MSG({en:"Ok",ko:"확인"}),on:{tap:e=>{void 0!==d&&d(e.getLeft(),e.getTop())!==!1&&(e.stop(),A())}}}),v=UUI.BUTTON({style:f,title:MSG({en:"Close",ko:"닫기"}),on:{tap:()=>{void 0!==r&&r(),A()}}}),CLEAR_BOTH()]}),S=EVENT("keydown",e=>{("Enter"===e.getKey()||"TEXTAREA"!==document.activeElement.tagName&&"INPUT"!==document.activeElement.tagName&&" "===e.getKey())&&(m.fireEvent("tap"),e.stop())});t+=1,T.on("remove",()=>{S.remove(),t-=1});let A=(n.getNode=(()=>{return T.getNode()}),n.append=(e=>{y.append(e)}),n.prepend=(e=>{y.prepend(e)}),n.after=(e=>{T.after(e)}),n.before=(e=>{T.before(e)}),n.remove=(()=>{T.remove()}));n.empty=(()=>{y.empty()}),n.getChildren=(()=>{return y.getChildren()}),n.getOkButton=(()=>{return m}),n.getCancelButton=(()=>{return v}),n.addContentStyle=(e=>{y.addContentStyle(e)}),n.addOkButtonStyle=(e=>{m.addStyle(e)}),n.addCancelButtonStyle=(e=>{v.addStyle(e)})}}}),UUI.FULL_CHECKBOX=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o,i=n.name,d=n.label,r=void 0===n.spacing?0:n.spacing,a=n.value,c=n.inputStyle,u=DIV({style:{position:"relative"},c:[o=INPUT({style:{flt:"left",marginTop:5,marginRight:5},name:i,type:"checkbox",value:a}),SPAN({style:{marginLeft:r,flt:"left",cursor:"pointer"},c:d,on:{tap:e=>{o.toggleCheck(),EVENT.fireAll({node:t,name:"change"})}}}),CLEAR_BOTH()]});e.setWrapperDom(u);let l=(t.getName=(()=>{return i}),t.getValue=(()=>{return o.getValue()}),t.setValue=(e=>{let n=o.checkIsChecked();o.setValue(e),e===!0?n!==!0&&EVENT.fireAll({node:t,name:"change"}):n===!0&&EVENT.fireAll({node:t,name:"change"})}),t.select=(()=>{o.select(),EVENT.fireAll({node:t,name:"select"}),EVENT.fireAll({node:t,name:"focus"})}),t.blur=(()=>{o.blur(),EVENT.fireAll({node:t,name:"blur"})}),t.addInputStyle=(e=>{o.addStyle(e)}));void 0!==c&&l(c);t.on=((e,n)=>{"focus"===e||"blur"===e||"change"===e||"keydown"===e||"keypress"===e||"keyup"===e?EVENT({node:t,lowNode:o,name:e},n):EVENT({node:t,lowNode:u,name:e},n)}),t.toggleCheck=(e=>{let n=o.toggleCheck();return EVENT.fireAll({node:t,name:"change"}),n}),t.checkIsChecked=(()=>{return o.checkIsChecked()});EVENT({node:t,lowNode:o,name:"keyup"},e=>{void 0!==e&&" "===e.getKey()&&DELAY(()=>{EVENT.fireAll({node:t,name:"change"})})})}}),UUI.FULL_INPUT=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o,i=n.name,d=n.type,r=n.placeholder,a=n.capture,c=n.accept,u=n.value,l=n.inputStyle,f=n.isOffAutocomplete,s=DIV({style:{padding:5,backgroundColor:"#fff"},c:DIV({style:{position:"relative"},c:[SPAN({style:{visibility:"hidden"},c:"."}),o=INPUT({style:{position:"absolute",left:0,top:0,width:"100%",border:"none",background:"date"===d||"datetime"===d||"datetime-local"===d||"month"===d||"time"===d||"week"===d?void 0:"transparent"},name:i,type:d,value:u,capture:a,accept:c,placeholder:r,isOffAutocomplete:f})]}),on:{tap:()=>{o.focus(),EVENT.fireAll({node:t,name:"focus"})}}});e.setWrapperDom(s);let p=(t.getName=(()=>{return i}),t.getValue=(()=>{return o.getValue()}),t.setValue=(e=>{let n=o.getValue();o.setValue(e),n!==e&&EVENT.fireAll({node:t,name:"change"})}),t.select=(()=>{o.select(),EVENT.fireAll({node:t,name:"select"}),EVENT.fireAll({node:t,name:"focus"})}),t.focus=(()=>{o.focus(),EVENT.fireAll({node:t,name:"focus"})}),t.blur=(()=>{o.blur(),EVENT.fireAll({node:t,name:"blur"})}),t.addInputStyle=(e=>{o.addStyle(e)}));void 0!==l&&p(l);t.on=((e,n)=>{"focus"===e||"blur"===e||"change"===e||"keydown"===e||"keypress"===e||"keyup"===e?EVENT({node:t,lowNode:o,name:e},n):EVENT({node:t,lowNode:s,name:e},n)})}}),UUI.FULL_SELECT=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o,i=n.name,d=n.value,r=n.options,a=n.selectStyle,c=DIV({style:{padding:5,backgroundColor:"#fff",position:"relative"},c:o=SELECT({style:{width:"100%",border:"none",background:"transparent"},name:i,value:d,c:r})});e.setWrapperDom(c);let u=(t.getName=(()=>{return i}),t.getValue=(()=>{return o.getValue()}),t.setValue=(e=>{let n=o.getValue();o.setValue(e),n!==e&&EVENT.fireAll({node:t,name:"change"})}),t.select=(()=>{o.select()}),t.blur=(()=>{o.blur()}),t.addSelectStyle=(e=>{o.addStyle(e)}));void 0!==a&&u(a);t.addOption=(e=>{o.append(e)}),t.removeAllOptions=(()=>{o.empty()}),t.on=((e,n)=>{"focus"===e||"blur"===e||"change"===e||"select"===e||"keydown"===e||"keypress"===e||"keyup"===e?EVENT({node:t,lowNode:o,name:e},n):EVENT({node:t,lowNode:c,name:e},n)})}}),UUI.FULL_SUBMIT=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o=void 0===n?void 0:n.value,i=INPUT({type:"submit",style:{display:"block",border:"none",width:"100%",padding:"10px 0",cursor:"pointer"}});void 0!==o&&i.setValue(o),e.setDom(i);t.getValue=(()=>{return i.getValue()}),t.setValue=(e=>{i.setValue(e)})}}),UUI.FULL_TEXTAREA=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o,i,d,r;void 0!==n&&(o=n.name,i=n.placeholder,d=n.value,r=n.textareaStyle);let a,c=DIV({style:{padding:5,backgroundColor:"#fff",position:"relative",height:100},c:a=TEXTAREA({style:{width:"100%",height:"100%",backgroundColor:"transparent",border:"none"},name:o,placeholder:i,value:d})});e.setWrapperDom(c),e.setContentDom(a);let u=(t.getName=(()=>{return o}),t.getValue=(()=>{return a.getValue()}),t.setValue=(e=>{let n=a.getValue();a.setValue(e),n!==e&&EVENT.fireAll({node:t,name:"change"})}),t.select=(()=>{a.select()}),t.focus=(()=>{a.focus()}),t.blur=(()=>{a.blur()}),t.addTextareaStyle=(e=>{a.addStyle(e)}));void 0!==r&&u(r);t.on=((e,n)=>{"focus"===e||"blur"===e||"change"===e||"keydown"===e||"keypress"===e||"keyup"===e?EVENT({node:t,lowNode:a,name:e},n):EVENT({node:t,lowNode:c,name:e},n)})}}),UUI.FULL_UPLOAD_FORM=CLASS({preset:()=>{return NODE},init:(e,t,n,o)=>{let i,d,r=n.box,a=n.accept,c=n.isMultiple,u=void 0!==n.callbackURL?n.callbackURL:(BROWSER_CONFIG.isSecure===!0?"https://":"http://")+BROWSER_CONFIG.host+":"+BROWSER_CONFIG.port+"/__CORS_CALLBACK",l=n.formStyle,f=n.inputStyle,s=n.uploadingStyle;void 0!==o&&(i=o.success,d=o.overSizeFile);let p,E,g,y,m,v,T=DIV({style:{padding:5,background:"#FFF",position:"relative"},c:[y=IFRAME({style:{display:"none"},name:"__UPLOAD_FORM_"+t.id}),m=UUI.V_CENTER({style:{display:"none",position:"absolute",top:0,left:0,backgroundColor:"rgba(0, 0, 0, 0.5)",color:"#fff",textAlign:"center"},c:["Uploading...",v=SPAN({style:{marginLeft:10}})]})]});GET({isSecure:BROWSER_CONFIG.isSecure,port:BROWSER_CONFIG.port,uri:"__UPLOAD_SERVER_HOST?defaultHost="+BROWSER_CONFIG.host},e=>{let n=RANDOM_STR(20);y.after(E=FORM({action:(BROWSER_CONFIG.isSecure===!0?"https://":"http://")+e+":"+BROWSER_CONFIG.port+"/__UPLOAD?boxName="+r.boxName+"&callbackURL="+u+"&uploadKey="+n,target:"__UPLOAD_FORM_"+t.id,method:"POST",enctype:"multipart/form-data",style:l,c:[g=INPUT({type:"file",name:"file",accept:a,isMultiple:c,style:COMBINE([{width:"100%",height:"100%",color:"#000",border:"none"},f])}),INPUT({type:"submit",style:{visibility:"hidden",position:"absolute"}})]})),EVENT({node:g,name:"change"},e=>{""!==g.getValue()&&(m.addStyle({width:T.getWidth(),height:T.getHeight()}),m.show(),void 0!==p&&p.exit(),p=r.ROOM("uploadProgressRoom/"+n),p.on("progress",e=>{v.empty(),v.append("("+e.bytesRecieved+"/"+e.bytesExpected+")")}),void 0!==E&&E.submit())})}),EVENT({node:y,name:"load"},e=>{let n,o=global["__UPLOAD_FORM_"+t.id],r=void 0!==o?o.fileDataSetStr:void 0,a=void 0!==o?o.maxUploadFileMB:void 0;if(void 0!==a)void 0!==d&&d(a),n=g.getValue(),g.setValue(""),""!==n&&EVENT.fireAll({node:t,name:"change"});else if(void 0!==r){let e=PARSE_STR(decodeURIComponent(r));EACH(e,(t,n)=>{e[n]=UNPACK_DATA(t)}),void 0!==i&&i(c!==!0?e[0]:e,t),n=g.getValue(),g.setValue(""),""!==n&&EVENT.fireAll({node:t,name:"change"})}m.hide(),void 0!==p&&(p.exit(),p=void 0)}),e.setWrapperDom(T);let S=(t.select=(()=>{void 0!==g&&(g.select(),EVENT.fireAll({node:t,name:"select"}),EVENT.fireAll({node:t,name:"focus"}))}),t.addFormStyle=(e=>{void 0!==E?E.addStyle(e):EXTEND({origin:l,extend:e})}));void 0!==l&&S(l);let A=t.addInputStyle=(e=>{void 0!==g?g.addStyle(e):EXTEND({origin:f,extend:e})});void 0!==f&&A(f);let h=t.addUploadingStyle=(e=>{m.addStyle(e)});void 0!==s&&h(s);t.on=((e,n)=>{"focus"===e||"blur"===e||"change"===e||"keydown"===e||"keypress"===e||"keyup"===e?EVENT({node:t,lowNode:g,name:e},n):EVENT({node:t,lowNode:T,name:e},n)})}}),UUI.ICON_BUTTON=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o=n.icon,i=n.href,d=n.target,r=A({style:{cursor:"pointer",textDecoration:"none",touchCallout:"none",userSelect:"none"},href:i,target:d}),a=t.setIcon=(e=>{o!==e&&void 0!==o&&o.remove(),o=e,r.append(o)});void 0!==o&&a(o),e.setDom(r);t.getIcon=(()=>{return o}),t.tap=(()=>{EVENT.fireAll({node:t,name:"tap"})})}}),UUI.LIST=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o,i,d,r=void 0===n?void 0:n.isRequiringClearBoth,a=[],c={};void 0===i&&(i={}),e.setDom(o=UL());let u=t.addItem=(e=>{let n=e.key,u=e.item,l=e.isFirst;void 0!==i[n]?(u.insertBefore(i[n]),a[FIND({array:a,value:i[n]})]=u,i[n].remove()):l===!0&&a.length>0?(u.insertBefore(a[0]),a.unshift(u)):(t.append(u),a.push(u)),i[n]=u,r===!0&&(void 0!==d&&d.remove(),d=CLEAR_BOTH().appendTo(o)),u.on("remove",()=>{let e=c[n];void 0!==e&&EACH(e,e=>{e()}),REMOVE({array:a,value:u}),REMOVE({data:i,name:n}),REMOVE({data:c,name:n})})});void 0!==n&&void 0!==n.items&&EACH(n.items,(e,t)=>{u({key:t,item:e})});t.getItems=(()=>{return i}),t.sortItems=(e=>{a.sort(e),EACH(a,e=>{t.append(e)})}),t.getItem=(e=>{return i[e]}),t.removeItem=(e=>{let t=i[e];void 0!==t&&t.remove()}),t.addRemoveItemHandler=((e,t)=>{void 0===c[e]&&(c[e]=[]),c[e].push(t)}),t.removeAllItems=(()=>{EACH(i,(e,t)=>{let n=c[t];e.remove(),void 0!==n&&EACH(n,e=>{e()})}),i={},a=[],c={}})}}),UUI.LOADING=CLASS({init:(e,t,n)=>{let o=n.style,i=n.contentStyle,d=n.indicator,r=n.msg,a=n.on,c=UUI.MODAL({style:COMBINE([{textAlign:"center"},o]),contentStyle:i,isCannotClose:!0,c:UUI.V_CENTER({style:{height:"100%"},c:[void 0===d?"":d,P({style:void 0===d?{}:{marginTop:10},c:r})]}),on:a});t.getNode=(()=>{return c.getNode()}),t.append=(e=>{c.append(e)}),t.prepend=(e=>{c.prepend(e)}),t.after=(e=>{c.after(e)}),t.before=(e=>{c.before(e)}),t.remove=(()=>{c.remove()}),t.empty=(()=>{c.empty()}),t.getChildren=(()=>{return c.getChildren()}),t.addStyle=(e=>{c.addStyle(e)}),t.addContentStyle=(e=>{c.addContentStyle(e)})}}),UUI.MODAL=CLASS({init:(e,t,n)=>{let o,i=void 0===n?void 0:n.c,d=void 0===n?void 0:n.style,r=void 0===n?void 0:n.contentStyle,a=void 0===n?void 0:n.xStyle,c=void 0===n?void 0:n.xIcon,u=void 0===n?void 0:n.isCannotClose,l=DIV({style:{position:"fixed",zIndex:9999999},c:[o=DIV(),void 0===c?"":UUI.ICON_BUTTON({style:COMBINE([{lineHeight:0,position:"absolute"},void 0===a?{top:-10,right:-10}:a]),icon:c,on:{tap:e=>{v()},mouseover:()=>{y({opacity:.8})},mouseout:()=>{y({opacity:1})}}})]}).appendTo(BODY),f=RAR(()=>{let e=(WIN_WIDTH()-l.getWidth())/2,t=(WIN_HEIGHT()-l.getHeight())/2;l.addStyle({left:e<0?0:e,top:t<0?0:t});let n=e=>{EACH(e,e=>{e.type===IMG&&EVENT({node:e,name:"load"},()=>{f()}),void 0!==e.getChildren&&n(e.getChildren())})};n(l.getChildren())});DELAY(()=>{f()}),l.on("show",f),l.on("append",f);let s=EVENT({name:"resize"},f),p=EVENT({name:"keydown"},e=>{"Escape"===e.getKey()&&u!==!0&&v()});l.on("remove",()=>{s.remove(),p.remove()});let E=(t.getNode=(()=>{return l}),t.append=(e=>{o.append(e),f()}));void 0!==i&&(CHECK_IS_ARRAY(i)===!0?EACH(i,(e,t)=>{E(e)}):E(i));let g=(t.prepend=(e=>{o.prepend(e),f()}),t.after=(e=>{l.after(e),f()}),t.before=(e=>{l.before(e),f()}),t.remove=(()=>{l.remove()})),y=(t.empty=(()=>{o.empty()}),t.getChildren=(()=>{return o.getChildren()}),t.addStyle=(e=>{l.addStyle(e),f()}));void 0!==d&&y(d);let m=t.addContentStyle=(e=>{o.addStyle(e),f()});void 0!==r&&m(r);let v=(t.on=((e,t)=>{l.on(e,t)}),t.close=(()=>{EVENT.fireAll({node:l,name:"close"})!==!1&&g()}));t.getLeft=(()=>{return l.getLeft()}),t.getTop=(()=>{return l.getTop()})},afterInit:(e,t,n)=>{let o;void 0!==n&&CHECK_IS_DATA(n)===!0&&(o=n.on),void 0!==o&&EACH(o,(e,n)=>{t.on(n,e)})}}),UUI.NOTICE=CLASS({init:(e,t,n)=>{let o=n.style,i=n.contentStyle,d=n.isCannotClose,r=n.on,a=n.msg,c=UUI.MODAL({style:COMBINE([{textAlign:"center"},o]),contentStyle:i,isCannotClose:!0,on:r,c:a});t.getNode=(()=>{return c.getNode()}),t.append=(e=>{c.append(e)}),t.prepend=(e=>{c.prepend(e)}),t.after=(e=>{c.after(e)}),t.before=(e=>{c.before(e)}),t.remove=(()=>{c.remove()}),t.empty=(()=>{c.empty()}),t.getChildren=(()=>{return c.getChildren()}),t.addContentStyle=(e=>{c.addContentStyle(e)});d!==!0&&DELAY(2,()=>{c.close()})}}),UUI.PANEL=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o,i,d=void 0===n?void 0:n.contentStyle;o=DIV({c:i=DIV()}),e.setWrapperDom(o),e.setContentDom(i);let r=t.addContentStyle=(e=>{i.addStyle(e)});void 0!==d&&r(d)}}),UUI.PROMPT=CLASS(e=>{let t=0;e.getCount=(()=>{return t});return{init:(e,n,o,i)=>{let d,r,a=o.style,c=o.contentStyle,u=o.formStyle,l=o.inputStyle,f=o.okButtonStyle,s=o.cancelButtonStyle,p=o.on,E=o.msg,g=o.value;CHECK_IS_DATA(i)!==!0?d=i:(d=i.ok,r=i.cancel);let y,m,v,T,S,A=UUI.MODAL({style:COMBINE([{textAlign:"center"},a]),on:p,c:[y=P({style:c,c:E}),m=FORM({style:u,c:v=UUI.FULL_INPUT({style:l,value:g,on:{keydown:e=>{"Escape"!==e.getKey()&&e.stopBubbling()}}}),on:{submit:e=>{d(v.getValue())!==!1&&h()}}}),T=UUI.BUTTON({style:f,title:MSG({en:"Ok",ko:"확인"}),on:{tap:()=>{m.submit()}}}),S=UUI.BUTTON({style:s,title:MSG({en:"Close",ko:"닫기"}),on:{tap:()=>{void 0!==r&&r(),h()}}}),CLEAR_BOTH()]});v.select(),t+=1,A.on("remove",()=>{t-=1});let h=(n.getNode=(()=>{return A.getNode()}),n.append=(e=>{y.append(e)}),n.prepend=(e=>{y.prepend(e)}),n.after=(e=>{A.after(e)}),n.before=(e=>{A.before(e)}),n.remove=(()=>{A.remove()}));n.empty=(()=>{y.empty()}),n.getChildren=(()=>{return y.getChildren()}),n.getOkButton=(()=>{return T}),n.getCancelButton=(()=>{return S}),n.addContentStyle=(e=>{y.addContentStyle(e)}),n.addInputStyle=(e=>{v.addStyle(e)}),n.addOkButtonStyle=(e=>{T.addStyle(e)}),n.addCancelButtonStyle=(e=>{S.addStyle(e)})}}}),UUI.RANGE=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o=n.name,i=n.min,d=n.max,r=n.step,a=n.value,c=n.thumbStyle,u=n.trackStyle,l=n.scale;void 0===i&&(i=0),void 0===d&&(d=100),void 0===r&&(r=1),void 0===a&&(a=i),void 0===l&&(l=1),a>d&&(a=d),a<i&&(a=i);let f,s,p=a,E=DIV({style:{padding:"10px 5px"},c:f=DIV({style:EXTEND({origin:{position:"relative"},extend:u}),c:s=DIV({style:EXTEND({origin:{position:"absolute",cursor:"pointer"},extend:c})})})});t.on("show",()=>{s.addStyle({left:(a-i)/(d-i)*f.getWidth(),marginLeft:-s.getWidth()/2,top:(f.getHeight()-s.getHeight())/2}),DELAY(()=>{s.addStyle({left:(a-i)/(d-i)*f.getWidth(),marginLeft:-s.getWidth()/2,top:(f.getHeight()-s.getHeight())/2})}),s.on("touchstart",e=>{let n=e.getLeft(),o=s.getLeft()+s.getWidth()/2-f.getLeft(),c=EVENT("touchmove",e=>{let c=f.getWidth(),u=o+(e.getLeft()-n)/l;u<0&&(u=0),u>c&&(u=c),a=u/c*(d-i)+i,a=Math.round(a/r)*r,u=(a-i)/(d-i)*c,s.addStyle({left:u}),p!==a&&(t.fireEvent("change"),p=a),e.stopDefault()}),u=EVENT("touchend",e=>{c.remove(),u.remove(),t.fireEvent("touchend"),e.stop()});e.stopDefault()})}),e.setWrapperDom(E);t.getName=(()=>{return o}),t.getValue=(()=>{return a}),t.setValue=(e=>{a=e,a>d&&(a=d),a<i&&(a=i),p!==a&&(t.fireEvent("change"),p=a)}),t.on=((e,n)=>{EVENT({node:t,lowNode:E,name:e},n)})}}),UUI.TABLE=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o=void 0===n?void 0:n.trs,i=[],d={};void 0===o&&(o={});let r;e.setDom(r=TABLE());t.addTR=(e=>{let n=e.key,r=e.tr,a=e.isFirst;void 0!==o[n]?(r.insertBefore(o[n]),i[FIND({array:i,value:o[n]})]=r,o[n].remove()):a===!0&&i.length>0?(r.insertBefore(i[0]),i.unshift(r)):(t.append(r),i.push(r)),o[n]=r,r.on("remove",()=>{let e=d[n];void 0!==e&&EACH(e,e=>{e()}),REMOVE({array:i,value:r}),REMOVE({data:o,name:n}),REMOVE({data:d,name:n})})});EACH(o,(e,n)=>{i.push(e),t.append(e)});t.removeTR=(e=>{let t=o[e];void 0!==t&&t.remove()}),t.addRemoveTRHandler=((e,t)=>{void 0===d[e]&&(d[e]=[]),d[e].push(t)}),t.removeAllTRs=(()=>{EACH(o,(e,t)=>{let n=d[t];e.remove(),void 0!==n&&EACH(n,e=>{e()})}),o={},i=[],d={}})}}),UUI.TEXT_BUTTON=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o,i=n.title,d=n.href,r=n.target,a=A({style:{cursor:"pointer",textDecoration:"none",touchCallout:"none",userSelect:"none"},href:d,target:r,c:o=SPAN({c:void 0===i?void 0===d?"":d:i})});e.setDom(a);t.setTitle=(e=>{o.empty(),o.append(e)}),t.tap=(()=>{EVENT.fireAll({node:t,name:"tap"})})}}),UUI.VALID_FORM=CLASS({preset:()=>{return FORM},init:(e,t,n)=>{let o=void 0===n?void 0:n.errorMsgs,i=void 0===n?void 0:n.errorMsgStyle,d=[];t.on("remove",()=>{EACH(d,e=>{e.remove()})});t.showErrors=(e=>{let n=COPY(e),r=e=>{EACH(e.getChildren(),e=>{if(void 0!==e.getValue&&void 0!==e.getName){let t=e.getName(),r=n[t];if(void 0!==r&&void 0!==o){let a=o[t][r.type];"function"==typeof a&&(a=a(void 0!==r.validParam?r.validParam:r.validParams));let c;e.after(c=P({style:i,c:a})),REMOVE({data:n,name:t}),d.push(DELAY(3,e=>{c.remove(),REMOVE({array:d,value:e})}))}}r(e)})};r(t)}),t.getErrorMsgs=(e=>{let t={};return EACH(e,(e,n)=>{if(void 0!==o){let i=o[n][e.type];"function"==typeof i&&(i=i(void 0!==e.validParam?e.validParam:e.validParams)),t[n]=i}}),t}),t.getErrorMsgStyle=(()=>{return i})}}),UUI.V_CENTER=CLASS({preset:()=>{return NODE},init:(e,t,n)=>{let o,i=void 0===n?void 0:n.contentStyle,d=TABLE({style:{width:"100%",margin:0,padding:0},c:TR({style:{margin:0,padding:0},c:o=TD({style:{width:"100%",height:"100%",margin:0,padding:0}})})});e.setWrapperDom(d),e.setContentDom(o);let r=t.addContentStyle=(e=>{o.addStyle(e)});void 0!==i&&r(i)}});