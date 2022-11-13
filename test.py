# Module Load
#import myDB, prec_preprocessing, model

#import pandas as pd
import sys
import json
import io
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')


json_object = json.loads(sys.argv[1])
input_types = json_object['type']
input_content = json_object['content']
input_id = json_object['id']

letter = [input_types, input_content, input_id]
print(letter)

#print("5번   : " + merge_df)
#sub_df = merge_df[['판례일련번호', '유사도']]
#sub_json = sys.argv[1].to_json(orient='columns')