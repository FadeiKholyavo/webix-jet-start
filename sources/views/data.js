import {JetView} from "webix-jet";
import Datatable from "./common.js";
import {countries} from "../models/countries.js";
import {statuses} from "../models/statuses.js";

export default class DataView extends JetView{
	config(){
		return { 
			view:"tabview",
			cells: [
				{
					header: "Countries",
					body:{
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
										this.deleteItem(webix.$$("countriesDatatable"), webix.$$("countriesForm"), id);
										return false;
									}
								},
								data: countries
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
												click: function(){
													this.$scope.saveData(webix.$$("countriesDatatable"), webix.$$("countriesForm"));
												}						
											},
											{ 
												view: "button", 
												value: "Clear",
												click: function(){
													this.$scope.clearForm(webix.$$("countriesForm"));
												}	
											},
											{ 
												view: "button", 
												value: "Unselect",
												click: function(){
													webix.$$("countriesDatatable").unselectAll();
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
										this.deleteItem(webix.$$("statusesDatatable"), webix.$$("statusesForm"), id);
										return false;
									}
								},	
								data: statuses
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
												click: function(){
													this.$scope.saveData(webix.$$("statusesDatatable"), webix.$$("statusesForm"));
												}					
											},
											{ 
												view: "button", 
												value: "Clear",
												click: function(){
													this.$scope.clearForm(webix.$$("statusesForm"));
												}		
											},
											{ 
												view: "button", 
												value: "Unselect",
												click: function(){
													webix.$$("statusesDatatable").unselectAll();
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
		webix.$$("countriesForm").bind(webix.$$("countriesDatatable"));
		webix.$$("statusesForm").bind(webix.$$("statusesDatatable"));
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