### Package Load ###
import streamlit as st
import pandas as pd
import numpy as np
import pickle as pk

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

### Caching AI Model and Data ###
# 1. Precedent DataFrame Data Load Function
@st.cache(allow_output_mutation=True)
def load_prec_df():
    prec_df = pd.read_csv("./data/prec_data_refine.csv", encoding='utf-8-sig')
    return prec_df

# 2. Precedent embeddings pickle data load function
@st.cache(allow_output_mutation=True)
def load_prec_pickle():
    with open("./data/prec_data_refine_embeddings.pickle", "rb") as fr:
        prec_embeddings = pk.load(fr)
    
    return prec_embeddings

@st.cache(allow_output_mutation=True)
def load_sbert():
    model = SentenceTransformer('jhgan/ko-sbert-sts')
    return model