import "./globals.css";
import Footer from '@/components/Footer';
import { Providers } from "./providers";
import Navigationbar from '@/components/NavigationBar'


export default function RootLayout({
  children,
}: {children: React.ReactNode;}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body>
        <Providers>
          <div className="flex justify-center">
            <Navigationbar />
          </div>
          <main className='min-h-screen flex-grow'>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
