import React, { useState } from 'react';
import { csvData } from '../data/csv-data';

const CollapsibleTable = () => {
    const [expandedMainTopic, setExpandedMainTopic] = useState(null);

    const handleMainTopicClick = (index) => {
        setExpandedMainTopic((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className="collapsible-table-container">
            <h2>Collapsible Topics Table</h2>
            <table className="collapsible-table">
                <thead>
                    <tr>
                        <th>Main Topic</th>
                        <th>Subtopic</th>
                        <th>Details</th>
                        <th>Video Link</th>
                    </tr>
                </thead>
                <tbody>
                    {csvData.map((mainTopic, mainIndex) => (
                        <React.Fragment key={mainIndex}>
                            {/* Main Topic Row */}
                            <tr
                                className="main-topic-row"
                                onClick={() => handleMainTopicClick(mainIndex)}
                            >
                                <td colSpan="4" className="main-topic-cell">
                                    {mainTopic["Main Topic"]}
                                    <span className={`arrow ${expandedMainTopic === mainIndex ? 'expanded' : ''}`}>
                                        ▼
                                    </span>
                                </td>
                            </tr>
                            {/* Subtopics */}
                            {expandedMainTopic === mainIndex &&
                                mainTopic.Subtopics.map((subtopic, subIndex) => (
                                    <React.Fragment key={subIndex}>
                                        <tr className="subtopic-row">
                                            <td></td>
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
                                    </React.Fragment>
                                ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CollapsibleTable;
