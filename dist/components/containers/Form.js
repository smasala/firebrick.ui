/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["text!./Form.html","./Base"],function(e){return Firebrick.define("Firebrick.ui.containers.Form",{extend:"Firebrick.ui.containers.Base",uiName:"fb-ui-form",tpl:e,formRole:"'form'",horizontal:!0,inline:!1,formBindings:function(){var e=this;return{attr:{id:"'"+e.getId()+"'",role:e.formRole},css:{"'form-horizontal'":this.horizontal,"'form-inline'":this.inline}}}})});