"use client";

import MobileNav from "./MobileNav";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [hasLogin, setHasLogin] = useState(false);

 useEffect(() => {
    // 1. Create the helper function
    const checkLogin = () => {
      const id = localStorage.getItem("fpl_manager_id");
      setHasLogin(!!id);
    };

    // 2. Check immediately when the navbar loads
    checkLogin();

    // 3. Listen for the auth change event we created in page.tsx
    window.addEventListener("fpl-auth-change", checkLogin);

    // 4. Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener("fpl-auth-change", checkLogin);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-0">
        
        {/* Logo */}
        <div className="flex items-center gap-1 leading-none">
          <Image src="/FPLPred_logo.png" alt="FPLPredict Logo" width={50} height={46} priority />
          <Link href="/" className="cursor-pointer">
            <span className="text-2xl font-bold tracking-wider text-white">
              FPL<span className="text-green-500">Predict</span>
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <ul className="hidden lg:flex gap-12 items-center text-white/80 font-medium">
          <li>
            <Link
              href="/prediction"
              onClick={(e) => {
                // If no ID, force them to login instead
                if (!localStorage.getItem("fpl_manager_id")) {
                  e.preventDefault();
                  window.location.href = "/login";
                }
              }}
              className="hover:text-green-500 transition"
            >
              Prediction
            </Link>
          </li>

          <li>
            <Link
              href="/planner"
              onClick={(e) => {
                if (!localStorage.getItem("fpl_manager_id")) {
                  e.preventDefault();
                  window.location.href = "/login";
                }
              }}
              className="hover:text-green-500 transition"
            >
              Planner
            </Link>
          </li>
          <li>
            <Link
              href="/players"
              className="hover:text-green-500 cursor-pointer transition-colors"
            >
              Players
            </Link>
          </li>
          {/* Fixtures */}
          <li>
            <Link
              href="/fixtures"
              className="hover:text-green-500 cursor-pointer transition-colors"
            >
              Fixtures
            </Link>
          </li>

          {/* Login */}
          <li>
            <Link href="/login">
              <button className="fpl-neon-btn">
                <span>{hasLogin ? "Change Team" : "Login"}</span>
              </button>
            </Link>
          </li>
        </ul>

        {/* Mobile */}
        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}