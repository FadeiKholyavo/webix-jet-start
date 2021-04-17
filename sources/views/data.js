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
					body:	new Datatable(this.app, "", ["Country"], countries)
				},
				{
					header: "Statuses",
					body:	new Datatable(this.app, "", ["Status","Icon"], statuses)
				},
			]
		};
	}
}
