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
	ready(view, url){
		if(!!url[0].params.user && contacts.exists(url[0].params.user)){
			this.$$("contactsList").select(url[0].params.user)
		}else{
			this.setParam("user", 1, true);
			this.$$("contactsList").select(1)
		}
	}
}