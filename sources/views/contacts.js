import {JetView} from "webix-jet";
import {contacts} from "../models/contacts.js";
import ContactsForm from "./contacts-form.js";

export default class СontactsView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
		return {
			cols:[
				{
					rows:[
						{				
							view:"list",
							localId: "contactsList",
							select:true,
							template: `<div class="item-justify"><span><b>#id#. #Name#</b><br>Email: #Email#,<br> ${_("Country")}: #Country# <br> ${_("Status")}: #Status#</span><span class="webix_icon wxi-close"></span></div>`,
							type:{
								height: "auto"
							},
							on:{
								"onAfterSelect": (id) =>{
									this.setParam("user", id, true);
								}		
							},
							onClick: {
								"wxi-close":(e, id)=>{
									webix.confirm({
										title: "User deleting",
										text: "Do you really want to delete this user's information"
									}).then(()=>{
										const list = this.contactsList;
										contacts.remove(id);
										const newItemId = list.getSelectedId();
										if(!newItemId){
											this.app.show("/top/contacts");
										}
									}
									);
									return false;
								}
							},
						},
						{
							view: "button",
							value: "Add",
							css: "webix_primary",	
							click: () => {
								contacts.waitSave(function(){
									this.add({
										Name: "Name",
										Country: 1,
										Email: "mail@mail.com",
										Status: 1
									});
								}).then( obj =>{
									this.contactsList.select(obj.id);
								});
							}
						}
					]
				},
				ContactsForm
			]
		};
	}
	init(){
		this.contactsList = this.$$("contactsList");
		this.contactsList.sync(contacts);
	}
	urlChange(view, url){
		contacts.waitData.then(()=>{
			const id = url[0].params.user  ;
			if(!!id && contacts.exists(id)){
				this.contactsList.select(id);
			}
			else{
				this.contactsList.select(contacts.getFirstId());
			}
		});
	}
}