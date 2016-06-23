import {Aurelia} from 'aurelia-framework';
import {bootstrap} from 'aurelia-bootstrapper-webpack';

import 'bootstrap';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';

import '../node_modules/vis/dist/vis.js';
import '../node_modules/vis/dist/vis.css';

import '../styles/styles.css';
import '../styles/visualize.less';

bootstrap((aurelia: Aurelia): void => {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
	
	.feature('components/format')
	.feature('components/panel')
	.feature('components/wait-overlay')
	
	.feature('components/visjs')
	;

	const rootElem = document.body;
	aurelia.start().then(() => aurelia.setRoot('app', rootElem));
	rootElem.setAttribute('aurelia-app', '');
});
