### Package Load ###
import pandas as pd
import numpy as np
import pickle as pk
import streamlit as st

from module import search

### Cache Data ###
@st.cache(allow_output_mutation=True)
def load_prec_df():
    prec_df = pd.read_csv("./data/prec_data_refine.csv", encoding='utf-8-sig')
    
    return prec_df

@st.cache(allow_output_mutation=True)
def load_prec_pickle():
    with open("./data/prec_data_refine_embeddings.pickle", "rb") as fr:
        prec_pickle = pk.load(fr)
    
    return prec_pickle

### Cache Module ###
@st.cache(allow_output_mutation=True)
def load_search_module(prec_df, prec_pickle):
    search_module = search.PrecSearchEngine(prec_df, prec_pickle)
    
    return search_module

### Define Session state ###
if 'prec_df' not in st.session_state:
    st.session_state['prec_df'] = load_prec_df()

if 'prec_pickle' not in st.session_state:
    st.session_state['prec_pickle'] = load_prec_pickle()

if 'search' not in st.session_state:
    st.session_state['search'] = load_search_module(st.session_state['prec_df'], st.session_state['prec_pickle'])

if 'page' not in st.session_state:
    st.session_state['page'] = 0
    
if 'result' not in st.session_state:
    st.session_state['result'] = None

# Load Data from session
prec_df = st.session_state['prec_df']
prec_pickle = st.session_state['prec_pickle']
    
### Home Front-End ###
st.markdown("# 👵AI 판례 검색 시스템")

with st.expander("시스템 소개"):
    st.markdown("""> 사건의 내용을 입력하면 그와 비슷한 판례를 찾아주는 시스템입니다.""")

# 1. input form
with st.form("form_1", clear_on_submit=False):
    user_accident_input = st.text_area('사건 내용 입력')
    user_view_count = st.number_input('검색할 판례 수', min_value=0, max_value=len(st.session_state['prec_df']), value=5)
    submitted_1 = st.form_submit_button("검색")

# 2. show result
if submitted_1:
    search_result = st.session_state['search'].run(user_accident_input, user_view_count)
    st.session_state['result'] = search_result
        
if st.session_state['result']:
    prec_idx = st.session_state['result'][st.session_state['page']][0]
    prec_sim = round(st.session_state['result'][st.session_state['page']][1] * 100, 2)
    
    st.markdown(f'### 유사도 {prec_sim}%')
    st.markdown(f'- 사건명 : {prec_df["사건명"][prec_idx]}')
    st.markdown(f'- 선고일자 : {prec_df["선고일자"][prec_idx]}')
    st.markdown(f'- 판례내용 : {prec_df["판례내용"][prec_idx]}')
    
    with st.form('form_2', clear_on_submit=True):
        form_2_col_1, form_2_col_2 = st.columns(2)

        with form_2_col_1:
            submitted_2 = st.form_submit_button('이전')
        with form_2_col_2:
            submitted_3 = st.form_submit_button('다음')

        if submitted_2 and int(st.session_state['page']) > 0:
            st.session_state['page'] -= 1
        elif submitted_3 and (int(st.session_state['page']) < len(st.session_state['prec_df']) - 1):
            st.session_state['page'] += 1