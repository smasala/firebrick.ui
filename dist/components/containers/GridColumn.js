/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./GridColumn.html","./Base","../common/mixins/Column"],function(e){"use strict";return Firebrick.define("Firebrick.ui.containers.GridColumn",{extend:"Firebrick.ui.containers.Base",mixins:"Firebrick.ui.common.mixins.Column",sName:"containers.gridcolumn",tpl:e,bindings:function(){var e=this;return e.calColumn(e.callParent(arguments))}})});