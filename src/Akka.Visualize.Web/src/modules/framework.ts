export class NodeInfo{
	Path: string;
	Name: string;

	Type: string;
	TypeName: string;
	
	IsLocal: boolean;
	IsTerminated: boolean;
	NoOfMessages: boolean;
	
	Router: RouteInfo;
}

export class RouteInfo{
	Pool: boolean;
	Type: string;
	NrOfInstances: number;
}

export class QueryResult{
	Path: string;
	Children: Array<NodeInfo>;
}

