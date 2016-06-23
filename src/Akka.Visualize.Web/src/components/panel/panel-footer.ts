import {inject, customElement, bindable, containerless} from 'aurelia-framework';

//@containerless
export class PanelFooter{
	@bindable class: string;
	
	constructor(){
		this.class = "text-right";
	}
}