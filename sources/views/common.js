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
					this.deleteItem(id);
					return false;
				}
			}
		};


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
		this.datatable = this.$$("datatable");
		this.form = this.$$("form");
		this.data.waitData.then(()=>{
			this.datatable.parse(this.data);	
			this.addColumns(this.datatable);
		});
	}
	ready(){
		this.form.bind(this.datatable);
	}
	clearForm(){
		const form = this.form;
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
	saveData(){
		const form = this.form;
		const table = this.datatable;

		if(form.validate()){
			
			const formItem = form.getValues();
			const formItemId = formItem.id;
			
			
			if(form.isDirty()){
				//Protection against XSS
				formItem.Name = webix.template.escape(formItem.Name);
				formItem.Icon = formItem.Icon ? webix.template.escape(formItem.Icon): "";

				if(table.exists(formItemId)){

					this.data.updateItem(formItemId,formItem);

				}else{

					this.data.add(formItem);	

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
	deleteItem(tablelItemId){
		const form = this.form;
		const table = this.datatable;
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
						this.saveData();
					}						
				},
				{ 
					view: "button", 
					value: this._("Clear"),
					click: () => {
						this.clearForm();
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
	
		const data = this.data.getItem(this.data.getFirstId());
			
		datatable.config.columns = Object.keys(data).filter(key =>{
			return key != "Code";
		}).map(key => {
			return{ 
				id: key, 
				header: this._(key), 
				fillspace: true
			};
		});
	
		datatable.config.columns.push(
			{ 
				id:"delete", 
				header: "", 
				template:"{common.trashIcon()}", 
				width: 60
			}
		);
		datatable.refreshColumns();
	}
}

