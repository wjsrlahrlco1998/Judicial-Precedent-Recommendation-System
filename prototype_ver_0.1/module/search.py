### Package Load ###
import pandas as pd
import numpy as np
import tensorflow as tf
import pickle as pk

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

### Define Class ###
class PrecSearchEngine:
    def __init__(self, prec_df, prec_pickle):
        self.sbert_model = SentenceTransformer('jhgan/ko-sbert-sts')
        self.prec_df = prec_df
        self.prec_pickle = prec_pickle
    
    def embedding_text(self, text):
        embedded_text = self.sbert_model.encode(text)
        
        return embedded_text
    
    def compare_similarity(self, user_input):
        with tf.device("/device:GPU:0"):
            embedded_user_input = self.embedding_text(user_input)

            prec_similarity = list(enumerate(cosine_similarity([embedded_user_input], self.prec_pickle)[0]))
            prec_similarity = sorted(prec_similarity, key = lambda x : x[1], reverse = True)
        
        return prec_similarity
    
    def run(self, user_input, view_count):
        prec_similarity = self.compare_similarity(user_input)
        
        return prec_similarity[:view_count]
    
### Test Code ###
if __name__ == "__main__":
    prec_df = pd.read_csv("../data/prec_data_refine.csv", encoding='utf-8-sig')
    with open("../data/prec_data_refine_embeddings.pickle", "rb") as fr:
        prec_embeddings = pk.load(fr)
    
    search = PrecSearchEngine(prec_df, prec_embeddings)
    
    print("""<< 판례 유사도 비교 >>""")
    user_input = input("사건 내용 입력 : ")
    user_view_count = int(input("검색할 판례 개수 선택 : "))
    
    search.run(user_input, user_view_count)