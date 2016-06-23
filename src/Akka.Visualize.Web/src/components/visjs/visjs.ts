import {autoinject, customElement, containerless, bindable} from 'aurelia-framework';

import * as F from '../../modules/framework';
import {VisualizeService} from '../../modules/services/visualizeservice';

import * as D from 'demotest';
import * as v from 'vis';

@customElement('visjs')
@containerless()
@autoinject()
export class VisJS {
	visualizeService: VisualizeService;

	visv: any;
	vControl: HTMLElement;
	network: any;

	popup: any;
	jPopup: any;

	// file:///E:/Projects/Akka/akka.visualize/src/Akka.Visualize.Web/node_modules/vis/docs/data/dataset.html
	nodes: any;
	edges: any;

	currentNode: F.NodeInfo;

	constructor(visualizeService: VisualizeService) {
		this.visualizeService = visualizeService;
	}

	attached() {
		var vis = <any>v;

		this.jPopup = <any>$(this.popup);
		//this.jPopup.hide();

		this.nodes = new vis.DataSet([
			{ id: "/", label: 'akka' }
		]);

		// create an array with edges
		this.edges = new vis.DataSet([

		]);

		// create a network
		var container = this.vControl;
		var data = {
			nodes: this.nodes,
			edges: this.edges
		};

		var poolColors = { background: 'cyan', border: 'white' };
		var options = {
			physics: {
				enabled: true,
				maxVelocity: 3,
				minVelocity: 3
			},
			nodes: {
				shape: 'box',
				borderWidth: 2,
				shadow: true
			},
			edges: {
				smooth: {
					type: 'cubicBezier',
					forceDirection: 'horizontal',
					roundness: 0.4
				}
			},
			layout: {
				hierarchical: {
					direction: 'LR'
				}
			},
			interaction: {
				hover: true
			},
			groups: {
				pool: {
					color: poolColors,
					shape: 'icon',
					icon: {
						face: 'Glyphicons Halflings',
						code: '\ue011',
						size: 23,
						color: '#6E6EFD'
					}
				},
				group: {
					shape: 'icon',
					icon: {
						face: 'Glyphicons Halflings',
						code: '\ue056',
						size: 23,
						color: '#00FF8C'
					}
				}
			}
		};

		this.network = new vis.Network(container, data, options);

		this.network.on("doubleClick", this.onNodeDoubleClick);

		this.network.on("hoverNode", this.onNodeHover);

		this.reload();
	}

	onNodeDoubleClick = (param) => {
		// request more data
		if (param && param.nodes) {
			param.nodes.forEach(n => {
				this.load(n + "/*");
			})
		}
	};

	onNodeHover = (param) => {
		// request more data
		if (param && param.node) {
			var c = this.nodes._data[param.node];
			if (c && c.data && c.data.info) {
				this.currentNode = c.data.info;
			}
		}
	};

	clearAll() {
		if (this.nodes) {
			this.nodes.clear();
			this.nodes.add({ id: "/", label: 'akka' });
		}
		if (this.edges) {
			this.edges.clear();
		}
	}

	update(result: F.QueryResult) {
		if (result && result.Path == "") {
			// root
			this.nodes.clear();
			this.edges.clear();

			// root
			var root = result.Children[0];
			this.nodes.add({ id: this.removeEndSlash(root.Path), label: root.Name, level: 0 });

			this.load(root.Path);
			return;
		}

		var updateTimeStamp = new Date().getTime();
		if (result && result.Children) {

			// delete all from this parent
			if (result.Children.length == 0) {	// kill all
				var path = this.removeEndSlash(result.Path);
				var items = this.nodes.get({
					filter: function(item) {
						if (item && item.data)
							return item.data.parent.startsWith(path);
						return false;
					}
				});

				items.forEach(old => {
					this.nodes.remove(old.id);
				});
				return;
			}

			var first = result.Children[0];
			var parent = this.calculateParent(first.Path);

			result.Children.forEach(c => {
				// calculate parent of this child
				var node = {
					id: c.Path,
					label: c.Name,
					level: this.calculateLevel(c.Path),
					shape: 'box',
					data: {
						info: c,
						parent: parent,
						timestamp: updateTimeStamp
					}
				};

				if (c.Router) {
					var name = `${c.Router.Pool ? 'pool' : 'group'}`.toLowerCase();
					node["group"] = name;
					delete node["shape"];
				}

				var updated = this.nodes.update(node);

				// delete old?
				this.edges.update({ id: `${c.Path}#${parent}`, from: c.Path, to: parent });
			});

			// delete all other children
			var items = this.nodes.get({
				filter: function(item) {
					if (item && item.data)
						return item.data.parent == parent && item.data.timestamp < updateTimeStamp;
					return false;
				}
			});

			items.forEach(old => {
				this.nodes.remove(old.id);
			});
		}
	}

	private calculateParent(path: string): string {
		var lastIndex = path.lastIndexOf("/");
		return path.substring(0, lastIndex);
	}
	private removeEndSlash(path: string): string {
		if (path.endsWith('/'))
			return path.substring(0, path.length - 1);
		return path;
	}
	private calculateLevel(path: string): number {
		var delimit = path.indexOf("//");
		var after = path.substring(delimit + 2).split('/').length - 1;
		return after;
	}

	load(path: string) {
		console.log("Loading " + path);
		this.visualizeService
			.list(path, 0, 100)
			.then(result => {
				this.update(result);
			});
	}

	reload() {
		this.clearAll();
		this.load("");
	}

	send(messageType) {
		if (this.currentNode) {
			var path = this.currentNode.Path;
			this.visualizeService
				.send(path, messageType)
				.then(r => {
					setTimeout(() => {
						var parent = this.calculateParent(path) + "/";
						this.load(parent);
					}, 1000);	// reload the graph
				})
		}
	}
}