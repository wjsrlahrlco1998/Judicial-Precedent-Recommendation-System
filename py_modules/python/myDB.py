### 1. Package Load
import pymysql
import pandas as pd
import time
from sqlalchemy import create_engine

### 2. Class Define
class CaseLawDB:
    
    def __init__(self, host, user, password, db, port=3306, charset='utf8'):
        '''DB 연동에 필요한 변수 초기화'''
        self.__host = host              # Host Name ex) localhost
        self.__user = user              # user Name ex) root
        self.__password = password      # paswword
        self.__db = db                  # Database Name
        self.__port = port              # Database port
        self.__charset = charset        # encoding type
        
        self.__connect = None           # Connection Object
    
    def connection(self):
        '''DB 연동'''
        try:
            db_connection_str = f'mysql+pymysql://{self.__user}:{self.__password}@{self.__host}:{self.__port}/{self.__db}'
            db_connection = create_engine(db_connection_str)
            self.__connect = db_connection.connect()
            print("DB Connection Success")
        except Exception as e:
            print(e)
            print("DB Connection Fail")
    
    def insert(self, df:pd.DataFrame, table, if_exists='append', index=False):
        '''Data 추가'''
        start = time.time()
        
        df.to_sql(name=table,           # DataFrame을 바로 DB에 삽입하여 추가                  
                 con=self.__connect,
                 if_exists=if_exists,
                 index=index)
        
        print(f"insert time : {round(time.time() - start, 2)}(sec)")
    
    def read(self, sql):
        '''Data 읽기'''
        start = time.time()
        
        read_df = pd.read_sql(sql, self.__connect)  # SQL문으로 읽은 데이터를 DataFrame 형태로 가져오기
        
        print(f"read time : {round(time.time() - start, 2)}(sec)")
        
        return read_df

### 3. Testing Code
if __name__ == "__main__":
    # 1) DB 객체 선언
    db = CaseLawDB(host='localhost', user='root', password='1234', db='cases', charset='utf8')

    # 2) DB 연결
    db.connection()

    # 3) 데이터 로드
    data = pd.read_csv("./data/prec_data_refine.csv", encoding='utf-8-sig')

    # 4) 데이터 Insert
    db.insert(data, table='cases_info')

    # 5) 데이터 Read
    read_df = db.read(sql="SELECT * FROM cases_info")