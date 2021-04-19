import {JetView} from "webix-jet";
import {contacts} from "../models/contacts.js";
import {countries} from "../models/countries.js";
import {statuses} from "../models/statuses.js";


export default class СontactsFormView extends JetView{
	config(){
		return {
				
			view: "form",
            localId: "contactsForm",
			width: 400,
			scroll: false,
			elements: [
				{
					view: "template",
					template: "edit user",
					type: "section",
					css: "section-font-size"
				},
				{ 
					view: "text",
					label: "Name",
					name: "Name",
					invalidMessage: "Enter the name"
				},
				{ 
					view: "text",
					label: "Email",
					name: "Email",
					invalidMessage: "Enter the email"
				},
				{ 
					view: "combo",
					label: "Status",
					name: "Status",
					invalidMessage: "Status cannot be empty",
                    options: statuses
				},
				{ 
					view: "combo",
					label: "Country",
					name: "Country",
					invalidMessage: "Country cannot be empty",
                    options: countries
				},
					{
						cols:[
						    { 
								view: "button", 
								value: "Save",
								css: "webix_primary",		
								click: () =>{
									this.saveData(this.getSubView().$$("contactsList"),this.$$("contactsForm"));
								}						
							},
							{ 
								view: "button", 
								value: "Clear",	
								click: () =>{
									this.clearForm(this.$$("contactsForm"));
								}	

							},
							{ 
								view: "button", 
								value: "Unselect",	
								click: ()=>{
									this.getSubView().$$("contactsList").unselectAll()
									this.setParam("user", "", true);
									this.$$("contactsForm").clear();
									
								}
							}
						]
					},
					{}
			],
			rules:{
				Name: webix.rules.isNotEmpty,
				Email: webix.rules.isEmail,
				Status: webix.rules.isNotEmpty,
				Country: webix.rules.isNotEmpty
			}	
		};
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
	
					contacts.updateItem(formItemId, formItem)
	
				}else{

					contacts.add(formItem)	

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
	clear(){
		this.$$("contactsForm").clear()
	}
}