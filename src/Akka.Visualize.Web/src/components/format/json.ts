import {inject, customElement, containerless, bindable} from 'aurelia-framework';

@customElement('json')
@containerless()
export class Json{
	@bindable model: any;
	
	refresh(){
		var temp = this.model;
		this.model = null;
		setTimeout(()=>{
			this.model = temp;
		}, 20);
	}
}