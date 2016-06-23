import {bindable, inject, autoinject} from 'aurelia-framework';
import {Logger} from 'aurelia-logging';
import {LogManager} from 'aurelia-framework';

import * as F from '../framework';
import * as C from '../connection';

@autoinject()
export class VisualizeService{	
	private httpConnection: C.HttpConnection;
	
	constructor(httpConnection: C.HttpConnection){
		this.httpConnection = httpConnection;
	}
	
	list(path: string, page: number, pageSize: number): Promise<F.QueryResult>{
		var q = new C.QueryInfo(page, "", pageSize);
		
		return this.httpConnection
			.get<F.QueryResult>(`/visualize/list?path=${path}`, F.QueryResult, q)
			.then(r=>{
				
				return r;
			});
	}
	
	send(path: string, messageType: string): Promise<string>{
		return this.httpConnection
			.get<string>(`/visualize/send?path=${path}&messageType=${messageType}`, String)
			.then(r=>{
				return r;
			});
	}
}