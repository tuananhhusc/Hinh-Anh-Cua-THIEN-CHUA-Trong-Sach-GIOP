"use client";
import React from "react";

interface Reference {
    id: string;
    citation: string;
    url: string;
}

interface ReferencesSectionProps {
    references: Reference[];
}

export default function ReferencesSection({ references }: ReferencesSectionProps) {
    if (!references || references.length === 0) return null;

    return (
        <section id="references" className="bg-[var(--secondary)]/5 py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 border-t border-[var(--accent)]/30">
            <div className="w-full lg:max-w-3xl lg:mx-auto">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-[family-name:var(--font-heading)] font-bold mb-6 sm:mb-8 text-[var(--accent)] border-b border-[var(--accent)]/20 pb-4 inline-block">
                    Tài Liệu Tham Khảo
                </h2>

                <ol className="space-y-3 sm:space-y-4 list-decimal list-outside ml-4 sm:ml-5">
                    {references.map((ref, idx) => {
                        // Attempt to clean citation if needed
                        let citationText = ref.citation.replace(/^\d+:\s*/, '').trim();

                        return (
                            <li key={ref.id} id={`ref-${idx + 1}`} className="text-sm sm:text-base text-[var(--foreground)]/80 font-[family-name:var(--font-body)] pl-1 sm:pl-2 marker:text-[var(--accent)] marker:font-bold">
                                {citationText}
                                {ref.url && (
                                    <a
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-[var(--accent)] hover:underline text-xs uppercase tracking-wider font-sans"
                                    >
                                        [Truy cập]
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
