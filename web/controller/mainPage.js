// 파일 업로드 변수
const realUpload = document.querySelector('.real-upload');
const upload = document.querySelector('.upload');
const fileName = document.querySelector('.fileName');
console.log('fileName', fileName)
localStorage.setItem("fetchInfo", true);

// 파일 업로드 이벤트
upload.addEventListener('click', () => realUpload.click());
realUpload.addEventListener('change', () => {

    if (realUpload.files.length > 1) {
        alert("하나의 파일만 선택 가능합니다.");
    }
    else {
        let fileList = "";
        for(i = 0; i < realUpload.files.length; i++) {
            fileList += realUpload.files[i].name + '<br>';
        }

        fileName.innerHTML = fileList;
    }
})

// 파일 form 제출
const submit = document.querySelector(".submitBtn");
const search = document.querySelector(".searchBar");
const form = document.querySelector(".layout");

// 파일 사건종류 체크 함수
const inputCheck = () => {
    console.log('inputCheck start');
    let inputCheck = Boolean(false);
    const inputList = document.querySelectorAll('input[type="checkbox"]');
    const checkList = [];
    inputList.forEach((check) => {
        checkList.push(check.checked);
    });

    if(checkList.includes(true) === false){
        console.log("check",checkList.includes('true') )
        alert("사건 종류를 선택해주세요.");
        inputCheck = false;
    } else { inputCheck = true};

    return inputCheck;
};

// 파일 form 제출 이벤트
search.addEventListener('click', () => submit.click());
form.addEventListener('submit', (event) => {
    const input = inputCheck();

    if(input == true) {
        location.href = '/board'
    } else {
        event.preventDefault();
    } // 검색 애니메이션, 서버로 검색 자원 판별 요청 후 주소 변경
            // 검색 시간 맞추려면? 고민..!
})
