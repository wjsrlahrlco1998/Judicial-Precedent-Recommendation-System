// 파일 업로드 변수
const realUpload = document.querySelector('.real-upload');
const upload = document.querySelector('.upload');
const fileName = document.querySelector('.fileName');

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
const inputCheck = (fileName) => {
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
    const input = inputCheck(fileName);

    if(input == true) {
        const loading = document.querySelector('.loadBox');
        loading.style.display = "block";
        setTimeout(() => {
            fetch('/cases_board').then((resolve) => resolve.json()).then((data) => {
                console.log(data.length)
                if (data.length > 0) {
                    loading.style.display = "none";
                    location.href = "/board";
                } else {
                    loading.style.display = "none";
                    location.href = "/alert";
                }
            });
        }, 3000);
    } else {
        event.preventDefault();
    } // 검색 애니메이션, 서버로 검색 자원 판별 요청 후 주소 변경
            // 검색 시간 맞추려면? 고민..!
})




