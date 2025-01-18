import React, { useState } from 'react'
import { csvData } from '../data/csv-data';

const data = [
    {
        mainTopic: "Main Topic 1",
        subtopics: [
            {
                subtopic: "Subtopic 1",
                details: "Detail 1",
                videoLink: "https://www.youtube.com/watch?v=example1",
            },
            {
                subtopic: "Subtopic 2",
                details: "Detail 2",
                videoLink: "https://www.youtube.com/watch?v=example2",
            },
        ],
    },
    {
        mainTopic: "Main Topic 2",
        subtopics: [
            {
                subtopic: "Subtopic A",
                details: "Detail A",
                videoLink: "https://www.youtube.com/watch?v=exampleA",
            },
        ],
    },
];

const DSA = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleDropdown = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className='mt-10'>
            <h1 className='text-3xl font-semibold uppercase'>
                DSA
            </h1>
            <div className="p-4">
                {data.map((topic, index) => (
                    <div key={index} className="mb-4 border rounded shadow">
                        {/* Dropdown Header */}
                        <button
                            onClick={() => toggleDropdown(index)}
                            className="w-full text-left px-4 py-2 bg-blue-500 text-white font-bold rounded-t"
                        >
                            {topic.mainTopic}
                        </button>

                        {/* Subtopics Table */}
                        <div
                            className={`transition-all duration-300 overflow-hidden ${activeIndex === index ? "block" : "hidden"
                                }`}
                        >
                            <table className="w-full border-collapse border border-gray-300 mt-2">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Subtopic
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Details
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Video Link
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topic.subtopics.map((sub, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-100 transition-colors"
                                        >
                                            <td className="border border-gray-300 px-4 py-2">
                                                {sub.subtopic}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {sub.details}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <a
                                                    href={sub.videoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline hover:text-blue-700"
                                                >
                                                    Watch Video
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DSA