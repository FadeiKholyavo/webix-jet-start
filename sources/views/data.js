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
					body:	new Datatable(this.app, "", {
						columns:[
							{id: "id", header: {text: "id", css:"datatable_header"}, css:"datatable_header", width: 70},
							{id: "Name", header: "Name", fillspace:true},
							{id:"delete", header: "", template:"{common.trashIcon()}", width: 60}
						],
						fields: [
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
						],
						rules:{
							Name: function(value){
								return webix.rules.isNotEmpty(value) && !webix.rules.isNumber(value);
							}
						},
						data: countries
					}
					),
				},
				{
					header: "Statuses",
					body:	new Datatable(this.app, "", {	
						columns:[
							{id: "id", header: {text: "id", css:"datatable_header"}, css:"datatable_header", width: 70},
							{id: "Name", header: "Name", fillspace:true},
							{id: "Icon", header:{text: "Icon", css:"datatable_header"}, css:"datatable_header", width: 100},
							{id:"delete", header: "", template:"{common.trashIcon()}", width: 60}
						],
						fields: [
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
						],
						rules:{
							Name: webix.rules.isNotEmpty,
							Icon: webix.rules.isNotEmpty
						},
						data: statuses
					}
					),
				},
			]
		};
	}
}
