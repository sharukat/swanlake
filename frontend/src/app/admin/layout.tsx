import "../globals.css";
import { Providers } from "../providers";
import SidebarAdmin from '@/components/client/adminSidebar'


export default function RootLayout({
  children,
}: {children: React.ReactNode;}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body>
        <Providers>
        <div className="flex flex-row h-screen w-full overflow-hidden">
            {/* Sidebar positioned on the left */}
            <SidebarAdmin />
            
            {/* Main content area */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
