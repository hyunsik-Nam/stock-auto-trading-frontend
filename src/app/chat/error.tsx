"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ChatError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Chat error:", error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>채팅 오류가 발생했습니다</h2>
      <p>잠시 후 다시 시도해주세요.</p>
      <button onClick={reset} className="retry-button">
        다시 시도
      </button>
    </div>
  );
}
