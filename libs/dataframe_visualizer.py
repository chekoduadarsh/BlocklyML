""" Generates list of intialized visualizers """
import pandas as pd
import seaborn as sns
from libs.dashboard import dashboard_app

pd.set_option("display.max_rows", None)
pd.set_option("display.max_columns", None)
pd.set_option("display.width", None)
pd.set_option("display.max_colwidth", -1)

def dataframe_visualizer(code_imdict, dash_app):
    """Returns Dataframe visuualizers and list fo processed Daataframes """
    codedict = dict(code_imdict)
    list_dataframe_names = []

    for code in codedict.keys():
        loc = {}
        replace_str = ""
        command = "var = " + code.replace('"', "'") + replace_str
        exec(command, globals(), loc)
        dash_app = dashboard_app(loc["var"], dash_app, {})
        list_dataframe_names.append("")

    return list_dataframe_names, dash_app
