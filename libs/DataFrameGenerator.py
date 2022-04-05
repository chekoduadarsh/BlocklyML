
import pandas as pd
from libs.dashboard import dashboardApp
import seaborn as sns
import pandas as pd

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', -1)


def DataFramevisualizer(codeImdict, dash_app):
    codedict = dict(codeImdict)
    listDF = []

    for code in codedict.keys():
        loc = {}
        replaceStr = ""
        command = "var = "+code.replace('"', "'")+replaceStr
        exec(command, globals(), loc)
        dash_app = dashboardApp(loc['var'], dash_app, {})
        listDF.append("")

    return listDF, dash_app
