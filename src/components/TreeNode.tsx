"use client";

import { useState, useEffect } from "react";

export default function TreeNode({
  node,
  allTrees,
  setAllTrees,
  uid,
  companyId,
  updateNode,
  deleteNode,
}: any) {
  const [question, setQuestion] = useState(node.question);
  const [answer, setAnswer] = useState(node.answer);
  const [childrenVisible, setChildrenVisible] = useState(true);

  useEffect(() => {
    updateNode({ ...node, question, answer });
  }, [question, answer]);

  const handleAddChild = () => {
    if (node.children.length > 0) return;
    const newChild = {
      id: crypto.randomUUID(),
      question: "",
      answer: "",
      children: [],
    };
    const updatedNode = { ...node, children: [...node.children, newChild] };
    updateNode(updatedNode);
  };

  const handleUpdateChild = (updatedChild: any) => {
    const updatedChildren = node.children.map((c: any) =>
      c.id === updatedChild.id ? updatedChild : c
    );
    updateNode({ ...node, children: updatedChildren });
  };

  const handleDeleteChild = (childId: string) => {
    const updatedChildren = node.children.filter((c: any) => c.id !== childId);
    updateNode({ ...node, children: updatedChildren });
  };

  return (
    <div className="border border-gray-600 rounded-md p-4 space-y-3 bg-[#0b1622]">
      <div className="flex gap-3 mb-2">
        <button
          onClick={handleAddChild}
          className={`text-sm px-2 py-1 mr-2 rounded hover:underline ${
            node.children.length > 0 ? "text-gray-500" : "text-blue-500"
          }`}
        >
          ＋派生質問追加
        </button>

        {node.children.length > 0 && (
          <button
            onClick={() => setChildrenVisible(!childrenVisible)}
            className="text-sm text-blue-400 hover:underline"
          >
            {childrenVisible ? "派生質問を非表示（OFF）" : "派生質問を表示（ON"}
          </button>
        )}

        <button
          onClick={() => deleteNode(node.id)}
          className="text-sm text-red-500 hover:underline ml-auto"
        >
          削除
        </button>
      </div>

      <div className="flex items-start space-x-2">
        <span className="text-blue-400 font-bold pt-1">Q</span>
        <textarea
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-full bg-black text-white border border-gray-700 rounded resize-none overflow-hidden pt-3 px-2"
          style={{ minHeight: "1rem", lineHeight: "1rem", fontSize: "1rem" }}
        />
      </div>

      <div className="flex items-start space-x-2">
        <span className="text-green-400 font-bold pt-1">A</span>
        <textarea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-full bg-black text-white border border-gray-700 rounded resize-none overflow-hidden pt-3 px-2"
          style={{ minHeight: "1rem", lineHeight: "1rem", fontSize: "1rem" }}
        />
      </div>

      {childrenVisible && (
        <div className="pl-4 border-l border-blue-800 mt-4 space-y-4">
          {node.children.map((child: any) => (
            <TreeNode
              key={child.id}
              node={child}
              allTrees={allTrees}
              setAllTrees={setAllTrees}
              uid={uid}
              companyId={companyId}
              updateNode={handleUpdateChild}
              deleteNode={handleDeleteChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
