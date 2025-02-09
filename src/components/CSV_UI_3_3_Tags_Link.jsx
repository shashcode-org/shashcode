import React, { useState, useEffect, useMemo } from 'react';
import { csvDataAll } from '../data/csv-data-v3-solve';
import '../styles/Table.css';
import { RiArrowRightSLine } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";

const CSV_UI_3_3_Tags_Link = () => {
    const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState("All");

    // Get unique main topics for filtering
    const uniqueTopics = useMemo(() => ["All", ...new Set(csvDataAll.map(topic => topic["Main Topic"]))], []);

    // Memoized filtered topics for better performance
    const filteredTopics = useMemo(() => {
        return selectedTopic === "All"
            ? csvDataAll
            : csvDataAll.filter(topic => topic["Main Topic"] === selectedTopic);
    }, [selectedTopic]);

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
        <div className="accordion-table-container mt-10">
            {/* Tag Filter Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {uniqueTopics.map((topic, index) => (
                    <button
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all 
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
                <div key={mainIndex} className="accordion-section">
                    {/* Main Topic Row (Collapsible Header) */}
                    <div
                        className="accordion-header flex justify-between items-center p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-all"
                        onClick={() => handleTopicToggle(mainIndex)}
                        onKeyDown={(e) => handleKeyDown(e, mainIndex)}
                        tabIndex={0}
                    >
                        <span className="font-semibold">{mainTopic["Main Topic"]}</span>
                        <span className={`arrow transition-transform ${expandedTopicIndex === mainIndex ? 'rotate-90' : 'rotate-0'}`}>
                            <RiArrowRightSLine size={25} />
                        </span>
                    </div>

                    {/* Collapsible Content: Show Subtopics Table */}
                    {expandedTopicIndex === mainIndex && (
                        <div className="mt-3 p-3 bg-white shadow rounded-md">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200 text-left text-sm">
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
                                                    <td className="border p-2 font-semibold align-top text-[15px]" rowSpan={subtopic.Details.length}>
                                                        {subtopic.Subtopic}
                                                    </td>
                                                ) : null}

                                                {/* If no Solve link, merge Solve column into Details */}
                                                {detail.Solve === "N/A" ? (
                                                    <td className="border p-2 text-sm capitalize align-top" colSpan={2}>
                                                        {detail.Detail}
                                                    </td>
                                                ) : (
                                                    <>
                                                        {/* Details (Question Name) */}
                                                        <td className="border p-2 text-sm capitalize align-top">
                                                            {detail.Detail}
                                                        </td>

                                                        {/* Solve Links */}
                                                        <td className="border p-2 text-center align-top">
                                                            <a href={detail.Solve} target="_blank" rel="noopener noreferrer">
                                                                <SiLeetcode className="inline-block w-[24px] h-auto text-yellow-500" />
                                                            </a>
                                                        </td>
                                                    </>
                                                )}

                                                {/* Video Link (Only for first row of each subtopic) */}
                                                {detailIndex === 0 ? (
                                                    <td className="border p-2 text-center align-top" rowSpan={subtopic.Details.length}>
                                                        {subtopic["Video Link"] && (
                                                            <a href={subtopic["Video Link"]} target="_blank" rel="noopener noreferrer">
                                                                <FaYoutube className="inline-block w-[24px] h-auto text-red-700" />
                                                            </a>
                                                        )}
                                                    </td>
                                                ) : null}
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

export default CSV_UI_3_3_Tags_Link;
