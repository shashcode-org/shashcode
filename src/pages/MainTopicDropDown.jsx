import React, { useState } from 'react';
import { csvData } from '../data/csv-data';

const MainTopicDropdown = () => {
    const [selectedMainTopic, setSelectedMainTopic] = useState('');

    const handleSelectChange = (e) => {
        setSelectedMainTopic(e.target.value);
    };

    const selectedMainTopicData = csvData.find((mainTopic) => mainTopic['Main Topic'] === selectedMainTopic);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <select
                className="block w-full pl-10 py-2 text-base text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedMainTopic}
                onChange={handleSelectChange}
            >
                <option value="">Select a Main Topic</option>
                {csvData.map((mainTopic) => (
                    <option key={mainTopic['Main Topic']} value={mainTopic['Main Topic']}>
                        {mainTopic['Main Topic']}
                    </option>
                ))}
            </select>

            {selectedMainTopicData && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold">{selectedMainTopicData['Main Topic']}</h2>
                    <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtopic</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YouTube Link</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {selectedMainTopicData.Subtopics.map((subtopic) => (
                                <tr key={subtopic.Subtopic}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subtopic.Subtopic}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subtopic.Details.map((detail) => detail.Detail).join(', ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <a href={subtopic['Video Link']} target="_blank" className="break-all">
                                            Watch on YouTube ({subtopic['Video Link']})
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
};

export default MainTopicDropdown;
