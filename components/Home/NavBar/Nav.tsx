"use client";

import MobileNav from "./MobileNav";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [hasLogin, setHasLogin] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("fpl_manager_id");
    setHasLogin(!!id);
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
              href={hasLogin ? "/prediction" : "/login"}
              className="hover:text-green-500 transition"
            >
              Prediction
            </Link>
          </li>

          <li>
            <Link
              href={hasLogin ? "/planner" : "/login"} 
              className="hover:text-green-500 transition font-medium"
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