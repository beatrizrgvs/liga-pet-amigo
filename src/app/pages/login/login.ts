import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';


//import { AppHeaderComponent } from '../../components/app-header/app-header.component';

import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonText
}  from '@ionic/angular';


import {
  loginComEmail,
  loginComGoogle
} from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonItem,
    IonInput,
    IonButton
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginPage {
  email = '';
  senha = '';
  erro = '';
  carregando = false;

  async entrar() {
  this.erro = '';
  this.carregando = true;

  try {
    await loginComEmail(this.email, this.senha);
    await this.router.navigateByUrl('/home', { replaceUrl: true });
  } catch (error) {
    console.error(error);
    this.erro = 'Não foi possível entrar. Confira seu e-mail e senha.';
  } finally {
    this.carregando = false;
  }
}

  async entrarComGoogle() {
  this.erro = '';
  this.carregando = true;

  try {
    await loginComGoogle();

    await this.router.navigateByUrl('/home', {
      replaceUrl: true
    });
  } catch (error: any) {
    console.error('Erro no login com Google:', error);

    if (error.code === 'auth/popup-closed-by-user') {
      this.erro = 'Você fechou a janela de login do Google.';
    } else if (error.code === 'auth/popup-blocked') {
      this.erro = 'O navegador bloqueou a janela. Permita pop-ups.';
    } else if (error.code === 'auth/unauthorized-domain') {
      this.erro = 'Este domínio não está autorizado no Firebase.';
    } else {
      this.erro = 'Não foi possível entrar com o Google. Tente novamente.';
    }
  } finally {
    this.carregando = false;
  }
}
  constructor(private router: Router) {}


testarCadastro() {
  window.location.href = '/cadastro';
}
}
