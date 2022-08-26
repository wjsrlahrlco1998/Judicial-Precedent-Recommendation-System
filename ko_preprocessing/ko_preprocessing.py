# Package Load
import re

from kss import split_sentences
from hanspell import spell_checker

# Define class
class K_preprocessing:
    @classmethod
    def remove_special_char(self, sent):
        '''
문장에서 한글과 숫자를 제외하고 모두 제거하는 함수.

Parameters
----------
sent : String

Returns
-------
한글과 숫자만 존재하는 문장 : String
'''
        return re.sub('[^가-힣0-9 ]', '', sent)
    
    @classmethod
    def tokenize_sent(self, document):
        '''
문서의 문장 토큰화하는 함수.

Parameters
----------
document : String

Returns
-------
문장 토큰화된 리스트 : List
'''
        return split_sentences(document)
    
    @classmethod
    def correct_spell(self, sent):
        '''
한글 문장의 맞춤법을 교정해주는 함수.

Parameters
----------
sent : String

Returns
-------
맞춤법이 교정된 문장 : String
'''
        ck_sent = spell_checker.check(sent)
        
        return ck_sent.checked
    
if __name__ == "__main__":
    sent = '안녕 하 세요. 박지성 입니다. 잘 부탁 드립니다.'
    print(K_preprocessing.remove_special_char(sent))
    print(K_preprocessing.tokenize_sent(sent))
    print(K_preprocessing.correct_spell(sent))