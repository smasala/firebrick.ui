/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./SplitBar.html","jquery","../../common/mixins/Column","./Draggable","../Panel"],function(e,t){return Firebrick.define("Firebrick.ui.containers.border.Pane",{extend:"Firebrick.ui.containers.Panel",mixins:"Firebrick.ui.common.mixins.Column",uiName:"fb-ui-borderpane",resizable:!1,position:"",collapseDirection:"left",splitbarIdPrefix:"fb-ui-splitbar-",splitBarTpl:e,_rotatedHeadingClass:"panel-rotated-heading",_rotatedTitleClass:"panel-rotated-title",_positionPrefixClass:"fb-ui-pane-position-",_transitionClass:"fb-ui-transition",height:"auto",init:function(){var e=this;return e.on("htmlRendered",function(){return e._htmlRendered.apply(e,arguments)}),e.on("rendered",function(){return e._rendered.apply(e,arguments)}),e.callParent(arguments)},_htmlRendered:function(){var e=this,t,n,r=e.position;e.resizable&&r!=="center"&&(t=e.getElement(),t&&(e.template("splitBarTpl"),n=e.build("splitBarTpl"),r!=="right"&&r!=="bottom"?t.after(n):t.before(n))),e._setDimensions()},_setDimensions:function(){var e=this,t=e.getElement(),n=e.position,r=e.height,i=e.width;(n==="top"||n==="bottom")&&r!=="auto"&&t.css("height",r),e.width&&(t.css("width",i),t.css("min-width",i))},_rendered:function(){var e=this;e.collapsible&&e.setCollapsibleActions(),e.resizable&&e.setResizableActions()},setCollapsibleActions:function(){var e=this,n=e.getElement(),r=e.position;r==="left"||r==="right"?(t("> .panel-collapse",n).on("hide.bs.collapse",function(){return e._onRLPaneCollapse.apply(e,arguments)}),t("> .panel-collapse",n).on("show.bs.collapse",function(){return e._onRLPaneExpand.apply(e,arguments)})):(t("> .panel-collapse",n).on("hide.bs.collapse",function(){return e._onTBPaneCollapse.apply(e,arguments)}),t("> .panel-collapse",n).on("show.bs.collapse",function(){return e._onTBPaneExpand.apply(e,arguments)}))},setResizableActions:function(){var e=this,n=e.position,r=e.getElement(),i=t("> .panel-heading",r),s=n==="top"||n==="bottom"?!0:!1,o=s||n==="right"?r.prev(".fb-ui-splitbar"):r.next(".fb-ui-splitbar");o.length&&(s?(r.hasClass(e._collapsedClass)||e.enableDrags(o,"vertical"),r.on("fb-ui-panel-state-change",function(){r.hasClass(e._collapsedClass)?e.disableDrags(o):e.enableDrags(o,"vertical")}),o.on("dragged",function(e,t){var s;n==="top"?(s=r.height()+t,s>0&&(s-=i.height()),r.css("height",s),r.css("min-height",s)):(s=r.height()-t,s<0&&(s+=i.height()),r.css("height",s),r.css("min-height",s))})):(r.hasClass(e._collapsedClass)||e.enableDrags(o,"horizontal"),r.on("fb-ui-panel-state-change",function(){r.hasClass(e._collapsedClass)?e.disableDrags(o):e.enableDrags(o,"horizontal")}),o.on("dragged",function(e,t,i){var s=r.width();n==="right"?(r.width(s-i),r.css("min-width",s-i)):(r.width(s+i),r.css("min-width",s+i))})))},_onTBPaneCollapse:function(){var e=this,n=e.getElement(),r=t("> .panel-heading",n),i=r.outerHeight();n.prop("_fbResizeHeight")||(n.css("min-height",n.css("min-height")),n.css("height",n.css("height"))),n.addClass(e._transitionClass),n.prop("_fbResizeHeight",n.css("height")),n.css("min-height",i),n.css("height",i),n.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){n.removeClass(e._transitionClass)})},_onTBPaneExpand:function(){var e=this,t=e.getElement();t.addClass(e._transitionClass),t.css("min-height",t.prop("_fbResizeHeight")),t.css("height",t.prop("_fbResizeHeight")),t.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){t.removeClass(e._transitionClass)})},_onRLPaneExpand:function(){var e=this,n=e.getElement(),r=t("> .panel-heading",n),i=t(".panel-title",r);n.addClass(e._transitionClass),n.trigger("pane-expanding"),r.removeClass(e._rotatedHeadingClass),i.removeClass(e._rotatedTitleClass),n.css("min-width",n.prop("_fbResizeWidth")),n.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){n.removeClass(e._transitionClass)})},_onRLPaneCollapse:function(){var e=this,n=e.getElement(),r=t("> .panel-heading",n),i=t(".panel-title",r),s=r.outerHeight();n.addClass(e._transitionClass),n.trigger("pane-collapsing"),n.prop("_fbResizeWidth",n.css("width")),n.css("min-width",s),n.css("width",s),n.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){r.addClass(e._rotatedHeadingClass),i.addClass(e._rotatedTitleClass),n.removeClass(e._transitionClass)})},enableDrags:function(e,t){e.prop("dragDisabled",!1),e.drags(t)},disableDrags:function(e){e.prop("dragDisabled",!0)},bindings:function(){var e=this,t=e.callParent(arguments);return t.css["'fb-ui-border-pane'"]=!0,t.css[e.parseBind(e._positionPrefixClass+e.position)]=!0,e.collapsible&&(t.css["'fb-ui-pane-collapsible'"]=!0),e.calColumn(t)},splitbarBindings:function(){var e=this,t={css:{"'fb-ui-splitbar'":!0},attr:{}};return t.css[e.parseBind("fb-ui-splitbar-"+e.position)]=!0,e.position==="top"||e.position==="bottom"?(t.css.col=!0,t.css[e.parseBind("col-"+e.deviceSize+"-12")]=!0,t.css["'fb-ui-splitbar-horizontal'"]=!0):t.css["'fb-ui-splitbar-vertical'"]=!0,t},getSplitbarId:function(){var e=this;return e.splitbarIdPrefix+e.getId()}})});