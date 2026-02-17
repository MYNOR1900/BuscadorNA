
import pandas as pd

try:
    df = pd.read_excel('Collections.xlsx')
    print("Columns:")
    for col in df.columns:
        print(f"- {col}")
    print("\nFirst row sample:")
    print(df.iloc[0].to_dict())
except Exception as e:
    print(f"Error reading Excel file: {e}")
