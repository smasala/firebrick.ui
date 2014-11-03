define(["text!./Text.html", "../common/Base"], function(tpl){
	return Firebrick.create("Firebrick.ui.display.Text", {
		extend: "Firebrick.ui.common.Base",
		uiName:"fb-ui-text",
		tpl:tpl,
		/**
		 * @type boolean - whether text is raw html or not
		 */
		isHtml:false,
		/**
		 * @type string 
		 */
		text:"",
		/**
		 * @type boolean
		 */
		leadCSS:false,
		/**
		 * @type boolean
		 */
		blockQuote:false,
		/**
		 * @type boolean
		 */
		blockQuoteReverseCSS: false,
		/**
		 * @type boolean :: string - false not to show, string for footer text
		 */
		blockQuoteFooter:false,
		/**
		 * @type boolean
		 */
		isBlockQuoteFooterHTML: false,
		/**
		 * @type false || string :: 'left', 'center', 'right', 'justify', 'no-wrap' (defaults to: left)
		 */
		textAlignment:"justify",
		/**
		 * Bindings
		 */
		bindings:function(){
			var me = this,
				obj = {
					css:{
						lead: me.leadCSS
					}
				};
			
			if(me.textAlignment){
				obj.css["'text-"+me.textAlignment+"'"] = true;	
			}
			
			if(me.html){
				obj.html = me.text; 
			}else{
				obj.text = me.text;
			}
			
			return obj;
		},
		
		blockQuoteBindings: function(){
			return {
				css:{
					"'blockquote-reverse'": this.blockQuoteReverseCSS
				}
			};
		},
		
		blockQuoteFooterBindings: function(){
			var me = this,
				obj = {};
			if(me.html){
				obj.html = me.blockQuoteFooter; 
			}else{
				obj.text = me.blockQuoteFooter;
			}
			return obj;
		}
	});
});