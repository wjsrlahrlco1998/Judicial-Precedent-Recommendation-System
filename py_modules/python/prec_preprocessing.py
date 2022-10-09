# Package Load
import pandas as pd
import numpy as np
import warnings
from bs4 import BeautifulSoup
from tqdm import tqdm_notebook

# Define Class
class PrecedentPrcs:
    
    def __init__(self):
        '''초기화'''
        pass
    
    def handling_null(self, prec_df):
        '''결측치 처리'''
        df = prec_df.copy()
        
        # 1. 판례내용 null인 값 제거
        if df['판례내용'].isna().sum() > 0:
            df = df.dropna(subset=['판례내용'], how='any')
        
        # 2. 사건명이 없는 판례 값 채우기 : '제목없음'
        if df['사건명'].isna().sum() > 0:
            df['사건명'] = df['사건명'].fillna(value='제목없음')
        
        # 3. 사건종류명이 없는 판례 값 채우기 : '기타'
        if df['사건종류명'].isna().sum() > 0:
            df['사건종류명'] = df['사건종류명'].fillna(value='기타')
        
        # 4. 판결유형이 없는 판례 값 채우기 : '미기재'
        if df['판결유형'].isna().sum() > 0:
            df['판결유형'] = df['판결유형'].fillna(value='미기재')
            
        # 5. 참조판례가 없는 판례 값 채우기 : '없음'
        if df['참조판례'].isna().sum() > 0:
            df['참조판례'] = df['참조판례'].fillna(value='없음')
            
        # 6. 선고가 없는 판례 값 채우기 : '미기재'
        if df['선고'].isna().sum() > 0:
            df['선고'] = df['선고'].fillna(value='미기재')
            
        # 7. 판시사항이 없는 판례 값 채우기 : '미기재'
        if df['판시사항'].isna().sum() > 0:
            df['판시사항'] = df['판시사항'].fillna(value='미기재')
            
        # 8. 판결요지가 없는 판례 값 채우기 : '미기재'
        if df['판결요지'].isna().sum() > 0:
            df['판결요지'] = df['판결요지'].fillna(value='미기재')
        
        # 9. 참조조문이 없는 판례 값 채우기 : '미기재'
        if df['참조조문'].isna().sum() > 0:
            df['참조조문'] = df['참조조문'].fillna(value='미기재')
        
        return df
        
    def handling_date(self, prec_df):
        '''선고일자 정리'''
        df = prec_df.copy()
        
        def apply_date(x):
            if len(x) == 8:
                x = x[:4] + '-' + x[4:6] + '-' + x[6:8]
            else:
                x = x[:4] + '-00-00'
            
            return x
        
        # 1. 선고일자 데이터 타입 변경
        df['선고일자'] = df['선고일자'].astype('str')
        
        # 2. 선고일자의 특수문자 제거
        df['선고일자'] = df['선고일자'].apply(lambda x : x[:-2])
        df['선고일자'] = df['선고일자'].str.replace('[^0-9]', '')
        
        # 3. 선고일자의 형식 통일 : ex. 2022-08-18 or 2022
        df['선고일자'] = df['선고일자'].apply(apply_date)

        return df
    
    def handling_duplicate(self, prec_df):
        '''중복 처리'''
        df = prec_df.copy()
        
        # 1. 사건번호 중복 제거
        df = df.drop_duplicates(subset=['사건번호'])
        
        return df
    
    def handling_schars(self, prec_df):
        '''html 처리'''
        df = prec_df.copy()
        
        def apply_reference(x):
            temp = []
            if '<' in x:
                soup = BeautifulSoup(x)
                return soup.text
            else:
                return x
        
        # 1. html 형식 제거
        df['참조판례'] = df['참조판례'].apply(apply_reference)
        
        return df
    
    def handling_snum(self, prec_df):
        '''법원종류코드 및 사건종류코드 처리'''
        df = prec_df.copy()
        
        df = df.astype({'선고일자' : 'str', '법원종류코드' : 'str', '사건종류코드' : 'str'})
        
        df['법원종류코드'] = df['법원종류코드'].apply(lambda x : x[:-2])
        df['사건종류코드'] = df['사건종류코드'].apply(lambda x : x[:-2])
        
        return df
            
    def sort(self, prec_df, standard, ascending = False):
        '''정렬'''
        df = prec_df.copy()
        
        df.sort_values(standard, ascending=ascending)
        
        return df
    
    def run(self, prec_df):
        df = prec_df.copy()
        
        # 1. 판례 결측치 처리
        df = self.handling_null(df)
        
        # 2. 판례 법원종류코드 및 사건종류 코드 처리
        df = self.handling_snum(df)
        
        # 3. 판례 선고일자 처리
        df = self.handling_date(df)
        
        # 4. 판례 중복 처리
        df = self.handling_duplicate(df)
        
        # 5. html 처리
        df = self.handling_schars(df)
        
        # 6. 판례 정렬 : 디폴트 선고일자 내림차순
        df = self.sort(df, standard='선고일자', ascending=False)
        
        # 7. 인덱스 재설정
        df = df.reset_index(drop=True)
        
        return df

if __name__ == "__main__":
    prec_df = pd.read_csv('../data/prec_data.csv', encoding='utf-8-sig')
    prec_obj = PrecedentPrcs()
    prep_df = prec_obj.run(prec_df)