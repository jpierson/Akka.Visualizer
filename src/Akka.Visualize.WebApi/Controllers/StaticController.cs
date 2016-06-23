using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Akka.Visualize.Models;
using Akka.Visualize.WebApi.Utils;

namespace Akka.Visualize.WebApi.Controllers
{
	public class StaticController : ApiController
	{
		[HttpGet()]
		[Route("get/{id}")]
		public object Get(string id = null)
		{
			if (String.IsNullOrEmpty(id))
				id = "index.html";
			var stream = ResourceExtensions.GetResource(id);


			if (stream == null)
			{
				return NotFound();
			}

			var response = new HttpResponseMessage()
			{
				Content = new StreamContent(stream),
			};
			//response.Headers.Add("Content-Type",new string[] { GetMedia(id) });
            return response;
		}

		private string GetMedia(string file)
		{
			var extension = Path.GetExtension(file);
			switch (extension)
			{
				case ".js":
					return "application/javascript";
				case ".html":
					return "text/html";
				case ".png":
					return "image/png";
				case ".woff2":
					return "application/font-woff2";
				case ".woff":
					return "application/font-woff";
				case ".ttf":
					return "application/ttf";
				default:
					return "application/" + extension;
			}
		}
	}
}
