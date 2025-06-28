// src/lib/firebase.ts
// Firebaseの基本機能を初期化するための関数を読み込む
import { initializeApp } from 'firebase/app';
// 認証（ログイン・登録）機能を使うための関数を読み込む
import { getAuth } from 'firebase/auth';
// データベース（Firestore）を使うための関数を読み込む
import { getFirestore } from 'firebase/firestore';

// Firebaseの設定情報（君のプロジェクト専用の情報）
const firebaseConfig = {
   apiKey: "AIzaSyBmuXbaY6dGgabaJFucbJR5J77h1aFlMQ0",
  authDomain: "syukatuapp-2b936.firebaseapp.com",
  projectId: "syukatuapp-2b936",
  storageBucket: "syukatuapp-2b936.firebasestorage.app",
  messagingSenderId: "654940370094",
  appId: "1:654940370094:web:f6b0bd438bf558f2f6a93f",
  measurementId: "G-BG4D49Y5D3"
};

// 上記の設定を使ってFirebaseアプリを初期化する（これで接続される）
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // ← ログイン機能用
export const db = getFirestore(app); // ← データ保存用
