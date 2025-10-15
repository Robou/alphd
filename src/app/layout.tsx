import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlpHD - Visualisation 3D HD",
  description:
    "Application de visualisation de données LiDAR haute définition pour l'analyse de terrains montagneux",
};

/* export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
} */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    🏔️ AlpHD
                  </h1>
                </div>
                <nav className="flex space-x-8">
                  <Link
                    href="/"
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    Accueil
                  </Link>
                  <Link
                    href="/models"
                    className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    Modèles
                  </Link>
                  <Link
                    href="/viewer"
                    className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    Visualiseur
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}