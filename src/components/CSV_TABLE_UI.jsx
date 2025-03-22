import React, { useState, useEffect, useMemo } from 'react';
import { csvData } from '../data/csv-data-v10-sheet-6.3';
import { RiArrowRightSLine } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";

const CSV_TABLE_UI = () => {

    const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState("All");
    
    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    // Get unique main topics for filtering
    const uniqueTopics = useMemo(() => ["All", ...new Set(csvData.map(topic => topic["Main Topic"]))], []);

    // Filter topics based on selected tag and search query
    const filteredTopics = useMemo(() => {
        let topics = selectedTopic === "All"
            ? csvData
            : csvData.filter(topic => topic["Main Topic"] === selectedTopic);

        // If search query exists, filter subtopics and details
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

    // Automatically expand the first topic when a tag is selected
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
        <div className="accordion-table-container mt-4">
            
            {/* Search Input */}
            <div className="mb-6 text-xs sm:text-sm">
                <input
                    type="text"
                    placeholder="Search Subtopics or Questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 w-full border rounded-md"
                />
            </div>

            {/* Tag Filter Section */}
            <div className="flex flex-wrap gap-2 mb-6">
                {uniqueTopics.map((topic, index) => (
                    <button
                        key={index}
                        className={`px-2 py-[3px] sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all 
                            ${selectedTopic === topic
                                ? "bg-signature_yellow text-signature_dark shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                        onClick={() => handleTagClick(topic)}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            {/* Accordion Sections */}
            {filteredTopics.map((mainTopic, mainIndex) => (
                <div key={mainIndex} className="accordion-section mb-3">
                    
                    {/* Main Topic Row (Collapsible Header) */}
                    <div
                        className="accordion-header flex justify-between items-center p-3 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-all text-sm sm:text-base"
                        onClick={() => handleTopicToggle(mainIndex)}
                        onKeyDown={(e) => handleKeyDown(e, mainIndex)}
                        tabIndex={0}
                    >
                        <span className="font-semibold">{mainTopic["Main Topic"]}</span>
                        <span className={`arrow transition-transform duration-300 ease-in-out ${expandedTopicIndex === mainIndex ? 'rotate-90' : 'rotate-0'}`}>
                            <RiArrowRightSLine className='w-[20px] sm:w-[24px] h-auto' />
                        </span>
                    </div>

                    {/* Collapsible Content: Show Subtopics Table */}
                    {expandedTopicIndex === mainIndex && (
                        <div className="mt-3 bg-white rounded-md overflow-x-auto shadow-md">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200 text-left text-xs sm:text-sm">
                                        <th className="border p-2 w-[30%]">Subtopic</th>
                                        <th className="border p-2 w-1/2">Details</th>
                                        <th className="border py-2 w-[10%] text-center">Solve</th>
                                        <th className="border py-2 w-[10%] text-center">Video</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mainTopic.Subtopics.map((subtopic, subIndex) => (
                                        subtopic.Details.map((detail, detailIndex) => (
                                            <tr key={`${subIndex}-${detailIndex}`} className="border">

                                                {/* Subtopic (Only for first detail row of each subtopic) */}
                                                {detailIndex === 0 ? (
                                                    <td className="border p-2 font-semibold align-top text-xs sm:text-sm" rowSpan={subtopic.Details.length}>
                                                        {subtopic.Subtopic}
                                                    </td>
                                                ) : null}

                                                {/* If no valid Solve link, merge Solve column into Details */}
                                                {/* {!detail.Links || !detail.Links.startsWith("http") ? (  */}
                                                {/* {!detail.Links || !Array.isArray(detail.Links) || !detail.Links.some(link => link.startsWith("http")) ? ( */}
                                                {!detail.Links || !Array.isArray(detail.Links) || !detail.Links.some(link => link.includes("leetcode") || link.includes("geeksforgeeks"))  ? (
                                                    <td className="border p-2 text-xs sm:text-sm capitalize align-top" colSpan={2}>
                                                        {detail.Detail}
                                                    </td>
                                                ) : (
                                                    <>
                                                        {/* Details (Question Name) */}
                                                        <td className="border p-2 text-xs sm:text-sm capitalize align-top">
                                                            {detail.Detail}
                                                        </td>

                                                        {/* Solve Links (Handle multiple links) */}
                                                        <td className="border p-2 text-center align-top">
                                                            <div className="flex align-center justify-center gap-2">
                                                                {detail.Links.map((link, index) => (
                                                                    link !== "N/A" ? (
                                                                        <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="inline-block">
                                                                            {link.includes("leetcode") ? (
                                                                                <SiLeetcode className="w-[16px] sm:w-[20px] h-auto text-yellow-500" />
                                                                            ) : link.includes("geeksforgeeks") ? (
                                                                                <SiGeeksforgeeks className="w-[20px] sm:w-[24px] h-auto text-green-500" />
                                                                            ) : (
                                                                                <span className="text-blue-600 underline"> No Solve Link </span>
                                                                            )}
                                                                        </a>
                                                                    ) : null
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                                
                                                {/* Video Link (Show detail level video links) */}
                                                <td className="border p-2 text-center align-top">
                                                    {detail["Video Link"] && detail["Video Link"].includes('https') && (
                                                        <a href={detail["Video Link"]} target="_blank" rel="noopener noreferrer">
                                                            <FaYoutube className="inline-block w-[20px] sm:w-[24px] h-auto text-red-700" />
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CSV_TABLE_UI;
