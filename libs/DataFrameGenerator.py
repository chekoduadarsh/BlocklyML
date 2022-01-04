import json
import pandas as pd
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', -1)
def DataFrameGenerator(codeImdict):
    codedict = dict(codeImdict)
    listDF = []
    print(codedict)
    for code in codedict.keys():
        codeDict = json.loads(code)
        loc = {}
        for x in codeDict:
            exec(x+" = "+codeDict[x].replace('"',"'")+"", globals(), loc)
            if(type(loc[x]) == pd.Series):
                listDF.append(loc[x].to_frame().to_html().replace("\n",""))
            if(type(loc[x]) == pd.DataFrame):
                listDF.append(loc[x].to_html().replace("\n",""))
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
            command = "var = ProfileReport("+codeDict[x].replace('"',"'")+", explorative=True).to_html()"+replaceStr
            exec(command, globals(), loc)
            listDF.append(loc['var'])
    return listDF
