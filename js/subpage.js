document.addEventListener("DOMContentLoaded", function () {
    사업자정보연결();
    상세데이터불러오기();
});

async function 상세데이터불러오기() {
    try {
        const 응답 = await fetch("./data/project-hail-mary.json");

        if (!응답.ok) {
            throw new Error(`도서 정보를 불러오지 못했습니다. (${응답.status})`);
        }

        const 데이터 = await 응답.json();

        책정보출력(데이터.book);
        작품정보출력(데이터.workInformation);
        리뷰출력(데이터.review);
        대표작품출력(데이터.authorTrilogy);
        연관작품출력(데이터.relatedWorks);
    } catch (오류) {
        console.error("비동기 데이터 호출 실패:", 오류);
        document.querySelector(".책정보")?.classList.add("데이터호출실패");
    }
}

function 글자넣기(선택자, 내용) {
    const 요소 = document.querySelector(선택자);
    if (요소) 요소.textContent = 내용 ?? "";
}

function 배열문자열(값, 구분자 = "\n") {
    return Array.isArray(값) ? 값.join(구분자) : (값 ?? "");
}

function 책정보출력(책) {
    if (!책) return;

    const 표지 = document.querySelector(".책표지");
    if (표지 && 책.cover) {
        if (책.cover.src) 표지.src = 책.cover.src;
        표지.alt = 책.cover.alt ?? "";
    }

    글자넣기(".책카테고리", 배열문자열(책.categories, " > "));
    글자넣기(".책제목", 책.title);
    글자넣기(".책평점", 책.rating ? `★ ${책.rating}` : "");
    글자넣기(".책평가수", 책.ratingCount ? `(${책.ratingCount})` : "");
    글자넣기(".책관심수", 책.interestCount);
    글자넣기(".책출판사", 책.publisher);
    글자넣기(".책이벤트", 책.event);
    글자넣기(".전자책정가", 책.purchase?.regularPrice);
    글자넣기(".판매가격", 책.purchase?.salePrice);

    관계자출력(책.contributors);
    상세정보출력(책.detail);
    함께구매출력(책.alsoPurchased);
}

function 관계자출력(관계자목록 = []) {
    const 목록 = document.querySelector(".책관계자목록");
    if (!목록) return;

    목록.replaceChildren();

    관계자목록.forEach(function (관계자) {
        const 항목 = document.createElement("li");
        const 이름 = document.createElement("a");
        const 역할 = document.createElement("span");

        이름.href = "#";
        이름.textContent = 관계자.name ?? "";
        역할.className = "책관계자역할";
        역할.textContent = 관계자.role ?? "";
        항목.append(이름, 역할);
        목록.appendChild(항목);
    });
}

function 상세정보출력(상세 = {}) {
    글자넣기(".출간정보라벨", 상세.publishedLabel);
    글자넣기(".출간정보내용", 배열문자열(상세.published));
    글자넣기(".파일정보라벨", 상세.fileLabel);
    글자넣기(".파일정보내용", 배열문자열(상세.file));
    글자넣기(".듣기기능라벨", 상세.ttsLabel);
    글자넣기(".듣기기능내용", 상세.tts);
    글자넣기(".지원환경라벨", 상세.supportLabel);
    글자넣기(".지원환경내용", 배열문자열(상세.support, " · "));
    글자넣기(".isbn라벨", 상세.isbnLabel);
    글자넣기(".isbn내용", 상세.isbn);
}

function 함께구매출력(추천 = {}) {
    글자넣기(".함께구매제목", 추천.title);
    const 목록 = document.querySelector(".함께구매목록");
    if (!목록) return;

    목록.replaceChildren();
    (추천.books ?? []).forEach(function (책제목) {
        const 항목 = document.createElement("li");
        항목.textContent = 책제목;
        목록.appendChild(항목);
    });
}

function 작품정보출력(작품 = {}) {
    문단출력("#작품소개", 작품.introduction);
    목차출력("#목차", 작품.contents);
    문단출력("#출판사서평", 작품.publisherReview);
}

function 문단출력(선택자, 문단목록 = []) {
    const 영역 = document.querySelector(선택자);
    if (!영역) return;

    영역.replaceChildren();
    문단목록.forEach(function (내용) {
        const 문단 = document.createElement("p");
        문단.textContent = 내용;
        영역.appendChild(문단);
    });
}

function 목차출력(선택자, 목차목록 = []) {
    const 영역 = document.querySelector(선택자);
    if (!영역) return;

    const 목록 = document.createElement("ol");
    목차목록.forEach(function (내용) {
        const 항목 = document.createElement("li");
        항목.textContent = 내용;
        목록.appendChild(항목);
    });
    영역.replaceChildren(목록);
}

function 리뷰출력(리뷰 = {}) {
    글자넣기(".리뷰평점", 리뷰.rating ? `★ ${리뷰.rating}` : "");
    글자넣기(".리뷰평가수", 리뷰.ratingCount);

    const 목록 = document.querySelector(".댓글목록");
    const 더보기버튼 = document.querySelector(".댓글더보기버튼");
    if (!목록) return;

    목록.replaceChildren();
    (리뷰.comments ?? []).forEach(function (댓글) {
        const 카드 = document.createElement("article");
        const 윗줄 = document.createElement("div");
        const 별점 = document.createElement("span");
        const 작성자 = document.createElement("strong");
        const 날짜 = document.createElement("time");
        const 내용 = document.createElement("p");

        카드.className = "댓글카드";
        윗줄.className = "댓글윗줄";
        별점.className = "댓글별점";
        작성자.className = "댓글작성자";
        날짜.className = "댓글날짜";
        내용.className = "댓글내용";
        별점.textContent = 댓글.rating ? "★".repeat(댓글.rating) : "";
        작성자.textContent = 댓글.writer ?? "";
        날짜.textContent = 댓글.date ?? "";
        내용.textContent = 댓글.content ?? "";

        윗줄.append(별점, 작성자, 날짜);
        카드.append(윗줄, 내용);
        목록.appendChild(카드);
    });

    if (더보기버튼) 더보기버튼.hidden = !(리뷰.comments?.length > 5);
}

function 도서카드만들기(책) {
    const 카드 = document.createElement("article");
    const 표지영역 = document.createElement("div");
    const 표지 = document.createElement("img");
    const 정보 = document.createElement("div");
    const 제목 = document.createElement("strong");
    const 작가 = document.createElement("span");
    const 평점 = document.createElement("span");

    카드.className = "서브도서카드";
    표지영역.className = "서브도서표지링크";
    표지.className = "서브도서표지";
    정보.className = "서브도서정보";
    제목.className = "서브도서제목";
    작가.className = "서브도서작가";
    평점.className = "서브도서평점";

    표지.src = 책.cover || "";
    표지.alt = 책.coverAlt || "";
    제목.textContent = 책.title || "";
    작가.textContent = 책.author || "";
    평점.textContent = 책.rating
        ? `★ ${책.rating} (${책.ratingCount || "0"})`
        : "";

    표지영역.appendChild(표지);
    정보.append(제목, 작가, 평점);
    카드.append(표지영역, 정보);

    return 카드;
}

function 도서목록출력(선택자, 책목록 = []) {
    const 목록 = document.querySelector(선택자);
    if (!목록) return;

    목록.replaceChildren();
    책목록.forEach(function (책) {
        목록.appendChild(도서카드만들기(책));
    });
}

function 대표작품출력(책목록 = []) {
    도서목록출력(".대표작품목록", 책목록);
}

function 연관작품출력(책목록 = []) {
    도서목록출력(".연관작품목록", 책목록);
}

function 사업자정보연결() {
    const 버튼 = document.querySelector("#사업자정보버튼");
    const 내용 = document.querySelector("#사업자정보내용");
    if (!버튼 || !내용) return;

    버튼.addEventListener("click", function () {
        const 열림 = 버튼.getAttribute("aria-expanded") === "true";
        버튼.setAttribute("aria-expanded", String(!열림));
        내용.hidden = 열림;
    });
}
