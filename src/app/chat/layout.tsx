import "../css/globals.css";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="chat-layout-container">
      <header className="chat-header">
        <h1>주식 자동매매 채팅</h1>
      </header>
      <main className="chat-main">{children}</main>
    </div>
  );
}
