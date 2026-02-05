"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ChapterOutlineProps {
    content: string;
    chapterId: string;
}

export default function ChapterOutline({ content, chapterId }: ChapterOutlineProps) {
    const [subsections, setSubsections] = useState<{ id: string, title: string }[]>([]);

    useEffect(() => {
        // Parse content looking for lines starting with "X.X." or "X.X.X."
        // Or lines that look like headers (short, bold logic if we had markdown)
        // From raw text, the parsing script preserved headers as part of content.
        // We look for pattern: ^\d+\.\d+\.?\s*(.+)$
        const lines = content.split('\n');
        const found = lines.map((line, idx) => {
            const match = line.trim().match(/^(\d+\.\d+\.?.*)$/);
            if (match && match[1].length < 100) { // arbitrary length limit to avoid false positives
                return {
                    id: `${chapterId}-sub-${idx}`,
                    title: match[1]
                };
            }
            return null;
        }).filter(item => item !== null) as { id: string, title: string }[];

        setSubsections(found);
    }, [content, chapterId]);

    if (subsections.length === 0) return null;

    return (
        <div className="hidden xl:block sticky top-24 w-64 p-4 pl-8 border-l border-[var(--accent)]/10 h-fit max-h-[80vh] overflow-y-auto">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--accent)] mb-4 font-serif">
                Trong chương này
            </h4>
            <ul className="space-y-3">
                {subsections.map((sub) => (
                    <li key={sub.id}>
                        <button
                            className="text-xs text-left text-[var(--foreground)]/60 hover:text-[var(--accent)] transition-colors duration-200 leading-snug font-[family-name:var(--font-body)]"
                            onClick={() => {
                                // Since we don't have IDs on the P tags in content block yet, scroll logic is tricky.
                                // Improvement: ContentBlock should assign IDs to these headers.
                                // For now, this is a visual outline only.
                            }}
                        >
                            {sub.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
