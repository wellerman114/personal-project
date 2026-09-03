// =========================
// 페이지 로드 후 실행
// =========================

document.addEventListener("DOMContentLoaded", function () {

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
