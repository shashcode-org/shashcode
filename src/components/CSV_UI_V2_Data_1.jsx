import React, { useState } from 'react';
import { csvDataAll } from '../data/csv-data-v2';
import '../styles/Table.css';

// Details/Questions Separated

const CSV_UI_V2_Data_1 = () => {
    const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);

    const handleTopicToggle = (index) => {
        setExpandedTopicIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className="accordion-table-container mt-10">
            {csvDataAll.map((mainTopic, mainIndex) => (
                <div key={mainIndex} className="accordion-section">
                    {/* Main Topic Row (Collapsible Header) */}
                    <div
                        className="accordion-header"
                        onClick={() => handleTopicToggle(mainIndex)}
                    >
                        <span>{mainTopic["Main Topic"]}</span>
                        <span
                            className={`arrow ${expandedTopicIndex === mainIndex ? 'expanded' : ''}`}
                        >
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
                                    <th>Questions</th>
                                    <th>Video Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mainTopic.Subtopics.map((subtopic, subIndex) => (
                                    <tr key={subIndex}>
                                        {/* Subtopic */}
                                        <td>{subtopic.Subtopic}</td>

                                        {/* Details */}
                                        <td>
                                            {subtopic.Details.length > 0 ? (
                                                <ul>
                                                    {subtopic.Details.map((detail, detailIndex) => (
                                                        <li key={detailIndex}>{detail.Detail}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span>No details available</span>
                                            )}
                                        </td>

                                        {/* Questions */}
                                        <td>
                                            {subtopic.Questions.length > 0 ? (
                                                <ul>
                                                    {subtopic.Questions.map((question, questionIndex) => (
                                                        <li key={questionIndex}>
                                                            {question.Question}{' '}
                                                            {question["Video Link"] && (
                                                                <a
                                                                    href={question["Video Link"]}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Watch
                                                                </a>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span>No questions available</span>
                                            )}
                                        </td>

                                        {/* Video Link */}
                                        <td>
                                            {subtopic["Video Link"] ? (
                                                <a
                                                    href={subtopic["Video Link"]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Watch Video
                                                </a>
                                            ) : (
                                                <span>No video available</span>
                                            )}
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

export default CSV_UI_V2_Data_1;
