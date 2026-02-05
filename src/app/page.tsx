"use client";
import React, { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import ContentBlock from "@/components/ContentBlock";
// import ChapterOutline from "@/components/ChapterOutline"; // Optional: Add later if layout permits
import ReferencesSection from "@/components/ReferencesSection";
import Footer from "@/components/Footer";
import reportData from "@/data/report.json";

export default function Home() {
    const [activeChapter, setActiveChapter] = useState<string>(reportData.chapters[0]?.id || "");

    const handleNavigate = (id: string) => {
        setActiveChapter(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleInView = (id: string) => {
        setActiveChapter(id);
    };

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <HeroSection />

            <div className="flex max-w-[1600px] mx-auto overflow-visible relative z-20 bg-[var(--background)] shadow-2xl mt-[-5vh] sm:mt-[-8vh] md:mt-[-10vh] rounded-t-2xl sm:rounded-t-3xl border-t border-[var(--accent)]/20">
                {/* Sidebar Navigation (Left) */}
                <Navigation
                    chapters={reportData.chapters}
                    activeId={activeChapter}
                    onNavigate={handleNavigate}
                />

                {/* Main Content Area (Center) */}
                <div className="flex-1 w-full relative min-w-0">
                    <div className="w-full lg:max-w-4xl lg:mx-auto pb-8">
                        {reportData.chapters.map((chapter) => (
                            <ContentBlock
                                key={chapter.id}
                                chapter={chapter}
                                onInView={handleInView}
                            />
                        ))}
                    </div>

                    {/* References Section */}
                    <ReferencesSection references={reportData.references} />

                    <Footer />
                </div>

                {/* Outline Sidebar (Right) - Hidden for now or implement as sticky if space permits */}
                {/* <div className="hidden 2xl:block w-72 sticky top-0 h-screen p-8 border-l border-[var(--accent)]/10">
             <ChapterOutline ... /> 
         </div> */}
            </div>
        </main>
    );
}
