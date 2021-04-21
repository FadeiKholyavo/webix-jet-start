import {JetView} from "webix-jet";
import {contacts} from "../models/contacts.js";
import {countries} from "../models/countries.js";
import {statuses} from "../models/statuses.js";
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
							template: function(obj){
								return `<div class="item-justify">
											<span><b>${obj.id}. ${obj.Name}</b><br>
													Email: ${obj.Email},<br> 
													${_("Country")}: ${countries.getItem(obj.Country) && countries.getItem(obj.Country).Name || "1"} <br> 
													${_("Status")}: ${statuses.getItem(obj.Status) && statuses.getItem(obj.Status).Name || "1"}
											</span>
											<span class="webix_icon wxi-close"></span>
										</div>`;
							},
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
										Country: countries.getFirstId(),
										Email: "mail@mail.com",
										Status: statuses.getFirstId()
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
		webix.promise.all([
			countries.waitData,
			statuses.waitData
		]).then(()=>{
			this.contactsList.sync(contacts);
		});
	
		
		
	}
	urlChange(view, url){
		webix.promise.all([
			contacts.waitData,
			countries.waitData,
			statuses.waitData
		]).then(()=>{
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