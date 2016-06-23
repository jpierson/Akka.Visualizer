import {autoinject, bindable} from 'aurelia-framework';

import * as F from '../modules/framework';
import {VisualizeService} from '../modules/services/visualizeservice';
import {VisJS} from '../components/visjs/visjs';

@autoinject()
export class ViewGraph {
	visualizeService: VisualizeService;
	visjs: VisJS;

	constructor(visualizeService: VisualizeService) {
		this.visualizeService = visualizeService;
	}

	attached() {
	}

	reload() {
		this.visjs.reload();
	}
}