// =========================
// 페이지 로드 후 실행
// =========================

document.addEventListener("DOMContentLoaded", function () {


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

        // 다음 버튼
        다음버튼.addEventListener("click", function () {

            if (현재슬라이드 < 그룹들.length - 1) {
                현재슬라이드++;
            }

            트랙.style.transform =
                `translateX(-${현재슬라이드 * 100}%)`;

        });


        // 이전 버튼
        이전버튼.addEventListener("click", function () {

            if (현재슬라이드 > 0) {
                현재슬라이드--;
            }

            트랙.style.transform =
                `translateX(-${현재슬라이드 * 100}%)`;

        });

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