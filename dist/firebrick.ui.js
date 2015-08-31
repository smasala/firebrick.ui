/*!
* Firebrick UI
* @author Steven Masala [me@smasala.com]
* @version 0.20.17
* @date
*
* FirebrickUI, component library for Firebrick JS
**/

define(["jquery","firebrick","knockout","devicejs","knockout-mapping","text","bootstrap"],function(e,t,n,r,i){"use strict";var s=window.Firebrick;n.mapping=i;if(!s){console.error("Firebrick has not been loaded, Firebrick-UI requires Firebrick JS to function");return}if(s.ui){console.error("Firebrick.ui namespace has already been taken!");return}return s._ns.push("Firebrick.ui"),s.ui={version:"0.20.17",build:function(e){var t=this,n=s.views.getTarget(e.target),r,i;return r=t._populate(e.items,e.view),i=r.html,e.view&&r.items.length&&(e.view.items=r.items),n&&n.append(i),i},_populate:function(t,n){var r=this,i=[],o="",u;e.isFunction(t)&&(t=t()),!e.isArray(t)&&t&&(t=[t]);if(e.isArray(t)&&t.length){if(n.defaults){s.utils.merge("defaults",n);for(var a=0,f=t.length;a<f;a++)t[a]=s.utils.copyover(t[a],n.defaults)}for(var l=0,c=t.length;l<c;l++)u=r._buildComponent(t[l],n),o+=u._html,u.getId||console.error("something went wrong",t[l],"is it defined correctly? Check the item name and dependency include"),u.fireEvent("uiBuilt"),i.push(u)}return{html:o,items:i}},_buildComponent:function(e,t){var n=this,r,i;return e.isView?(e._state!=="initial"&&(r=e.init()),r=e):e.viewName?r=s.create(e.viewName,e):(e=n._componentFilter(e),e.uiComponent?r=e:(e.sName&&(e.sName=e.sName.toLowerCase()),i=s.get(e.sName||e),i||console.error("Has",e.sName||e,"been added as a dependency?"),r=s.create(i._classname,e.sName?Object.getPrototypeOf(Object.create(e)):null))),r._parent||(r._parent=t),r.build&&(r._html=r.build()),r},_componentFilter:function(e){if(typeof e=="string")switch(e){case"|":e="display.divider"}return e},getCmp:function(e){return s.getById(e)},get:function(e){return s.get(e)},utils:{_buildDotObj:function(e,t,n){var r=this,i=e.shift();return n=n||{},n[i]={},e.length?e[0]!==""?r._buildDotObj(e,t,n[i]):console.error("error building sName, found empty string",e,i,t):n[i]=t,n},isVisible:function(e,t){var n={offset:t.offset(),height:t.height(),width:t.width()},r={offset:e.offset(),height:e.height(),width:e.width()},i=function(e){return e>n.offset.top&&e<n.offset.left&&e<n.bottom?!0:!1};return n.bottom=n.offset.top+n.height,r.bottom=r.offset.top+r.height,i(r.offset.top)||i(r.offset.top+r.width)||i(r.bottom)||i(r.bottom+r.width)?!0:!1},getValue:function(t){return e.isFunction(t)?t():t},stringify:function(t){if(t){var n=function(t,r){var i=r?"":"{",s,o;for(s in t)t.hasOwnProperty(s)&&(o=t[s],e.isPlainObject(o)?i+=s+":"+n(o):i+=s+": "+o+",");return i=i.substr(-1)===","?i.substring(0,i.length-1):i,i+=r?"":"},",i};return n(t,!0)}return""}},KeyEvents:{DOM_VK_CANCEL:3,DOM_VK_HELP:6,DOM_VK_BACK_SPACE:8,DOM_VK_TAB:9,DOM_VK_CLEAR:12,DOM_VK_RETURN:13,DOM_VK_ENTER:14,DOM_VK_SHIFT:16,DOM_VK_CONTROL:17,DOM_VK_ALT:18,DOM_VK_PAUSE:19,DOM_VK_CAPS_LOCK:20,DOM_VK_ESCAPE:27,DOM_VK_SPACE:32,DOM_VK_PAGE_UP:33,DOM_VK_PAGE_DOWN:34,DOM_VK_END:35,DOM_VK_HOME:36,DOM_VK_LEFT:37,DOM_VK_UP:38,DOM_VK_RIGHT:39,DOM_VK_DOWN:40,DOM_VK_PRINTSCREEN:44,DOM_VK_INSERT:45,DOM_VK_DELETE:46,DOM_VK_0:48,DOM_VK_1:49,DOM_VK_2:50,DOM_VK_3:51,DOM_VK_4:52,DOM_VK_5:53,DOM_VK_6:54,DOM_VK_7:55,DOM_VK_8:56,DOM_VK_9:57,DOM_VK_SEMICOLON:59,DOM_VK_EQUALS:61,DOM_VK_A:65,DOM_VK_B:66,DOM_VK_C:67,DOM_VK_D:68,DOM_VK_E:69,DOM_VK_F:70,DOM_VK_G:71,DOM_VK_H:72,DOM_VK_I:73,DOM_VK_J:74,DOM_VK_K:75,DOM_VK_L:76,DOM_VK_M:77,DOM_VK_N:78,DOM_VK_O:79,DOM_VK_P:80,DOM_VK_Q:81,DOM_VK_R:82,DOM_VK_S:83,DOM_VK_T:84,DOM_VK_U:85,DOM_VK_V:86,DOM_VK_W:87,DOM_VK_X:88,DOM_VK_Y:89,DOM_VK_Z:90,DOM_VK_CONTEXT_MENU:93,DOM_VK_NUMPAD0:96,DOM_VK_NUMPAD1:97,DOM_VK_NUMPAD2:98,DOM_VK_NUMPAD3:99,DOM_VK_NUMPAD4:100,DOM_VK_NUMPAD5:101,DOM_VK_NUMPAD6:102,DOM_VK_NUMPAD7:103,DOM_VK_NUMPAD8:104,DOM_VK_NUMPAD9:105,DOM_VK_MULTIPLY:106,DOM_VK_ADD:107,DOM_VK_SEPARATOR:108,DOM_VK_SUBTRACT:109,DOM_VK_DECIMAL:110,DOM_VK_DIVIDE:111,DOM_VK_F1:112,DOM_VK_F2:113,DOM_VK_F3:114,DOM_VK_F4:115,DOM_VK_F5:116,DOM_VK_F6:117,DOM_VK_F7:118,DOM_VK_F8:119,DOM_VK_F9:120,DOM_VK_F10:121,DOM_VK_F11:122,DOM_VK_F12:123,DOM_VK_F13:124,DOM_VK_F14:125,DOM_VK_F15:126,DOM_VK_F16:127,DOM_VK_F17:128,DOM_VK_F18:129,DOM_VK_F19:130,DOM_VK_F20:131,DOM_VK_F21:132,DOM_VK_F22:133,DOM_VK_F23:134,DOM_VK_F24:135,DOM_VK_NUM_LOCK:144,DOM_VK_SCROLL_LOCK:145,DOM_VK_COMMA:188,DOM_VK_PERIOD:190,DOM_VK_SLASH:191,DOM_VK_BACK_QUOTE:192,DOM_VK_OPEN_BRACKET:219,DOM_VK_BACK_SLASH:220,DOM_VK_CLOSE_BRACKET:221,DOM_VK_QUOTE:222,DOM_VK_META:224},helper:{getHtml:function(t,n,r){var i=s.getById(t),o=i.html;return e.isFunction(o)&&(o=o(n,r)),typeof o=="string"&&n.hasOwnProperty(o)?n[o]:o},tabBuilder:function(t){var n=s.getById(t),r=n.items;return e.isFunction(r)?"Firebrick.getById('"+t+"').items()":e.isArray(r)?"Firebrick.getById('"+t+"').items":r},optionString:function(t){var n=t.options;return e.isFunction(n)?"Firebrick.ui.getCmp('"+t.getId()+"').options()":e.isArray(n)?"Firebrick.ui.getCmp('"+t.getId()+"').options":n},linkBuilder:function(e){if(e){if(typeof e.link=="string")return e.link;if(typeof e.href=="string")return e.href}return!1},callFunction:function(e,t,n){var r=s.getById(e);r&&t&&r[t].apply(r,n)}},renderer:{_registry:{},add:function(e,t){var n=this;return n._registry[e]=t,n},get:function(t){var n=this;return e.isFunction(t)&&(t=t()),n._registry[t]}}},s.classes.overwrite("Firebrick.view.Base",{_ko:null,passDownEvents:{rendered:1,htmlRendered:1,unbound:1,destroy:1},listeners:{uiBuilt:function(){var e=this,t;if(e.passDownEvents){s.utils.merge("passDownEvents",e);for(t in e.passDownEvents)e.passDownEvents.hasOwnProperty(t)&&e._parent&&e._initPassDownEvent(t)}}},_initPassDownEvent:function(e){var t=this,n=t._createPassEvent(t);t._parent.on(e,n),t.on("destroy",function(){n.__isDestroyed=!0})},_createPassEvent:function(e){return function(){var t=this,n=Array.prototype.slice.call(arguments);n=[t.event.eventName].concat(n),e.fireEvent.apply(e,n)}},items:null,tpl:function(){var e=this;if(e.items)return s.ui.build({items:e.items,view:e})}}),function(e){e.bindingHandlers.withProperties={init:function(t,n,r,i,s){var o=s.createChildContext(s.$rawData,null,function(t){e.utils.extend(t,n())});return e.applyBindingsToDescendants(o,t),{controlsDescendantBindings:!0}}},e.bindingHandlers.htmlWithBinding={init:function(){return{controlsDescendantBindings:!0}},update:function(t,n,r,i,s){var o=n();o===null&&(o=""),t.innerHTML=o,e.applyBindingsToDescendants(s,t)}},e.virtualElements.allowedBindings.debug=!0,e.bindingHandlers.debug={init:function(e,t,n,r,i){console.warn("Debug:",e,t(),n(),r,i)}}}(n),s.classes.addLookups({"button.icon":"Firebrick.ui.button.Icon","button.togglebutton":"Firebrick.ui.button.ToggleButton","containers.border.pane":"Firebrick.ui.containers.border.Pane","containers.box":"Firebrick.ui.containers.Box","containers.fieldset":"Firebrick.ui.containers.Fieldset","containers.form":"Firebrick.ui.containers.Form","containers.formpanel":"Firebrick.ui.containers.FormPanel","containers.gridcolumn":"Firebrick.ui.containers.GridColumn","containers.modal":"Firebrick.ui.containers.Modal","containers.panel":"Firebrick.ui.containers.Panel","containers.tab.pane":"Firebrick.ui.containers.tab.Pane","display.alert":"Firebrick.ui.display.Alert","display.divider":"Firebrick.ui.display.Divider","display.header":"Firebrick.ui.display.Header","display.image":"Firebrick.ui.display.Image","display.list":"Firebrick.ui.display.List","display.loader":"Firebrick.ui.display.Loader","display.progress":"Firebrick.ui.display.Progress","display.span":"Firebrick.ui.display.Span","display.text":"Firebrick.ui.display.Text","fields.base":"Firebrick.ui.fields.Base","fields.checkbox":"Firebrick.ui.fields.Checkbox","fields.combobox":"Firebrick.ui.fields.ComboBox","fields.datepicker":"Firebrick.ui.fields.DatePicker","fields.display":"Firebrick.ui.fields.Display","fields.email":"Firebrick.ui.fields.Email","fields.file":"Firebrick.ui.fields.File","fields.hidden":"Firebrick.ui.fields.Hidden","fields.htmleditor":"Firebrick.ui.fields.HtmlEditor","fields.input":"Firebrick.ui.fields.Input","fields.password":"Firebrick.ui.fields.Password","fields.radio":"Firebrick.ui.fields.Radio","fields.selectbox":"Firebrick.ui.fields.SelectBox","fields.textarea":"Firebrick.ui.fields.TextArea","menu.contextmenu":"Firebrick.ui.menu.ContextMenu","nav.breadcrumbs":"Firebrick.ui.nav.Breadcrumbs","nav.list":"Firebrick.ui.nav.List","nav.navbar":"Firebrick.ui.nav.Navbar","nav.pagination":"Firebrick.ui.nav.Pagination","nav.toolbar":"Firebrick.ui.nav.Toolbar","table.table":"Firebrick.ui.table.Table","table.treetable":"Firebrick.ui.table.TreeTable"}),s});