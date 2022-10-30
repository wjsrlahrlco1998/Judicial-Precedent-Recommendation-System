# Module Load
from py_modules import myDB, prec_preprocessing, model

# Package Load
import base64
import json
import pandas as pd
import numpy as np
import time
import sys

### DB Connection ###
# 1. myDB 객체 생성
db = myDB.CaseLawDB(host="localhost", user="root", password="1234", db="cases")
# 2. Database Connect
db.connection()

### Modules ###
# 1. 전처리 객체 선언
preprocessing_module = prec_preprocessing.PrecedentPrcs()
# 2. 임베딩 모델 객체 선언
embedding_module = model.PrecSearchEngine()

### Functions ###
# 1. 검색 함수
def search(input_json):
    # 1. Convert Json to DataFrame
    json_object = json.loads(input_json)
    # 2. Split Types and Content
    input_types = json_object['type']
    input_content = json_object['content']
    input_id = json_object['id']
    # 3. Create Query
    query_condition = ""
    if len(input_types) == 1:
        query = f"사건종류명 = '{input_types[0]}'"
    else:
        for i in range(1, len(input_types)):
            query_condition += f"or 사건종류명 = '{input_types[i]}'"
        query = f"사건종류명 = '{input_types[0]}'" + query_condition
    # 4. Load Selected Data from DataBase
    load_prec_df = db.read(f"SELECT * FROM case_info WHERE {query}")
    # 5. Get Embedding vector from DataBase
    load_embedding_df = db.read(f"SELECT * FROM case_embedding WHERE 판례일련번호 IN (SELECT 판례일련번호 FROM case_info WHERE {query})")
    # 6. Merge by 판례일련번호
    merge_df = pd.merge(left=load_prec_df, right=load_embedding_df, how='inner', on='판례일련번호')
    # 7. Convert Byte to Vector
    merge_df['임베딩'] = merge_df['임베딩'].apply(lambda x : np.frombuffer(x, dtype=np.float32))
    # 8. Search
    searched_list = embedding_module.run(input_content, len(merge_df), merge_df)
    # 9. Concat similarity to DataFrame
    similarity = [sim for _, sim in searched_list]
    merge_df["유사도"] = similarity
    merge_df = merge_df.drop(['임베딩'], axis=1).reset_index(drop=True)
    # 10. Similarity decimal conversion
    merge_df['유사도'] = merge_df['유사도'].apply(lambda x : round(x, 3) * 100)
    # 11. Convert to JSON : ['판례일련번호', '유사도']
    sub_df = merge_df[['판례일련번호', '유사도']]
    sub_json = sub_df.to_json(orient='index')
    return_json = json.loads(sub_json)
    return_json["id"] = input_id
    
    return return_json

if __name__ == "__main__":
    # argv[1] : JSON DATA
    # JSON[0] : type
    # JSON[1] : content
    # JSON[2] : id
    print(search(sys.argv[1]))