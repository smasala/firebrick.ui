define(["handlebars"], function(Handlebars){

	Handlebars.registerHelper('data-bind', function(arg, scope) {
		if(typeof arg == "string"){
			return scope.data.root["data-bind"](arg);
		}
		
		return arg.data.root["data-bind"]();
	});
	
	
	return Firebrick.define("Firebrick.ui.common.Base", {
		extend:"Firebrick.class.Base",
		/**
		 * Override class id 
		 */
		_idPrefix: "fb-ui-",
		/**
		 * @type boolean
		 * used when filtering component classes when searching
		 */
		uiComponent: true,
		/**
		 * @type string
		 */
		glyphiconClass: "glyphicon",
		
		/**
		 * @type false || string || jquery object
		 */
		renderTo:false,
		
		/**
		 * @private
		 */
		_build:"",
		
		/**
		 *@type boolean :: used in conjunction with renderTo
		 */
		appendComponent:false,
		
		init: function(){
			var me = this;
			if($.isPlainObject(me.bindings)){
				Firebrick.utils.mixinFor("bindings", me);	
			}
			if(me.renderTo){
				me.on("ready", function(){
					Firebrick.views.renderTo(Firebrick.views.getTarget(me.renderTo), me.build(), me.appendComponent);
				});
			}
			return this.callParent();
		},
		
		build: function(prop){
			var me = this;
			if(!me._build){
				me._build = Handlebars.compile(prop ? me[prop] : me.tpl)(me);
			}
			return me._build;
		},
		
		/**
		 * @param property is option :: string :: defaults to this.bindings
		 */
		"data-bind": function(property){
			var prop = property ? this[property] : this.bindings;
			if($.isFunction(prop)){
				prop = prop.call(this);
			}
			return Firebrick.ui.utils.stringify( prop );
		},
		
		getId: function(){
			return this.getClassId();
		},
		
		getSubTpl: function(){
			return this.build("subTpl");
		},
		
		/**
		 * @private
		 * find the parent of this class
		 * iterate up the inheritance tree looking for a classname that differs from the current and that "subTpl" or "tpl" don't match either
		 */
		_getParent: function(clazz){
			var me = clazz || this,
				p = Object.getPrototypeOf(me);

			if(me._classname != p._classname){
				if((me.subTpl != p.subTpl) || (me.tpl != p.tpl)){
					return p;
				}
			}
		  
			return this._getParent(p);
		},
		
		getParentTpl: function(){
			var me = this;
			return Handlebars.compile(me._getParent().subTpl)(me);
		},
		
		/**
		 * clean string - i.e. remove all ' from string
		 */
		cleanString: function(string){
			return string.replace(/\'/g, "");
		}
		
	});
});
	