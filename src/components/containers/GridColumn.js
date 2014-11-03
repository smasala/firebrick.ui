define(["text!./GridColumn.html", "./Base"], function(tpl){
	return Firebrick.create("Firebrick.ui.containers.GridColumn", {
		extend:"Firebrick.ui.containers.Base",
		uiName:"fb-ui-gridcol",
		tpl:tpl,
		/**
		 * @type string
		 */
		deviceSize:"md",
		/**
		 * @type int || string :: number 1 to 12 || "auto"
		 * auto will attempt to provide the column width by dividing the number of items in the parent Grid by 12 - decimals will be rounded down
		 */
		columnWidth:"auto",
		/**
		 * @private
		 */
		_getColumnWidth:function(){
			var me = this,
				colWidth = me.columnWidth;
			if(colWidth === "auto"){
				return Math.floor(12/me._parent.items.length);
			}
			return colWidth;
		},
		
		/**
		 * Bindings
		 */
		bindings: function(){
			var me = this,
				obj = {
					css:{}
				};
				
			obj.css["'col-"+me.deviceSize+"-"+me._getColumnWidth()+"'"] = true;
			
			return obj;
		}
	});
})