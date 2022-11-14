const pageMove = document.querySelector("button");
pageMove.addEventListener('click', () => this.location.href = "http://localhost:8080/board");

const example = JSON.parse(localStorage.getItem("userInfo"))

const head = document.querySelector(".head")
head.innerHTML = `
     <div>사건명 : ${example['사건명']}</div>
     <div>판례일련번호 : ${example['판례일련번호']}</div>
     <div>사건번호 : ${example['사건번호']}</div>
     <div>사건종류코드 : ${example['사건종류코드']}</div>
`;

const head2 = document.querySelector(".head2")
head2.innerHTML = `
     <div>선고일자 : ${example['선고일자']}</div>
     <div>법원명 : ${example['법원명']}</div>
     <div>법원종류코드 : ${example['법원종류코드']}</div>
     <div>사건종류 : ${example['사건종류명']}</div>
     <div>${example['판결유형']}</div>
     <div>선고여부 : ${example['선고']}</div>
`;

const head4 = document.querySelector(".head4")
head4.innerHTML = `
     <div>${example['판례내용']}</div>
`;

const head6 = document.querySelector(".head6")
head6.innerHTML = `
     <div>${example['판결요지']}</div>
`;

const head8 = document.querySelector(".head8")
head8.innerHTML = `
     <div>${example['참조판례']}</div>
`;

const head10 = document.querySelector(".head10")
head10.innerHTML = `
     <div>${example['참조조문']}</div>
`;

const head12 = document.querySelector(".head12")
head12.innerHTML = `
     <div>${example['판시사항']}</div>
`;