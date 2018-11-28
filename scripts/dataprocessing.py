import json
import numpy as np
import pandas as pd
path = '/Users/youjia/Documents/Utah-Soc/Fall2018/CS6630/project/dataviscourse-pr-VisCsCollaborations/data/'

with open(path+"articles.json") as f:
    data = json.load(f)
f.close()

papers = {}
for d in data:
    if d["title"] in papers:
        papers[d["title"]]["authors"].append({"name":d["name"], "institution":d["institution"]})
    else:
        paperInfo = {"year":d["year"], "conf":d["conf"], "area":d["area"], "numauthors":d["numauthors"], "authors":[]}
        paperInfo["authors"] = [{"name":d["name"], "institution":d["institution"]}]
        papers[d["title"]] = paperInfo

years = []
for paper in papers:
    if papers[paper]['year'] not in years:
        years.append(papers[paper]['year'])
years.sort()

papersJson = []
for item in papers:
    paperInfo = papers[item]
    paperInfo["title"] = item
    papersJson.append(paperInfo)
temp = papersJson[0:10]

with open(path+"confArticles.json","w") as outfile:
    json.dump(papersJson, outfile)
outfile.close()

temp1 = papersJson[0:10]

#insList = []
#for d in data:
#    if d["institution"] not in insList:
#        insList.append(d["institution"])
insList = pd.read_csv(path+"insList.csv")["aff_name"].tolist()

confList = []
for d in data:
    if d["area"] not in confList:
#        print(d["conf"], d["area"])
        confList.append(d["area"])
confList.sort()


collaborations = {}
for year in years:
    if year >= 1980:
        collaborations[year] = {}
for paper in papersJson:
    year = paper['year']
    if year in collaborations:
        ins = []
        for author in paper["authors"]:
            if author["institution"] in insList:
                ins.append(author["institution"])
        for i in ins:
            if i not in collaborations[year]:
                collaborations[year][i] = {} 
            for j in ins:
                if j!= i:
                    if j not in collaborations[year][i]:
                        collaborations[year][i][j] = 1
                    else:
                        collaborations[year][i][j] += 1 

## lenins = 2671
#ins = "Carnegie Mellon University"
#lenins = 0
#for year in collaborations:
#    if ins in collaborations[year]:
#        for collins in collaborations[year][ins]:
#            lenins += collaborations[year][ins][collins]

with open(path+"collaborations.json","w") as outfile:
    json.dump(collaborations, outfile)
outfile.close()

Ai = ["AAAI","IJCAI","CVPR","ECCV","ICCV","NIPS","ICML","KDD","ACL","EMNLP","NAACL","SIGIR","WWW"]
System = ["ASPLOS","ISCA","MICRO","HPCA","SIGCOMM","NSDI","CCS","OAKLAND","USENIXSEC","NDSS","SIGMOD","VLDB","ICDE","PODS","DAC","ICCAD","EMSOFT","RTAS","RTSS","HPDC","ICS","SC","MOBICOM","MOBISYS","SENSYS","IMC","SIGMETRICS","OSDI","SOSP","EUROSYS","FAST","USENIXATC","PLDI","POPL","ICFP","OOPSLA","FSE","ICSE","ASE","ISSTA"]
Theory = ["FOCS","SODA","STOC","CRYPTO","EUROCRYPT","CAV","LICS"]
Interdisciplinary = ["ISMB","RECOMB","SIGGRAPH","SIGGRAPH-ASIA","EC","WINE","SIGCHI","CHI","UBICOMP","UIST","ICRA","IROS","RSS","VIS","VR"]
Ai = [i.lower() for i in Ai]
System = [i.lower() for i in System]
Theory = [i.lower() for i in Theory]
Interdisciplinary = [i.lower() for i in Interdisciplinary]

collaborationsDetails = {}
for year in years:
    if year >= 1980:
        collaborationsDetails[year] = {}
for paper in papersJson:
    year = paper['year']
    if year in collaborations:
        ins = []
        for author in paper["authors"]:
            if author["institution"] in insList:
                ins.append(author["institution"])
        for i in ins:
            if i not in collaborationsDetails[year]:
                collaborationsDetails[year][i] = {}
            for j in ins:
                if j!= i:
                    if j not in collaborationsDetails[year][i]:
                        collaborationsDetails[year][i][j] = {"ai":0, "system":0, "theory":0, "interdis":0, "total":0}
                    collaborationsDetails[year][i][j]["total"] += 1
                    if paper["area"] in Ai:
                        collaborationsDetails[year][i][j]['ai'] += 1
                    elif paper["area"] in System:
                        collaborationsDetails[year][i][j]['system'] += 1
                    elif paper["area"] in Theory:
                        collaborationsDetails[year][i][j]['theory'] += 1
                    elif paper["area"] in Interdisciplinary:
                        collaborationsDetails[year][i][j]['interdis'] += 1

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

collGeo1 = pd.read_csv(path+"world-affiliationsSub.csv")
insList = pd.DataFrame(collGeo1["aff_name"])
insList.to_csv(path+"insList.csv",index = False)
