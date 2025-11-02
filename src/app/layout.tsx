'use client';

import './css/globals.css';
import React, { useState, useEffect } from 'react';
import ChatArea from '../components/ChatArea';
import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = (): void => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  return (
    <html>
      <body>
        <div className="flex flex-col h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/images/background.png')" }}>
          {/* 오버레이 투명도 조정 */}
          <div className="absolute inset-0 bg-black/30 z-0"></div>

          <header className="h-16 shadow-sm border-b border-gray-200 z-50 flex-shrink-0">
            <div className="p-4 h-full flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="lg:hidden transition-all duration-200 ease-in-out opacity-100 lg:opacity-0 lg:pointer-events-none hover:cursor-pointer"
                  aria-label="메뉴 열기"
                >
                  {!isSidebarOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke={isHovered ? 'gray' : 'white'} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke={isHovered ? 'gray' : 'white'} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
                <Image
                  src="/images/woookiki_icon.png"
                  alt="woookiki 로고"
                  width={120}
                  height={32}
                  className="ml-2 lg:ml-0 max-h-12 w-auto object-contain"
                  priority
                />
              </div>
            </div>
          </header>

          <div className="flex flex-row flex-1 overflow-hidden relative">
            {isSidebarOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeSidebar} />}

            <div
              className={`
                ${isSidebarOpen ? 'w-[250px]' : 'w-0'} 
                lg:w-[250px] 
                min-w-0 lg:min-w-[250px] 
                flex-shrink-0 
                overflow-hidden 
                transition-all 
                duration-300 
                ease-in-out
                lg:relative
                fixed
                lg:z-auto
                z-50
                h-full
                lg:h-auto
                text-white
              `}
            >
              <div className="h-full w-[250px] p-5 ">
                <div className="h-full w-full bg-neutral-900/70 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-4 lg:hidden">
                    <span className="text-lg font-semibold">메뉴</span>
                    <button onClick={closeSidebar} className="p-2 rounded-md hover:bg-gray-200 transition-colors" aria-label="메뉴 닫기">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div>메뉴바 영역</div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-5">
              <main className="flex w-full h-full bg-neutral-900/70 rounded-lg gap-1">
                <div className="w-[200px] sm:w-[250px] md:w-[300px] lg:w-[450px] flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out border border-gray-200 rounded-lg">
                  <ChatArea />
                </div>
                <div className="flex-1 border border-gray-200 overflow-hidden min-w-0 rounded-lg text-white">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
