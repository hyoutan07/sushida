'use client';

import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between">
      <Link href="/" className='text-xl'>
        Nishida
      </Link>
      <nav className="space-x-4">
        <Link href="/addWord" className="hover:underline">
          新規登録
        </Link>
        <Link href="/sushiList" className="hover:underline">
          リスト確認
        </Link>
      </nav>
    </header>
  );
};

export default Header;
