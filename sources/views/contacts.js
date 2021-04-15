import {JetView} from "webix-jet";
import {contacts} from "../models/contacts.js";

export default class СontactsView extends JetView{
	config(){
		return {
			cols:[
				{					
					view:"datatable",
					scroll: "y",
					columns: [
						{id: "id", header: {text: "id", css:"datatable_header"}, css:"datatable_header", width: 50},
						{id: "Name", header: "Name", width: 200},
						{id: "Email", header: "Email", fillspace: true},
						{id: "Status", header:{text: "Status", css:"datatable_header"}, css:"datatable_header", width: 100},
						{id: "Country", header:{text: "Country", css:"datatable_header"}, css:"datatable_header", width: 100},
					]	
				},
				{}
			]
		};
	}
	init(view){
		view.queryView("datatable").parse(contacts);
	}
}