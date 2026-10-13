
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonText
} from '@ionic/angular';
import { cadastrarComEmail } from '../../services/auth';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonText
  ]
})
export class CadastroPage {
  email = '';
  senha = '';
  nome = '';
  erro = '';
  carregando = false;

  constructor(private router: Router) {}

  async cadastrar() {
    this.erro = '';

    if (!this.nome.trim() || !this.email.trim() || !this.senha) {
      this.erro = 'Preencha todos os campos.';
      return;
    }

    if (this.senha.length < 6) {
      this.erro = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    this.carregando = true;

    try {
      await cadastrarComEmail(
        this.nome.trim(),
        this.email.trim(),
        this.senha
      );

      await this.router.navigateByUrl('/home');
    } catch (error: unknown) {
      console.error('Erro ao cadastrar:', error);

      const codigo = (error as { code?: string })?.code;

      if (codigo === 'auth/email-already-in-use') {
        this.erro = 'Este e-mail já está cadastrado.';
      } else if (codigo === 'auth/invalid-email') {
        this.erro = 'Digite um e-mail válido.';
      } else if (codigo === 'auth/weak-password') {
        this.erro = 'Escolha uma senha mais forte.';
      } else {
        this.erro = 'Não foi possível criar a conta. Tente novamente.';
      }
    } finally {
      this.carregando = false;
    }
  }
}
