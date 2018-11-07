import json
import numpy as np
path = '/Users/youjia/Documents/Utah-Soc/Fall2018/CS6630/project/dataProcessing/data/'

with open(path+"articles.json") as f:
    data = json.load(f)
f.close()

temp = data[0:10]

papers = {}
for d in data:
    if d["title"] in papers:
        papers[d["title"]]["authors"].append({"name":d["name"], "institution":d["institution"]})
    else:
        paperInfo = {"year":d["year"], "conf":d["conf"], "numauthors":d["numauthors"], "authors":[]}
        paperInfo["authors"] = [{"name":d["name"], "institution":d["institution"]}]
        papers[d["title"]] = paperInfo

papersJson = []
for item in papers:
    paperInfo = papers[item]
    paperInfo["title"] = item
    papersJson.append(paperInfo)

with open(path+"confArticles.json","w") as outfile:
    json.dump(papersJson, outfile)
outfile.close()
