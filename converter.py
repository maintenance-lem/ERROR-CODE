import pandas as pd
import json
import os

# === Paths ===
base_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(base_dir)
data_path = os.path.join(root_dir, "data", "ErrorCode.xlsx")
js_output_path = os.path.join(root_dir, "js", "errorLogData.js")

# === Load Excel ===
df = pd.read_excel(data_path)
df.columns = df.columns.str.strip()

# === Build nested dictionary ===
data = {}
for _, row in df.iterrows():
    machine = str(row["Machine Name"]).strip()
    laser = str(row["Laser Marking"]).strip()
    error_code = str(row["Machine Error Code"]).strip()
    when = str(row["When"]).strip()
    what = str(row["What"]).strip()
    reason_code = str(row["D365 Scrap Reason Code"]).strip()
    reason_desc = str(row["D365 Scrap Description"]).strip()

    data.setdefault(machine, {}).setdefault(laser, {}).setdefault(error_code, []).append({
        "when": when,
        "what": what,
        "reason_code": reason_code,
        "reason_desc": reason_desc
    })

# === Save as JS file ===
js_output = "const errorLogData = " + json.dumps(data, indent=2) + ";"

with open(js_output_path, "w", encoding="utf-8") as f:
    f.write(js_output)

print(f"✅ JS file updated: {js_output_path}")
