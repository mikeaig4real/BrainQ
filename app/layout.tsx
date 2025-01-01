"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import { GameProvider } from "@/contexts/GameContext";
import { Audiowide } from "next/font/google";
import { Authenticator } from "@aws-amplify/ui-react";
import { ThemeProvider } from "next-themes";

const audiowide = Audiowide({ subsets: ["latin"], weight: ["400"] });

import DeviceWrapperComponent from "@/components/DeviceWrapper";

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      data-theme="dark"
      className={`${audiowide.className} tracking-widest`}
      lang="en"
    >
      <head>
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Brain-Q - Cognitive Training Platform"
        />
        <meta
          name="keywords"
          content="cognitive training, brain games, memory games"
        />
        <meta property="og:title" content="Brain-Q" />
        <meta
          property="og:description"
          content="Enhance your cognitive abilities"
        />
        <meta name="author" content="Michael Aigbovbiosa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://main.d339fwuhwmun4v.amplifyapp.com/"
        />
      </head>
      <body className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Authenticator.Provider>
          <GameProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
            >
              <DeviceWrapperComponent>{children}</DeviceWrapperComponent>
            </ThemeProvider>
          </GameProvider>
        </Authenticator.Provider>
      </body>
    </html>
  );
}
