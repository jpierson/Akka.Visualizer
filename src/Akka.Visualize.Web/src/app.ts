import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Akka.Visualize';
    config.map([
      { route: ['', 'akka'], name: 'akka',      moduleId: 'akka/index',      nav: true, title: 'akka://' }
    ]);

    this.router = router;
  }
}
