import React from "react";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const WordManagementModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // モーダルが閉じているときは何も表示しない

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg border-4 border-blue-400 text-center">
        <h2 className="text-blue-600 text-2xl font-bold mb-4">ワード管理</h2>
        <p className="text-gray-700 mb-4">カスタムワードの登録や確認ができます。</p>
        <div className="flex flex-col space-y-3">
          <Link
            href="/addSushi"
            className="bg-blue-500 text-white text-lg font-bold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 text-center"
          >
            新規登録
          </Link>
          <Link
            href="/manageSushi"
            className="bg-green-500 text-white text-lg font-bold px-6 py-3 rounded-lg shadow-md hover:bg-green-600 text-center"
          >
            リスト確認
          </Link>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default WordManagementModal;
