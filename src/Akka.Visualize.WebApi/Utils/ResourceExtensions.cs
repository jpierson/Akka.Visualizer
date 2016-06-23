using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Akka.Visualize.Utils;

namespace Akka.Visualize.WebApi.Utils
{
	internal class ResourceExtensions
	{
		public static Stream GetResource(string name)
		{
			var calling = typeof(ResourceExtensions).Assembly.FullName.UpTo(",");

			var resourceName = $"{calling}.UI.{name}";

			var stream = Assembly.GetCallingAssembly().GetManifestResourceStream(resourceName);
			{
				if (stream == null)
					return null;
				//using (var reader = new StreamReader(stream))
				//	return reader.ReadToEnd();
				return stream;
			}
		}
	}
}
