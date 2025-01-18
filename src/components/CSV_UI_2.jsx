import React, { useState } from 'react';
import { csvData } from '../data/csv-data';
import '../styles/Table.css'

const CSV_UI_2 = () => {
    
    const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);

    const handleTopicToggle = (index) => {
        setExpandedTopicIndex(prevIndex => (prevIndex === index ? null : index)); // Toggle the expanded state
    };

    return (
        <div className="accordion-table-container mt-10">

            {csvData.map((mainTopic, mainIndex) => (
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

export default CSV_UI_2;
