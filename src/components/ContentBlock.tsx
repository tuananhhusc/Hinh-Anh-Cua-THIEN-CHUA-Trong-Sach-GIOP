"use client";
import React, { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface Chapter {
    id: string;
    number: number;
    title: string;
    abstract: string;
    content: string;
    keyQuote: string;
}

interface ContentBlockProps {
    chapter: Chapter;
    onInView: (id: string) => void;
}

// Low-fi parser for the specific table structure
// "Bảng 1:..." followed by title rows and data rows groups of 3
const parseTableContent = (paragraphs: string[], startIndex: number) => {
    // Title is at startIndex
    const title = paragraphs[startIndex].replace("Bảng 1: ", "").trim();

    // Headers: next 3 lines
    // "Đặc điểm", "Satan trong Sách Gióp...", "Satan trong Tân Ước..."
    const headerRow = [
        paragraphs[startIndex + 1],
        paragraphs[startIndex + 2],
        paragraphs[startIndex + 3]
    ];

    // Data rows: groups of 3 until we hit a non-matching pattern or end of buffer
    // For this specific hardcoded intervention, we know there are 4 rows.
    // Total lines to consume = 1 (title) + 3 (header) + 4*3 (12 data) = 16 lines.

    const dataRows = [];
    let currentIndex = startIndex + 4;
    const itemsPerRow = 3;
    const rowCount = 4; // Vị thế, Quyền hạn, Chức năng, Mối quan hệ

    for (let i = 0; i < rowCount; i++) {
        const row = [];
        for (let j = 0; j < itemsPerRow; j++) {
            if (currentIndex + j < paragraphs.length) {
                row.push(paragraphs[currentIndex + j]);
            }
        }
        dataRows.push(row);
        currentIndex += itemsPerRow;
    }

    return {
        title,
        headerRow,
        dataRows,
        consumedCount: 16 // Explicitly consume 16 paragraphs
    };
};

const GLOSSARY: Record<string, string> = {
    "Leviathan": "Quái vật biển khổng lồ tượng trưng cho sự hỗn mang nguyên thủy (Chaos). Trong sách Gióp, nó đại diện cho những sức mạnh thiên nhiên mà con người không thể kiểm soát nhưng Chúa tể trị.",
    "Goel": "Thuật ngữ pháp lý Do Thái chỉ 'Người Cứu Chuộc' hoặc 'Người Bảo Lãnh'. Gióp dùng từ này để chỉ Thiên Chúa - Đấng sẽ minh oan cho ông.",
    "Divine Council": "Hội đồng Thiên quốc, nơi Thiên Chúa họp bàn với các thiên sứ/thần thánh.",
    "Deus Absconditus": "Thiên Chúa Ẩn Giấu - Khái niệm của Luther chỉ sự ẩn mình của Chúa dưới những hình thức trái ngược (như đau khổ, thập giá).",
    "Theophany": "Sự Thần Hiện - Sự xuất hiện trực tiếp của Thiên Chúa (như trong Cơn bão táp).",
    "Behemoth": "Quái thú trên cạn (thường hiểu là hà mã), biểu tượng cho sức mạnh hoang dã của tạo vật.",
    "Theodicy": "Biện thần luận - Sự bào chữa cho sự công bình của Chúa trước sự tồn tại của sự dữ.",
    "Satan": "Trong sách Gióp (ha-satan), nghĩa là 'Kẻ Đối Kháng' hoặc 'Kẻ Cáo Buộc', một thành viên của Hội đồng Thiên quốc có nhiệm vụ kiểm tra lòng trung thành, chưa phải là Quỷ dữ (Devil) như trong Tân Ước.",
    "Divine Providence": "Sự Quan Phòng - Sự chăm sóc và cai quản khôn ngoan của Thiên Chúa trên mọi sự việc.",
    "Retribution Theology": "Thần học thưởng phạt - Quan niệm rằng người lành luôn được phước và kẻ ác luôn bị trừng phạt.",
};

export default function ContentBlock({ chapter, onInView }: ContentBlockProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) {
            onInView(chapter.id);
        }
    }, [isInView, chapter.id, onInView]);

    const renderTextWithGlossary = (text: string, isDropCap = false) => {
        // 1. Remove subsection numbering (e.g. "1.1. ", "7.4. ") to clean the view
        let processedText = text.replace(/^\d+(\.\d+)+\.?\s*/, "");

        // 2. Remove em-dashes
        processedText = processedText.replace(/—/g, " ");

        // Find glossary terms
        const terms = Object.keys(GLOSSARY);
        terms.sort((a, b) => b.length - a.length);
        const glossaryPattern = new RegExp(`(${terms.join('|')})`, 'gi');

        const parts = processedText.split(glossaryPattern);

        const children = parts.map((part, i) => {
            const matchedKey = terms.find(t => t.toLowerCase() === part.toLowerCase());
            if (matchedKey) {
                return (
                    <span key={`gloss-${i}`} className="text-[var(--accent)] font-bold cursor-help relative group border-b border-dashed border-[var(--accent)]/50">
                        {part}
                        <span className="invisible group-hover:visible absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-[var(--secondary)] text-[var(--background)] text-sm rounded-md shadow-xl border border-[var(--accent)] z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-left font-sans normal-case leading-snug">
                            <strong className="block text-[var(--accent)] mb-1 uppercase text-xs tracking-wider">{matchedKey}</strong>
                            {GLOSSARY[matchedKey]}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--secondary)]"></span>
                        </span>
                    </span>
                );
            }

            // Citation Parsing
            // Look for patterns like ".1 ", ".15", Or just "32" if it's standalone?
            // Based on input, citation is numbers attached to end of sentences often like "word.1"
            // Regex: matches (period/punct)(number)(space/end)
            const citationParts = part.split(/(\.|,)(\d+)(?=\s|$)/);

            if (citationParts.length === 1) return part;

            return citationParts.map((subPart, j) => {
                // If we have a number at 'j' and 'j-1' was punctuation, it's a citation
                if (j > 0 && /^\d+$/.test(subPart) && (/(\.|,)/.test(citationParts[j - 1]))) {
                    return (
                        <sup key={`cite-${i}-${j}`}>
                            <a
                                href="#references"
                                className="text-[var(--accent)] hover:text-[var(--foreground)] font-bold cursor-pointer ml-0.5 no-underline hover:underline transition-all"
                                title={`Xem nguồn trích dẫn [${subPart}]`}
                            >
                                [{subPart}]
                            </a>
                        </sup>
                    );
                }
                return subPart;
            });
        });

        // Drop Cap logic
        // Only apply if isDropCap is true and the FIRST child is a simple string starting with letter
        if (isDropCap && children.length > 0 && typeof children[0] === 'string') {
            const firstStr = children[0];
            if (firstStr.match(/^[a-zA-Z0-9À-ỹ]/)) {
                const dropCapChar = firstStr.charAt(0);
                const rest = firstStr.slice(1);
                return (
                    <>
                        <span className="drop-cap float-left mr-3 mt-[-0.1em] mb-[-0.2em]">{dropCapChar}</span>
                        {rest}{children.slice(1)}
                    </>
                );
            }
        }

        return children;
    }

    const renderContent = (content: string) => {
        const paragraphs = content.split('\n').filter(p => p.trim() !== "");
        const elements = [];
        let i = 0;

        while (i < paragraphs.length) {
            const p = paragraphs[i];

            if (p.startsWith("Bảng 1:")) {
                // Trigger Table Mode
                const { title, headerRow, dataRows, consumedCount } = parseTableContent(paragraphs, i);

                elements.push(
                    <div key={`table-${i}`} className="my-12 overflow-hidden border border-[var(--accent)]/30 rounded-lg shadow-sm">
                        <div className="bg-[var(--accent)]/10 p-4 border-b border-[var(--accent)]/30">
                            <h4 className="font-[family-name:var(--font-heading)] font-bold text-[var(--accent)] text-center text-lg uppercase tracking-wide">
                                Bảng 1: {title}
                            </h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        {headerRow.map((h, idx) => (
                                            <th key={idx} className={cn(
                                                "p-4 border-b border-[var(--accent)]/20 font-serif font-bold text-[var(--foreground)] bg-[var(--background)]/50 align-top",
                                                idx === 0 ? "w-1/6 text-[var(--accent)]" : "w-5/12"
                                            )}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataRows.map((row, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-[var(--accent)]/5 transition-colors">
                                            {row.map((cell, cIdx) => (
                                                <td key={cIdx} className={cn(
                                                    "p-4 border-b border-[var(--accent)]/10 align-top text-base leading-relaxed",
                                                    cIdx === 0 ? "font-bold text-[var(--accent)] font-serif border-r border-[var(--accent)]/10" : ""
                                                )}>
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

                i += consumedCount;
            } else {
                // Regular paragraph
                elements.push(
                    <p key={i} className="mb-4 sm:mb-6 text-base sm:text-lg md:text-xl leading-relaxed text-[var(--foreground)]/90 font-[family-name:var(--font-body)] text-justify relative">
                        {renderTextWithGlossary(p, i === 0)}
                    </p>
                );
                i++;
            }
        }

        return elements;
    };

    return (
        <section
            id={chapter.id}
            ref={ref}
            className="min-h-screen py-12 px-4 sm:py-16 sm:px-6 md:py-24 md:px-12 border-b border-[var(--accent)]/10 flex flex-col justify-center"
        >
            <div className="w-full lg:max-w-4xl lg:mx-auto">
                <div className="mb-12 text-center">
                    <span className="text-[var(--accent)] font-serif text-sm uppercase tracking-widest block mb-2">
                        Chương {chapter.number}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-[family-name:var(--font-heading)] font-bold mb-4 sm:mb-6 md:mb-8 text-[var(--foreground)]">
                        {chapter.title}
                    </h2>
                    {chapter.abstract && (
                        <div className="italic text-[var(--foreground)]/70 text-base sm:text-lg md:text-xl border-y border-[var(--accent)]/30 py-4 sm:py-6 my-4 sm:my-6 md:my-8 font-[family-name:var(--font-heading)] text-justify">
                            {chapter.abstract.replace(/^\d+(\.\d+)+\.?\s*/, "")}
                        </div>
                    )}
                </div>

                <div className="prose prose-lg prose-p:font-[family-name:var(--font-body)] max-w-none text-[var(--foreground)] text-justify">
                    {renderContent(chapter.content)}
                </div>

                {chapter.keyQuote && (
                    <div className="mt-20 relative px-8">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-10 text-8xl text-[var(--accent)]/10 font-[family-name:var(--font-heading)]">“</div>
                        <blockquote className="academic-quote text-2xl md:text-3xl text-center border-none !p-0 font-[family-name:var(--font-heading)] text-[var(--accent)] leading-tight">
                            {chapter.keyQuote}
                        </blockquote>
                        <div className="w-16 h-[2px] bg-[var(--accent)]/50 mx-auto mt-8"></div>
                    </div>
                )}
            </div>
        </section>
    );
}
