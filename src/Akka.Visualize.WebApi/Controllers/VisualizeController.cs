using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Routing;
using Akka.Visualize.Models;

namespace Akka.Visualize.WebApi.Controllers
{
#if DEBUG
	[EnableCors("http://localhost:3000", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Accept", "GET, POST, PUT, OPTIONS")]
#endif
	public class VisualizeController : ApiController
	{
		public VisualizeController()
		{
			
		}
		
		[HttpGet()]
		[Route("list")]
		public async Task<QueryResult> List(string path = null)
		{
			return await WebApiVisualizer.Root.List(path);
		}

		[HttpGet()]
		[Route("send")]
		public async Task<NodeInfo> Send(string path, string messageType)
		{
			return await WebApiVisualizer.Root.Send(path, messageType);
		}
	}
}
