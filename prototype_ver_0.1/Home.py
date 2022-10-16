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
def load_search_module():
    search_module = search.PrecSearchEngine()
    
    return search_module

### Define Session state ###
if 'prec_df' not in st.session_state:
    st.session_state['prec_df'] = load_prec_df()

if 'prec_pickle' not in st.session_state:
    st.session_state['prec_pickle'] = load_prec_pickle()

if 'page' not in st.session_state:
    st.session_state['page'] = 0
    
if 'result' not in st.session_state:
    st.session_state['result'] = None

if 'case_list' not in st.session_state:
    st.session_state['case_list'] = None

if 'page_change' not in st.session_state:
    st.session_state['page_change'] = 0

if 'selected_prec_df' not in st.session_state:
    st.session_state['selected_prec_df'] = None
    
### Define Callable function ###
def page_controll():
    if st.session_state['page_change'] == 0:
        st.session_state['page_change'] = 1
    else:
        st.session_state['page_change'] = 0
    
# Load Data from session
prec_df = st.session_state['prec_df']
prec_pickle = st.session_state['prec_pickle']
prec_df['embeddings'] = prec_pickle

search_module = load_search_module()
    
### Home Front-End ###
if st.session_state['page_change'] == 0:
    # 1. 헤드라인
    _, col_head, _ = st.columns(3)
    with col_head:
        st.markdown("# Cases")

    # 2. 사건종류 선택 (Check Box)
    with st.form("settings_form", clear_on_submit=False):
        st.markdown("**1. 검색할 사건 종류를 선택해주세요.**")
        check_box_col_1, check_box_col_2, check_box_col_3, check_box_col_4 = st.columns(4)
        with check_box_col_1: 
            check_box_1 = st.checkbox("민사", key = 'cbx_1')
            check_box_2 = st.checkbox("특허", key = 'cbx_2')
        with check_box_col_2:
            check_box_3 = st.checkbox("형사", key = 'cbx_3')
            check_box_4 = st.checkbox("세무", key = 'cbx_4')
        with check_box_col_3:
            check_box_5 = st.checkbox("가사", key = 'cbx_5')
            check_box_6 = st.checkbox("기타", key = 'cbx_6')
        with check_box_col_4:
            check_box_7 = st.checkbox("일반행정", key = 'cbx_7')

        st.markdown("**2. 사건 내용 입력방식을 선택해주세요.**")
        mode = st.radio("", ("직접입력", "불러오기"), horizontal=True)

        submit_1 = st.form_submit_button('Settings')

    # 3. 사용자 입력 받기
    if submit_1:
        if (check_box_1 | check_box_2 | check_box_3 | check_box_4 | check_box_5 | check_box_6 | check_box_7):
            cases_list = []
            if check_box_1:
                cases_list.append("민사")
            if check_box_2:
                cases_list.append("특허")
            if check_box_3:
                cases_list.append("형사")
            if check_box_4:
                cases_list.append("세무")
            if check_box_5:
                cases_list.append("가사")
            if check_box_6:
                cases_list.append("기타")
            if check_box_7:
                cases_list.append("일반행정")
            st.session_state['case_list'] = cases_list
        else:
            st.error("사건 종류를 선택해주세요.", icon="🚨")

    with st.form("search_form", clear_on_submit=False):
        if mode == "직접입력":
            if st.session_state['case_list']:
                st.markdown("**3. 사건 내용 입력**")
                user_accident_input = st.text_area("")
                user_view_count = st.number_input('검색할 판례 수', min_value=0, max_value=len(prec_df.loc[prec_df['사건종류명'].isin(st.session_state['case_list'])]), value=5)
            else:
                st.error("사건 종류를 선택해주세요.", icon="🚨")
        elif mode == "불러오기":
            st.error("아직 구현되지않은 기능입니다.", icon="😂")

        submit_2 = st.form_submit_button("Search")        

    # 4. 판례 검색
    if submit_2:
        # 1) 선택된 카테고리 판례 선택
        selected_prec_df = prec_df.loc[prec_df['사건종류명'].isin(st.session_state['case_list'])]
        selected_prec_df = selected_prec_df.reset_index(drop=True)
        st.session_state['selected_prec_df'] = selected_prec_df.copy()

        # 2) 판례 검색 엔진 실행
        with st.spinner("판례 검색 중..."):
            st.session_state['result'] = search_module.run(user_accident_input, user_view_count, selected_prec_df)
        st.success("검색 완료!")
        st.button("결과확인", key='bnt_1', on_click=page_controll)
    
elif st.session_state['page_change'] == 1:
    # 1. 헤드라인
    st.markdown("# Cases Search Result")
    st.button("초기화면", key='bnt_2', on_click=page_controll)
    
    with st.form('form_2', clear_on_submit=True):
        form_2_col_1, form_2_col_2 = st.columns(2)

        with form_2_col_1:
            submitted_2 = st.form_submit_button('이전')
        with form_2_col_2:
            submitted_3 = st.form_submit_button('다음')

        if submitted_2 and int(st.session_state['page']) > 0:
            st.session_state['page'] -= 1
        elif submitted_3 and (int(st.session_state['page']) < len(st.session_state['result']) - 1):
            st.session_state['page'] += 1
    st.markdown(f"Page {st.session_state['page'] + 1} / {len(st.session_state['result'])}")
    
    prec_idx = st.session_state['result'][st.session_state['page']][0]
    prec_sim = round(st.session_state['result'][st.session_state['page']][1] * 100, 2)
    
    selected_prec_df = st.session_state['selected_prec_df'].copy()
    
    st.markdown(f'### 유사도 {prec_sim}%')
    st.markdown(f'- 사건명 : **{selected_prec_df["사건명"][prec_idx]}**')
    st.markdown(f'- 사건종류 : **{selected_prec_df["사건종류명"][prec_idx]}**')
    st.markdown(f'- 선고일자 : **{selected_prec_df["선고일자"][prec_idx]}**')
    st.markdown(f'- 판례 일련번호 : **{selected_prec_df["판례일련번호"][prec_idx]}**')
    st.markdown(f'- 판시사항 : {selected_prec_df["판시사항"][prec_idx]}')
    st.markdown(f'- 판결요지 : {selected_prec_df["판결요지"][prec_idx]}')
    with st.expander("판례내용"):
        st.markdown(f'{selected_prec_df["판례내용"][prec_idx]}')
    st.markdown(f'- 참조판례 : *{selected_prec_df["참조판례"][prec_idx]}*')
    st.markdown(f'- 참조조문 : *{selected_prec_df["참조조문"][prec_idx]}*')