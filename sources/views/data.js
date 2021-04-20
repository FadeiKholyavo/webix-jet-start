import {JetView} from "webix-jet";
import Datatable from "./common.js";
import {countries} from "../models/countries.js";
import {statuses} from "../models/statuses.js";

export default class DataView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
		return { 
			view:"tabview",
			cells: [
				{
					header: _("Countries"),
					body:	new Datatable(this.app, "", ["Name"], countries)
				},
				{
					header: _("Statuses"),
					body:	new Datatable(this.app, "", ["Name","Icon"], statuses)
				},
			]
		};
	}
}
