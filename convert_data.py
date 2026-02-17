
import pandas as pd
import json
import os

try:
    # Read the Excel file
    df = pd.read_excel('Collections.xlsx')
    
    # Fill NaN values with empty strings or appropriate defaults
    df = df.fillna('')
    
    # Convert to list of dictionaries
    data = df.to_dict(orient='records')
    
    # Ensure the target directory exists
    os.makedirs('search-app/public', exist_ok=True)
    
    # Write to JSON file
    with open('search-app/public/data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully converted {len(data)} records to search-app/public/data.json")
    
except Exception as e:
    print(f"Error converting Excel to JSON: {e}")
