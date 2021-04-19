import {JetView} from "webix-jet";
import {contacts} from "../models/contacts.js";
import ContactsForm from "./contacts-form.js";

export default class СontactsView extends JetView{
	config(){
		return {
			cols:[
				{					
					view:"list",
					localId: "contactsList",
					select:true,
					template: "<span><b>#id#. #Name#</b><br>Email: #Email#,<br> Country: #Country# <br> Status: #Status#</span>",
					type:{
						height: "auto"
					}
				},
				ContactsForm
			]
		};
	}
	init(){
		this.$$("contactsList").parse(contacts);
	}
}