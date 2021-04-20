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
								"onSelectChange": (id) =>{
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
							click: () => {
								const id = contacts.add({
									Name: "Name",
									Country: 1,
									Email: "mail@mail.com",
									Status: 1
								});
								this.contactsList.select(id);
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
		this.contactsList.parse(contacts);
	}
	urlChange(view, url){
		
		const id = url[0].params.user;
		if(!!id && contacts.exists(id)){
			this.contactsList.select(id);
		}else{
			const contactId = contacts.getFirstId();
			this.setParam("user", contactId, true);
			this.contactsList.select(contactId);
		}
	}
}