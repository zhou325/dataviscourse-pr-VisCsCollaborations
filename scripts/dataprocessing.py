import json
import numpy as np
import pandas as pd
path = '/Users/youjia/Documents/Utah-Soc/Fall2018/CS6630/project/dataviscourse-pr-VisCsCollaborations/data/'

with open(path+"articles.json") as f:
    data = json.load(f)
f.close()

temp = data[0:10]

papers = {}
for d in data:
    if d["title"] in papers:
        papers[d["title"]]["authors"].append({"name":d["name"], "institution":d["institution"]})
    else:
        paperInfo = {"year":d["year"], "conf":d["conf"], "area":d["area"], "numauthors":d["numauthors"], "authors":[]}
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

temp1 = papersJson[0:10]

insList = []
for d in data:
    if d["institution"] not in insList:
        insList.append(d["institution"])

confList = []
for d in data:
    if d["area"] not in confList:
#        print(d["conf"], d["area"])
        confList.append(d["area"])
confList.sort()


collaborations = {}
for paper in papersJson:
    ins = []
    for author in paper["authors"]:
        ins.append(author["institution"])
    for i in ins:
        if i not in collaborations:
            collaborations[i] = {} 
        for j in ins:
            if j!= i:
                if j not in collaborations[i]:
                    collaborations[i][j] = 1
                else:
                    collaborations[i][j] += 1

with open(path+"collaborations.json","w") as outfile:
    json.dump(collaborations, outfile)
outfile.close()

collaborationsDetails = {}
for paper in papersJson:
    ins = []
    for author in paper["authors"]:
        ins.append(author["institution"])
    for i in ins:
        if i not in collaborationsDetails:
            collaborationsDetails[i] = {}
        for j in ins:
            if j!= i:
                if j not in collaborationsDetails[i]:
                    collaborationsDetails[i][j] = {}
                    collaborationsDetails[i][j]["total"] = 1
                else: collaborationsDetails[i][j]["total"] += 1
                if paper["area"] not in collaborationsDetails[i][j]:
                    collaborationsDetails[i][j][paper["area"]] = 1
                else:
                    collaborationsDetails[i][j][paper["area"]] += 1

with open(path+"collaborationsDetails.json","w") as outfile:
    json.dump(collaborationsDetails, outfile)
outfile.close()

collGeo = pd.read_csv(path+"world-affiliations.csv")
with open(path+"collaborations.json") as f:
    collaborations = json.load(f)
f.close()
collName = list(collaborations.keys())
collGeo_new = []
inName = []
for i in range(0,len(collGeo)):
    if collGeo.iloc[i]['aff_name'] in collName:
        collGeo_new.append(i)
        inName.append(collGeo.iloc[i]['aff_name'])
collGeo1 = collGeo.iloc[collGeo_new,]
collGeo1.index = range(0,len(collGeo1))
outName = [i for i in collName if i not in inName]
collGeo1.to_csv(path+"world-affiliationsSub.csv",index = False)

