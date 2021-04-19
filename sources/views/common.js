import {JetView} from "webix-jet";


export default class CommonDatatableView extends JetView {
	constructor(app, name, settings, data){
		super(app, name); 
		this.settings = settings;
		this.data = data;
		this._ = this.app.getService("locale")._;
	}
	config(){		
		const datatable = {
			view:"datatable",
			scroll: "y",
			select: true,
			localId: "datatable",
			hover: "datatable-hover",
			columns:[],
			onClick: {
				"wxi-trash":(e, id) =>{
					this.deleteItem(this.datatable,this.form, id);
					return false;
				}
			}
		};

		this.addColumns(datatable);
		
		const form = {
			view:"form",
			localId: "form",
			width: 400,
			elements: [],
			rules:{}
		};

		this.addFields(form);

		return {cols:[
			datatable,
			form
		]};
	}
	init(){
		this.datatable.parse(this.data);
	}
	ready(){
		const dataTable = this.datatable;

		dataTable.config.columns.push(
			{ 
				id:"delete", 
				header: "", 
				template:"{common.trashIcon()}", 
				width: 60
			}
		);
		dataTable.refreshColumns();
		this.form.bind(dataTable);
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
			text: "Do you really want to delete this information"
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
	addFields(form){
		form.elements.push({
			view: "template",
			template: this._("EditData"),
			type: "section",
			css: "section-font-size"
		});

		this.settings.forEach( el =>{
			form.rules[el] = webix.rules.isNotEmpty;
			form.elements.push({
				view: "text",
				label: this. _(el),
				name: el,
				invalidMessage: `Enter the ${el.toLowerCase()}`,
			});
		});
		form.elements.push({			
			cols:[
				{ 
					view: "button", 
					value: this._("Save"),
					css: "webix_primary",		
					click: () => {
						this.saveData(this.datatable,this.form);
					}						
				},
				{ 
					view: "button", 
					value: this._("Clear"),
					click: () => {
						this.clearForm(this.form);
					}	
				},
				{ 
					view: "button", 
					value: this._("Unselect"),
					height: 45,
					click: () => {
						this.datatable.unselectAll();
					}
				}
			]
		});
		form.elements.push({});
	}
	addColumns(datatable){
		datatable.columns = Object.keys(this.data[0]).map(key => {
			return				{ 
				id: key, 
				header: this._(key), 
				fillspace: true
			};
		});
	}
	get datatable(){
		return this.$$("datatable");
	}
	get form(){
		return this.$$("form");
	}
}

