define(["jquery", "./Table", "jquery-treetable"], function($){
	return Firebrick.define("Firebrick.ui.table.TreeTable", {
		extend:"Firebrick.ui.table.Table",
		uiName: "fb-ui-treetable",
		data:"treeTableData",
		treetable:true
	});
});