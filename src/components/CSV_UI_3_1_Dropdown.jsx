import React, { useState } from 'react';
import { csvDataAll } from '../data/csv-data-all';
import '../styles/Table.css';

const CSV_UI_3_1_Dropdown = () => {

    const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState("All");

    const handleTopicToggle = (index) => {
        setExpandedTopicIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleDropdownChange = (event) => {
        setSelectedTopic(event.target.value);
        setExpandedTopicIndex(null);
    };

    // Filter topics based on dropdown selection
    const filteredTopics = selectedTopic === "All"
        ? csvDataAll
        : csvDataAll.filter(topic => topic["Main Topic"] === selectedTopic);

    return (
        <div className="accordion-table-container mt-10">

            {/* Dropdown for Filtering Topics */}
            <div className="dropdown-container mb-5">
                <label htmlFor="topic-dropdown" className="mr-2 font-semibold">Select Topic:</label>
                <select
                    id="topic-dropdown"
                    value={selectedTopic}
                    onChange={handleDropdownChange}
                    className="p-2 border rounded"
                >
                    <option value="All">All</option>
                    {csvDataAll.map((topic, index) => (
                        <option key={index} value={topic["Main Topic"]}>
                            {topic["Main Topic"]}
                        </option>
                    ))}
                </select>
            </div>

            {/* Accordion Sections */}
            {filteredTopics.map((mainTopic, mainIndex) => (
                <div key={mainIndex} className="accordion-section">
                    {/* Main Topic Row (Collapsible Header) */}
                    <div
                        className="accordion-header"
                        onClick={() => handleTopicToggle(mainIndex)}
                    >
                        <span>{mainTopic["Main Topic"]}</span>
                        <span className={`arrow ${expandedTopicIndex === mainIndex ? 'expanded' : ''}`}>
                            ▼
                        </span>
                    </div>

                    {/* Collapsible Content: Show Subtopics Table */}
                    {expandedTopicIndex === mainIndex && (
                        <table className="subtopics-table">
                            <thead>
                                <tr>
                                    <th>Subtopic</th>
                                    <th>Details</th>
                                    <th>Video Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mainTopic.Subtopics.map((subtopic, subIndex) => (
                                    <tr key={subIndex}>
                                        <td>{subtopic.Subtopic}</td>
                                        <td>
                                            <ul>
                                                {subtopic.Details.map((detail, detailIndex) => (
                                                    <li key={detailIndex}>{detail.Detail}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>
                                            <a href={subtopic["Video Link"]} target="_blank" rel="noopener noreferrer">
                                                Watch Video
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CSV_UI_3_1_Dropdown;
