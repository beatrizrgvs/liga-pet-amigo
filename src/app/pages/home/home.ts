import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonContent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomePage {
  porte = 'M';

  servicos = [
    { nome: 'Banho pequeno', preco: 40, portes: ['P'], status: '' },
    { nome: 'Banho médio', preco: 55, portes: ['M'], status: '' },
    { nome: 'Banho grande', preco: 70, portes: ['G'], status: '' },
    { nome: 'Tosa higiênica', preco: 55, portes: ['P', 'M', 'G'], status: '' },
    { nome: 'Hidratação', preco: 35, portes: ['P', 'M', 'G'], status: 'Agenda cheia' },
    { nome: 'Pacote VIP', preco: 120, portes: ['P', 'M'], status: 'Esgotado' }
  ];

  constructor(private router: Router) {}

  get servicosVisiveis() {
    return this.servicos.filter(s => s.portes.includes(this.porte));
  }

  sair() {
    this.router.navigateByUrl('/login');
  }

  agendar(nome: string) {
    alert('Serviço selecionado: ' + nome + ' — porte ' + this.porte);
  }

  abrirPetVirtual() {
  this.router.navigateByUrl('/pet-virtual');
}
}
