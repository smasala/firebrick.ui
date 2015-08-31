/*!
 * @author Steven Masala [me@smasala.com]
 */

define(["jquery","./Items","Firebrick.ui/nav/Toolbar"],function(e){"use strict";return Firebrick.define("Firebrick.ui.common.mixins.Toolbars",{_toolbarDefaults:{navbarItem:!0},toolbars:null,toolbarContainer:function(t){var n=this,r;if(n.toolbars&&e.isArray(n.toolbars)){t.css["'fb-ui-toolbar-container'"]=!0;for(var i=0,s=n.toolbars.length;i<s;i++)r=n.toolbars[i].position,r&&(t.css[n.parseBind("fb-ui-toolbar-"+r)]=!0)}return t},getToolbars:function(){var t=this,n=t.toolbars,r,i="",s;if(n)if(e.isArray(n))for(var o=0,u=n.length;o<u;o++)r=n[o],r.items?(r.sName="nav.toolbar",r.defaults=Firebrick.utils.overwrite(t._toolbarDefaults,r.defaults||{}),s=t._getItems(r),i+=s.html,t.toolbars[o]=s.items[0]):console.warn("a toolbar was found without the items property and didn't render");else console.warn("unable to load toolbars for this panel",t,"toolbars property must be an array of objects");return i}})});