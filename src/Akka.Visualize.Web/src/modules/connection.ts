import {bindable, autoinject} from 'aurelia-framework';
import {Logger} from 'aurelia-logging';
import {LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'isomorphic-fetch';

import {Url} from './url';

export class QueryInfo {
	Search: string;
	PageSize: number = 50;
	PageIndex: number = 0;
	Sort: string;
	Direction: string;	/* asc|desc */
	Columns: string;	/* list of columns to be retrieved (CSV) */

	constructor(pageIndex?: number, search?: string, pageSize?: number) {
		this.PageIndex = pageIndex || 0;
		this.Search = search;
		this.PageSize = pageSize || 50;
	}

	setPageSize(pageSize: number): QueryInfo {
		this.PageSize = pageSize;
		return this;
	}

	setExtraQuery(query: string): QueryInfo {
		if (query) {
			query.split("&").forEach(n=> {
				var kv = n.split("=");
				this[kv[0]] = kv[1];
			});
		}
		return this;
	}
}

// this is what the grid wants
export class GridResult<T>{
	data: T[];
	count: number;
}

export class QueryResult<T>{
	Total: number;
	Items: T[];
}

export class Req {
	name: string;
	url: string;
	constructor(name: string, url: string) {
		this.name = name;
		this.url = url;
	}
}

export interface RequestOptions{
	redirectOnError?: boolean,
	/// Avoid logging this call
	dontLog?: boolean
}

/** Endpoint router calling the server. Executes HttpCalls, Caching, Batching and standard Auth lifecycle */
@autoinject
export class HttpConnection {
	private httpClient: HttpClient;
	protected static logger: Logger = LogManager.getLogger("Server");

	authorizeHeader: () => string;

	constructor(httpClient: HttpClient) {
		this.httpClient = httpClient;
		
		this.httpClient.configure(config=>{
			config
        		.useStandardConfiguration()
        		.withBaseUrl('http://localhost:8085');
		});	
	}

	protected prepareUrl(path: string): Url {
		if (!path) {
			debugger;
			throw 'server called without a valid url';
		}

		path = 'api' + path;

		var u = new Url(path, "/");

		return u.cacheBust();
	}

	// https://github.com/github/fetch
	// private processResponse(response: Response, options?: RequestOptions): any {

	// 	if (response) {
	// 		var redirectOnError = (options ? options.redirectOnError : true);

	// 		// 200 - yey, server result
	// 		// 401 - Not Authorized
	// 		// 404 - Not Found (API is offline?)
	// 		// 500 - Server Error
	// 		switch (response.status) {
	// 			case 200:
	// 				return response.json();
	// 			case 401:	// not authorized - redirect to
	// 				// maybe come up with a better error handler?
	// 				HttpConnection.logger.error(`401 - Could not call (${response.type}) ${response.url}. Status ${response.status}`);
	// 				var error = new M.Message(null, "401", "Authorization Error");
	// 				this.current.lastError = error;

	// 				if(redirectOnError)
	// 				{
	// 					this.systemRoutes.redirectToAuth();
	// 				}
	// 				throw error;
	// 			case 404:
	// 				HttpConnection.logger.error(`404 - Could not call (${response.type}) ${response.url}. Status ${response.status}`);
	// 				// somehow report that the server is not available?
	// 				var error = new M.Message(null, "errors:connection_404");
	// 				this.current.lastError = error;

	// 				if(redirectOnError)
	// 				{
	// 					this.systemRoutes.redirectToErrorPage("404");
	// 				}
	// 				throw error;
	// 			case 500:	// should we retry somehow?
	// 			default:
	// 				HttpConnection.logger.error(`500 - Could not call (${response.type}) ${response.url}. Status ${response.status}`);
	// 				var r = new M.Messages();
	// 				r.addMessage(new M.Message(null, "Error", "Server reported an error while trying to process this request. Please wait and try again later or contact customer support.", MessageType.Error));
	// 				var error = new M.Message(null, response.status.toString(), "Error communicating with the server");
	// 				if(redirectOnError)
	// 				{
	// 					this.current.lastError = error;
	// 				}
	// 				throw error;
	// 		}
	// 	}

	// 	return
	// }

	/** Retrieve a resource from the server. This call might be delayed and batched */
	get<T>(path: string, constructor: any, options?: RequestOptions): Promise<T> {
		return this.getNow<T>(path, constructor, options);
	}
	getNow<T>(path: string, constructor: any, options?: RequestOptions): Promise<T> {
		var url = this.prepareUrl(path);

		if(!options||!options.dontLog)
		{
			HttpConnection.logger.info(`getNow ${url}`);
		}

		return new Promise<T>((resolve, reject) => {
			return this.httpClient
				.fetch(url.toString())
				//.then((r) => this.processResponse(r, options))
				.then(response=> {
					// todo  - handle 401 Auth and maybe other errors
					//var result = Serializer.deserialize<T>(response.statusText, constructor);
					//HttpConnection.logger.debug(`getNow ${url} - Finished!`);
					resolve(response.json());
				}).catch(e=> {
					HttpConnection.logger.error(`Error - Rejected ${url}: ${e}`);
					reject(e);
				});
		});
	}

	// /** Request a batch of items. Returns an object with the results */
	// batchGet(...batch: Req[]) {
	// 	var log = "";
	// 	var promises = [];

	// 	batch.forEach(b=> {
	// 		log = `${log} [${b.name}]=${b.url}`;
	// 		promises.push(this.get<M.Messages>(b.url, M.Messages));
	// 	})

	// 	HttpConnection.logger.info(`batchGet ${log}`);

	// 	return Promise.all(promises)
	// 		.then(results=> {
	// 			// results is the results in order
	// 			var result = {};
	// 			batch.forEach((b, i) => {
	// 				result[b.name] = results[i];
	// 			});

	// 			return result;
	// 		});
	// }


	// list<T>(path: string, constructor: any): Promise<T[]> {
	// 	let url = this.prepareUrl(path);
	// 	HttpConnection.logger.info("list " + url.toString());

	// 	return new Promise<T[]>((resolve, reject) => {
	// 		return this.httpClient
	// 			.fetch(url.toString(), { headers: { 'Authorization': this.authorizeHeader() } })
	// 			.then((r) => this.processResponse(r))
	// 			.then(response=> {
	// 				let result = <T[]>(response);
	// 				resolve(result);
	// 			}).catch(e=> {
	// 				HttpConnection.logger.error(`Error - Rejected ${url}: ${e}`);
	// 				reject(e);
	// 			});
	// 	});
	// }

	query<T>(path: string, constructor: any, query?: QueryInfo): Promise<QueryResult<T>> {
		if (!query)
			query = new QueryInfo();

		let url = this.prepareUrl(path);
		url.set(query);
		HttpConnection.logger.info("query " + url.toString());

		return new Promise<QueryResult<T>>((resolve, reject) => {
			return this.httpClient
				.fetch(url.toString(), {credentials: 'include'})
				//.then((r) => this.processResponse(r))
				.then(r=>{
					return r.json();
				})
				.then(response=> {
					let result = <QueryResult<T>>response;
					resolve(result);
				}).catch(e=> {
					HttpConnection.logger.error(`Error - Rejected ${url}: ${e}`);
					reject(e);
				});
		});
	}

	send<T, U>(path: string, entity: T, constructor: any): Promise<U> {
		var url = this.prepareUrl(path);
		var json = JSON.stringify(entity);

		HttpConnection.logger.info(`saving ${url}: ${json}`);

		return new Promise<U>((resolve, reject) => {
			return this.httpClient
				.fetch(url.toString(),
				{
					method: 'POST',
					headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
					body: json,
					//mode: 'no-cors',
					credentials: 'include'
				})
				.then(response=>{
					resolve(response.json());
				// })
				// //.then((r) => this.processResponse(r))
				// .then(response=> {
				// 	// check if this response contains some errors
				// 	var messages = <M.Messages>response;
				// 	if(M.MessagesUtils.HasIssues(messages)){
				// 		HttpConnection.logger.error(`saving ${url} returned issues: ${JSON.stringify(messages)}`);
				// 	}

				// 	resolve(response);
				}).catch(e=> {
					HttpConnection.logger.error(`Error - Rejected ${url}: ${e}. Send '${json}'`);
					reject(e);
				})
		});
	}
}
