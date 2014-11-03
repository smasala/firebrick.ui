define(["text!./Grid.html", "jquery", "./Base"], function(tpl, $){
	return Firebrick.create("Firebrick.ui.containers.Grid", {
		extend:"Firebrick.ui.containers.Base",
		uiName:"fb-ui-grid",
		tpl: tpl,
		/**
		 * @boolean or string
		 */
		rowClass:true,
		bindings: function(){
			var me = this;
			return {
				css: {
					row: me.rowClass
				},
				attr:{
					id: "'" + me.getId() + "'"
				}
			}
		},
		getBasicBindings:function(){
			var me = this;
				obj = {
						css:{}
				};
			obj.css["'col-md-" + (Math.floor(12/me.items.length)) + "'"] = true;
			return obj;
		},
		getGridItem: function(index, item, context){
			var me = context.data.root,
				newItem = me._getItems(item);
			
			me.items[index] = newItem.items[0];
			
			if(!$.isPlainObject(item)){
				return '<div data-bind="' + Firebrick.ui.utils.stringify(me.getBasicBindings()) + '">' + newItem.html + '</div>';
			}
			
			return newItem.html;
		}
	});
});