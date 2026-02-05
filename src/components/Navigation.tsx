"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { cn } from "@/lib/utils";

interface Chapter {
    id: string;
    number: number;
    title: string;
}

interface NavigationProps {
    chapters: Chapter[];
    activeId: string;
    onNavigate: (id: string) => void;
}

export default function Navigation({ chapters, activeId, onNavigate }: NavigationProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleMobileClick = (id: string) => {
        setIsMobileOpen(false);
        onNavigate(id);
    }

    return (
        <>
            {/* Mobile Toggle Button - Fixed position outside the main structure flow */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-6 right-6 z-50 p-3 bg-[var(--background)] text-[var(--accent)] border border-[var(--accent)] rounded-full shadow-2xl hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all duration-300"
                aria-label="Menu"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Drawer Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-[var(--secondary)]/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
                    isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* Mobile Drawer Content */}
            <div
                className={cn(
                    "fixed top-0 right-0 z-40 h-full w-[80%] max-w-sm bg-[var(--background)] border-l border-[var(--accent)]/50 shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col p-8 overflow-y-auto",
                    isMobileOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="mb-8 mt-12">
                    <h3 className="text-[var(--accent)] font-[family-name:var(--font-heading)] uppercase text-lg font-bold mb-2">
                        Mục Lục
                    </h3>
                    <div className="w-16 h-[2px] bg-[var(--accent)]/50"></div>
                </div>

                <ul className="space-y-6">
                    {chapters.map((chapter) => (
                        <li key={chapter.id}>
                            <button
                                onClick={() => handleMobileClick(chapter.id)}
                                className={cn(
                                    "text-left transition-colors font-[family-name:var(--font-heading)] text-base w-full",
                                    activeId === chapter.id
                                        ? "text-[var(--accent)] font-bold pl-3 border-l-4 border-[var(--accent)]"
                                        : "text-[var(--foreground)]/80"
                                )}
                            >
                                <span className="block text-xs uppercase opacity-60 mb-1">Chương {chapter.number}</span>
                                {chapter.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Desktop Sidebar (unchanged visually but using same logic) */}
            <nav className="hidden lg:block sticky top-0 h-screen w-80 p-8 border-r border-[var(--accent)]/20 overflow-y-auto shrink-0">
                <div className="mb-8">
                    <h3 className="text-[var(--accent)] font-[family-name:var(--font-heading)] uppercase text-sm font-bold mb-2">
                        Mục Lục
                    </h3>
                    <div className="w-12 h-[1px] bg-[var(--accent)]"></div>
                </div>

                <ul className="space-y-4">
                    {chapters.map((chapter) => (
                        <li key={chapter.id}>
                            <button
                                onClick={() => onNavigate(chapter.id)}
                                className={cn(
                                    "text-left transition-colors duration-300 ease-in-out font-[family-name:var(--font-heading)] text-sm leading-relaxed w-full hover:text-[var(--accent)]",
                                    activeId === chapter.id
                                        ? "text-[var(--accent)] font-bold pl-2 border-l-2 border-[var(--accent)]"
                                        : "text-[var(--foreground)]/60"
                                )}
                            >
                                <span className="block text-xs opacity-70 mb-1">Chương {chapter.number}</span>
                                {chapter.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
