"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";
import TreeNode from "@/components/TreeNode";
import { Dialog } from "@headlessui/react";

export default function InterviewPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [isOpen, setIsOpen] = useState(true); // モーダル初期表示

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid || !id) return;
    const unsub = onSnapshot(doc(db, "users", uid, "companies", id), (snap) => {
      const data = snap.data();
      if (data) {
        setInterviewQuestions(data?.interview_questions || []);
        setCompanyName(data.name || "");
      }
    });
    return () => unsub();
  }, [uid, id]);

  const addNewTree = async () => {
    if (!uid) return;
    const newTree = { id: uuidv4(), question: "", answer: "", children: [] };
    const updated = [...interviewQuestions, newTree];
    setInterviewQuestions(updated);
    await updateDoc(doc(db, "users", uid, "companies", id), {
      interview_questions: updated,
    });
  };

  const updateNode = async (updatedNode: any) => {
    if (!uid) return;
    const updated = interviewQuestions.map((node) =>
      node.id === updatedNode.id ? updatedNode : node
    );
    setInterviewQuestions(updated);
    await updateDoc(doc(db, "users", uid, "companies", id), {
      interview_questions: updated,
    });
  };

  const deleteNode = async (idToDelete: string) => {
    if (!uid) return;
    const updated = interviewQuestions.filter((node) => node.id !== idToDelete);
    setInterviewQuestions(updated);
    await updateDoc(doc(db, "users", uid, "companies", id), {
      interview_questions: updated,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-900 to-gray-900 text-white px-4 py-4">
      {/* ✅ 使い方モーダル */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <Dialog.Title className="text-lg font-bold mb-2 text-gray-800">このページの使い方</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-700 mb-4">
              よく聞かれる質問を「＋ 質問を追加」で追加し、答えを入力していってください。
              <br />
              各質問に対して派生質問追加をクリックすることで「面接質問」の深掘りも対応しよう。
              <br />
              派生質問を非表示することもできます。
            </Dialog.Description>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              閉じる
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* ✅ メイン内容 */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-left">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-blue-200 underline hover:text-blue-100"
          >
            ← 企業一覧ページに戻る
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center">
          {companyName
            ? `${companyName}の面接対策Q&Aを作成しよう（なぜなぜ分析対応）`
            : "企業別 面接Q&A"}
        </h1>

        <div className="text-center">
          <button
            onClick={addNewTree}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:bg-blue-600 hover:scale-[1.02] transition"
          >
            ＋ 質問を追加
          </button>
        </div>

        <div className="space-y-4">
          {interviewQuestions.map((tree) => (
            <TreeNode
              key={tree.id}
              node={tree}
              allTrees={interviewQuestions}
              setAllTrees={setInterviewQuestions}
              uid={uid}
              companyId={id}
              updateNode={updateNode}
              deleteNode={deleteNode}
              autoGrow={true}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
