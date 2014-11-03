/*!
Author: https://github.com/taivo
https://github.com/vitalets/x-editable/issues/153#issuecomment-49246106

List of radio buttons. Unlike checklist, value is stored internally as
scalar variable instead of array. Extends Checklist to reuse some code.

@class radiolist
@extends checklist
@final
@example
<a href="#" id="options" data-type="radiolist" data-pk="1" data-url="/post" data-title="Select options"></a>
<script>
$(function(){
    $('#options').editable({
        value: 2,    
        source: [
              {value: 1, text: 'option1'},
              {value: 2, text: 'option2'},
              {value: 3, text: 'option3'}
           ]
    });
});
</script>
**/

(function(e){typeof define=="function"&&define.amd?define(["jquery","x-editable"],e):e(window.jQuery)})(function(e){var t=function(e){this.init("radiolist",e,t.defaults)};e.fn.editableutils.inherit(t,e.fn.editabletypes.checklist),e.extend(t.prototype,{renderList:function(){var t;this.$tpl.empty();if(!e.isArray(this.sourceData))return;for(var n=0;n<this.sourceData.length;n++)t=e("<div><label>",{"class":this.options.inputclass}).append(e("<input>",{type:"radio",name:this.options.name,value:this.sourceData[n].value})).append(e("<span>").text(this.sourceData[n].text)),this.$tpl.append(t);this.$input=this.$tpl.find('input[type="radio"]')},input2value:function(){return this.$input.filter(":checked").val()},str2value:function(e){return e||null},value2input:function(e){this.$input.val([e])},value2str:function(e){return e||""}}),t.defaults=e.extend({},e.fn.editabletypes.list.defaults,{tpl:'<div class="editable-radiolist"></div>',inputclass:"",name:"defaultname"}),e.fn.editabletypes.radiolist=t});