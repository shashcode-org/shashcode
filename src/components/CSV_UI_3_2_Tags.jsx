import React, { useState } from 'react';
import { csvDataAll } from '../data/csv-data-all';
import '../styles/Table.css';

const CSV_UI_3_2_Tags = () => {
    const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState("All");

    const handleTopicToggle = (index) => {
        setExpandedTopicIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleTagClick = (topic) => {
        setSelectedTopic(topic);
        setExpandedTopicIndex(null);
    };

    // Get unique main topics for filtering
    const uniqueTopics = ["All", ...csvDataAll.map(topic => topic["Main Topic"])];

    // Filter topics based on selection
    const filteredTopics = selectedTopic === "All"
        ? csvDataAll
        : csvDataAll.filter(topic => topic["Main Topic"] === selectedTopic);

    return (
        <div className="accordion-table-container mt-10">

            {/* Tag Filter Section */}
            <div className="flex flex-wrap gap-3 mb-5">
                {uniqueTopics.map((topic, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all 
                            ${selectedTopic === topic
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
                        }
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
                    >
                        <span className="font-semibold">{mainTopic["Main Topic"]}</span>
                        <span className={`arrow transition-transform ${expandedTopicIndex === mainIndex ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </div>

                    {/* Collapsible Content: Show Subtopics Table */}
                    {expandedTopicIndex === mainIndex && (
                        <div className="mt-3 p-3 bg-white shadow rounded-md">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Subtopic</th>
                                        <th className="border p-2">Details</th>
                                        <th className="border p-2">Video Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mainTopic.Subtopics.map((subtopic, subIndex) => (
                                        <tr key={subIndex} className="border">
                                            <td className="border p-2">{subtopic.Subtopic}</td>
                                            <td className="border p-2">
                                                <ul className="list-disc pl-4">
                                                    {subtopic.Details.map((detail, detailIndex) => (
                                                        <li key={detailIndex}>{detail.Detail}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="border p-2 text-blue-600 underline">
                                                <a href={subtopic["Video Link"]} target="_blank" rel="noopener noreferrer">
                                                    Watch Video
                                                </a>
                                            </td>
                                        </tr>
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

export default CSV_UI_3_2_Tags;
