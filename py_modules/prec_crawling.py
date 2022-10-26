# Package Load
import pandas as pd
import requests
import xml.etree.ElementTree as tree
from tqdm import tqdm_notebook
import warnings

# Ignore Warning
warnings.filterwarnings('ignore')

# Define Class
class PrecedentCrawl:
    def __init__(self, oc='wjsrlahrlco', sort='ddes'):
        '''생성자'''
        self.__oc = oc
        self.__sort = sort
        self.__prec_list_url = f'https://www.law.go.kr/DRF/lawSearch.do?OC={oc}&target=prec&type=XML&sort={sort}&page={1}'
        self.__totalPage = int()
        self.__totalCnt = int()
        self.__prec_dict = {}
    
    def start_crawling(self):
        '''판례 크롤링 함수'''
        
        # 1. 판례의 총 개수 추출
        prec_list_response = requests.get(self.__prec_list_url)
        root = tree.fromstring(prec_list_response.text)
        self.__totalCnt = int(root.find('totalCnt').text)
        
        # 2. 판례의 총 페이지 수 계산
        if self.__totalCnt % 20 == 0:
            self.__totalPage = self.__totalCnt // 20
        else:
            self.__totalPage = (self.__totalCnt // 20) + 1
        
        print(f'총 판례 수\t:\t{self.__totalCnt}\n총 페이지 수\t:\t{self.__totalPage}')
        
        # 3. 판례 크롤링
        i = 0

        for page in tqdm_notebook(range(1, self.__totalPage + 1)):
            for item in root.iter('prec'):
                try:
                    target_info = {}

                    prec_serial_num = item.find('판례일련번호').text

                    prec_info_response = requests.get(f"http://www.law.go.kr/DRF/lawService.do?OC={self.__oc}&target=prec&ID={prec_serial_num}&type=XML")
                    prec_info_root = tree.fromstring(prec_info_response.text)

                    target_info['판례일련번호'] = prec_serial_num
                    target_info['사건명'] = prec_info_root.find('사건명').text
                    target_info['사건번호'] = prec_info_root.find('사건번호').text
                    target_info['선고일자'] = prec_info_root.find('선고일자').text
                    target_info['선고'] = prec_info_root.find('선고').text
                    target_info['법원명'] = prec_info_root.find('법원명').text
                    target_info['법원종류코드'] = prec_info_root.find('법원종류코드').text
                    target_info['사건종류명'] = prec_info_root.find('사건종류명').text
                    target_info['사건종류코드'] = prec_info_root.find('사건종류코드').text
                    target_info['판결유형'] = prec_info_root.find('판결유형').text
                    target_info['판시사항'] = prec_info_root.find('판시사항').text
                    target_info['판결요지'] = prec_info_root.find('판결요지').text
                    target_info['참조조문'] = prec_info_root.find('참조조문').text
                    target_info['참조판례'] = prec_info_root.find('참조판례').text
                    target_info['판례내용'] = prec_info_root.find('판례내용').text

                    self.__prec_dict[i] = target_info
                    i += 1
                except Exception as e:
                    print(e)
            try:
                self.__prec_list_url = f'https://www.law.go.kr/DRF/lawSearch.do?OC={self.__oc}&target=prec&type=XML&sort={self.__sort}&page={page}'
                prec_list_response = requests.get(self.__prec_list_url)
                root = tree.fromstring(prec_list_response.text)
            except Exception as e:
                print(e)
        
        return self.__prec_dict
    
    def save_judg_precedent_to_csv(self, prec_dict, filename):
        '''판례 csv 저장 함수'''
        prec_df = pd.DataFrame.from_dict(prec_dict, orient='index')
        prec_df.to_csv(f'{filename}.csv', encoding='utf-8-sig', index=False)
    
    def save_judg_precedent_to_db(self, db, df:pd.DataFrame, table='cases_info'):
        '''판례 DB 저장 함수'''
        db.insert(df, table=table)
    
    def dict_to_df(self, prec_dict):
        '''dict형 자료형을 DataFrame으로 바꿔주는 함수'''
        prec_df = pd.DataFrame.from_dict(prec_dict, orient='index')
        
        return prec_df
    
    def update_crawling(self, recent_serial_nums):
        '''업데이트를 위한 판례 크롤링 함수'''
         # 1. 판례의 총 개수 추출
        prec_list_response = requests.get(self.__prec_list_url)
        root = tree.fromstring(prec_list_response.text)
        self.__totalCnt = int(root.find('totalCnt').text)
        
        # 2. 판례의 총 페이지 수 계산
        if self.__totalCnt % 20 == 0:
            self.__totalPage = self.__totalCnt // 20
        else:
            self.__totalPage = (self.__totalCnt // 20) + 1
        
        print(f'총 판례 수\t:\t{self.__totalCnt}\n총 페이지 수\t:\t{self.__totalPage}')
        
        # 3. 판례 크롤링
        self.__prec_dict = {}
        i = 0
        stop = False

        for page in tqdm_notebook(range(1, self.__totalPage + 1)):
            
            if stop:
                break
            
            for item in root.iter('prec'):
                try:
                    target_info = {}

                    prec_serial_num = item.find('판례일련번호').text
                    
                    if prec_serial_num in recent_serial_nums:
                        stop = True
                        break

                    prec_info_response = requests.get(f"http://www.law.go.kr/DRF/lawService.do?OC={self.__oc}&target=prec&ID={prec_serial_num}&type=XML")
                    prec_info_root = tree.fromstring(prec_info_response.text)

                    target_info['판례일련번호'] = prec_serial_num
                    target_info['사건명'] = prec_info_root.find('사건명').text
                    target_info['사건번호'] = prec_info_root.find('사건번호').text
                    target_info['선고일자'] = prec_info_root.find('선고일자').text
                    target_info['선고'] = prec_info_root.find('선고').text
                    target_info['법원명'] = prec_info_root.find('법원명').text
                    target_info['법원종류코드'] = prec_info_root.find('법원종류코드').text
                    target_info['사건종류명'] = prec_info_root.find('사건종류명').text
                    target_info['사건종류코드'] = prec_info_root.find('사건종류코드').text
                    target_info['판결유형'] = prec_info_root.find('판결유형').text
                    target_info['판시사항'] = prec_info_root.find('판시사항').text
                    target_info['판결요지'] = prec_info_root.find('판결요지').text
                    target_info['참조조문'] = prec_info_root.find('참조조문').text
                    target_info['참조판례'] = prec_info_root.find('참조판례').text
                    target_info['판례내용'] = prec_info_root.find('판례내용').text

                    self.__prec_dict[i] = target_info
                    i += 1
                except Exception as e:
                    print(e)
            try:
                self.__prec_list_url = f'https://www.law.go.kr/DRF/lawSearch.do?OC={self.__oc}&target=prec&type=XML&sort={self.__sort}&page={page}'
                prec_list_response = requests.get(self.__prec_list_url)
                root = tree.fromstring(prec_list_response.text)
            except Exception as e:
                print(e)
        
        return self.__prec_dict
    
    def run(self, fname):
        prec_dict = self.start_crawling()
        self.save_judg_precedent(prec_dict=prec_dict, filename=fname)
        
if __name__ == "__main__":
    # 1. 객체 선언
    crawling_obj = PrecedentCrawl()
    # 2. 크롤링 Start
    crawling_obj.run(fname="precedent.csv")