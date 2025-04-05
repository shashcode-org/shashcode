import pandas as pd
import json

# Initialize empty list to hold structured data
structured_data = []

# Iterate through rows and structure data
current_main_topic = None
current_subtopic = None

for index, row in df.iterrows():
    main_topic = row['Main Topics']
    subtopic = row['Subtopics']
    detail = row['Details']
    solve = row['Links']
    video_link = row['Video Links']

    if pd.notna(main_topic):  # New main topic
        if current_main_topic:  # Save previous topic if any
            if current_subtopic:  # Save previous subtopic if any
                current_main_topic["Subtopics"].append(current_subtopic)
                current_subtopic = None
            structured_data.append(current_main_topic)

        # Start new main topic
        current_main_topic = {
            "Main Topic": main_topic,
            "Subtopics": []
        }

    if pd.notna(subtopic):  # New subtopic under current main topic
        if current_subtopic:  # Save previous subtopic if any
            current_main_topic["Subtopics"].append(current_subtopic)

        # Start new subtopic
        current_subtopic = {
            "Subtopic": subtopic,
            "Details": [],
        }

        if pd.notna(video_link):
            current_subtopic["Video Link"] = video_link

    # Add the detail and solve link to the current subtopic
    if pd.notna(detail):
        detail_entry = {"Detail": detail, "Links": solve if pd.notna(solve) else "N/A"}
        if pd.notna(video_link):
            detail_entry["Video Link"] = video_link
        current_subtopic["Details"].append(detail_entry)

# Append the last processed subtopic and main topic
if current_subtopic:
    current_main_topic["Subtopics"].append(current_subtopic)
if current_main_topic:
    structured_data.append(current_main_topic)

# Output the structured data as JSON
json_data = json.dumps(structured_data, indent=2)

print(json_data)