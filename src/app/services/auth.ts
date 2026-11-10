
import { Capacitor } from '@capacitor/core';

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential
} from 'firebase/auth';

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

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

export async function loginComGoogle() {
  if (Capacitor.isNativePlatform()) {
    const resultado = await FirebaseAuthentication.signInWithGoogle({
      skipNativeAuth: true
    });

    const idToken = resultado.credential?.idToken;

    if (!idToken) {
      throw new Error('Não foi possível obter o token do Google.');
    }

    const credencial = GoogleAuthProvider.credential(idToken);

    return signInWithCredential(auth, credencial);
  }

  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: 'select_account'
  });

  return signInWithPopup(auth, provider);
}
