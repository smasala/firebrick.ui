/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Loader.html","jquery","../common/Base","../common/mixins/Items"],function(e,t){"use strict";return Firebrick.define("Firebrick.ui.display.Loader",{extend:"Firebrick.ui.common.Base",enclosedBind:!0,target:"body",appendTarget:!0,mixins:"Firebrick.ui.common.mixins.Items",tpl:e,sName:"display.loader",msgText:"Please wait...",init:function(){var e=this,t=e.getTarget();return t.is("input")&&(e.target=t.parent()),e.on("rendered",function(){e._initRender()}),e.callParent(arguments)},_initRender:function(){var e=this,t=e.getTarget();t.addClass("fb-ui-loader-open"),e.position()},destroy:function(){var e=this,t=e.getTarget();return t.removeClass("fb-ui-loader-open"),e.callParent(arguments)},_getCalcTarget:function(){var e=this;return e.target==="body"||e.target==="html"?t(window):e.getTarget()},position:function(){var e=this,n=e._getCalcTarget(),r=e.getElement(),i=t(".fb-ui-loader-msg-container",r),s=i.outerWidth()/2,o=i.outerHeight()/2;i.css({top:n.height()/2-o,left:n.width()/2-s})},bindings:function(){var e=this,t=e.callParent(arguments);return t.css["'fb-ui-loader-container'"]=!0,t},maskBindings:function(){var e={css:{"'fb-ui-loader-mask'":!0}};return e},spinnerBindings:function(){var e={css:{"'fb-ui-loader-spinner'":!0,glyphicon:!0,"'glyphicon-refresh'":!0,"'glyphicon-refresh-animate'":!0}};return e},msgContainerBindings:function(){var e={css:{"'fb-ui-loader-msg-container'":!0}};return e},msgBindings:function(){var e=this,t={css:{"'fb-ui-loader-msg'":!0}};return e.msgText&&(t.text=e.textBind("msgText")),t}})});