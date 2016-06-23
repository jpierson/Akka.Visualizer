# Akka.Visualizer
===============================
Visualizer for Akka [Akka.NET](https://github.com/akkadotnet/akka.net "Port of Akka actors for .NET") actor systems.

## Installation
First thing you want to do is install the `Akka.Monitoring` packages via NuGet:

```
Install-Package Akka.Monitoring
```

## Preparing your environment
* From an Administrator command prompt run
`netsh http add urlacl url=http://+:8085/ user=\Everyone`
this will give the Self Hosted Web host the rights to use the port 8085.

# Running the Visualizer
* After you create your ActorSystem add the Akka Visualizer extension:

```
using Akka;
using Akka.Visualize.WebApi;

_system = ActorSystem.Create("My System");

var webVisualizer = new WebApiVisualizer();
ActorVisualizeExtension.InstallVisualizer(_system, webVisualizer);
```
* Start your Akka System/App and point your browser to [http://localhost:8085](http://localhost:8085)


## Disclaimer
* This is a very very alpha version of the visualizer.
* This might not work on IE*

## Used Libraries
* [Aurelia](www.aurelia.io)
* [VisJs](visjs.org)
