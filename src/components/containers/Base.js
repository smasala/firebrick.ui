define(["jquery", "../common/Base"], function($){
	return Firebrick.define("Firebrick.ui.containers.Base", {
		extend:"Firebrick.ui.common.Base",
		
		init:function(){
			var me = this;
			me.on("componentReady", function(){
				var items = me.items,
					args = arguments;
				if($.isArray(items)){
					$.each(items, function(i,f){
						if(f.passEvent){
							f.passEvent(args);
						}
					});
				}
			});
			me.callParent();
		},
		
		/**
		 * inject sub items
		 * @param items :: array || object || string (optional) :: only pass param if you don't want to use default this.items
		 */
		getItems: function(){
			var me = this,
				r = me._getItems(me.items);
			me.items = r.items;
			return r.html;
		},
		
		/**
		 * @private
		 * use getItems
		 */
		_getItems: function(items){
			var me = this;
			if(items){
				if(!$.isArray(items)){
					items = [items];
				}
				return Firebrick.ui._populate(items, me);
			}
			return "";
		}
	});
});