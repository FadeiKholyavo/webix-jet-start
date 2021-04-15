import {JetView} from "webix-jet";
import Datatable from "./common.js";

export default class DataView extends JetView{
	config(){
		return { 
			view:"tabview",
			cells: [
				{
				  header: "Countries",
				  body: {
					  cols:[
							new Datatable(this.app, "", {
								id: "countriesDatatable",
								columns: [
									{id: "id", header: {text: "id", css:"datatable_header"}, css:"datatable_header", width: 70},
									{id: "Name", header: "Name", fillspace:true},
									{id:"delete", header: "", template:"{common.trashIcon()}", width: 60}
								],
								onClick: {
									"wxi-trash":(e, id) =>{
										this.deleteItem($$("countriesDatatable"), $$("countriesForm"), id);
										return false;
									}
								},
							}),
							{
								view: "form",
								id: "countriesForm",
								width: 300,
								elements:[
									{
										view: "template",
										template: "edit country",
										type: "section",
										css: "section-font-size"
									},
									{ 
										view: "text",
										label: "Country",
										name: "Name",
										invalidMessage: "Enter the country name "
									},
									{
										cols:[
											{ 
												view: "button", 
												value: "Save",
												css: "webix_primary",		
												click: () => {
													this.saveData($$("countriesDatatable"), $$("countriesForm"));
												}						
											},
											{ 
												view: "button", 
												value: "Clear",
												click: () => {
													this.clearForm($$("countriesDatatable"), $$("countriesForm"));
												}	
											},
											{ 
												view: "button", 
												value: "Unselect",
												click: () => {
													this.unselectItem($$("countriesDatatable"));
												}
											}
										]
									},
									{}
								],
								rules:{
									Name: function(value){
										return webix.rules.isNotEmpty(value) && !webix.rules.isNumber(value);
									},
								}
							}
					  ]
				  }
				},
				{
					header: "Statuses",
					body: {
						cols:[
							new Datatable(this.app, "", {
								id: "statusesDatatable",
								columns: [
									{id: "id", header: {text: "id", css:"datatable_header"}, css:"datatable_header", width: 70},
									{id: "Name", header: "Name", fillspace:true},
									{id: "Icon", header:{text: "Icon", css:"datatable_header"}, css:"datatable_header", width: 100},
									{id:"delete", header: "", template:"{common.trashIcon()}", width: 60}
								 ],
								 onClick: {
									"wxi-trash":(e, id) =>{
										this.deleteItem($$("statusesDatatable"), $$("statusesForm"), id);
										return false;
									}
								},	
							  }),
							  {	
								  view: "form",
								  id: "statusesForm",
								  width: 300,
								  elements:[
									  {
										view: "template",
										template: "edit status",
										type: "section",
										css: "section-font-size"
									},
									{ 
										view: "text",
										label: "Status",
										name: "Name",
										invalidMessage: "Enter the status name"
									},
									{ 
										view: "text",
										label: "Icon",
										name: "Icon",
										invalidMessage: "Enter the icon name"
									},
									{
										cols:[
											{ 
												view: "button", 
												value: "Save",
												css: "webix_primary",			
												click: () => {
													this.saveData($$("statusesDatatable"), $$("statusesForm"));
												}					
											},
											{ 
												view: "button", 
												value: "Clear",
												click: () => {
													this.clearForm($$("statusesDatatable"), $$("statusesForm"));
												}		
											},
											{ 
												view: "button", 
												value: "Unselect",
												click: () => {
													this.unselectItem($$("statusesDatatable"));
												}	
											}
										]
									},
									{}
								  ],
								  rules:{
									Name: webix.rules.isNotEmpty,
									Icon: webix.rules.isNotEmpty
								}
							  }
							]
					}
				  },
			  ]
		  };
	}
	ready(){
		$$("countriesForm").bind($$("countriesDatatable"));
		$$("statusesForm").bind($$("statusesDatatable"));
	};	
	unselectItem(tableId){
		tableId.unselectAll();
	};
	clearForm(tableId,formId){
		const formItem = formId.getValues();
		const formItemId = formItem.id;
		webix.confirm({
			title: "Form cleaning",
			text: "Do you realy want to clean up the form?"
		}).then(
			function(){
				formId.clear();
				formId.clearValidation();
			}
		)
	};
	saveData(tableId,formId){

		if(formId.validate()){
			
			const formItem = formId.getValues();
			const formItemId = formItem.id;
			
			if(formId.isDirty()){
				//Protection against XSS
				formItem.Name = webix.template.escape(formItem.Name);
				formItem.Icon = formItem.Icon ? webix.template.escape(formItem.Icon): "";
	
				if(tableId.exists(formItemId)){
	
					formId.save();
	
				}else{

					formId.save(formItem);		

				};
	
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
	};
	deleteItem(tableId, formId, tablelItemId){
		webix.confirm({
			title: "Country deleting",
			text: "Do you really want to delete this country information"
		}).then(
			function(){
				const formItemId = formId.getValues().id;
	
				tableId.remove(tablelItemId);

				if(formItemId == tablelItemId.row){
					formId.clear();
				}
			}
		)
	}
}