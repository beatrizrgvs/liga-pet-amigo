import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

import { auth } from '../firebase.config';

export async function cadastrarComEmail(
  nome: string,
  email: string,
  senha: string
) {
  const credencial = await createUserWithEmailAndPassword(
    auth,
    email,
    senha
  );

  await updateProfile(credencial.user, {
    displayName: nome
  });

  return credencial;
}

export function loginComEmail(email: string, senha: string) {
  return signInWithEmailAndPassword(auth, email, senha);
}

export function loginComGoogle() {
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: 'select_account'
  });

  return signInWithPopup(auth, provider);
}
