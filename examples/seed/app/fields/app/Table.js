define(["Firebrick.ui/table/Table"], function(){
	return Firebrick.define("MyApp.fields.app.Table", {
		extend: "Firebrick.ui.table.Table",
		uiName:"ui-app-table",
		data:"tableData"
	});
});