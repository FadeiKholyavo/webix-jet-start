import {JetView} from "webix-jet";


export default class CommonDatatableView extends JetView {
	constructor(app, name, settings, data){
		super(app, name); 
		this.settings = settings;
		this.data = data;
	}
	config(){		
		const _ = this.app.getService("locale")._;
		const datatable = {
			view:"datatable",
			scroll: "y",
			select: true,
			localId: "datatable",
			hover: "datatable-hover",
			columns:[],
			onClick: {
				"wxi-trash":(e, id) =>{
					this.deleteItem(this.getDatatable(),this.getForm(), id);
					return false;
				}
			}
		};

		this.addColumns(datatable, _);
		
		const form = {
			view:"form",
			localId: "form",
			width: 400,
			elements: [],
			rules:{}
		};

		this.addFields(form, _);

		return {cols:[
			datatable,
			form
		]};
	}
	init(){
		this.getDatatable().parse(this.data);
	}
	ready(){
		const dataTable = this.getDatatable();

		dataTable.config.columns.push(
			{ 
				id:"delete", 
				header: "", 
				template:"{common.trashIcon()}", 
				width: 60
			}
		);
		dataTable.refreshColumns();
		this.getForm().bind(dataTable);
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
	addFields(form, _){
		form.elements.push({
			view: "template",
			template: _("EditData"),
			type: "section",
			css: "section-font-size"
		});

		this.settings.forEach( el =>{
			form.rules[el] = webix.rules.isNotEmpty;
			form.elements.push({
				view: "text",
				label: _(el),
				name: el,
				invalidMessage: `Enter the ${el.toLowerCase()}`,
			});
		});
		form.elements.push({			
			cols:[
				{ 
					view: "button", 
					value: _("Save"),
					css: "webix_primary",		
					click: () => {
						this.saveData(this.getDatatable(),this.getForm());
					}						
				},
				{ 
					view: "button", 
					value: _("Clear"),
					click: () => {
						this.clearForm(this.getForm());
					}	
				},
				{ 
					view: "button", 
					value: _("Unselect"),
					height: 45,
					click: () => {
						this.getDatatable().unselectAll();
					}
				}
			]
		});
		form.elements.push({});
	}
	addColumns(datatable, _){
		datatable.columns = Object.keys(this.data[0]).map(key => {
			return				{ 
				id: key, 
				header: _(key), 
				fillspace: true
			};
		});
	}
	getDatatable(){
		return this.$$("datatable");
	}
	getForm(){
		return this.$$("form");
	}
}

