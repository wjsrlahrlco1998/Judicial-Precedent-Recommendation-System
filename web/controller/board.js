const pageMove = document.querySelector(".headBtns button");
pageMove.addEventListener('click', () => this.location.href = "http://localhost:8080/");

const selectOption = (value) => {
    console.log("test", value); // 사건 추천순 가져오기.
}

const selectValue = document.querySelector("select");

// https://dongyeopblog.wordpress.com/2020/12/08/javascript-%EA%B0%9D%EC%B2%B4%EB%A1%9C-%EA%B5%AC%EC%84%B1%EB%90%9C-%EB%B0%B0%EC%97%B4-%EC%A0%95%EB%A0%AC%ED%95%98%EA%B8%B0/
const contents = document.querySelector("tbody");
const buttons = document.querySelector(".buttons");

const fetchRender = (data) => {
    // ? data.sort((a,b) => b['유사도'].substring(0,b['유사도'].length - 1) - a['유사도'].substring(0,a['유사도'].length - 1)) :
    let sort = (selectValue.value === '유사도순') ? data.sort((a,b) => b['유사도'] - a['유사도']) :
    data.sort((a,b) => {
        return b['선고일자'].substr(0, 4) - a['선고일자'].substr(0, 4)
    });
    const numOfContent = data.length;
    const maxContent = 5;
    const maxButton = 5;
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;

    const makeContent = (id) => {
    id -= 1;
    idx = id + 1;
    console.log(id)
    const content = document.createElement('tr');
    content.classList.add("content");
    content.innerHTML = `
        <td style = "padding : 1rem;">${idx}</td>
        <td style = "text-align : left; padding-top : 1rem;">${data[id]["사건명"]}</td>
        <td style = "padding-top : 1rem;">${data[id]["판례일련번호"]}</td>
        <td style = "padding-top : 1rem;">${data[id]["선고일자"]}</td>
        <td style = "padding-top : 1rem;">${data[id]["사건종류명"]}</td>
        <td style = "padding-top : 1rem;">${data[id]["유사도"]}%</td>
    `;

    // <td class = "download">${data[id]["다운로드"]}</td>
    content.style.cursor = "pointer"

    return content;
    }

    const makeButton = (id) => {
    const button = document.createElement("button");
    button.classList.add("button");
    button.dataset.num = id; // data-num 동적 생성
    button.innerText = id;
    button.addEventListener("click", (e) => {
        // Array.prototype binding
        Array.prototype.forEach.call(buttons.children, (button) => {
        if (button.dataset.num) {
            button.classList.remove("active")
        }; // button class 초기화, active 판별을 위함
        });

        e.target.classList.add("active"); // 사용자가 클릭한 target button active 활성화
        renderContent(parseInt(e.target.dataset.num)); // 숫자변환 후 함수 호출
    });
    return button;
    };

    const renderContent = (page, data) => {
    // 목록 리스트 초기화
    while (contents.hasChildNodes()) {
        contents.removeChild(contents.lastChild);
    }
    // 글의 최대 개수를 넘지 않는 선에서, 화면에 최대 10개의 글 생성
    for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
        contents.appendChild(makeContent(id));
    }
    };

    const prev = document.createElement("button");
    const next = document.createElement("button");

    const renderButton = (page) => {
    // 버튼 리스트 초기화
    while (buttons.hasChildNodes()) {
        buttons.removeChild(buttons.lastChild);
    }
    // 화면에 최대 5개의 페이지 버튼 생성
    for (let id = page; id < page + maxButton && id <= maxPage; id++) {
        buttons.appendChild(makeButton(id));
    }
    // 첫 버튼 활성화(class="active")
    buttons.children[0].classList.add("active");

    buttons.prepend(prev);
    buttons.append(next);

    // 이전, 다음 페이지 버튼이 필요한지 체크
    if (page - maxButton < 1) buttons.removeChild(prev);
    if (page + maxButton > maxPage) buttons.removeChild(next);
    };

    const render = (page) => {
    renderContent(page);
    renderButton(page);
    };

    const goPrevPage = () => {
    page -= maxButton;
    render(page);
    };

    const goNextPage = () => {
    page += maxButton;
    render(page);
    };

    prev.classList.add("button", "prev");
    prev.innerHTML = '이전';
    prev.addEventListener("click", goPrevPage);

    next.classList.add("button", "next");
    next.innerHTML = '다음';
    next.addEventListener("click", goNextPage);

    const totalCase = document.querySelector(".totalCase");
    totalCase.innerHTML = `<span style = "font-size : 3vw; font-weight : bold;">${data.length}</span> 개의 유사한 판례를 찾았습니다.`;

    render(page);
}

fetch('/cases_board').then((resolve) => resolve.json()).then((data) => {
    fetchRender(data);
});

selectValue.addEventListener('change', () => {

    fetch('/cases_board').then((resolve) => resolve.json()).then((data) => {
        while (contents.hasChildNodes()) {
            contents.removeChild(contents.lastChild);
        }

        while (buttons.hasChildNodes()) {
            buttons.removeChild(buttons.lastChild);
        }
        fetchRender(data);
    });
})

// 눌렀을 때, 그에 대한 데이터를 서버에 저장시켜놓고,
// 다른 페이지에서 다시 받아와서 출력하기.

let contentArr;
let isStop = [];

const interval = setInterval(() => {
    contentArr = document.querySelectorAll(".content");
    contentArr.forEach((content) => {
        content.addEventListener('click', (e) => {
            if (isStop == true) {

            } else {
                const title = e.target.parentNode.childNodes[3].innerHTML;
                fetch('/cases_board').then((resolve) => resolve.json()).then((data) => {
                    for (let i of data) {
                        if (i["사건명"] === title){
                            console.log("find!")
                            console.log(i)
                            localStorage.setItem("userInfo", JSON.stringify(i))

                            location.href = '/detail'
                            break;
                        }
                    }
                    // 서버에 데이터 저장 fetch, POST 방식
                });
                isStop = true;
            }
        });
    })
}, 100)

// if (isStop == true) {
//     console.log('stop')
//     clearInterval(interval);
// }



// for (let i = 0; i < contentArr.length; i++){
//     contentArr[i].addEventListener('click', (e) => {
//         const title = e.target.parentNode.childNodes[3].innerHTML;
//         fetch('/cases_board').then((resolve) => resolve.json()).then((data) => {
//             for (let i of data) {
//                 if (i["사건명"] === title){
//                     console.log("find!")
//                     console.log(i)
//                     localStorage.setItem("userInfo", JSON.stringify(i))
//                     location.href = '/detail'
//                     break;
//                 }
//             }
//             // 서버에 데이터 저장 fetch, POST 방식
//         });
//     });
// }

// console.log(contentArr)