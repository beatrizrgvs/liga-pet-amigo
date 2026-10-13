import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class App {}
