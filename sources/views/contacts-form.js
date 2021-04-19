import {JetView} from "webix-jet";
import {contacts} from "../models/contacts.js";
import {countries} from "../models/countries.js";
import {statuses} from "../models/statuses.js";


export default class СontactsFormView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
		return {
			view: "form",
			localId: "contactsForm",
			width: 400,
			scroll: false,
			elements: [
				{
					view: "template",
					template: _("EditUser"),
					type: "section",
					css: "section-font-size"
				},
				{ 
					view: "text",
					label: _("Name "),
					name: "Name",
					invalidMessage: "Enter the name"
				},
				{ 
					view: "text",
					label: _("Email"),
					name: "Email",
					invalidMessage: "Enter the email"
				},
				{ 
					view: "combo",
					label: _("Status"),
					name: "Status",
					invalidMessage: "Status cannot be empty",
					options: {
						body: {
							template: "#Name#",
							data: statuses,	 
						}
					}
				},
				{ 
					view: "combo",
					label: _("Country"),
					name: "Country",
					invalidMessage: "Country cannot be empty",
					options: {
						body: {
							template: "#Name#",
							data: countries, 
						}
					}		
				},
				{
					cols:[
						{ 
							view: "button", 
							value: _("Save"),
							css: "webix_primary",		
							click: () =>{
								this.saveData(this.getSubView().contactsList,this.contactsForm);
							}						
						},
						{ 
							view: "button", 
							value: _("Clear"),	
							click: () =>{
								this.clearForm(this.contactsForm);
							}	

						},
						{ 
							view: "button", 
							value: _("Unselect"),	
							height: 45,
							click: ()=>{
								this.getSubView().contactsList.unselectAll();
								this.app.show("/top/contacts");
								this.contactsForm.clear();
									
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
	urlChange(view, url){
		if(!!url[0].params.user && contacts.exists(url[0].params.user)){
			const id = url[0].params.user;
			this.contactsForm.setValues(contacts.getItem(id));
		}else{
			this.contactsForm.clear();
		}
	}
	clearForm(form){
		const list = this.getSubView().contactsList;
		webix.confirm({
			title: "Form cleaning",
			text: "Do you realy want to clean up the form?"
		}).then(
			function(){
				const id = form.getValues().id;
				form.clear();
				if(id == list.getSelectedId()){
					form.setValues({id: id });
				}
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
	
					contacts.updateItem(formItemId, formItem);
	
				}else{

					contacts.add(formItem);	

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
	get contactsForm(){
		return this.$$("contactsForm");
	}
}