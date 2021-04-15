import {JetView} from "webix-jet";
import {contacts} from "../models/contacts.js";

export default class СontactsView extends JetView{
	config(){
		return {
			cols:[
				{					
					view:"list",
					select:true,
					template: "<span><b>#id#. #Name#</b><br>Email: #Email#,<br> Country: #Country# <br> Status: #Status#</span>",
					type:{
						height: "auto"
					}
				},
				{
					view: "form",
					width: 300,
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
							name: "name",
							invalidMessage: "Enter the title of the movie"
						},
						{ 
							view: "text",
							label: "Email",
							name: "email",
							invalidMessage: `Year isn't between 1970 - ${new Date().getFullYear()}`
						},
						{ 
							view: "text",
							label: "Status",
							name: "status",
							invalidMessage: "Rating cannot be empty or 0"
						},
						{ 
							view: "text",
							label: "Country",
							name: "country",
							invalidMessage: "Votes must be less than 100000"
						},
						{
							cols:[
								{ 
									view: "button", 
									value: "Save",
									css: "webix_primary",							
								},
								{ 
									view: "button", 
									value: "Clear",	
								},
								{ 
									view: "button", 
									value: "Unselect",	
								}
							]
						},
						{}
					],
					rules:{
						name: webix.rules.isNotEmpty,
						email: [webix.rules.isNotEmpty, webix.rules.isEmail],
						status: webix.rules.isNumber,
						country: webix.rules.isNotEmpty
					}
				}
				]
			};
		}
	init(view){
		view.queryView("list").parse(contacts);
	}
}