
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonInput,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonProgressBar
} from '@ionic/angular';

interface Animal {
  tipo: string;
  emoji: string;
  nome: string;
}

interface DadosPet {
  tipo: string;
  nome: string;
  nomesPersonalizados: Record<string, string>;
  fome: number;
  humor: number;
  limpeza: number;
}

@Component({
  selector: 'app-pet-virtual',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonHeader,
    IonToolbar,
    IonInput,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonProgressBar
  ],
  templateUrl: './pet-virtual.html',
  styleUrl: './pet-virtual.scss'
})
export class PetVirtualPage {
  animais: Animal[] = [
    { tipo: 'Cachorro', emoji: '🐶', nome: 'Bolt' },
    { tipo: 'Gato', emoji: '🐱', nome: 'Mimi' },
    { tipo: 'Vaca', emoji: '🐮', nome: 'Mimosa' },
    { tipo: 'Coelho', emoji: '🐰', nome: 'Pipoca' },
    { tipo: 'Hamster', emoji: '🐹', nome: 'Biscoito' },
    { tipo: 'Cavalo', emoji: '🐴', nome: 'Estrela' }
  ];

  animalSelecionado: Animal = this.animais[0];

  nomePet = this.animalSelecionado.nome;

  // Guarda um nome diferente para cada animal.
  nomesPersonalizados: Record<string, string> = {};

  fome = 80;
  humor = 45;
  limpeza = 25;

  mensagem = 'Bolt está com fome!';

  constructor() {
    this.carregarPet();
  }

  private salvarPet(): void {
    // Atualiza o nome do animal atualmente selecionado.
    this.nomesPersonalizados[this.animalSelecionado.tipo] =
      this.nomePet;

    const dados: DadosPet = {
      tipo: this.animalSelecionado.tipo,
      nome: this.nomePet,
      nomesPersonalizados: this.nomesPersonalizados,
      fome: this.fome,
      humor: this.humor,
      limpeza: this.limpeza
    };

    localStorage.setItem('petVirtual', JSON.stringify(dados));
  }

  private carregarPet(): void {
    const dadosSalvos = localStorage.getItem('petVirtual');

    if (!dadosSalvos) {
      return;
    }

    try {
      const dados = JSON.parse(dadosSalvos) as Partial<DadosPet>;

      this.nomesPersonalizados =
        dados.nomesPersonalizados ?? {};

      const animal = this.animais.find(
        a => a.tipo === dados.tipo
      );

      if (animal) {
        this.animalSelecionado = animal;
      }

      this.nomePet =
        this.nomesPersonalizados[this.animalSelecionado.tipo]
        ?? dados.nome
        ?? this.animalSelecionado.nome;

      this.fome = dados.fome ?? 80;
      this.humor = dados.humor ?? 45;
      this.limpeza = dados.limpeza ?? 25;

      this.atualizarMensagem();
    } catch {
      localStorage.removeItem('petVirtual');
    }
  }

  selecionarAnimal(animal: Animal): void {
    // Salva o animal anterior antes de trocar.
    this.salvarPet();

    this.animalSelecionado = animal;

    // Recupera o nome personalizado do novo animal.
    this.nomePet =
      this.nomesPersonalizados[animal.tipo] ?? animal.nome;

    this.atualizarMensagem();
    this.salvarPet();
  }

  salvarNome(): void {
    this.nomePet = this.nomePet.trim();

    if (!this.nomePet) {
      this.nomePet = this.animalSelecionado.nome;
    }

    this.nomesPersonalizados[this.animalSelecionado.tipo] =
      this.nomePet;

    this.atualizarMensagem();
    this.salvarPet();
  }

  alimentar(): void {
    if (this.fome === 0) {
      this.mensagem = `${this.nomePet} está sem fome!`;
      return;
    }

    this.fome = Math.max(0, this.fome - 30);
    this.humor = Math.min(100, this.humor + 10);

    this.atualizarMensagem();
    this.salvarPet();
  }

  brincar(): void {
    if (this.fome >= 100) {
      this.mensagem =
        `${this.nomePet} precisa comer antes de brincar!`;
      return;
    }

    this.humor = Math.min(100, this.humor + 25);
    this.fome = Math.min(100, this.fome + 10);

    this.atualizarMensagem();
    this.salvarPet();
  }

  darBanho(): void {
    if (this.limpeza === 100) {
      this.mensagem = `${this.nomePet} já está limpinho!`;
      return;
    }

    this.limpeza = Math.min(100, this.limpeza + 40);
    this.humor = Math.max(0, this.humor - 5);

    this.atualizarMensagem();
    this.salvarPet();
  }

  atualizarMensagem(): void {
    if (this.fome >= 70) {
      this.mensagem = `${this.nomePet} está com fome!`;
    } else if (this.limpeza <= 30) {
      this.mensagem = `${this.nomePet} precisa de um banho!`;
    } else if (this.humor >= 75) {
      this.mensagem = `${this.nomePet} está muito feliz!`;
    } else {
      this.mensagem =
        `${this.nomePet} está recebendo seus cuidados.`;
    }
  }
}
