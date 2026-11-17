import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { ADMIN_UID, Servico, escutarServicos, alterarStatus } from '../../services/estoque';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, IonContent],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminPage implements OnInit, OnDestroy {
  servicos: Servico[] = [];
  mensagem = '';

  private unsubEstoque?: () => void;
  private unsubAuth?: () => void;

  constructor(
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.unsubAuth = onAuthStateChanged(auth, user => {
      this.zone.run(() => {
        // quem não é admin sai do painel
        if (!user || user.uid !== ADMIN_UID) {
          this.router.navigateByUrl(user ? '/home' : '/login', { replaceUrl: true });
          return;
        }

        if (!this.unsubEstoque) {
          this.unsubEstoque = escutarServicos(
            lista => {
              this.zone.run(() => {
                this.servicos = lista;
                this.cdr.detectChanges();
              });
            },
            e => {
              this.zone.run(() => {
                this.mensagem = 'Erro ao carregar o estoque: ' + e;
                this.cdr.detectChanges();
              });
            }
          );
        }
      });
    });
  }

  ngOnDestroy() {
    this.unsubEstoque?.();
    this.unsubAuth?.();
  }

  async mudarStatus(s: Servico, status: string) {
    try {
      await alterarStatus(s.id, status);
      this.mensagem = '';
    } catch (e) {
      console.error(e);
      this.mensagem = 'Erro ao alterar: ' + e;
    }
    this.cdr.detectChanges();
  }

  async sair() {
    await signOut(auth);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}