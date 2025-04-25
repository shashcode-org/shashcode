import React, { useState, useEffect, useMemo, useRef } from "react";
import { csvData } from '../data/csv-data-java-dsa-release-v1';
import { Search, ChevronRight, Youtube } from 'lucide-react';
import AnimatedElement from '@/components/AnimatedElement';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";

export const CSV_TABLE_UI = () => {
    const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const uniqueTopics = useMemo(() => ["All", ...new Set(csvData.map(topic => topic["Main Topic"]))], []);

    const filteredTopics = useMemo(() => {
        let topics = selectedTopic === "All"
            ? csvData
            : csvData.filter(topic => topic["Main Topic"] === selectedTopic);

        if (searchQuery.trim() !== "") {
            topics = topics.map(topic => {
                const filteredSubtopics = topic.Subtopics.map(subtopic => {
                    const filteredDetails = subtopic.Details.filter(detail =>
                        detail.Detail.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    return filteredDetails.length > 0 ? { ...subtopic, Details: filteredDetails } : null;
                }).filter(subtopic => subtopic !== null);

                return filteredSubtopics.length > 0 ? { ...topic, Subtopics: filteredSubtopics } : null;
            }).filter(topic => topic !== null);
        }

        return topics;
    }, [selectedTopic, searchQuery]);

    useEffect(() => {
        setExpandedTopicIndex(selectedTopic === "All" ? null : 0);
        if (selectedTopic !== "All") {
            // Scroll to the first expanded topic card
            setTimeout(() => {
                firstExpandedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100); // slight delay ensures the card is rendered before scroll
        }
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
    const firstExpandedRef = useRef(null);
    return (
        <div className="p-4 sm:p-6 md:p-8">
            
            <AnimatedElement animation="fadeIn" delay="200">
                <div className="flex flex-wrap gap-2 mb-8">
                    {uniqueTopics.map((topic, index) => (
                        <button
                            key={index}
                            onClick={() => handleTagClick(topic)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                                selectedTopic === topic
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-muted/60 text-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </AnimatedElement>

            <AnimatedElement animation="fadeIn" delay="100">
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search topics or questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 p-3 w-full bg-background/60 backdrop-blur-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground shadow-sm transition-all"
                    />
                </div>
            </AnimatedElement>

            {filteredTopics.map((mainTopic, mainIndex) => {
                return (
                    <div
                    key={mainIndex}
                    ref={mainIndex === 0 ? firstExpandedRef : null} // Attach ref only to the first item
                    className="mb-6 bg-white rounded-xl shadow-md scroll-mt-24"
                    >
                <AnimatedElement 
                    key={mainIndex} 
                    animation="fadeIn" 
                    delay={`${Math.min((mainIndex + 3) * 100, 500)}`} 
                    className="mb-4"
                >
                    <Card className="overflow-hidden">
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer hover:bg-accent/10 transition-all"
                            onClick={() => handleTopicToggle(mainIndex)}
                            onKeyDown={(e) => handleKeyDown(e, mainIndex)}
                            tabIndex={0}
                            role="button"
                            aria-expanded={expandedTopicIndex === mainIndex}
                        >
                            <span className="font-semibold">{mainTopic["Main Topic"]}</span>
                            <ChevronRight
                                className={`w-5 h-5 transition-transform duration-300 ${
                                    expandedTopicIndex === mainIndex ? 'rotate-90' : 'rotate-0'
                                }`}
                            />
                        </div>

                        <AnimatePresence initial={false}>
                            {expandedTopicIndex === mainIndex && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <Separator />
                                    <div className="overflow-x-auto p-1">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[30%]">Subtopic</TableHead>
                                                    <TableHead className="w-[50%]">Details</TableHead>
                                                    <TableHead className="w-[10%] text-center">Solve</TableHead>
                                                    <TableHead className="w-[10%] text-center">Video</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {mainTopic.Subtopics.map((subtopic, subIndex) => (
                                                    subtopic.Details.map((detail, detailIndex) => (
                                                        <TableRow key={`${subIndex}-${detailIndex}`} className="hover:bg-accent/5 transition-colors">
                                                            {detailIndex === 0 ? (
                                                                <TableCell className="font-medium align-top" rowSpan={subtopic.Details.length}>
                                                                    {subtopic.Subtopic}
                                                                </TableCell>
                                                            ) : null}

                                                            {!detail.Links || !Array.isArray(detail.Links) || !detail.Links.some(link => link.includes("leetcode") || link.includes("geeksforgeeks")) ? (
                                                                <TableCell className="capitalize align-top" colSpan={2}>
                                                                    {detail.Detail}
                                                                </TableCell>
                                                            ) : (
                                                                <>
                                                                    <TableCell className="capitalize align-top">
                                                                        {detail.Detail}
                                                                    </TableCell>
                                                                    <TableCell className="text-center align-top">
                                                                        <div className="flex justify-center space-x-2">
                                                                                {detail.Links.map((link, index) => (
                                                                                    link !== "N/A" ? (
                                                                                        <a
                                                                                            key={index}
                                                                                            href={link}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-background hover:bg-accent transition-colors"
                                                                                        >
                                                                                            {link.includes("leetcode") ? (
                                                                                                <SiLeetcode className="w-[16px] sm:w-[20px] h-auto" style={{ color: '#FFA116' }} />
                                                                                            ) : link.includes("geeksforgeeks") ? (
                                                                                                <SiGeeksforgeeks className="w-[20px] sm:w-[24px] h-auto" style={{ color: '#2F8D46' }} />
                                                                                            ) : (
                                                                                                <span className="text-primary text-xs font-bold">Solve</span>
                                                                                            )}
                                                                                        </a>
                                                                                    ) : null
                                                                                ))}
                                                                        </div>
                                                                    </TableCell>
                                                                </>
                                                            )}

                                                            <TableCell className="text-center align-top">
                                                                {detail["Video Link"] && detail["Video Link"].includes('https') && (
                                                                    <a 
                                                                        href={detail["Video Link"]} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-background hover:bg-accent transition-colors"
                                                                    >
                                                                        <Youtube
                                                                            className="h-4 w-4"
                                                                            style={{ color: "#FF0000" }} // YouTube red
                                                                        />
                                                                    </a>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </AnimatedElement>
            </div>
            )})}
        </div>
    );
};

export default CSV_TABLE_UI;
