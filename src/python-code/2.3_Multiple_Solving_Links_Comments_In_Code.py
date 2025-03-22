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

    # If there is a New main topic
    if pd.notna(main_topic):

        # Save previous main topic if any
        if current_main_topic:  
            # Save previous subtopic if any
            if current_subtopic: 
                current_main_topic["Subtopics"].append(current_subtopic)
                current_subtopic = None # Reset subtopic
                
            # Store the completed main topic
            structured_data.append(current_main_topic)

        # Create new main topic
        current_main_topic = {
            "Main Topic": main_topic,
            "Subtopics": []
        }

    # If new subtopic under current main topic
    if pd.notna(subtopic):
        # Save the previous one before overwriting 
        if current_subtopic:
            current_main_topic["Subtopics"].append(current_subtopic)

        # Create new subtopic
        current_subtopic = {
            "Subtopic": subtopic,
            "Details": [],
        }

    # Add the detail and solve link to the current subtopic
    if pd.notna(detail):

        # Convert links into a list (split by comma and trim spaces)
        links_list = [link.strip() for link in solve.split(",")] if pd.notna(solve) else []

        detail_entry = {"Detail": detail, "Links": links_list if links_list else ["N/A"]}

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