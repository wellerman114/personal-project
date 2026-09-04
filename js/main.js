// =========================
// 페이지 로드 후 실행
// =========================

document.addEventListener("DOMContentLoaded", async function () {

    try {
        // 섹션별로 정리된 도서 정보 JSON 요청
        const 응답 = await fetch("./data/main-books.json");

        if (!응답.ok) {
            throw new Error(`도서 정보 요청 실패: ${응답.status}`);
        }

        const 도서정보 = await 응답.json();
        const 도서텍스트 = {};

        // 각 섹션의 texts 객체를 주입에 사용할 하나의 조회 객체로 합치기
        Object.values(도서정보).forEach(function (섹션) {
            if (섹션 && typeof 섹션 === "object" && 섹션.texts) {
                Object.assign(도서텍스트, 섹션.texts);
            }
        });

        // HTML 구조를 바꾸지 않고 async-book 주석 위치에 도서 텍스트만 삽입
        const 주석탐색기 = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT
        );
        const 도서정보위치 = [];

        while (주석탐색기.nextNode()) {
            if (주석탐색기.currentNode.nodeValue.trim().startsWith("async-book:")) {
                도서정보위치.push(주석탐색기.currentNode);
            }
        }

        도서정보위치.forEach(function (주석) {
            const 키 = 주석.nodeValue.trim().replace("async-book:", "").trim();

            if (Object.hasOwn(도서텍스트, 키)) {
                주석.replaceWith(document.createTextNode(도서텍스트[키]));
            }
        });
    } catch (오류) {
        console.error("메인 도서 정보를 불러오지 못했습니다.", 오류);
    }

    // 지금 많이 읽고 있는 작품 순위 페이지
    const 순위트랙 = document.querySelector(".순위트랙");
    const 순위이전버튼 = document.querySelector(".순위이전버튼");
    const 순위다음버튼 = document.querySelector(".순위다음버튼");

    if (순위트랙 && 순위이전버튼 && 순위다음버튼) {
        순위다음버튼.addEventListener("click", function () {
            순위트랙.style.transform = "translateX(-100%)";
            순위다음버튼.hidden = true;
            순위이전버튼.hidden = false;
        });

        순위이전버튼.addEventListener("click", function () {
            순위트랙.style.transform = "translateX(0)";
            순위이전버튼.hidden = true;
            순위다음버튼.hidden = false;
        });
    }

    // 새로 나온 작품 두 페이지
    const 신작트랙 = document.querySelector(".신작트랙");
    const 신작이전버튼 = document.querySelector(".신작이전버튼");
    const 신작다음버튼 = document.querySelector(".신작다음버튼");

    if (신작트랙 && 신작이전버튼 && 신작다음버튼) {
        신작다음버튼.addEventListener("click", function () {
            신작트랙.style.transform = "translateX(-100%)";
            신작다음버튼.hidden = true;
            신작이전버튼.hidden = false;
        });

        신작이전버튼.addEventListener("click", function () {
            신작트랙.style.transform = "translateX(0)";
            신작이전버튼.hidden = true;
            신작다음버튼.hidden = false;
        });
    }

    // 오디세이 추천: 여섯 권을 보여주고 두 칸씩 이동
    const 오디세이트랙 = document.querySelector(".오디세이트랙");
    const 오디세이이전버튼 = document.querySelector(".오디세이이전버튼");
    const 오디세이다음버튼 = document.querySelector(".오디세이다음버튼");

    if (오디세이트랙 && 오디세이이전버튼 && 오디세이다음버튼) {
        오디세이다음버튼.addEventListener("click", function () {
            오디세이트랙.style.transform = "translateX(-384px)";
            오디세이다음버튼.hidden = true;
            오디세이이전버튼.hidden = false;
        });

        오디세이이전버튼.addEventListener("click", function () {
            오디세이트랙.style.transform = "translateX(0)";
            오디세이이전버튼.hidden = true;
            오디세이다음버튼.hidden = false;
        });
    }

    // 베스트 두 페이지
    const 베스트트랙 = document.querySelector(".베스트트랙");
    const 베스트이전버튼 = document.querySelector(".베스트이전버튼");
    const 베스트다음버튼 = document.querySelector(".베스트다음버튼");

    if (베스트트랙 && 베스트이전버튼 && 베스트다음버튼) {
        베스트다음버튼.addEventListener("click", function () {
            베스트트랙.style.transform = "translateX(-100%)";
            베스트다음버튼.hidden = true;
            베스트이전버튼.hidden = false;
        });

        베스트이전버튼.addEventListener("click", function () {
            베스트트랙.style.transform = "translateX(0)";
            베스트이전버튼.hidden = true;
            베스트다음버튼.hidden = false;
        });
    }

    // 선 출간 신작: 세 권을 보여주고 마지막 두 권까지 두 칸 이동
    const 선출간트랙 = document.querySelector(".선출간트랙");
    const 선출간이전버튼 = document.querySelector(".선출간이전버튼");
    const 선출간다음버튼 = document.querySelector(".선출간다음버튼");

    if (선출간트랙 && 선출간이전버튼 && 선출간다음버튼) {
        선출간다음버튼.addEventListener("click", function () {
            선출간트랙.style.transform = "translateX(-770px)";
            선출간다음버튼.hidden = true;
            선출간이전버튼.hidden = false;
        });

        선출간이전버튼.addEventListener("click", function () {
            선출간트랙.style.transform = "translateX(0)";
            선출간이전버튼.hidden = true;
            선출간다음버튼.hidden = false;
        });
    }

    // =========================
    // 슬라이더
    // =========================

    let 현재슬라이드 = 0;

    const 트랙 = document.querySelector(".사진트랙");
    const 그룹들 = document.querySelectorAll(".사진그룹");

    const 이전버튼 = document.querySelector(".이전버튼");
    const 다음버튼 = document.querySelector(".다음버튼");


    if (
        트랙 &&
        이전버튼 &&
        다음버튼 &&
        그룹들.length > 0
    ) {

        const 자동이동간격 = 5000;
        let 자동이동타이머;

        function 슬라이드이동() {
            트랙.style.transform =
                `translateX(-${현재슬라이드 * 100}%)`;
        }

        function 다음슬라이드() {
            현재슬라이드 =
                (현재슬라이드 + 1) % 그룹들.length;

            슬라이드이동();
        }

        function 이전슬라이드() {
            현재슬라이드 =
                (현재슬라이드 - 1 + 그룹들.length) % 그룹들.length;

            슬라이드이동();
        }

        function 자동이동시작() {
            clearInterval(자동이동타이머);
            자동이동타이머 = setInterval(
                다음슬라이드,
                자동이동간격
            );
        }

        // 다음 버튼
        다음버튼.addEventListener("click", function () {
            다음슬라이드();
            자동이동시작();
        });


        // 이전 버튼
        이전버튼.addEventListener("click", function () {
            이전슬라이드();
            자동이동시작();
        });

        자동이동시작();

    }

    // =========================
    // 슬라이더 작품 상세장르 메뉴
    // =========================

    const 상세장르메뉴들 =
        document.querySelectorAll(".상세장르메뉴");


    상세장르메뉴들.forEach(function (메뉴) {

        메뉴.addEventListener("click", function (e) {

            // a 태그의 기본 이동 방지
            e.preventDefault();


            // 모든 메뉴의 active 제거
            상세장르메뉴들.forEach(function (항목) {

                항목.classList.remove("active");

            });


            // 클릭한 메뉴에 active 추가
            메뉴.classList.add("active");

        });

    });



    // =========================
    // 푸터 사업자 정보 펼치기 / 접기
    // =========================

    const 사업자정보버튼 =
        document.querySelector("#사업자정보버튼");

    const 사업자정보내용 =
        document.querySelector("#사업자정보내용");


    if (사업자정보버튼 && 사업자정보내용) {

        사업자정보버튼.addEventListener("click", function () {

            const 열림상태 =
                사업자정보버튼.getAttribute("aria-expanded") === "true";


            // true ↔ false 변경
            사업자정보버튼.setAttribute(
                "aria-expanded",
                String(!열림상태)
            );


            // 내용 펼치기 / 접기
            사업자정보내용.hidden = 열림상태;

        });

    }

});
