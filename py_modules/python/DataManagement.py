import pymysql
import csv
import time
import sys


csv.field_size_limit(1000000) #csv파일 읽어올수 있는 길이 변경(설정되어 있는 것으로 할 경우 판례 내용에서 오류가 생긴다.)
start = time.time() # 얼마나 걸리는지 알아보기 위함

class CaseLawDB:
    
    # 데이터베이스 연동 속성들
    __host = 'localhost'
    __user = 'root'
    __pw = '1234'
    __db_name = 'caselawDB'
    
        
    # 데이터베이스 연동을 위한 속성값 설정
    def setAttr(self,set_host,set_user,set_pw,set_db_name):
        self.__host = set_host
        self.__user = set_user
        self.__pw = set_pw
        self.__db_name = set_db_name
        
    # 데이터베이스 연동을 위한 속성값 반환
    def getAttr(self):
        self.attr_list.apped(self.__host)
        self.attr_list.apped(self.__user)
        self.attr_list.apped(self.__pw)
        self.attr_list.apped(self.__db_name)
        
        return self.attr_list
    
    #데이터베이스 연동
    def connection(self, host=__host, user=__user, pw=__pw, db_name=__db_name):
        try:
            self.connect = pymysql.connect(host=host, user=user, password=pw, db=db_name) #데이터베이스 연동과 동시에 객체 생성
            self.curs = self.connect.cursor() #커서 생성
        except:
            print("연결 실패")
            return 0

    def close(self):
        try:
           self.connect.close()
        except:
           print("데이터베이스 연결 종료 실패")
           return 0;
        
    def dbUpdate(self):
       
        try:
            f = open('clean_prec_data.csv','r', encoding='utf-8') # 파일 읽기
        except:
            print("파일 열기 실패")
            mutex = True
            return 0;
        
        csvReader = csv.reader(f) # 파일 내용 저장
        
        #현재 릴레이션 비우기
        deletesql = "delete from caselaw3"
        self.curs.execute(deletesql)   
        self.connect.commit() 
        
        
        data = csvReader
        #릴레이션 투플 삽입
        sql = """insert into caselaw3 values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        #self.curs.executemany(sql,data)
        #self.connect.commit()
        #bulk insert 방법 
        #장점으로는 시간이 단축된다. 
        #단점으로는 키설정이 불가능한다. why? 1번실행으로 모든 데이터를 insert하는 방법인데 중간에 중복데이터가 존재하므로 오류가난다.
        
        for line in csvReader:
            try:
                self.curs.execute(sql,line)
                self.connect.commit()
            except:
                continue
        #일반적인 insert 방법
        #장점으로는 중복데이터가 발생하지 않는다.(기본키 설정이가능하다.) 
        #단점으로는 실행시간이 비교적 느리다.
        
        f.close() #파일 닫기
            

def updateDB():
    case = CaseLawDB()
    case.connection()
    
    case.dbUpdate()
    
    case.close()
 
    #thread = threading.Timer(5, DB).start() 
    #주기적으로 반복하기 위함
    #끝나는 시간을 기점으로 초가 흐른다.
            

    print("time :", time.time() - start)  # 현재시각 - 시작시간 = 실행 시간    


updateDB()
