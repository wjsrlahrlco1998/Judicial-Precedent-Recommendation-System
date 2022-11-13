# Module Load
from py_modules import myDB, prec_crawling, prec_preprocessing, model

# Package Load
import sys
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

if __name__ == "__main__":
    argument = sys.argv[1]
    if argument == "first":
        first_crawling()
    elif argument == "update":
        update_crawling()