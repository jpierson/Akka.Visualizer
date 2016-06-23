using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Akka.Actor;
using Akka.Routing;
using Akka.Visualize.CommandLine;
using Akka.Visualize.WebApi;

namespace Akka.Visualize.Sample
{
	class HelloActor : TypedActor, IHandle<string>
	{
		protected override void PreStart()
		{
			//Context.IncrementActorCreated();
			base.PreStart();
		}

		protected override void PostStop()
		{
			//Context.IncrementActorStopped();
			base.PostStop();
		}

		public void Handle(string message)
		{
			//Context.IncrementMessagesReceived();
			Console.WriteLine("Received: {0}", message);
			if (message == "Goodbye")
			{
				//Context.Self.Tell(PoisonPill.Instance);
				Program.ManualResetEvent.Set(); //allow the program to exit
			}
			else
				Sender.Tell("Hello!");
		}
	}

	class GoodbyeActor : TypedActor, IHandle<Tuple<IActorRef, string>>, IHandle<string>
	{
		protected override void PreStart()
		{
			//Context.IncrementActorCreated();
			base.PreStart();
		}

		protected override void PostStop()
		{
			//Context.IncrementActorStopped();
			base.PostStop();
		}

		public void Handle(string message)
		{
			//Context.IncrementMessagesReceived();
			Console.WriteLine("Received: {0}", message);
			Sender.Tell("Goodbye");
			//Context.Self.Tell(PoisonPill.Instance);
		}

		public void Handle(Tuple<IActorRef, string> message)
		{
			//Context.IncrementMessagesReceived();
			message.Item1.Tell("Starting");
		}
	}

	class Program
	{
		public static AutoResetEvent ManualResetEvent = new AutoResetEvent(false);

		private static ActorSystem _system;

		static void Main(string[] args)
		{
			_system = ActorSystem.Create("akka-visualize-demo");

			var commandLineVisualizer = new CommandLineVisualizer();
			var webVisualizer = new WebApiVisualizer();
			ActorVisualizeExtension.InstallVisualizer(_system, commandLineVisualizer);
			ActorVisualizeExtension.InstallVisualizer(_system, webVisualizer);

			Console.ForegroundColor = ConsoleColor.Green;
			Console.WriteLine("Starting up actor system...");
			var goodbyPool = _system.ActorOf(Props.Create<GoodbyeActor>().WithRouter(new RandomPool(10)), "GoodbyPool");
			var goodbuyGroup = _system.ActorOf(Props.Create<GoodbyeActor>().WithRouter(new RandomGroup("a1", "a2", "a3")), "GoodbyGroup");

			var goodbye = _system.ActorOf(Props.Create<GoodbyeActor>(), "Goodby");
			var hello = _system.ActorOf<HelloActor>("Hello");

			//Console.WriteLine("Incrementing debug log once every 10 ms for 2 seconds...");
			//var count = 200;
			//while (count >= 0)
			//{
			//	//ActorMonitoringExtension.Monitors(_system).IncrementDebugsLogged();
			//	//Console.WriteLine("Logging debug...");
			//	Thread.Sleep(100);
			//	count--;
			//}
			//Console.WriteLine("Starting a conversation between actors");
			goodbye.Tell(new Tuple<IActorRef, string>(hello, "Start"));
			goodbyPool.Tell(new Tuple<IActorRef, string>(hello, "Start"));
			goodbuyGroup.Tell(new Tuple<IActorRef, string>(hello, "Start"));
			//goodbye.Tell(new Tuple<IActorRef, string>(hello, "Start"));

			webVisualizer.Start();

			// Start Akka Command LIne
			commandLineVisualizer.Run();

			while (ManualResetEvent.WaitOne())
			{
				Console.WriteLine("Shutting down...");
				_system.Shutdown();
				Console.WriteLine("Shutdown complete");
				Console.WriteLine("Press any key to exit");
				Console.ReadKey();
				return;
			}
		}
	}
}
