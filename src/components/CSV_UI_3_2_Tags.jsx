import React, { useState, useEffect } from 'react';
import { csvDataAll } from '../data/csv-data-all';
import '../styles/Table.css';
import { RiArrowRightSLine } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";



const CSV_UI_3_2_Tags = () => {

    const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState("All");

    // Get unique main topics for filtering
    const uniqueTopics = ["All", ...new Set(csvDataAll.map(topic => topic["Main Topic"]))];

    // Filter topics based on selection
    const filteredTopics = selectedTopic === "All"
        ? csvDataAll
        : csvDataAll.filter(topic => topic["Main Topic"] === selectedTopic);

    // Automatically expand the first topic when a tag is selected
    useEffect(() => {
        if (selectedTopic === "All") {
            setExpandedTopicIndex(null); // Collapse all when "All" is selected
        } else {
            const topicIndex = csvDataAll.findIndex(topic => topic["Main Topic"] === selectedTopic);
            setExpandedTopicIndex(topicIndex !== -1 ? topicIndex : null);
        }
    }, [selectedTopic]);

    const handleTopicToggle = (index) => {
        setExpandedTopicIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleTagClick = (topic) => {
        setSelectedTopic(topic);
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
            {filteredTopics.map((mainTopic, mainIndex) => {
                // Get the correct index in the full dataset
                const actualIndex = csvDataAll.findIndex(topic => topic["Main Topic"] === mainTopic["Main Topic"]);

                return (
                    <div key={mainIndex} className="accordion-section">
                        {/* Main Topic Row (Collapsible Header) */}
                        <div
                            className="accordion-header flex justify-between items-center p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-all"
                            onClick={() => handleTopicToggle(actualIndex)}
                        >
                            <span className="font-semibold">{mainTopic["Main Topic"]}</span>
                            <span className={`arrow transition-transform ${expandedTopicIndex === actualIndex ? 'rotate-90' : 'rotate-0'}`}>
                                {/* <RiArrowRightSLine className='w-[30px] h-fit' /> */}
                                <RiArrowRightSLine size={25} />
                            </span>
                        </div>

                        {/* Collapsible Content: Show Subtopics Table */}
                        {expandedTopicIndex === actualIndex && (
                            <div className="mt-3 p-3 bg-white shadow rounded-md">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200 text-left text-sm">
                                            <th className="border p-2 w-[30%]">Subtopic</th>
                                            <th className="border p-2 w-1/2">Details</th>
                                            <th className="border py-2 w-fit text-center">Solve</th>
                                            <th className="border py-2 w-fit text-center">Video</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mainTopic.Subtopics.map((subtopic, subIndex) => (
                                            <tr key={subIndex} className="border">
                                                <td className="border p-2 w-[30%] font-semibold align-top text-[15px]">{subtopic.Subtopic}</td>
                                                <td className="border p-2 w-auto">
                                                    <ul className="list-disc pl-4 text-sm capitalize">
                                                        {subtopic.Details.map((detail, detailIndex) => (
                                                            <li key={detailIndex}>{detail.Detail}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="border py-2 text-center w-fit align-top">
                                                    <a href={subtopic["Video Link"]} target="_blank" rel="noopener noreferrer">
                                                        <SiLeetcode className="inline-block w-[24px] h-auto" />
                                                    </a>
                                                </td>
                                                <td className="border py-2 text-center w-fit align-top">
                                                    <a href={subtopic["Video Link"]} target="_blank" rel="noopener noreferrer">
                                                        <FaYoutube className="inline-block w-[24px] h-auto text-red-700" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CSV_UI_3_2_Tags;