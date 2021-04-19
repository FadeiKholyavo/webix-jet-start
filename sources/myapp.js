import "./styles/app.css";
import {JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import State from "./helpers/state.js";

export default class MyApp extends JetApp{
	constructor(config){
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			router 	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: !PRODUCTION,
			start 	: "/top/contacts"
		};

		super({ ...defaults, ...config });
	}
}

if (!BUILD_AS_MODULE){
	if (!BUILD_AS_MODULE){
		webix.ready(() => {
			const app = new MyApp();
			app.use(plugins.Locale);
			app.setService("state", new State(app));
			app.render();
		
		});
	}
}