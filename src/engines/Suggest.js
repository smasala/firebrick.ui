/*!
 * @author Steven Masala [me@smasala.com]
 */

/**
 * Firebrick suggestions engine
 * @module Firebrick.engine
 * @class Suggest
 */
define(["jquery", "firebrick"], function($){
	"use strict";
	
	return Firebrick.define("Firebrick.ui.engines.Suggest", {
		/**
		 * @property store
		 * @type {Firebrick.store.Base}
		 * @default null
		 */
		store: null,
		/**
		 * local | remote
		 * @property mode
		 * @type {String}
		 * @default "local"
		 */
		mode: "local",
		/**
		 * @property _cache
		 * @private
		 * @type {Object}
		 */
		_cache: null,
		/**
		 * set this property if you wish to find matches for a certain property
		 * {name:"Steven", age: 10} - searchKey = "age" will result in all queries searching the age property
		 * set as null|false if you want to search in all properties (if data is an object and not primitive value)
		 * @property searchKey
		 * @type {String | Array of Strings | null | false}
		 * @default null;
		 */
		searchKeys: null,
		/**
		 * used to prefetch data on init
		 * @property prefetch
		 * 	 .url {String}
		 * @type {Object}
		 * @default null
		 */
		prefetch: null,
		/**
		 * @method init
		 */
		init: function(){
			var me = this;
			me._initCache();
		},
		/**
		 * @method _initCache
		 */
		_initCache: function(){
			var me = this;
			me._cache = {};
		},
		/**
		 * clears cache (search indexes)
		 * @method clear
		 */
		clear: function(){
			me._initCache();
		},
		/**
		 * used to filter out items in when performing a query
		 * @method filter
		 * @param value {Value Object}
		 * @return {Boolean}
		 */
		filter: function(){
			return true;
		},
		/**
		 * @method query
		 * @param query {String}
		 * @param callback {Function}
		 */
		query: function(query, callback){
			var me = this,
				matches = [],
				data,
				ajax;
			
			if(me.store){
				if( me.mode === "remote" ){
					me.store.load({
						suggest:{
							query: query
						},
						callback: function(data){
							matches = me._query(query, me.store.toPlainObject());
							callback( matches );
						}
					});
				}else if( me.mode === "local" ){
					if(!me._cache[query]){
						matches = me._query(query, me.store.toPlainObject());
					    me._cache[query] = matches;
					}else{
						data = me._cache[query];
						matches = me._cache[query].filter( function(){
							return me.filter.apply(me, arguments);
						});
					}
					
					callback( matches );
				}
			}
		},
		/**
		 * @method _query
		 * @param query {String}
		 * @param data {Array | JSON Object}
		 * @return matches {Array}
		 */
		_query: function(query, data){
			var me = this,
				matches = [],
				lookups,
				lukup,
				substrRegex = new RegExp(query, 'i'),
				it;

			for(var i = 0, l = data.length; i<l; i++){
		    	it = data[i];
		    	if( me.filter(it) ){
		    		lookups = me._getSearchStrings( it );
		    		for(var ii = 0, ll = lookups.length; ii<ll; ii++){
				    	//search for a match
		    			lukup = lookups[ii];
		    			//check for Knockout observables - maybe needed if store is defined for data
		    			lukup = $.isFunction( lukup ) ? lukup() : lukup;
				    	if( substrRegex.test( lukup ) ){
				    		matches.push(it);
				    		//break lookups loop
				    		break;
				    	}
		    		}
		    			
		    	}
		    }
			
			return matches;
		},
		/**
		 * returns an array of all the data which can be tested by the query method
		 * @method _getSearchStrings
		 * @param value {Any} query iteration value
		 * @return {Array}
		 */
		_getSearchStrings: function( value ){
			var me = this,
				searchKeys = me.searchKeys,
				str = [],
				sk;

			//e.g. value = {text:"Java", desc:"some kinda of programming language", icon:"java.png"}
			if( $.isPlainObject(value) ){
				//searchKeys !== null
				if(searchKeys){
					//searchKeys === ["text", "desc"];
					if( $.isArray( searchKeys ) ){
						for(var i = 0, l = searchKeys.length; i<l; i++){
							sk = searchKeys[i];
							if( value.hasOwnProperty( sk ) ){
								str.push( value[sk] );	
							}
						}
					}else{
						if( value.hasOwnProperty( searchKeys ) ){
							str.push( value[searchKeys] );	
						}
					}
				}else{
					//searchKeys === null. get all
					for(var key in value){
						if( value.hasOwnProperty(key) ){
							str.push( value[key] );
						}
					}
				}
			}else{
				//value === primitive type, string, int, boolean etc
				str.push( value );
			}
			
			return str;
		}
	});
	
});