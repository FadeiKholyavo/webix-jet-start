import {JetView} from "webix-jet";

export default class setSubView extends JetView{
	config(){
		return {
			rows:[
				{},
				{           
					view:"segmented", 
					value:1, 
					align: "center",
					options:[
						{ id:"1", value:"English" }, 
						{ id:"2", value:"Russian" }, 
					],
					inputWidth: 400,
					label: "Language:"},
                    
				{}
			]
		};   
	}
}