import json
import seaborn as sns
import pandas as pd
from pandas_profiling import ProfileReport
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', -1)
def DataFrameGenerator(codeImdict):
    codedict = dict(codeImdict)
    listDF = []
    
    for code in codedict.keys():
        codeDict = json.loads(code)

        for x in codeDict:
            #df = pd.DataFrame()
            loc = {}
            exec("var = "+codeDict[x].replace('"',"'")+"", globals(), loc)
            if(type(loc['var']) == pd.Series):
                listDF.append(loc['var'].to_frame().to_html().replace("\n",""))
            if(type(loc['var']) == pd.DataFrame):
                listDF.append(loc['var'].to_html().replace("\n",""))
    return listDF 

def DataFrameReportGenerator(codeImdict):
    codedict = dict(codeImdict)
    listDF = []
    
    for code in codedict.keys():
        codeDict = json.loads(code)

        for x in codeDict:
            #df = pd.DataFrame()
            loc = {}
            
            replaceStr = ""
            print("var = ProfileReport("+codeDict[x].replace('"',"'")+", explorative=True).to_html().replace('\\'',''').replace('\\n','')")
            command = "var = ProfileReport("+codeDict[x].replace('"',"'")+", explorative=True).to_html()"+replaceStr
            exec(command, globals(), loc)
            listDF.append(loc['var'])
    return listDF
