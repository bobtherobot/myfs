// -------------------------------------------------------------
// 
//  _____    _______  ___ ___  _______  _______  _______ 
//  |     |_ |   _   ||   |   ||       ||   |   ||_     _|
//  |       ||       | \     / |   -   ||   |   |  |   |  
//  |_______||___|___|  |___|  |_______||_______|  |___|  
// 
//  v0.0.30
//  2017-11-25
//
//  By Mike Gieson
//  www.gieson.com
// 
// -------------------------------------------------------------




;this.jbeeb=this.jbeeb||{},this.jbeeb.utils=this.jbeeb.utils||{},this.jbeeb.utils.Layout=function(){function init(){doc=document;var e=doc.documentElement;e.style.width="100%",e.style.height="100%",bodyNode=doc.body,bodyNode.style.width="100%",bodyNode.style.height="100%",mask=doc.createElement("div");var t=mask.style;t.position="absolute",t.left="0px",t.top="0px",t.right="0px",t.bottom="0px",t.zIndex=1001;var o=doc.createElement("div");o.classList.add("layout-splitter-col"),bodyNode.appendChild(o);var l=o.getBoundingClientRect();bodyNode.removeChild(o),splitter_size=l.width,all=doc.querySelectorAll("[data-layout]"),scrollbarSize=getScrollbarSize(),resizeThrottle.add(resize),tryToRip()}function tryToRip(){okToRip()?ripItGood():(tryToRipCount++,tryToRipCount>tryToRipCountMax?ripItGood(!0):setTimeout(tryToRip,100))}function ripItGood(e){var t=ripDoc();formatPanels(e),t?resetRemember():restore()}function okToRip(){for(var e=0;e<all.length;e++){for(var t=all[e],o=t.parentNode,l=o;l.dataset.layout;)l=l.parentNode;var i=l.getBoundingClientRect();if(!i.height&&!i.width)return!1}return!0}function ripDoc(){for(var e=!1,t=0;t<all.length;t++){var o=all[t];o.id=o.id||"layout_uuid_"+uuid++,e||(e=datasetExistBool(o,"reset"));for(var l=o.parentNode,i=l;i.dataset.layout;)i=i.parentNode;e||(e=datasetExistBool(i,"reset"));var n=findSibs(o),r=o.dataset.size,a=parseNumUnits(r),s=parseNumUnits(o.dataset.min),d="row"==o.dataset.layout,m=o.currentStyle||window.getComputedStyle(o),p={left:parseInt(m.paddingLeft),right:parseInt(m.paddingRight),top:parseInt(m.paddingTop),bottom:parseInt(m.paddingBottom)},v=o.style;v.boxSizing=v.webkitBoxSizing=v.mozBoxSizing=v.oBoxSizing=v.msBoxSizing="border-box";var u=i.getBoundingClientRect();if("%"==a.units){var c=d?u.height:u.width;a.num=c*(a.num/100)}var h=datasetExistBool(o,"hidden");!u.height&&u.width;var f={elem:o,id:o.id,first:!n.prev,last:!n.next,next:null,prev:null,nextElem:n.next,prevElem:n.prev,defaultSize:r,w:d?null:a.num,h:d?a.num:null,units:a.units,clickToggle:!datasetExistBool(o,"noclicktoggle"),fixed:datasetExistBool(o,"fixed"),showOverflow:datasetExistBool(o,"showoverflow"),hidden:h,toggleState:!1,parent:null,parentElem:l,amRoot:l==i,row:d,children:null,rootElem:i,root:null,minSource:s.num,color:o.dataset.color,remember:datasetExistBool(o,"remember"),resizable:!datasetExistBool(o,"noresize"),canScroll:!datasetExistBool(o,"noscroll"),onResizeComplete:o.dataset.onresizecomplete,onResize:o.dataset.onresize},g=new RegExp("[^A-Za-z0-1_.]","g");if(f.onResizeComplete&&(f.onResizeComplete=f.onResizeComplete.replace(g,"")),f.onResize&&(f.onResize=f.onResize.replace(g,"")),f.canScroll||f.showOverflow||(v.overflow="hidden"),f.color&&(v.backgroundColor=f.color),f.padding=p,v.margin=0,f.amRoot){rootList.push(f);var b=u.width,z=u.height;f.w=b,f.h=z,f.parent={w:b,h:z}}cells.push(f),f.onResizeComplete||f.onResize,h&&(f.w=d?null:1,f.h=d?1:null,f.units="px")}for(var t=0;t<cells.length;t++)for(var T=cells[t],w=0;w<cells.length;w++){var f=cells[w];f.elem==T.nextElem&&(T.next=f),f.elem==T.prevElem&&(T.prev=f),f.parentElem==T.rootElem&&(T.root=f),f.elem==T.parentElem&&(T.parent=f,f.children||(f.children=[]),f.children.push(T))}return e}function datasetExistBool(e,t){var o=e.dataset[t.toLowerCase()];return void 0!==o&&("false"!=o&&0!==o)}function getScrollbarSize(){var e=doc.createElement("div"),t=e.style;t.width="100%",t.height="200px";var o=doc.createElement("div");t=o.style,t.position="absolute",t.top=0,t.left=0,t.visibility="hidden",t.width="200px",t.height="150px",t.overflow="hidden",o.appendChild(e),bodyNode.appendChild(o);var l=e.offsetWidth;o.style.overflow="scroll";var i=e.offsetWidth;return l==i&&(i=o.clientWidth),o.removeChild(e),bodyNode.removeChild(o),e=null,o=null,l-i}function handleScroll(e){var t=findObjFromElem(e.target);t.handleOnResizeComplete&&handleOnResizeComplete(t),t.handleOnResize&&handleOnResize(t)}function handleOnResize(obj){var fn=eval(obj.onResize);"function"==typeof fn&&(obj.width=obj.w,obj.height=obj.h,handleOnResizeTimeout&&clearTimeout(handleOnResizeTimeout),handleOnResizeTimeout=setTimeout(function(){return function(){fn(obj)}}(),100))}function handleOnResizeComplete(obj){if(obj.onResizeComplete){var fn=eval(obj.onResizeComplete);"function"==typeof fn&&(obj.width=obj.w,obj.height=obj.h,handleOnResizeCompleteTimeout&&clearTimeout(handleOnResizeCompleteTimeout),handleOnResizeCompleteTimeout=setTimeout(function(e){return function(){fn(e)}}(obj),100))}}function prepSizes(e,t){var o=e.children;if(o){for(var l=(e.row,0),i=0,n=[],r=[],a=0;a<o.length;a++){var s=o[a],d=s.w;d<1&&n.push(s),l+=d||0;var m=s.h;m<1&&r.push(s),i+=m||0}var p=0,v=0,u=e.parent.w||0,c=e.parent.h||0;if(l!=u&&(p=u-l),i!=c&&(v=c-i),e.row){if(p<0||t){for(var a=0;a<o.length;a++){var e=o[a],h=e.minSource;h&&(e.w=h,p+=h)}if(p<0)if(t)for(var a=0;a<o.length;a++){var e=o[a];e.last&&(e.w+=p)}else for(var f=u/o.length,a=0;a<o.length;a++){var e=o[a];e.w=f;var h=e.minSource;h&&(e.minSource=null)}}else for(var f=p/n.length,a=0;a<n.length;a++){var e=n[a];e.w=f}for(var g,b=0,a=0;a<o.length;a++){var e=o[a];b+=e.w,e.last&&(g=e)}g||(g=e),g&&(b<u?g.w+=u-b:b>u&&(g.w+=u-b))}else{if(v<0||t){for(var a=0;a<o.length;a++){var e=o[a],h=e.minSource;h&&(e.h=h,v+=h)}if(v<0)if(t)for(var a=0;a<o.length;a++){var e=o[a];e.last&&(e.h+=v)}else for(var f=c/o.length,a=0;a<o.length;a++){var e=o[a];e.h=f;var h=e.minSource;h&&(e.minSource=null)}}else for(var f=v/r.length,a=0;a<r.length;a++){var e=r[a];e.h=f}for(var g,b=0,a=0;a<o.length;a++){var e=o[a];b+=e.h,e.last&&(g=e)}g||(g=e),g&&(b<c?g.h+=c-b:b>c&&(g.h+=c-b))}for(var a=0;a<o.length;a++){var s=o[a];prepSizes(s,t)}}}function prepRoots(e){for(var t=0;t<rootList.length;t++){var o=rootList[t],l=o.elem;o.showOverflow||(l.style.overflow="hidden"),prepSizes(o,e)}}function positionPanels(){for(var e=0;e<cells.length;e++){var t=cells[e],o=t.elem,l=o.style;if(l.position="absolute",l.left="0px",l.top="0px",l.right="0px",l.bottom="0px",t.showOverflow||(l.overflow=t.canScroll?"auto":"hidden"),!t.amRoot){var i=t.row,n=0,r=0,a=!(!t.next||!t.resizable),s=a?splitter_size:0;if(i){for(var d=t.prev,m=0;d&&(n+=d.h,d=d.prev,!(++m>1e3)););t.parent.h-(n+t.h),t.top=n,t.min=n+t.minSource,t.max=n+t.h,o.style.top=n+"px",o.style.height=t.h+"px"}else{for(var d=t.prev,m=0;d&&(r+=d.w,d=d.prev,!(++m>1e3)););t.left=r,t.min=r+t.minSource,t.max=r+t.w,o.style.left=r+"px",o.style.width=t.w+"px"}if(t.splitterElem){var p=t.splitterElem;i?p.style.top=t.max-s+"px":p.style.left=t.max-s+"px"}else if(a){var p=doc.createElement("div");i?(p.classList.add("layout-splitter-row"),p.style.top=t.max-s+"px"):(p.classList.add("layout-splitter-col"),p.style.left=t.max-s+"px");var v=doc.createElement("div");if(i?(v.classList.add("layout-splitter-line-row"),p.appendChild(v)):(v.classList.add("layout-splitter-line-col"),p.appendChild(v)),t.clickToggle&&t.resizable){var u=doc.createElement("div");i?(u.classList.add("layout-splitter-handle-row"),u.classList.add("opened"),v.appendChild(u)):(u.classList.add("layout-splitter-handle-col"),u.classList.add("opened"),v.appendChild(u)),t.splitterHandleElem=u}addDomElemListenerWithArgs(v,"mousedown",mouse_down,t),t.parentElem.insertBefore(p,t.nextElem),t.splitterElem=p}t.hidden&&(t.prev&&t.prev.splitterElem&&(t.prev.splitterElem.style.display="none"),t.splitterElem&&(t.splitterElem.style.display="none"),t.elem.style.display="none")}}}function formatPanels(e){prepRoots(e),positionPanels()}function pauseEvent(e){return e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault(),e.cancelBubble=!0,e.returnValue=!1,!1}function mouse_down(e,t){didMove=!1,pauseEvent(e),doc.addEventListener("mousemove",mouse_move),doc.addEventListener("mouseup",mouse_up),bodyNode.appendChild(mask),moveObj=t;var o=t.splitterElem.style;t.row?(mouseStart=e.clientY,startPos=parseFloat(o.top)):(mouseStart=e.clientX,startPos=parseFloat(o.left))}function mouse_up(e){doc.removeEventListener("mousemove",mouse_move),doc.removeEventListener("mouseup",mouse_up),bodyNode.removeChild(mask),finishMove()}function finishMove(){if(!didMove&&moveObj.clickToggle){prevState=moveObj.toggleState,moveObj.toggleState=!prevState;var e;if(moveObj.splitterHandleElem){if(prevState)e=moveObj.toggleOriginalPx,moveObj.splitterHandleElem.classList.remove("closed"),moveObj.splitterHandleElem.classList.add("opened");else{var t=moveObj.row?"h":"w",o=moveObj.prev?moveObj.prev[t]:0;e=o+toggleZone,e<2&&(e=2),moveObj.toggleOriginalPx=moveObj[t]+o,moveObj.splitterHandleElem.classList.remove("opened"),moveObj.splitterHandleElem.classList.add("closed")}resizePanel(moveObj.elem,e)}}else{moveObj.onResizeComplete&&handleOnResizeComplete(moveObj);var l=moveObj.next;l&&l.onResizeComplete&&handleOnResizeComplete(l),dispatch("globalResizeComplete",moveObj),didMove=!1,amToggling=!1,remember(moveObj)}}function findObjFromElem(e){"string"==typeof e&&(e=document.getElementById(e));for(var t,o=0;o<cells.length;o++){var l=cells[o];if(l.elem==e){t=l;break}}return t}function resizePanel(e,t){t=parseFloat(t);var o=findObjFromElem(e);o&&(amToggling=!0,moveObj=o,startPos=0,mouseStart=0,mouse_move({clientX:t,clientY:t},!0),finishMove())}function scrollPanel(e,t,o){var l=findObjFromElem(e);l&&(null!==t&&(l.elem.scrollLeft=parseInt(t)),null!==o&&(l.elem.scrollTop=parseInt(o)))}function mouse_move(e,t){var o=moveObj.row?e.clientY:e.clientX,l=mouseStart<o?o-mouseStart:-(mouseStart-o),i=startPos+l;Math.abs(l)>0&&(didMove=!0);var n=!1,r=moveObj.prev;if(r&&(r.resizable&&i<=moveObj.min&&moveTo(r,i-splitter_size),!r.resizable&&i<r.max&&(n=!0)),!n){var a=moveObj.next;a&&(a.resizable&&i>a.max&&moveTo(a,i+splitter_size),!a.resizable&&i>a.max&&(n=!0))}n||moveTo(moveObj,i)}function resize(){for(var e=0;e<rootList.length;e++){var t=rootList[e],o=t.rootElem.getBoundingClientRect(),l=o.width,i=o.height,n=l-t.w,r=i-t.h;(n||r)&&(t.parent.w=t.w=l,t.parent.h=t.h=i,t.elem.style.width=l+"px",t.elem.style.height=i+"px",resizeLast(t,n,r))}resizeDone_timeout&&clearTimeout(resizeDone_timeout),resizeDoneComplete_timeout&&clearTimeout(resizeDoneComplete_timeout),resizeDone_timeout=setTimeout(function(){formatPanels(!0),dispatch("globalResize")},300),resizeDoneComplete_timeout=setTimeout(function(){formatPanels(!0),dispatch("globalResizeComplete")},1e3)}function resizeLast(e,t,o){for(var l=e.children,i=0;i<l.length;i++){var n=l[i];if(n.last){for(var r=0,a=n,s=0;a.prev&&(r++,a=a.prev,!(++s>100)););var d;d=n.fixed&&n.prev?n.prev:n,d&&(d.row?moveTo(d,d.top+d.h+o,!0):moveTo(d,d.left+d.w+t,!0))}n.children&&resizeLast(n,t,o)}}function moveTo(e,t,o){var l=e.root,i=e.row;if(t>e.min&&t<(i?l.h:l.w)-splitter_size&&t>splitter_size){var n,r,a;i?(n=STATIC_H,r=STATIC_HEIGHT,a=STATIC_TOP):(n=STATIC_W,r=STATIC_WIDTH,a=STATIC_LEFT);var s=e.splitterElem;s&&(s.style[a]=t+STATIC_PX);var d=t-e[a],m=d-e[n];d<scrollbarSize?e.canScroll&&!e.killedScroll&&(dealWithPadding(e,!0),e.elem.style.display="none",e.killedScroll=!0):e.canScroll&&e.killedScroll&&(dealWithPadding(e),e.elem.style.display="block",e.killedScroll=!1),e.hidden&&(d=0),e[n]=d,e.max=t,e.elem.style[r]=d+STATIC_PX,e.onResize&&handleOnResize(e),dispatch("globalResize",e);var p=e.next;if(p){var v=p.elem.style;p[a]=t,p.min=t+(p.minSource||0),v[a]=t+splitter_size+STATIC_PX;var u=p[n];o||(u-=m),p.max=t+u,p[n]=u,v[r]=u+STATIC_PX,p.onResize&&handleOnResize(p)}}}function dealWithPadding(e,t){var o=e.padding,l=e.elem.style;if(t){var i=0;o.left&&(l.paddingLeft=0,i=1),o.right&&(l.paddingRight=0,i=1),o.top&&(l.paddingTop=0,i=1),o.bottom&&(l.paddingBottom=0,i=1),e.hasPadding=i}else{var n=o.left;n&&(l.paddingLeft=n+"px",i=1),n=o.right,n&&(l.paddingRight=n+"px",i=1),n=o.top,n&&(l.paddingTop=n+"px",i=1),n=o.bottom,n&&(l.paddingBottom=n+"px",i=1)}}function addDomElemListenerWithArgs(e,t,o,l){var i=function(e,t){return function(o){e(o,t)}}(o,l);return e.addEventListener(t,i),i}function parseNumUnits(e){return{num:parseFloat(e)||0,units:(""+(e||"")).match(/\%/)?"%":"px"}}function findSibs(e){var t=e.previousSibling,o=e.nextSibling,l={prev:null,next:null};if(t){for(;1!=t.nodeType;)if(!(t=t.previousSibling)){t=null;break}l.prev=t}if(o){for(;1!=o.nodeType;)if(!(o=o.nextSibling)){o=null;break}l.next=o}return l}function remember(e){e.remember&&(localStorage[LOCAL_STORAGE_PREFIX+e.id]=e.row?e.h:e.w)}function restore(){for(var e in localStorage)if(e.match(ls_re)){var t=e.replace(ls_re,""),o=localStorage[e],l=Number(o);null!==o&&void 0!==o&&o===l&&l>.001&&resizePanel(t,l)}}function resetRemember(){for(var e in localStorage)e.match(ls_re)&&(localStorage[e]=null)}function addListener(e,t,o){var l=listeners[e];l||(l=listeners[e]=[]),l.push([o?this:o,t])}function dispatch(e,t){var o=listeners[e];if(o)for(var l=o.length;l--;)o[l][1].call(o[l][0],e,t)}function removeListener(e,t){var o=listeners[e];if(o)for(var l=o.length;l--;)o[l][1]==t&&o.splice(l,1)}function expand(e){resizePanel(findObjFromElem(e).prev.elem,0)}function collapse(e){resizePanel(e,1)}function hide(e){var t=findObjFromElem(e);if(t){t.prev&&t.prev.splitterElem&&(t.prev.splitterElem.style.display="none"),t.splitterElem&&(t.splitterElem.style.display="none"),t.elem.style.display="none",t.hidden=!0;var o;o=t.first?t.next:t.last?t.prev:t,resizePanel(t.prev.elem,pctOfParent(o,1)-2)}}function show(e){var t=findObjFromElem(e);if(t){t.prev&&t.prev.splitterElem&&(t.prev.splitterElem.style.display="inline-block"),t.splitterElem&&(t.splitterElem.style.display="inline-block"),t.elem.style.display="inline-block",t.hidden=!1;var o;o=t.first?t.next:(t.last,t.prev),resizePanel(o.elem,pctOfParent(t,.5))}}function pctOfParent(e,t){var o=e.parentElem,l=o.getBoundingClientRect();return(e.row?l.height:l.width)*t}var toggleZone=0,scrollbarSize,mask,splitter_size,all,cells=[],rootList=[],handleOnResizeTimeout,handleOnResizeCompleteTimeout,moveObj,mouseStart,startPos,didMove=!1,amToggling=!1,resizeDone_timeout=null,resizeDoneComplete_timeout=null,STATIC_W="w",STATIC_H="h",STATIC_WIDTH="width",STATIC_HEIGHT="height",STATIC_TOP="top",STATIC_LEFT="left",STATIC_PX="px",LOCAL_STORAGE_PREFIX="layoutRemember_",ls_re=new RegExp("^"+LOCAL_STORAGE_PREFIX),doc,bodyNode,uuid=0,tryToRipCount=0,tryToRipCountMax=5,resizeThrottle=function(){function e(){i||(i=!0,window.requestAnimationFrame?window.requestAnimationFrame(t):setTimeout(t,66))}function t(){l.forEach(function(e){e()}),i=!1}function o(e){e&&l.push(e)}var l=[],i=!1;return{add:function(t){l.length||window.addEventListener("resize",e),o(t)}}}(),listeners={};return{init:init,resizePanel:resizePanel,scrollPanel:scrollPanel,addListener:addListener,removeListener:removeListener,expand:expand,collapse:collapse,show:show,hide:hide}}(),window.addEventListener("load",jbeeb.utils.Layout.init);
