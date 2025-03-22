# prompt: get the csv data

import pandas as pd
import numpy as np
import json

# Assuming your CSV file is named 'your_file.csv' and is in the same directory as your notebook.
# Replace 'your_file.csv' with the actual filename if it's different.
try:
  df = pd.read_csv('sheet_6.3.csv')
  # print(df)
except FileNotFoundError:
  print("Error: 'your_file.csv' not found. Please upload the file or provide the correct path.")
except pd.errors.EmptyDataError:
  print("Error: 'your_file.csv' is empty.")
except pd.errors.ParserError:
  print("Error: Could not parse 'your_file.csv'. Please check the file format.")

# If the file is somewhere else, specify the full path:
# Example: df = pd.read_csv('/content/drive/MyDrive/your_file.csv')

df.head()