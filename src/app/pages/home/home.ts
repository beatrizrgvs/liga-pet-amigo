import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { Servico, escutarServicos, lerCacheEstoque } from '../../services/estoque';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonContent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomePage implements OnInit, OnDestroy {
  porte = 'M';

  servicos: Omit<Servico, 'id'>[] = this.obterListaInicial();

  private unsubEstoque?: () => void;
  private unsubAuth?: () => void;

  constructor(
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  private obterListaInicial(): Omit<Servico, 'id'>[] {
    const cache = lerCacheEstoque();
    if (cache.length > 0) return cache;

    return [
      { nome: 'Banho pequeno', preco: 40, portes: ['P'], status: '' },
      { nome: 'Banho médio', preco: 55, portes: ['M'], status: '' },
      { nome: 'Banho grande', preco: 70, portes: ['G'], status: '' },
      { nome: 'Tosa higiênica', preco: 55, portes: ['P', 'M', 'G'], status: '' },
      { nome: 'Hidratação', preco: 35, portes: ['P', 'M', 'G'], status: 'Agenda cheia' },
      { nome: 'Pacote VIP', preco: 120, portes: ['P', 'M'], status: 'Esgotado' }
    ];
  }

  ionViewWillEnter() {
    const cache = lerCacheEstoque();
    if (cache.length > 0) {
      this.servicos = cache;
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    this.unsubAuth = onAuthStateChanged(auth, user => {
      this.zone.run(() => {
        if (!user) {
          this.router.navigateByUrl('/login', { replaceUrl: true });
          return;
        }

        if (!this.unsubEstoque) {
          this.unsubEstoque = escutarServicos(lista => {
            this.zone.run(() => {
              if (lista.length > 0) {
                this.servicos = lista;
              }
              this.cdr.detectChanges();
            });
          });
        }
      });
    });
  }

  ngOnDestroy() {
    this.unsubEstoque?.();
    this.unsubAuth?.();
  }

  get servicosVisiveis() {
    return this.servicos.filter(s => s.portes.includes(this.porte));
  }

  async sair() {
    await signOut(auth);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  agendar(nome: string) {
    alert('Serviço selecionado: ' + nome + ' — porte ' + this.porte);
  }

  abrirPetVirtual() {
    this.router.navigateByUrl('/pet-virtual');
  }
}