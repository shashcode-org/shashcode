import csv
import os

# =========================
# CONFIG
# =========================
INPUT_CSV = "DSARestartFinal.csv"
OUTPUT_JS = "../csv-data-bkp/dsa-restart-162.js"

# =========================
# HELPERS
# =========================
def clean(value):
    if not value:
        return ""
    return value.strip().strip("'").strip('"')


def detect_links(url):
    """
    Detect platform from URL.
    Returns dict with leetcode / gfg keys.
    """
    url = clean(url)
    links = {
        "leetcode": "",
        "gfg": ""
    }

    if not url:
        return links

    lower = url.lower()

    if "leetcode" in lower:
        links["leetcode"] = url
    elif "geeksforgeeks" in lower or "gfg" in lower:
        links["gfg"] = url

    return links

# =========================
# MAIN
# =========================
problems = []

with open(INPUT_CSV, newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        title = clean(row.get("title"))
        difficulty = clean(row.get("difficulty")).capitalize()
        link = clean(row.get("link"))
        youtube_link = clean(row.get("youtubeLink"))
        indexNo = clean(row.get("index"))

        if not title or not difficulty:
            print(f"⚠️ Skipping question {indexNo}: Missing title/difficulty")
            continue

        links = detect_links(link)
        links["youtube"] = youtube_link
        problems.append({
            "id": int(indexNo) if indexNo.isdigit() else len(problems) + 1,
            "title": title,
            "difficulty": difficulty,
            "week": clean(row.get("Week")),          # NEW
            "topic": clean(row.get("Topic")),         # NEW
            "restartTag": clean(row.get("RestartTag")), # NEW
            "optional": clean(row.get("OPTIONAL")) == "Yes", # NEW (bool)
            "links": links
        })

# =========================
# WRITE JS FILE
# =========================
os.makedirs(os.path.dirname(OUTPUT_JS), exist_ok=True)

with open(OUTPUT_JS, "w", encoding="utf-8") as f:
    f.write("export const dsaRestart = [\n")

    for p in problems:
        safe_title = p["title"].replace('"', '\\"')

        f.write("  {\n")
        f.write(f"    id: {p['id']},\n")
        f.write(f"    title: \"{safe_title}\",\n")
        f.write(f"    difficulty: \"{p['difficulty']}\",\n")
        f.write(f"    week: \"{p['week']}\",\n")
        f.write(f"    topic: \"{p['topic']}\",\n")
        f.write(f"    restartTag: \"{p['restartTag']}\",\n")
        f.write(f"    optional: {str(p['optional']).lower()},\n")
        f.write("    links: {\n")
        f.write(f"      leetcode: \"{p['links']['leetcode']}\",\n")
        f.write(f"      gfg: \"{p['links']['gfg']}\",\n")
        f.write(f"      youtube: \"{p['links'].get('youtube','')}\"\n")
        f.write("    }\n")
        f.write("  },\n")

    f.write("];\n")

print(f"✅ Generated {OUTPUT_JS}")
print(f"📌 Total problems: {len(problems)}")
