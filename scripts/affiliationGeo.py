import json

affid2name = {}

with open('data\AffiliationName.txt','r') as data_file:
    line = data_file.readline()
    content = line.strip() 
    while(line):
        line = data_file.readline()
        content += line.strip()

    index0 = content.find('[')
    index1 = content.find(']')
    content = content[index0+2:index1-2]
    content_list = content.split('},{')
    for elem in content_list:
        elem_json = '{'+elem+'}'
        json_content = json.loads(elem_json)
        affid2name[json_content['code']] = json_content['name']

affid2geo = {}
with open('data\AffiliationLatlong.txt','r') as data_file:
    line = data_file.readline()
    while(line):
        index0 = line.find('latlong["')
        aff_id = line[index0+9:index0+17] 
        index1 = line.find('{') 
        if(index1!=-1 ):
            content = line[index1:].strip()
            line = data_file.readline()
            index2 = line.find('}') 
            while(index2==-1):
                content += line.strip()
                line = data_file.readline()
                index2 = line.find('}') 
            content += line[:index2+1].strip()
            affid2geo[aff_id] = json.loads(content)


        line = data_file.readline()


with open('data\world-affiliations.csv','a') as data_file:
    data_file.write(','.join(['aff_name','lat','lon'])+'\n')
    for aff_id in affid2geo.keys():
        data_file.write(','.join(
            [str(e) for e in [affid2name[aff_id],affid2geo[aff_id]['latitude'],affid2geo[aff_id]['longitude']]]
            )+'\n')


