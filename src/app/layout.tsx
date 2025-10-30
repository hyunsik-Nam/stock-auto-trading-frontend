import './css/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <div className="flex flex-row h-full w-full">
          <div className="hidden md:block md:w-[250px] min-w-[250px] h-screen bg-gray-100">메뉴바 영역</div>
          <div className="flex-1 w-full h-screen">
            <div className="flex flex-col h-full w-full">
              <header className="md:left-[250px] right-0 z-50 h-16">
                <div className="bg-white shadow-sm border-b border-gray-200 p-4 h-full">
                  <h1 className="text-xl font-semibold text-gray-800 text-left">woookiki</h1>
                </div>
              </header>
              <main className="flex-1 bg-gray-50 w-full h-full overflow-hidden">
                <div className="w-full h-full flex-col">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
