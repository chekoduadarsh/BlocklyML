"""Prepare data for Plotly Dash."""
import pandas as pd

def create_dataframe(message):
    """Create Pandas DataFrame from CSV."""
    dropdowns = []
    df = pd.DataFrame()
    if message != "":
        df = pd.read_csv(message)
        df = df.sample(n = 50, random_state = 2) # reducing Data Load Running on Heroku Free !!!!
        if len(df) == 0:
            return pd.DataFrame()
        df.insert(0,"Index", df.index)
        for column in df.columns:
            dropdowns.append({"label":column, "value":column})
    return df, dropdowns
    
