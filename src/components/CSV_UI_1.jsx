import React, { useState } from 'react';
import { csvData } from '../data/csv-data';
import { csv_data_2 } from '../data/csv-data-2';

const CSV_UI_1 = () => {
    const [selectedMainTopic, setSelectedMainTopic] = useState(null);

    const handleMainTopicChange = (event) => {
        setSelectedMainTopic(event.target.value);
    };

    const renderTable = () => {
        const mainTopic = csvData.find(topic => topic["Main Topic"] === selectedMainTopic);

        if (!mainTopic) {
            return <p>Please select a main topic to view subtopics.</p>;
        }

        return (
            <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">Subtopic</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Details</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Video Link</th>
                    </tr>
                </thead>
                <tbody>
                    {mainTopic.Subtopics.map((subtopic, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{subtopic.Subtopic}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <ul className="list-disc pl-4">
                                    {subtopic.Details.map((detail, i) => (
                                        <li key={i}>{detail.Detail}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <a
                                    href={subtopic["Video Link"]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Watch Video
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="mt-10">
            <div className="mb-10">
                <label htmlFor="mainTopic" className="mr-2 font-medium">Select a Main Topic:</label>
                <select
                    id="mainTopic"
                    className="border border-gray-300 px-2 py-1"
                    onChange={handleMainTopicChange}
                >
                    <option value="">-- Select --</option>
                    {csvData.map((topic, index) => (
                        <option key={index} value={topic["Main Topic"]}>
                            {topic["Main Topic"]}
                        </option>
                    ))}
                </select>
            </div>
            {renderTable()}
        </div>
    );
};

export default CSV_UI_1;
