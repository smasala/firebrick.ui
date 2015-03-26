/*!
* Firebrick UI
* @author Steven Masala [me@smasala.com]
* 
* FirebrickUI, component library for Firebrick JS
**/

(function(e,t){if(typeof define!="function"||!define.amd)return t(e.jQuery,e.Firebrick,e.ko);define(["jquery","firebrick","knockout","devicejs","knockout-mapping","text"],function(e,n,r,i,s,o){return r.mapping=s,t(e,n,r,i)})})(this,function(e,t,n,r){if(!t){console.error("Firebrick has not been loaded, Firebrick-UI requires Firebrick JS to function");return}if(t.ui){console.error("Firebrick.ui namespace has already been taken!");return}t.ui={version:"0.13.0",_searchCache:{},build:function(e){var n=this,r=t.views.getTarget(e.target),i,s;return i=n._populate(e.items,e.view),s=i.html,e.view&&i.items.length&&(e.view.items=i.items),r&&r.append(s),s},cmp:{},addUIName:function(e){var n,r,i;e&&(n=e.substr(e.lastIndexOf("-")+1),r=n.indexOf("."),r===0?console.error("illegal uiName. The name cannot begin with a '.' ",e):r>=1?(i=n.split("."),n=i.shift(),t.ui.cmp[n]=t.ui.utils._buildDotObj(i,e)):t.ui.cmp[n]=e)},_populate:function(t,n){var r=this,i=[],s="",o;e.isFunction(t)&&(t=t());for(var u=0,a=t.length;u<a;u++)o=r._buildComponent(t[u],n),s+=o._html,o.getId||console.error("something went wrong",t[u],"is it defined correctly? Check the item name and dependency include"),i.push(o);return{html:s,items:i}},_buildComponent:function(e,n){var r=this,i,s;return e.isView?(e._state!=="initial"&&(i=e.init()),i=e):e.viewName?i=t.create(e.viewName,e):(e=r._componentFilter(e),e.uiComponent?i=e:(s=r.getByShortName(e.uiName||e),s||console.error("Has",e.uiName||e,"been added as a dependency?"),i=t.create(s._classname,e.uiName?Object.getPrototypeOf(Object.create(e)):null))),i._parent||(i._parent=n),i.build&&(i._html=i.build()),i},_componentFilter:function(e){if(typeof e=="string")switch(e){case"|":e="fb-ui-divider"}return e},getByShortName:function(e){var n=this,r=n._searchCache[e];if(!r){var i,s;for(i in t.classes._classRegistry)if(t.classes._classRegistry.hasOwnProperty(i)){s=t.classes._classRegistry[i];if(s.uiComponent&&s.uiName===e){r=s,n._searchCache[e]=s;break}}}return r||console.error("ui component",e,"not found"),r},getCmp:function(e){return t.getById(e)},get:function(e){return t.get(e)},utils:{_buildDotObj:function(e,t,n){var r=this,i=e.shift();return n=n||{},n[i]={},e.length?e[0]!==""?r._buildDotObj(e,t,n[i]):console.error("error building uiName, found empty string",e,i,t):n[i]=t,n},getValue:function(t){return e.isFunction(t)?t():t},stringify:function(t){if(t){var n=function(t,r){var i=r?"":"{",s,o;for(s in t)t.hasOwnProperty(s)&&(o=t[s],e.isPlainObject(o)?i+=s+":"+n(o):i+=s+": "+o+",");return i=i.substr(-1)===","?i.substring(0,i.length-1):i,i+=r?"":"},",i};return n(t,!0)}return""}},helper:{tabBuilder:function(n){var r=t.getById(n),i=r.items;return e.isFunction(i)?"Firebrick.getById('"+n+"').items()":e.isArray(i)?"Firebrick.getById('"+n+"').items":i},optionString:function(t){var n=t.options;return e.isFunction(n)?"Firebrick.ui.getCmp('"+t.getId()+"').options()":e.isArray(n)?"Firebrick.ui.getCmp('"+t.getId()+"').options":n},linkBuilder:function(e){return e&&typeof e.link=="string"?e.link:"javascript:void(0)"},callFunction:function(e,n,r){var i=t.getById(e);i&&n&&i[n].apply(i,r)}},renderer:{_registry:{},add:function(e,t){var n=this;return n._registry[e]=t,n},get:function(t){var n=this;return e.isFunction(t)&&(t=t()),n._registry[t]}}},t.classes.overwrite("Firebrick.view.Base",{passDownEvents:{rendered:1,htmlRendered:1,unbound:1},listeners:{preReady:function(){var e=this,n;if(e.passDownEvents){t.utils.merge("passDownEvents",e);for(n in e.passDownEvents)e.passDownEvents.hasOwnProperty(n)&&e.on(n,e._createPassEvent())}}},_createPassEvent:function(){return function(){var t=this,n=t.items,r=arguments;if(e.isArray(n)){var i;for(var s=0,o=n.length;s<o;s++)i=n[s],i.passEvent&&i.passEvent(r)}}},items:null,tpl:function(){var e=this;if(e.items)return t.ui.build({items:e.items,view:e})}}),n.bindingHandlers.withProperties={init:function(e,t,r,i,s){var o=s.createChildContext(s.$rawData,null,function(e){n.utils.extend(e,t())});return n.applyBindingsToDescendants(o,e),{controlsDescendantBindings:!0}}}});