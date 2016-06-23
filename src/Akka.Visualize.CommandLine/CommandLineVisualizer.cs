using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Akka.Visualize.Clients;
using ConsoleMenu;

namespace Akka.Visualize.CommandLine
{
	public class CommandLineVisualizer : IActorVisualizeClient
	{
		private IActorVisualizer _actorVisualizer;
		public void Dispose()
		{
			
		}

		public void SetVisualizer(IActorVisualizer actorVisualizer)
		{
			this._actorVisualizer = actorVisualizer;
		}

		public void Run()
		{
			var menu = new CMenu();
			menu.Add("view", (name) => RenderSystem(name));
			menu.Run();

			Console.WriteLine(">>>> DONE");
		}

		private void RenderSystem(string path)
		{
			var result = this._actorVisualizer.List(path);
			result.ContinueWith(task =>
			{
				var qr = result.Result;
				foreach (var c in qr.Children)
				{
					Console.WriteLine(">{0}: {1} : {2}", c.IsLocal ? "L":"R", c.Path, c.TypeName);
				}
			});

			Console.WriteLine("View {0}", path);
		}
	}
}
