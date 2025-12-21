import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { ChevronRight, Youtube } from "lucide-react";
import AnimatedElement from "@/components/AnimatedElement";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";

export const CSV_TABLE_UI = ({ csvData }) => {
  const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const lastIndexRef = useRef(null);
  const firstExpandedRef = useRef(null);

  const uniqueTopics = useMemo(
    () => ["All", ...new Set(csvData.map((t) => t["Main Topic"]))],
    [csvData]
  );

  /* ---------------- SEARCH + FILTER ---------------- */
  const filteredTopics = useMemo(() => {
    let topics =
      selectedTopic === "All"
        ? csvData
        : csvData.filter((t) => t["Main Topic"] === selectedTopic);

    if (!searchQuery.trim()) return topics;

    return topics
      .map((topic) => {
        const subtopics = topic.Subtopics.map((sub) => {
          const details = sub.Details.filter((d) =>
            d.Detail.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return details.length ? { ...sub, Details: details } : null;
        }).filter(Boolean);

        return subtopics.length ? { ...topic, Subtopics: subtopics } : null;
      })
      .filter(Boolean);
  }, [csvData, selectedTopic, searchQuery]);

  const handleTopicToggle = (index) => {
    setExpandedTopicIndex((prev) => (prev === index ? null : index));
    lastIndexRef.current = index;
  };

  useLayoutEffect(() => {
    if (lastIndexRef.current !== null) {
      const el = document.getElementById(`topic-${lastIndexRef.current}`);
      if (el) {
        setTimeout(() => {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 300);
      }
    }
  }, [expandedTopicIndex]);

  useEffect(() => {
    if (selectedTopic !== "All") {
      setExpandedTopicIndex(0);
      setTimeout(() => {
        const el = document.getElementById("topic-0");
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 400);
    } else {
      setExpandedTopicIndex(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedTopic]);




  const normalizeLinks = (links) => {
    if (!links) return [];

    const INVALID = ["n/a", "na", "-", ""];

    if (Array.isArray(links)) {
      return links
        .map(l => l?.trim())
        .filter(l =>
          l &&
          !INVALID.includes(l.toLowerCase())
        );
    }

    if (typeof links === "string") {
      return links
        .split(",")
        .map(l => l.trim())
        .filter(l =>
          l &&
          !INVALID.includes(l.toLowerCase())
        );
    }

    return [];
  };



  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* TAG FILTER */}
      <AnimatedElement animation="fadeIn">
        <div className="flex flex-wrap gap-2 mb-6">
          {uniqueTopics.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTopic(tag);
                setExpandedTopicIndex(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${selectedTopic === tag
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted/60 text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </AnimatedElement>

      {/* SEARCH */}
      <div className="relative mb-6">
        <input
          className="p-3 w-full rounded-xl border"
          placeholder="Search topics or questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* MAIN TOPICS */}
      {filteredTopics.map((mainTopic, mainIndex) => (
        <div
          key={mainIndex}
          id={`topic-${mainIndex}`}
          ref={mainIndex === 0 ? firstExpandedRef : null}
          className="mb-6"
        >
          <Card>
            {/* HEADER */}
            <div
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => handleTopicToggle(mainIndex)}
            >
              <span className="font-semibold">
                {mainTopic["Main Topic"]}
              </span>
              <ChevronRight
                className={`transition-transform ${expandedTopicIndex === mainIndex ? "rotate-90" : ""
                  }`}
              />
            </div>

            <AnimatePresence>
              {expandedTopicIndex === mainIndex && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <Separator />

                  <div className="p-4 space-y-6">
                    {mainTopic.Subtopics.map((sub, subIndex) => {

                      /* VIDEO LOGIC (UNCHANGED) */
                      const videoLinks = sub.Details.map(
                        (d) => d["Video Link"]
                      ).filter(Boolean);

                      const uniqueVideos = [...new Set(videoLinks)];
                      const hasSingleVideo = uniqueVideos.length === 1;
                      const hasMultipleVideos = uniqueVideos.length > 1;

                      /* NORMALIZE DETAILS */
                      const normalizedDetails = sub.Details.map((detail) => ({
                        ...detail,
                        _links: normalizeLinks(detail.Links),
                      }));

                      const concepts = normalizedDetails.filter(
                        (d) => d._links.length === 0
                      );

                      const questions = normalizedDetails.filter(
                        (d) => d._links.length > 0
                      );

                      return (
                        <div key={subIndex}>
                          {/* SUBTOPIC HEADER */}
                          <h3 className="flex items-center gap-2 font-semibold text-primary mb-3">
                            {sub.Subtopic}
                            {hasSingleVideo && (
                              <a
                                href={uniqueVideos[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Youtube className="text-red-500" size={18} />
                              </a>
                            )}
                          </h3>

                          {/* THEORY (PLAIN TEXT) */}
                          {/* THEORY (SOFT PANEL + BULLETS, NON-CLICKABLE) */}
                          {concepts.length > 0 && (
                            <div className="rounded-lg bg-muted/30 px-4 py-3 mb-3">
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {concepts.map((d, i) => (
                                  <li key={i} className="select-none">
                                    {d.Detail?.trim()}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}



                          {/* PRACTICE (NO HEADING, ICONS ONLY) */}
                          {questions.length > 0 && (
                            <div className="space-y-2">
                              {questions.map((d, i) => (
                                <div
                                  key={i}
                                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 rounded-lg border hover:bg-accent/5"
                                >
                                  <span>{d.Detail}</span>

                                  <div className="flex gap-3">
                                    {d._links.map((link, idx) =>
                                      link.includes("leetcode") ? (
                                        <a
                                          key={idx}
                                          href={link}
                                          target="_blank"
                                        >
                                          <SiLeetcode
                                            size={18}
                                            style={{ color: "#FFA116" }}
                                          />
                                        </a>
                                      ) : link.includes("geeksforgeeks") ? (
                                        <a
                                          key={idx}
                                          href={link}
                                          target="_blank"
                                        >
                                          <SiGeeksforgeeks
                                            size={18}
                                            style={{ color: "#2F8D46" }}
                                          />
                                        </a>
                                      ) : null
                                    )}

                                    {hasMultipleVideos &&
                                      d["Video Link"] && (
                                        <a
                                          href={d["Video Link"]}
                                          target="_blank"
                                        >
                                          <Youtube
                                            className="text-red-500"
                                            size={18}
                                          />
                                        </a>
                                      )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default CSV_TABLE_UI;
