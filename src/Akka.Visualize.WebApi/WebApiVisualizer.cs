using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Akka.Visualize.Clients;
using Akka.Visualize.Models;
using Akka.Visualize.Utils;

namespace Akka.Visualize.WebApi
{
	public class WebApiVisualizer : IActorVisualizeClient
	{
		private IActorVisualizer _actorVisualizer;
		private HttpServer _httpServer;

		internal static WebApiVisualizer Root;

		public WebApiVisualizer()
		{
			Root = this;
		}

		public void Dispose()
		{
		}

		public void Start()
		{
			var configurator = new WebApiStarter();

			_httpServer = configurator
				.OnLocalhost()
				.ConfigureRoutes(ConfigureRoutes)
				.Build();

			configurator.Initialize();
		}
		
		private void ConfigureRoutes(HttpRouteCollection routes)
		{
			routes.MapHttpRoute("Visualizer"
				, "api/{controller}/{action}"
				//, new {id = RouteParameter.Optional},
				//new {id = @"\d+"}
				);

			routes.MapHttpRoute("Index",
				"{id}"
				, new { controller = "Static", id = RouteParameter.Optional }
				);

			routes.MapHttpRoute("Index.html",
				"index.html"
				, new {controller = "Static"}
				);
		}

		public void SetVisualizer(IActorVisualizer actorVisualizer)
		{
			_actorVisualizer = actorVisualizer;
		}

		public Task<QueryResult> List(string path)
		{
			return _actorVisualizer.List(path);
		}

		public Task<NodeInfo> Send(string path, string messageType)
		{
			return _actorVisualizer.Send(path, messageType);
		}
	}
}
