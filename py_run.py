'''
함수에 대한 자세한 설명은 ipynb 파일을 참고.
'''

# Module Load
from py_modules import myDB, prec_crawling, prec_preprocessing, model

# Package Load
import base64
import pandas as pd
import numpy as np
import time

### DB Connection ###
# 1. myDB 객체 생성
db = myDB.CaseLawDB(host="localhost", user="root", password="1234", db="cases")
# 2. Database Connect
db.connection()

### Modules ###
# 1. Crawler module 객체 선언
crawler_module = prec_crawling.PrecedentCrawl()
# 2. 전처리 객체 선언
preprocessing_module = prec_preprocessing.PrecedentPrcs()
# 3. 임베딩 모델 객체 선언
embedding_module = model.PrecSearchEngine()

### Functions ###
# 1. 초기 크롤링 함수
def first_crawling():
    # 1. Crawling
    prec_dict = crawler_module.start_crawling()
    # 2. Convert Dictionary to DataFrame
    prec_df = crawler_module.dict_to_df(prec_dict)
    # 3. Preprocessing
    clean_prec_df = preprocessing_module.run(prec_df=prec_df)
    # 4. Embedding
    embedding_df = pd.DataFrame(columns=['판례일련번호', '임베딩'])
    embedding_df['판례일련번호'] = clean_prec_df['판례일련번호']
    embedding_df['임베딩'] = clean_prec_df['판례내용'].apply(embedding_module.embedding_text)
    # 5. Convert Vector to Byte
    embedding_df['임베딩'] = embedding_df['임베딩'].apply(base64.b64encode)
    embedding_df['임베딩'] = embedding_df['임베딩'].apply(base64.b64decode)
    # 6. Insert to DataBase
    db.insert(clean_prec_df, 'case_info')
    db.insert(embedding_df, 'case_embedding')
    
# 2. 업데이트 크롤링 함수
def update_crawling():
    # 1. Load origin data from DataBase
    non_update_df = db.read("SELECT * FROM case_info")
    # 2. Sorted data by non-ascending
    non_update_df = non_update_df.sort_values("선고일자", ascending=False).reset_index(drop=True)
    # 3. Get the most recent case serial number
    most_recent_serial_nums = [str(non_update_df['판례일련번호'][i]) for i in range(10)]
    # 4. Update
    update_dict = crawler_module.update_crawling(recent_serial_nums=most_recent_serial_nums)
    ## Checking Update
    if update_dict:
        pass
    else:   
        print("Aready Update")
        return
    # 5. Convert Dictionary to DataFrame
    update_df = crawler_module.dict_to_df(update_dict)
    # 6. Preprocessing
    clean_update_df = preprocessing_module.run(update_df)
    # 7. Embedding
    embedding_df = pd.DataFrame(columns=['판례일련번호', '임베딩'])
    embedding_df['판례일련번호'] = clean_update_df['판례일련번호']
    embedding_df['임베딩'] = clean_update_df['판례내용'].apply(embedding_module.embedding_text)
    # 8. Convert Vector to Byte
    embedding_df['임베딩'] = embedding_df['임베딩'].apply(base64.b64encode)
    embedding_df['임베딩'] = embedding_df['임베딩'].apply(base64.b64decode)
    # 9. Insert to DataBase
    db.insert(clean_update_df, 'case_info')
    db.insert(embedding_df, 'case_embedding')

# 3. 검색 함수
def search(input_json):
    # 1. Convert Json to DataFrame
    input_df = pd.read_json(input_json)
    # 2. Split Types and Content
    input_types = input_df['type'].to_list()
    input_content = input_df['content'][0]
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
    sub_json = sub_df.to_json(orient='values')
    
    return sub_json

if __name__ == "__main__":
    pass