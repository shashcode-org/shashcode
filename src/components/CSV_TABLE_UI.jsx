import React, { useState, useEffect, useMemo } from 'react';
import { csvData } from '../data/csv-data-java-dsa-release-v1';
import { RiArrowRightSLine } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";
import { motion, AnimatePresence } from 'framer-motion'; // 💥 Added

const CSV_TABLE_UI = () => {
    const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const uniqueTopics = useMemo(() => ["All", ...new Set(csvData.map(topic => topic["Main Topic"]))], []);

    const filteredTopics = useMemo(() => {
        let topics = selectedTopic === "All"
            ? csvData
            : csvData.filter(topic => topic["Main Topic"] === selectedTopic);

        if (searchQuery.trim() !== "") {
            topics = topics.map(topic => {
                const filteredSubtopics = topic.Subtopics.map(subtopic => {
                    const filteredDetails = subtopic.Details.filter(detail =>
                        detail.Detail.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    return filteredDetails.length > 0 ? { ...subtopic, Details: filteredDetails } : null;
                }).filter(subtopic => subtopic !== null);

                return filteredSubtopics.length > 0 ? { ...topic, Subtopics: filteredSubtopics } : null;
            }).filter(topic => topic !== null);
        }

        return topics;
    }, [selectedTopic, searchQuery]);

    useEffect(() => {
        setExpandedTopicIndex(selectedTopic === "All" ? null : 0);
    }, [selectedTopic]);

    const handleTopicToggle = (index) => {
        setExpandedTopicIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleTagClick = (topic) => {
        setSelectedTopic(topic);
    };

    const handleKeyDown = (event, index) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleTopicToggle(index);
        }
    };

    return (
        <div className="accordion-table-container mt-6">
            <div className="mb-6 text-xs sm:text-sm">
                <input
                    type="text"
                    placeholder="Search Subtopics or Questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 w-full bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400"
                />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {uniqueTopics.map((topic, index) => (
                    <button
                        key={index}
                        className={`px-3 py-[6px] sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-sm font-medium transition-all duration-300 shadow-sm
                            ${selectedTopic === topic
                                ? "bg-yellow-400 text-slate-900 shadow-md"
                                : "bg-slate-800 text-gray-200 hover:bg-slate-700"}
                              `}
                        onClick={() => handleTagClick(topic)}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            {filteredTopics.map((mainTopic, mainIndex) => (
                <div key={mainIndex} className="accordion-section mb-4">
                    <div
                        className="accordion-header flex justify-between items-center p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-all text-sm sm:text-base text-white"
                        onClick={() => handleTopicToggle(mainIndex)}
                        onKeyDown={(e) => handleKeyDown(e, mainIndex)}
                        tabIndex={0}
                    >
                        <span className="font-semibold text-white">{mainTopic["Main Topic"]}</span>
                        <span className={`arrow transition-transform duration-300 ease-in-out ${expandedTopicIndex === mainIndex ? 'rotate-90' : 'rotate-0'}`}>
                            <RiArrowRightSLine className='w-[20px] sm:w-[24px] h-auto' />
                        </span>
                    </div>

                    <AnimatePresence initial={false}>
                        {expandedTopicIndex === mainIndex && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="mt-3 bg-slate-800 text-white rounded-lg overflow-hidden shadow-md border border-slate-700"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-slate-700">
                                        <thead>
                                            <tr className="text-white text-left text-xs sm:text-sm">
                                                <th className="border border-slate-700 p-2 w-[30%]">Subtopic</th>
                                                <th className="border border-slate-700 p-2 w-1/2">Details</th>
                                                <th className="border border-slate-700 py-2 w-[10%] text-center">Solve</th>
                                                <th className="border border-slate-700 py-2 w-[10%] text-center">Video</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mainTopic.Subtopics.map((subtopic, subIndex) => (
                                                subtopic.Details.map((detail, detailIndex) => (
                                                    <tr key={`${subIndex}-${detailIndex}`} className="border border-slate-700 transition-all">
                                                        {detailIndex === 0 ? (
                                                            <td className="border border-slate-700 hover:bg-slate-700 p-2 font-semibold align-top text-xs sm:text-sm" rowSpan={subtopic.Details.length}>
                                                                {subtopic.Subtopic}
                                                            </td>
                                                        ) : null}

                                                        {!detail.Links || !Array.isArray(detail.Links) || !detail.Links.some(link => link.includes("leetcode") || link.includes("geeksforgeeks")) ? (
                                                            <td className="border border-slate-700 hover:bg-slate-700 p-2 text-xs sm:text-sm capitalize align-top" colSpan={2}>
                                                                {detail.Detail}
                                                            </td>
                                                        ) : (
                                                            <>
                                                                <td className="border border-slate-700 hover:bg-slate-700 p-2 text-xs sm:text-sm capitalize align-top">
                                                                    {detail.Detail}
                                                                </td>
                                                                <td className="border border-slate-700 hover:bg-slate-700 p-2 text-center align-top">
                                                                    <div className="flex justify-center gap-2">
                                                                        {detail.Links.map((link, index) => (
                                                                            link !== "N/A" ? (
                                                                                <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="inline-block">
                                                                                    {link.includes("leetcode") ? (
                                                                                        <SiLeetcode className="w-[16px] sm:w-[20px] h-auto text-yellow-500" />
                                                                                    ) : link.includes("geeksforgeeks") ? (
                                                                                        <SiGeeksforgeeks className="w-[20px] sm:w-[24px] h-auto text-green-600" />
                                                                                    ) : (
                                                                                        <span className="text-blue-600 underline">Solve</span>
                                                                                    )}
                                                                                </a>
                                                                            ) : null
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}

                                                        <td className="border border-slate-700 hover:bg-slate-700 p-2 text-center align-top">
                                                            {detail["Video Link"] && detail["Video Link"].includes('https') && (
                                                                <a href={detail["Video Link"]} target="_blank" rel="noopener noreferrer">
                                                                    <FaYoutube className="inline-block w-[20px] sm:w-[24px] h-auto text-red-600 hover:text-red-700" />
                                                                </a>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

export default CSV_TABLE_UI;
