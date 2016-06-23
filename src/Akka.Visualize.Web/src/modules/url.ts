import * as $ from 'jquery';

export class Url{
	baseUrl: string;
	path: string;

	queryParams: {} = {};

	constructor(path: string, baseUrl?: string){
		this.baseUrl = baseUrl || '/';
		this.parseQueryFromPath(path);
	}

	private parseQueryFromPath(p: string){
		this.queryParams = {};	// new query params
		if(p){
			var question = p.indexOf("?");
			if(question != -1){
				this.path = p.substring(0, question);
				var query =p.substring(question+1);
				if(query){
					query.split("&").forEach(n=>{
						var kv = n.split("=");
						if(kv && kv.length > 0 && kv[0])
							this.queryParams[kv[0]] = kv[1];
					});
				}
				return;
			}
		}
		this.path = p;
	}

	toString(){
		var q = "";
		for(var n in this.queryParams){
			var v = this.queryParams[n];
			if(typeof v == "function")
				continue;	// ignore function

			q += encodeURIComponent(n) + '=' + encodeURIComponent(this.queryParams[n]) + "&";
		}

		var url = this.baseUrl + this.path;
		if(q)
			url = url + "?" + q;

		return url;
	}

	static cacheBustValue(): string{
		return Math.floor((Math.random() * 1000000000) + 1).toString()
	}
	cacheBust(): Url{
		this.set("_", Url.cacheBustValue());
		return this;
	}

	set(name: string | any, value?: string) : Url{
		if(!name)
			return this;

		var jq = <any>$;

		if(typeof name === 'string')
			this.queryParams[name] = value;
		else
			this.queryParams = jq.extend(this.queryParams, name);

		return this;
	}

	remove(name: string){
		this.queryParams[name] = undefined;
		return this;
	}
}