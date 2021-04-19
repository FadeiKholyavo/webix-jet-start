import {JetView} from "webix-jet";
import {contacts} from "../models/contacts.js";
import ContactsForm from "./contacts-form.js";

export default class СontactsView extends JetView{
	config(){
		return {
			cols:[
				{					
					view:"list",
					localId: "contactsList",
					select:true,
					template: "<div class=\"item-justify\"><span><b>#id#. #Name#</b><br>Email: #Email#,<br> Country: #Country# <br> Status: #Status#</span><span class=\"webix_icon wxi-close\"></span></div>",
					type:{
						height: "auto"
					},
					on:{
						"onItemClick": (id) =>{
							this.setParam("user", id, true);
						}
					},
					onClick: {
						"wxi-close":(e, id)=>{
							webix.confirm({
								title: "User deleting",
								text: "Do you really want to delete this user's information"
							}).then(()=>{
									const list = this.$$("contactsList");
									contacts.remove(id);
									const newItemId = Object.keys(list.data.pull)[0];
									if(!newItemId){
										this.app.show("/top/contacts")
									}else{
										this.setParam("user", newItemId, true);
										list.select(newItemId);
									}

								}
							)
							return false;
						}
					},
				},
				ContactsForm
			]
		};
	}
	init(){
		this.$$("contactsList").parse(contacts);
	}
	ready(view, url){
		if(!!url[0].params.user && contacts.exists(url[0].params.user)){
			this.$$("contactsList").select(url[0].params.user)
		}else{
			this.setParam("user", 1, true);
			this.$$("contactsList").select(1)
		}
	}
}