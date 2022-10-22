const data = JSON.parse(localStorage.getItem("userInfo"))
const text = document.querySelector(".caseManagerLayout")
console.log(data)
text.innerHTML = `데이터 출력 -> 번호 : ${data["번호"]}, ${data["판례제목"]}, ${data["사건번호"]}
                , ${data["선고날짜"]} , ${data["사건종류"]} , ${data["유사도"]}`