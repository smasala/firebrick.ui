/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * @module Firebrick.ui.components
 * @extends components.common.Base
 * @namespace components.display
 * @class List
 */
define(["text!./List.html", "knockout", "jquery", "../common/Base",  "../common/mixins/Items", "../common/mixins/Badges"], function(tpl, ko, $){
	"use strict";
	
	if(!ko.bindingHandlers.listRenderer){
		/*
		 * optionsRenderer for list
		 * create dynamic css along with static
		 */
		ko.virtualElements.allowedBindings.listRenderer = true;
		ko.bindingHandlers.listRenderer = {
		    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		    	var childNodes = ko.virtualElements.childNodes(element),
		    		node,
		    		ul;

		    	for(var i = 0, l = childNodes.length; i<l; i++){
		    		node = childNodes[i];
		    		if(node instanceof HTMLUListElement){
		    			//list item
		    			$(node).attr("id", valueAccessor());
		    		}
		    	}
		    	
		    }
		};
	}
	
	if(!ko.bindingHandlers.listItemRenderer){
		ko.virtualElements.allowedBindings.listItemRenderer = true;
		ko.bindingHandlers.listItemRenderer = {
		    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
				var $el = $(element);
	
				if($el.length){
					if(viewModel){
						if(viewModel.css){
							$el.addClass(Firebrick.ui.utils.getValue(viewModel.css));
						}
					}
				}
		    }
		};
	}
	
	return Firebrick.define("Firebrick.ui.display.List", {
		extend:"Firebrick.ui.common.Base",
		mixins:["Firebrick.ui.common.mixins.Items", "Firebrick.ui.common.mixins.Badges"],
		/**
		 * @property sName
		 * @type {String}
		 * @default "fb-ui-list"
		 */
		sName:"display.list",
		/**
		 * @property tpl
		 * @type {String} html
		 * @default components/display/List.html
		 */
		tpl:tpl,
		/**
		 * type of list, ul or ol
		 * @property listType
		 * @type {String}
		 * @default "ul"
		 */
		listType:"ul",
		/**
		 * is a list group?
		 * @property listGroup
		 * @type {Boolean|String}
		 * @default true
		 */
		listGroup:false,
		/**
		 * defaults to true but only comes into effect with property "listGroup"
		 * @property listItemGroupClass
		 * @type {Boolean|String}
		 * @default true
		 */
		listItemGroupClass:true,
		/**
		 * items to parse into the list
		 * @property data
		 * @type {String}
		 * @default null
		 */
		data:null,
		/**
		 * unstyled - applies list-unstyled css class to list container (ul/ol)
		 * @property unstyled
		 * @type {boolean}
		 * @default false
		 */
		unstyled:false,
		/**
		 * inject a template into the <li>{preItemTpl}<span></span>{postItemTpl}</li> item
		 * @property preItemTpl
		 * @type {String|Function} html
		 * @default ""
		 */
		preItemTpl:"",
		/**
		 * inject a template into the <li>{preItemTpl}<span></span>{postItemTpl}</li> item
		 * @property postItemTpl
		 * @type {String|Function} html
		 * @default ""
		 */
		postItemTpl:"",
		/**
		 * wrap the list element content in a <a></a> link
		 * @property linkedList
		 * @type {Boolean}
		 * @default false
		 */
		linkedList: false,
		/**
		 * @method virtualContainerBindings
		 * @return {Object}
		 */
		virtualContainerBindings: function(){
			return {"if": "$data && $data.length"};
		},
		/**
		 * set to true to add attribute [fb-ignore-router=true] to all links - these links are then ignored by the history api (Firebrick.router.history)
		 * @property ignoreRouter
		 * @type {Boolean}
		 * @default false
		 */
		ignoreRouter: false,
		/**
		 * @property collapsedCSS
		 * @type {String}
		 * @default "fb-ui-listitem-collapsed"
		 */
		collapsedCSS: "fb-ui-listitem-collapsed",
		/**
		 * set to false to remove node span before text
		 * @property preNode
		 * @type {Boolean}
		 * @default true
		 */
		preNode: true,
		/**
		 * used by nodeRenderer()
		 * @method nodeCSSRenderer
		 * @param $data {ko bindings context}
		 * @return {Object} passed to $element.addClass()
		 */
		nodeCSSRenderer: function( $data ){
			var me = this,
				obj = {},
				children = $data.children;
			
			obj["fb-ui-node-action"] = true;
			
			if(children){
				
				obj.glyphicon = true;
				
				if(children.expandable !== false){
					obj["fb-ui-list-expandable-node"] = true;
				}
				
			}else{
				obj["fb-ui-hidden"] = true;
			}
			
			return obj;
		},
		/**
		 * @method nodeRenderer 
		 * @param $element {jQuery Object}
		 * @param bindingContext {KO Context Object]
		 */
		nodeRenderer: function($element, bindingContext ){
			var me = this,
				$data = bindingContext.$data,
				children = $data.children;
			
		},
		/**
		 * @method init
		 */
		init: function(){
			var me = this;
			
			me.on("rendered", function(){
				me._initUIEvents();
			});
			
			return me.callParent( arguments );
		},
		/**
		 * @method _initUIEvents
		 * @private
		 */
		_initUIEvents: function(){
			var me = this,
				$el = me.getElement(),
				$collapsibles = $(".fb-ui-list-expandable-node", $el),
				func = function(){
					return me._nodeClick( this, arguments );
				}

			if( $collapsibles.length ){
				$collapsibles.on("click", func);
				me.on("destroy", function(){
					$collapsibles.off("click", func);
				});
			}
		},
		/**
		 * @method _nodeClick
		 * @private
		 * used by jQuery on click event
		 */
		_nodeClick: function(element, clickArgs){
			var me = this,
				$el = $(element),
				$node = $el.closest("li.fb-ui-listitem-parent"),
				args = Firebrick.utils.argsToArray( clickArgs );
			
			args.unshift( "nodeClicked" );	//add to the begining
			args.push( $node ); //add to end
			
			me.toggleCollapse( $node );
			
			return me.fireEvent( "nodeClicked", args);
		},
		/**
		 * @method toggleCollapse
		 * @param $node {jQuery Object} li node item
		 */
		toggleCollapse: function( $node ){
			var me = this,
				$ul = $("> ul", $node);
			
			if($ul.length){
				if( $ul.is(":visible") ){
					me.collapseNode( $node );
				}else{
					me.expandNode( $node );
				}
			}
		},
		/**
		 * @method collapseNode
		 * @param $node {jQuery Object} li node item
		 */
		collapseNode: function( $node ){
			var me = this,
				$ul = $("> ul", $node);
			
			if($ul.length){
				$ul.hide();
				me.fireEvent("nodeCollapsed", $node, $ul);
				$node.addClass( me.collapsedCSS );
			}
		},
		/**
		 * @method expandNode
		 * @param $node {jQuery Object} li node item
		 */
		expandNode: function( $node ){
			var me = this,
				$ul = $("> ul", $node);
			
			if($ul.length){
				$ul.show();
				me.fireEvent("nodeExpanded", $node, $ul);
				$node.removeClass( me.collapsedCSS );
			}
		},
		/**
		 * @method bindings
		 * @return {Object}
		 */
		bindings: function(){
			var me = this,
				obj = me.callParent(arguments);

			if(me.listGroup){
				obj.css["'list-group'"] = me.listGroup;
			}
			if(me.unstyled){
				obj.css["'fb-ui-list-unstyled'"] = me.unstyled;
			}
			if(me.items){
				obj.foreach = "$data";
			}
			
			obj.visible = "$parent.expanded === false ? false : true";
			
			return obj;
		},
		/**
		 * @method listItemBindings
		 * @return {Object}
		 */
		listItemBindings: function(){
			var me  = this,
				obj = {
					css:{
						"'fb-ui-listitem-parent'": "$data.children ? true : false",
						"'fb-ui-listitem-haschildren'": "$data.children ? true : false"
					}, 
					attr:{}
				};
			
			if(me.listGroup && me.listItemGroupClass){
				obj.css["'list-group-item'"] = me.listItemGroupClass;
			}
			
			obj.css[ me.parseBind( me.collapsedCSS ) ] = "$data.children && $data.expandable !== false && $data.expanded === false ? true : false";
			
			obj.css.divider = "$data === '|' || $data.divider ? true : false";
			obj.attr.id = "$data.id || 'fb-ui-listitem-' + Firebrick.utils.uniqId()";
			obj.listItemRenderer = true;
			
			
			return obj;
		},
		/**
		 * @method listItemTextBindings
		 * @return {Object}
		 */
		listItemTextBindings:function(){
			var me = this;
			return {
				value: "$data.hasOwnProperty('value') ? $data.value : $data",
				htmlWithBinding: "$data.renderer ? $data.renderer($data, $context) : ($data.text ? $data.text : $data)",
				css: {
					"'fb-ui-listitem-text'": true
				} 
			};
		},
		/**
		 * @method listTemplateBindings
		 * @return {Object}
		 */
		listTemplateBindings: function(){
			var me = this;
			return {
				template: {
					name:  me.parseBind(me._getTplId()),
					data: $.isArray(me.items) ? "Firebrick.ui.getCmp('" + me.getId() + "').items" : me.items,
				},
				listRenderer: me.parseBind( me.getId() )
			};
		},
		/**
		 * @private
		 * @method _getTplId
		 * @return {String}
		 */
		_getTplId: function(){
			return "fb-ui-tpl-" + this.getId(); 
		},
		/**
		 * @method childrenBindings
		 * @return {Object}
		 */
		childrenBindings: function(){
			var me = this;
			return {
				template: {
					name:  me.parseBind( me._getTplId() ),
					data: "$data.children"
				}
			};
		},
		/**
		 * @method listLinkBindings
		 * @return {Object}
		 */
		listLinkBindings: function(){
			var me = this,
				obj = {
					attr:{
						href: "Firebrick.ui.helper.linkBuilder( $data )",
						"'data-value'": "$data.hasOwnProperty('value') ? $data.value : $data"
					},
					value: "$data.hasOwnProperty('value') ? $data.value : $data",
			};
			obj.attr["'data-target'"] = "$data.dataTarget ? $data.dataTarget : false";
			obj.attr["'fb-ignore-router'"] = "$data.hasOwnProperty( 'ignoreRouter' ) ? $data.ignoreRouter : " + me.ignoreRouter;
			return obj;
		},
		/**
		 * @method listItemNodeBindings
		 * @return {Object}
		 */
		listItemNodeBindings: function(){
			var me = this,
				obj = {
					css: "Firebrick.getById('" + me.getId() + "').nodeCSSRenderer( $data )"
				};
			
			return obj;
		}
	});
});