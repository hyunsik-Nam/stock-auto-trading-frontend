'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { getApiUrl } from '../config/config';
import ChatLoading from './loading';

interface Message {
  id: string;
  content: string;
  node_name: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
}

const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addUserMessage = (content: string): Message => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      node_name: '',
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const addBotMessage = (): Message => {
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isStreaming: true,
      node_name: '',
    };
    setMessages(prev => [...prev, botMessage]);
    return botMessage;
  };

  const updateBotMessage = (messageId: string, content: string, isComplete: boolean = false): void => {
    setMessages(prev => prev.map(msg => (msg.id === messageId ? { ...msg, content, isStreaming: !isComplete } : msg)));
  };
  const isAnalysisMessage = (node_name: string): boolean => {
    const ANALYSIS_PATTERNS = ['start', 'classify_main', 'classify_stock', 'process_stock_with_handlers', 'process_general', 'handle_error', 'content_start'];

    const isMatch = ANALYSIS_PATTERNS.some(pattern => node_name.trim() === pattern);
    return isMatch;
  };

  const handleStreamResponse = async (response: Response, botMessageId: string): Promise<void> => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let accumulatedContent = '';

    if (!reader) {
      throw new Error('스트림 리더를 생성할 수 없습니다.');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6);

            if (data === '[DONE]') {
              updateBotMessage(botMessageId, accumulatedContent, true);
              return;
            }

            try {
              const jsonData = JSON.parse(data);
              if (jsonData.content !== undefined) {
                console.log('수신된 콘텐츠 조각:', jsonData.node_name);
                if (isAnalysisMessage(jsonData.node_name)) {
                  accumulatedContent = '';
                }
                accumulatedContent += jsonData.content;
                updateBotMessage(botMessageId, accumulatedContent);
              }
            } catch (parseError) {
              console.warn('JSON 파싱 실패:', data, parseError);
            }
          } else if (trimmedLine === '[DONE]') {
            updateBotMessage(botMessageId, accumulatedContent, true);
            return;
          }
        }
      }

      updateBotMessage(botMessageId, accumulatedContent, true);
    } catch (error) {
      console.error('스트림 처리 중 에러 발생:', error);
      throw error;
    } finally {
      reader.releaseLock();
    }
  };

  const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!inputMessage.trim() || isStreaming) return;

    const userMessage = addUserMessage(inputMessage.trim());
    setInputMessage('');
    setIsStreaming(true);

    const botMessage = addBotMessage();

    try {
      const response = await fetch(getApiUrl('/api/v1/chat/stream/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP 에러! 상태: ${response.status}`);
      }
      await handleStreamResponse(response, botMessage.id);
    } catch (error) {
      console.error('메시지 전송 중 에러 발생:', error);
      updateBotMessage(botMessage.id, '죄송합니다. 메시지 처리 중 오류가 발생했습니다.', true);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      <Suspense fallback={<ChatLoading />} />

      <div className={messages.length === 0 ? 'flex-1 overflow-auto pt-16 flex justify-center items-center px-4' : 'flex-1 basis-[90%] overflow-auto px-4'}>
        {messages.length === 0 ? (
          <div className="text-center text-white mt-8">첫 메시지를 보내보세요!</div>
        ) : (
          <div className="w-full max-w-2xl mx-auto">
            {messages.map(message => (
              <div key={message.id} className="flex justify-between my-2 w-full">
                {message.sender === 'bot' ? (
                  <>
                    <div className="max-w-[70%] px-4 py-2 rounded-lg bg-white text-gray-800 shadow-sm border border-gray-200 self-start">
                      <p className="text-sm break-words whitespace-pre-wrap">
                        {message.content}
                        {message.isStreaming && <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse">|</span>}
                      </p>
                      <p className="text-xs mt-1 text-gray-500">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex-1" />
                  </>
                ) : (
                  <>
                    <div className="flex-1" />
                    <div className="max-w-[70%] px-4 py-2 rounded-lg bg-blue-500 text-white self-end">
                      <p className="text-sm break-words">{message.content}</p>
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
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className={messages.length === 0 ? 'flex-1 flex justify-center items-top px-4' : 'flex-1 flex justify-center items-center basis-[10%] px-4'}>
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              disabled={isStreaming}
              className="flex-1 px-4 text-white py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 disabled:opacity-50 bg-transparent"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isStreaming}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              {isStreaming ? '전송중...' : '전송'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
