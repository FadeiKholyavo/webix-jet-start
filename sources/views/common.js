import {JetView} from "webix-jet";

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
}
