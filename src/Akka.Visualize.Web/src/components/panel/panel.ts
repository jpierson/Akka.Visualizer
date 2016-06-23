import {inject, containerless, customElement, bindable} from 'aurelia-framework';
//import $ from 'bootstrap';

@customElement('panel')
@containerless
@inject(Element)
export class Panel{
	@bindable title: string;
	@bindable class: string = "";
	
	@bindable wait: string;
	
	element: any;

	constructor(element: Element) {
		this.element = element;
	}

	bind(bindingContext){
		(<any>this).$parent = bindingContext;
	}
}