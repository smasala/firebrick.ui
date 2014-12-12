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
/**
 * @module plugins
 * @namespace plugins
 * @class RadioList
 */
(function(factory) {
	"use strict";
    if (typeof define === "function" && define.amd) {
        // AMD anonymous module
        define(["jquery", "x-editable"], factory);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.jQuery);
    }
})(function($) {
	"use strict";
    var Radiolist = function(options) {
        this.init('radiolist', options, Radiolist.defaults);
    };
    $.fn.editableutils.inherit(Radiolist, $.fn.editabletypes.checklist);

    $.extend(Radiolist.prototype, {
        renderList : function() {
            var $label;
            this.$tpl.empty();
            if (!$.isArray(this.sourceData)) {
                return;
            }

            for (var i = 0; i < this.sourceData.length; i++) {
                $label = $('<div><label>', {'class':this.options.inputclass}).append($('<input>', {
                    type : 'radio',
                    name : this.options.name,
                    value : this.sourceData[i].value
                })).append($('<span>').text(this.sourceData[i].text));

                // Add radio buttons to template
                this.$tpl.append($label);
            }

            this.$input = this.$tpl.find('input[type="radio"]');
        },
        input2value : function() {
            return this.$input.filter(':checked').val();
        },
        str2value: function(str) {
           return str || null;
        },
        
        value2input: function(value) {
           this.$input.val([value]);
        },
        value2str: function(value) {
           return value || '';
        },
    });

    Radiolist.defaults = $.extend({}, $.fn.editabletypes.list.defaults, {
        /**
         @property tpl
         @default <div></div>
         **/
        tpl : '<div class="editable-radiolist"></div>',

        /**
         @property inputclass, attached to the <label> wrapper instead of the input element
         @type string
         @default null
         **/
        inputclass : '',

        name : 'defaultname'
    });

    $.fn.editabletypes.radiolist = Radiolist;
});

