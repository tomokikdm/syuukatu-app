'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('登録成功！');
    } catch (error: any) {
      alert(`登録エラー: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert("ログイン成功！");
      router.push('/dashboard');
    } catch (error: any) {
      alert(`ログインエラー: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert('ログアウトしました！');
    } catch (error: any) {
      alert(`ログアウトエラー: ${error.message}`);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert('メールアドレスを入力してください');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('パスワード再設定メールを送信しました');
    } catch (error: any) {
      alert(`送信エラー: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-12">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 p-6 rounded-xl mb-8 text-white shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">就活企業分析・面接対策アプリ</h2>
        <p className="text-sm text-gray-200">
          自分だけの面接対策ノートをつくって、企業分析を整理しよう。<br />
          スマホ・PC両方で使える、あなただけの就活アシスタント。
        </p>
      </section>

      {/* ログインフォーム */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">ログインページ</h1>

        <input
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
            onClick={handleSignup}
          >
            登録
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
            onClick={handleLogin}
          >
            ログイン
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow"
            onClick={handleLogout}
          >
            ログアウト
          </button>
        </div>

        {/* パスワード再設定リンク */}
        <button
          className="text-sm text-blue-400 hover:underline w-full text-center"
          onClick={handleResetPassword}
        >
          パスワードを忘れた方はこちら
        </button>

        {user && (
          <p className="text-sm text-green-400 text-center">ログイン中：{user.email}</p>
        )}
      </div>
    </main>
  );
}
