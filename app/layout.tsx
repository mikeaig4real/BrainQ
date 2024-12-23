"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import { GameProvider } from "@/contexts/GameContext";
import { Audiowide } from "next/font/google";
import { Authenticator } from "@aws-amplify/ui-react";

const audiowide = Audiowide({ subsets: ["latin"], weight: ["400"] });

import DeviceWrapperComponent from "@/components/DeviceWrapper";

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="dark" className={`${audiowide.className} tracking-widest`} lang="en">
      <body className="flex items-center justify-center min-h-screen bg-base-200">
        <Authenticator.Provider>
          <GameProvider>
            <DeviceWrapperComponent>{children}</DeviceWrapperComponent>
          </GameProvider>
        </Authenticator.Provider>
      </body>
    </html>
  );
}
