import {bindable, customElement} from 'aurelia-framework';

@customElement('wait-overlay')
export class WaitOverlay{
	@bindable title: string;
	@bindable size: string;
	
	constructor(){
		this.title = "Loading ...";
		this.size = '';
	}
}