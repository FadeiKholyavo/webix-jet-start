import {JetView} from "webix-jet";

export default class CommonDatatableView extends JetView {
	constructor(app, name, settings){
		super(app, name); 
		this.tableSettings = settings;
		this.formSettings = settings;
	}
	config(){

		const columns = this.tableSettings.columns;
			
		const datatable = webix.extend({
			view:"datatable",
			scroll: "y",
			select: true,
			localId: "datatable",
			hover: "datatable-hover",
			columns: columns,
			onClick: {
				"wxi-trash":(e, id) =>{
					this.deleteItem(this.$$("datatable"),this.$$("form"), id);
					return false;
				}
			}
		}, this.tableSettings);

		const elements = this.formSettings.fields;

		elements.push({			
			cols:[
				{ 
					view: "button", 
					value: "Save",
					css: "webix_primary",		
					click: function(){
						this.$scope.saveData(this.$scope.$$("datatable"),this.$scope.$$("form"));
					}						
				},
				{ 
					view: "button", 
					value: "Clear",
					click: function(){
						this.$scope.clearForm(this.$scope.$$("form"));
					}	
				},
				{ 
					view: "button", 
					value: "Unselect",
					click: function(){
						this.$scope.$$("datatable").unselectAll();
					}
				}
			]
		});
		elements.push({});
		const form = webix.extend({
			view:"form",
			localId: "form",
			width: 300,
			elements: elements,
			rules: this.formSettings.rules
			

		}, this.formSettings);

		return {cols:[
			datatable,
			form
		]};
	}
	ready(){
		this.$$("form").bind(this.$$("datatable"));
	}
	clearForm(form){
		webix.confirm({
			title: "Form cleaning",
			text: "Do you realy want to clean up the form?"
		}).then(
			function(){
				form.clear();
				form.clearValidation();
			}
		);
	}
	saveData(table,form){

		if(form.validate()){
			
			const formItem = form.getValues();
			const formItemId = formItem.id;
			
			if(form.isDirty()){
				//Protection against XSS
				formItem.Name = webix.template.escape(formItem.Name);
				formItem.Icon = formItem.Icon ? webix.template.escape(formItem.Icon): "";
	
				if(table.exists(formItemId)){
	
					form.save();
	
				}else{

					form.save(formItem);		

				}
	
				webix.message({
					text: "Validation is succsessful",
					type: "success",
					expire: 1000
				});
			}else{
				webix.message({
					text: "You have not edited the data",
					type: "info",
					expire: 1000
				});
			}	  
		}
	}
	deleteItem(table, form, tablelItemId){
		webix.confirm({
			title: "Country deleting",
			text: "Do you really want to delete this country information"
		}).then(
			function(){
				const formItemId = form.getValues().id;
	
				table.remove(tablelItemId);

				if(formItemId == tablelItemId.row){
					form.clear();
				}
			}
		);
	}
}

