"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

import IntroAnimationComponent from "@/components/IntroAnimation";

// import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  useEffect(() => {}, []);

  return (
    <main className="min-h-screen w-10/12">
      <IntroAnimationComponent />
    </main>
  );
}
