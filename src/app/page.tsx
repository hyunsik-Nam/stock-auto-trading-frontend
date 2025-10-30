'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import ChatLoading from './loading';

const Chat = () => {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      content: string;
      sender: 'user' | 'bot';
      timestamp: Date;
    }>
  >([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        content: inputMessage.trim(),
        sender: 'user' as const,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');

      // 강제 에러 발생
      try {
        throw new Error('강제로 발생시킨 테스트 에러입니다.');
      } catch (error) {
        console.error('메시지 전송 중 에러 발생:', error);

        // 에러 메시지를 채팅에 표시
        const errorMessage = {
          id: (Date.now() + 0.5).toString(),
          content: '죄송합니다. 메시지 처리 중 오류가 발생했습니다.',
          sender: 'bot' as const,
          timestamp: new Date(),
        };

        setTimeout(() => {
          setMessages(prev => [...prev, errorMessage]);
        }, 500);
      }
      // 봇 응답 시뮬레이션
      setTimeout(() => {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          content: '메시지를 받았습니다.',
          sender: 'bot' as const,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <Suspense fallback={ChatLoading()}></Suspense>
      <div
        className={
          messages.length === 0
            ? 'flex-1 overflow-auto pt-16 flex justify-center items-center' // 메시지가 없을 때
            : 'flex-1 basis-[90%] overflow-auto' // 메시지가 있을 떄
        }
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">첫 메시지를 보내보세요!</div>
        ) : (
          messages.map(message => (
            <div key={message.id} className="w-2xl mx-auto flex justify-between my-2">
              {message.sender === 'bot' ? (
                <>
                  <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white text-gray-800 shadow-sm border border-gray-200 self-start">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 text-gray-500">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div /> {/* 오른쪽 빈 공간 */}
                </>
              ) : (
                <>
                  <div /> {/* 왼쪽 빈 공간 */}
                  <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-500 text-white self-end">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 text-blue-100">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div
        className={
          messages.length === 0
            ? 'flex-1 flex justify-center items-top' // 메시지가 있을 때 basis-[20%] 제거
            : 'flex-1 flex justify-center items-center basis-[10%]' // 메시지가 없을 때 basis-[20%] 추가
        }
      >
        <div className="w-2xl">
          <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              전송
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
