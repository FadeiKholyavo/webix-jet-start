import {JetView} from "webix-jet";
import {countries} from "../models/countries.js";
import {statuses} from "../models/statuses.js";

export default class CommonDatatableView extends JetView {
	constructor(app, name, settings){
		super(app, name); 
		this.settings = settings;
	}
	config(){
		const datable = webix.extend({
			view:"datatable",
            scroll: "y",
            select: true,
            hover: "datatable-hover",
		}, this.settings);
		
		return datable;
	}
    init(view){
        if(view.$scope.settings.id == "countriesDatatable"){
            view.parse(countries)
        }
        if(view.$scope.settings.id == "statusesDatatable"){
            view.parse(statuses)
        }
	}
}
