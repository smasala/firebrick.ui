/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./SplitBar.html","jquery","../../common/mixins/Column","./Draggable","../Panel"],function(e,t){return Firebrick.define("Firebrick.ui.containers.border.Pane",{extend:"Firebrick.ui.containers.Panel",mixins:"Firebrick.ui.common.mixins.Column",sName:"containers.border.pane",resizable:!1,position:"",collapseDirection:"left",splitBarIdPrefix:"fb-ui-splitbar-",splitBarTpl:e,_rotatedHeadingClass:"panel-rotated-heading",_rotatedTitleClass:"panel-rotated-title",_positionPrefixClass:"fb-ui-pane-position-",_transitionClass:"fb-ui-transition",height:"auto",width:"33%",init:function(){var e=this;return e.on("htmlRendered",function(){return e._htmlRendered.apply(e,arguments)}),e.on("rendered",function(){return e._rendered.apply(e,arguments)}),e.callParent(arguments)},_htmlRendered:function(){var e=this,t,n,r=e.position;r!=="center"&&(t=e.getElement(),t&&(e.template("splitBarTpl"),n=e.build("splitBarTpl"),r!=="right"&&r!=="bottom"?t.after(n):t.before(n))),e._setDimensions()},_setDimensions:function(){var e=this,t=e.getElement(),n=e.position,r=e.height,i=e.width;(n==="top"||n==="bottom")&&r!=="auto"&&(t.css("height",r),t.css("min-height",r));if(n==="left"||n==="right")t.css("width",i),t.css("min-width",i)},_rendered:function(){var e=this,t=e.getElement(),n=e.position,r=n==="top"||n==="bottom"?"vertical":"horizontal",i=n==="top"||n==="left"?"next":"prev",s=t[i](".fb-ui-splitbar");t.prop("fb-direction",r),t.prop("fb-splitbar",s),e.collapsible&&(s.on("click touchstart","> .fb-ui-collapse-icon",function(){e.toggleCollapse.call(e)}),e.setCollapsibleActions()),e.resizable&&e.setResizableActions(),(e.resizable||e.collapsible)&&t.on("fb-ui-panel-state-change",function(){t.hasClass(e._collapsedClass)?e.onCollapsed():e.onExpanded()})},setCollapsibleActions:function(){var e=this,n=e.getElement(),r=e.position;r==="left"||r==="right"?(t("> .panel-collapse",n).on("hide.bs.collapse",function(){return e._onRLPaneCollapse.apply(e,arguments)}),t("> .panel-collapse",n).on("show.bs.collapse",function(){return e._onRLPaneExpand.apply(e,arguments)})):(t("> .panel-collapse",n).on("hide.bs.collapse",function(){return e._onTBPaneCollapse.apply(e,arguments)}),t("> .panel-collapse",n).on("show.bs.collapse",function(){return e._onTBPaneExpand.apply(e,arguments)}))},setResizableActions:function(){var e=this,n=e.position,r=e.getElement(),i=t("> .panel-heading",r),s=r.prop("fb-direction"),o=r.prop("fb-splitbar");o.length&&(s==="vertical"?(r.hasClass(e._collapsedClass)||e.onExpanded(),o.on("dragged",function(e,t){var s;n==="top"?(s=r.height()+t,s>0&&(s-=i.height()),r.css("height",s),r.css("min-height",s)):(s=r.height()-t,s<0&&(s+=i.height()),r.css("height",s),r.css("min-height",s))})):(r.hasClass(e._collapsedClass)||e.onExpanded(),o.on("dragged",function(e,t,i){var s=r.width();n==="right"?(r.width(s-i),r.css("min-width",s-i)):(r.width(s+i),r.css("min-width",s+i))})))},_onTBPaneCollapse:function(){var e=this,n=e.getElement(),r=t("> .panel-heading",n),i=r.outerHeight();n.prop("_fbResizeHeight")||(n.css("min-height",n.css("min-height")),n.css("height",n.css("height"))),n.addClass(e._transitionClass),n.prop("_fbResizeHeight",n.css("height")),n.css("min-height",i),n.css("height",i),n.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){n.removeClass(e._transitionClass)})},_onTBPaneExpand:function(){var e=this,t=e.getElement();t.addClass(e._transitionClass),t.css("min-height",t.prop("_fbResizeHeight")),t.css("height",t.prop("_fbResizeHeight")),t.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){t.removeClass(e._transitionClass)})},_onRLPaneExpand:function(){var e=this,n=e.getElement(),r=t("> .panel-heading",n),i=t(".panel-title",r);n.addClass(e._transitionClass),n.trigger("pane-expanding"),r.removeClass(e._rotatedHeadingClass),i.removeClass(e._rotatedTitleClass),n.css("min-width",n.prop("_fbResizeWidth")),n.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){n.removeClass(e._transitionClass)})},_onRLPaneCollapse:function(){var e=this,n=e.getElement(),r=t("> .panel-heading",n),i=t(".panel-title",r),s=r.outerHeight()||0;n.addClass(e._transitionClass),n.trigger("pane-collapsing"),n.prop("_fbResizeWidth",n.css("width")),n.css("min-width",s),n.css("width",s),n.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){r.addClass(e._rotatedHeadingClass),i.addClass(e._rotatedTitleClass),n.removeClass(e._transitionClass)})},onExpanded:function(){var e=this,t=e.getElement(),n=t.prop("fb-direction"),r=t.prop("fb-splitbar");r.length&&e.resizable&&(r.prop("dragDisabled",!1),r.drags(n)),r.removeClass("fb-ui-is-collapsed")},onCollapsed:function(){var e=this,t=e.getElement(),n=t.prop("fb-splitbar");n.length&&e.resizable&&n.prop("dragDisabled",!0),n.addClass("fb-ui-is-collapsed")},bindings:function(){var e=this,t=e.callParent(arguments);return t.css["'fb-ui-border-pane'"]=!0,t.css[e.parseBind(e._positionPrefixClass+e.position)]=!0,e.collapsible&&(t.css["'fb-ui-pane-collapsible'"]=!0),t},splitBarBindings:function(){var e=this,t={css:{"'fb-ui-splitbar'":!0},attr:{}};return t.css[e.parseBind("fb-ui-splitbar-"+e.position)]=!0,e.resizable&&(e.position==="top"||e.position==="bottom"?t.css["'fb-ui-splitbar-horizontal'"]=!0:t.css["'fb-ui-splitbar-vertical'"]=!0),e.collapsible&&(t.css["'fb-ui-collapsebar'"]=!0),t},getSplitBarId:function(){var e=this;return e.splitBarIdPrefix+e.getId()},splitBarCollapseBindings:function(){var e=this,t={css:{}};return t.css.glyphicon=!0,t.css["'fb-ui-collapse-icon'"]=!0,e.position==="left"?t.css["'glyphicon-chevron-left'"]=!0:e.position==="right"?t.css["'glyphicon-chevron-right'"]=!0:e.position==="top"?t.css["'glyphicon-chevron-up'"]=!0:e.position==="bottom"&&(t.css["'glyphicon-chevron-down'"]=!0),t}})});