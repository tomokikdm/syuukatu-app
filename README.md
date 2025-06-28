# 就活企業分析アプリ

企業ごとの情報管理や面接対策ができる、就活生向けWebアプリです。

## 🔍 主な機能

- 企業情報の登録・編集・削除（志望度・業種・年収など）
- 面接で聞かれた質問の記録とツリー表示（なぜなぜ分析対応）
- 自己PRや志望動機などのメモ管理
- ログイン機能（Firebase認証）
- 複数ユーザー対応（自分だけの企業一覧を管理）

## 🛠️ 使用技術

- **Next.js 13+（App Router）**
- **TypeScript**
- **Firebase（認証・Firestore）**
- **Tailwind CSS**
- **デプロイ：Vercel**

## 💻 セットアップ

```bash
git clone https://github.com/tomokikdm/syuukatu-app.git
cd syuukatu-app
npm install
npm run dev
