export class LocalStorageService{
	save<T>(name: string, value: T){
		var json = null;

		if(value){
			json = JSON.stringify(value);
			localStorage.setItem(name, json);
		} else{
			localStorage.removeItem(name);
		}
	}

	load<T>(name: string){
		var json = localStorage.getItem(name);
		if(json){
			return <T>JSON.parse(json);
		}
		return null;
	}

	saveSession<T>(name: string, value: T){
		var json = null;

		if(value){
			json = JSON.stringify(value);
			sessionStorage.setItem(name, json);
		} else{
			sessionStorage.removeItem(name);
		}
	}

	loadSession<T>(name: string){
		var json = sessionStorage.getItem(name);
		if(json){
			return <T>JSON.parse(json);
		}
		return null;
	}
}