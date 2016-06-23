using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Cors;
using System.Web.Http.Dependencies;
using System.Web.Http.Filters;
using System.Web.Http.SelfHost;

namespace Akka.Visualize.WebApi
{
	internal class WebApiStarter
	{
		public HttpServer Server { get; private set; }

		public IDependencyResolver DependencyResolver { get; set; }
		public string Scheme { get; set; }
		public string Domain { get; set; }
		public int Port { get; set; }
		public Func<Uri, HttpServer> ServerFactory { get; set; }
		public Action<HttpRouteCollection> RouteConfigurer { get; set; }
		public Action<HttpConfiguration> ServerConfigurer { get; set; }

		public WebApiStarter()
		{
			Scheme = "http";
			Domain = "localhost";
			Port = 8080;
		}

		public WebApiStarter UseDependencyResolver(IDependencyResolver dependencyResolver)
		{
			DependencyResolver = dependencyResolver;

			return this;
		}

		public WebApiStarter ConfigureRoutes(Action<HttpRouteCollection> route)
		{
			RouteConfigurer = route;

			return this;
		}

		public WebApiStarter ConfigureServer(Action<HttpConfiguration> config)
		{
			ServerConfigurer = config;

			return this;
		}

		public WebApiStarter OnLocalhost(int port = 8085)
		{
			return OnHost("http", "localhost", port);
		}

		public WebApiStarter OnHost(string scheme = null, string domain = null, int port = 8080)
		{
			Scheme = !string.IsNullOrEmpty(scheme) ? scheme : Scheme;
			Domain = !string.IsNullOrEmpty(domain) ? domain : Domain;
			Port = port;

			return this;
		}

		public HttpServer Build()
		{
			//var log = HostLogger.Get(typeof(WebApiStarter));

			var baseAddress = new UriBuilder(Scheme, Domain, Port).Uri;

			//log.Debug(string.Format("[Topshelf.WebApi] Configuring WebAPI Selfhost for URI: {0}", baseAddress));

			Server = ServerFactory != null ? ServerFactory(baseAddress) : BuildServer(baseAddress);
			var config = Server.Configuration;
			config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;

			if (DependencyResolver != null)
				config.DependencyResolver = DependencyResolver;

			if (ServerConfigurer != null)
			{
				ServerConfigurer(config);
			}

			if (RouteConfigurer != null)
			{
				RouteConfigurer(config.Routes);
			}

#if DEBUG
			var cors = new EnableCorsAttribute("http://localhost:3000", "Origin", "*")
			{
				ExposedHeaders = { "Cache-Control", "Pragma", "Origin", "Authorization", "Content-Type", "X-Requested-With", "Accept" },
				Methods = { "GET", "POST", "PUT" },
				Origins = { "http://localhost:3000" },
				SupportsCredentials = true
			};

			config.EnableCors(cors);
#endif
			//config.Initializer = httpConfig =>
			//{
			//	config.MessageHandlers.Add(new LocalCorsHandler(config));
			//	Debugger.Break();
			//};


			Console.WriteLine($"Akka.Visualize listening on: {baseAddress}");
			return Server;
		}

		private HttpServer BuildServer(Uri baseAddress)
		{
			return new HttpSelfHostServer(new HttpSelfHostConfiguration(baseAddress));
		}

		public virtual void Initialize()
		{
			if (Server is HttpSelfHostServer)
				(Server as HttpSelfHostServer).OpenAsync().Wait();
		}

		public virtual void Shutdown()
		{
			if (Server is HttpSelfHostServer)
				(Server as HttpSelfHostServer).CloseAsync().Wait();
		}
	}

	internal class LocalCorsHandler : DelegatingHandler
	{
		private readonly HttpConfiguration _configuration;

		public LocalCorsHandler(HttpConfiguration configuration)
		{
			_configuration = configuration;
		}

		protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
		{
			return base.SendAsync(request, cancellationToken);
		}
	}
}
