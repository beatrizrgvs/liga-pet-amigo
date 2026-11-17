import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

export const ADMIN_UID = 'bupMq6gle1NpposBpzkUvbOhLxp1';

export interface Servico {
  id: string;
  nome: string;
  preco: number;
  portes: string[];
  status: string; // '' = disponível
}

const CACHE_KEY = 'pet_amigo_estoque_cache';

const ORDEM_SERVICOS = [
  'Banho pequeno',
  'Banho médio',
  'Banho grande',
  'Tosa higiênica',
  'Hidratação',
  'Pacote VIP'
];

function ordenarServicos<T extends { nome: string }>(lista: T[]): T[] {
  return [...lista].sort((a, b) => {
    const posA = ORDEM_SERVICOS.indexOf(a.nome);
    const posB = ORDEM_SERVICOS.indexOf(b.nome);
    return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB);
  });
}

// Lê do localStorage se já tiver sido carregado antes
export function lerCacheEstoque(): Omit<Servico, 'id'>[] {
  try {
    const salvo = localStorage.getItem(CACHE_KEY);
    return salvo ? ordenarServicos(JSON.parse(salvo)) : [];
  } catch {
    return [];
  }
}

// Escuta o estoque em tempo real
export function escutarServicos(
  callback: (lista: Servico[]) => void,
  erro?: (e: unknown) => void
) {
  return onSnapshot(
    collection(db, 'estoque'),
    snap => {
      const lista = ordenarServicos(
        snap.docs.map(d => ({ id: d.id, ...d.data() } as Servico))
      );
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(lista));
      } catch {}
      callback(lista);
    },
    e => {
      console.error('Erro ao ler estoque:', e);
      erro?.(e);
    }
  );
}

// Só o admin consegue (as regras do Firestore bloqueiam os outros)
export function alterarStatus(id: string, status: string) {
  return updateDoc(doc(db, 'estoque', id), { status });
}

// Usada só para criar o estoque inicial
export async function popularEstoqueInicial(itens: Omit<Servico, 'id'>[]) {
  for (const item of itens) {
    const id = item.nome.toLowerCase().replace(/\s+/g, '-');
    await setDoc(doc(db, 'estoque', id), item);
  }
}