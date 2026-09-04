document.addEventListener("DOMContentLoaded", function () {
    사업자정보연결();
    작품정보탭연결();
    작품정보더보기연결();
    작가정보탭연결();
    작가소개더보기연결();
    리뷰입력연결();
    리뷰더보기연결();
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
        작가정보출력(데이터.authorInformation);
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

    카테고리출력(책.categories);
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

function 카테고리출력(카테고리목록 = []) {
    const 영역 = document.querySelector(".책카테고리");
    if (!영역) return;

    영역.replaceChildren();
    카테고리목록.forEach(function (항목정보) {
        if (typeof 항목정보 === "string") {
            const 링크 = document.createElement("a");
            링크.href = "#";
            링크.textContent = 항목정보;
            영역.appendChild(링크);
            return;
        }

        if (항목정보.separator) {
            const 구분자 = document.createElement("span");
            구분자.className = 항목정보.type === "divider"
                ? "카테고리구분자 카테고리세로선"
                : "카테고리구분자";
            구분자.textContent = 항목정보.separator;
            영역.appendChild(구분자);
            return;
        }

        const 링크 = document.createElement("a");
        링크.href = 항목정보.href || "#";
        링크.textContent = 항목정보.text || "";
        영역.appendChild(링크);
    });
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
    글자넣기(".출간정보내용", 배열문자열(상세.published));
    글자넣기(".파일정보내용", 배열문자열(상세.file, " | "));
    아이콘정보출력(".듣기기능내용", 상세.tts ? [상세.tts] : []);
    아이콘정보출력(".지원환경내용", 상세.support);
    글자넣기(".isbn내용", 상세.isbn);
}

function 상세아이콘만들기(아이콘이름) {
    const 아이콘경로 = {
        headphones: '<path d="M5 16v-4a7 7 0 0 1 14 0v4"/><path d="M5 15H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-7H5Zm14 0h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2v-7h1Z"/>',
        mobile: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 18h4"/>',
        web: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
        pc: '<rect x="2" y="3" width="20" height="14" rx="1"/><path d="M8 22h8M12 17v5"/>',
        paper: '<rect x="3" y="2" width="18" height="20" rx="1"/><path d="M16 2v20M18.5 12h.01"/>',
    };
    const 아이콘 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    아이콘.setAttribute("class", "상세정보아이콘");
    아이콘.setAttribute("viewBox", "0 0 24 24");
    아이콘.setAttribute("aria-hidden", "true");
    아이콘.innerHTML = 아이콘경로[아이콘이름] || "";
    return 아이콘;
}

function 아이콘정보출력(선택자, 정보목록 = []) {
    const 영역 = document.querySelector(선택자);
    if (!영역) return;

    영역.replaceChildren();
    const 목록 = Array.isArray(정보목록) ? 정보목록 : [정보목록];

    목록.forEach(function (정보) {
        if (!정보) return;

        const 항목정보 = typeof 정보 === "string"
            ? { icon: "", text: 정보 }
            : 정보;
        const 항목 = document.createElement("span");
        const 문구 = document.createElement("span");

        항목.className = "상세정보아이콘항목";
        if (항목정보.icon) 항목.appendChild(상세아이콘만들기(항목정보.icon));
        문구.textContent = 항목정보.text || "";
        항목.appendChild(문구);
        영역.appendChild(항목);
    });
}

function 함께구매출력(추천 = {}) {
    const 제목영역 = document.querySelector(".함께구매제목");
    const 목록 = document.querySelector(".함께구매목록");
    if (!제목영역 || !목록) return;

    // JSON에 입력한 제목과 주소로 SF 소설 순위 제목 링크 생성
    제목영역.replaceChildren();
    if (추천.title) {
        const 제목링크 = document.createElement("a");
        제목링크.href = 추천.href || "#";
        제목링크.textContent = 추천.title;
        제목영역.appendChild(제목링크);
    }

    목록.replaceChildren();
    // 오른쪽 영역에는 최대 10개의 도서만 출력
    (추천.books ?? []).slice(0, 10).forEach(function (책) {
        const 항목 = document.createElement("li");
        const 책링크 = document.createElement("a");
        const 책정보 = typeof 책 === "string" ? { title: 책, href: "#" } : 책;

        책링크.href = 책정보.href || "#";
        책링크.textContent = 책정보.title || "";
        항목.appendChild(책링크);
        목록.appendChild(항목);
    });
}

function 작품정보출력(작품 = {}) {
    문단출력("#작품소개", 작품.introduction);
    목차출력("#목차", 작품.contents);
    문단출력("#출판사서평", 작품.publisherReview);
}

function 작가정보출력(작가 = {}) {
    작가프로필출력(작가.profiles);
    문단출력("#작가소개", 작가.introduction);
}

function 작가프로필출력(프로필목록 = []) {
    const 영역 = document.querySelector(".작가프로필영역");
    if (!영역) return;

    영역.replaceChildren();
    if (!프로필목록.length) return;

    const 역할탭 = document.createElement("div");
    const 프로필내용 = document.createElement("div");

    역할탭.className = "프로필역할탭";
    역할탭.setAttribute("role", "tablist");
    역할탭.setAttribute("aria-label", "저자 및 번역가 선택");
    프로필내용.className = "프로필내용";
    프로필내용.id = "선택프로필내용";
    프로필내용.setAttribute("role", "tabpanel");

    프로필목록.forEach(function (프로필, 순서) {
        const 버튼 = document.createElement("button");
        const 선택됨 = 순서 === 0;

        버튼.type = "button";
        버튼.className = "프로필역할버튼";
        버튼.textContent = 프로필.buttonLabel || "";
        버튼.dataset.profileId = 프로필.id || "";
        버튼.setAttribute("role", "tab");
        버튼.setAttribute("aria-selected", String(선택됨));
        버튼.setAttribute("aria-controls", "선택프로필내용");
        버튼.classList.toggle("활성", 선택됨);

        버튼.addEventListener("click", function () {
            역할탭.querySelectorAll(".프로필역할버튼").forEach(function (역할버튼) {
                const 현재선택됨 = 역할버튼 === 버튼;
                역할버튼.classList.toggle("활성", 현재선택됨);
                역할버튼.setAttribute("aria-selected", String(현재선택됨));
            });

            프로필내용그리기(프로필내용, 프로필);
        });

        역할탭.appendChild(버튼);
    });

    영역.append(역할탭, 프로필내용);
    프로필내용그리기(프로필내용, 프로필목록[0]);
}

function 프로필내용그리기(영역, 프로필 = {}) {
    const 이름영역 = document.createElement("h3");
    const 이름 = document.createElement(프로필.nameHref ? "a" : "span");
    const 영문이름 = document.createElement("span");
    const 상세목록 = document.createElement("dl");

    이름영역.className = "프로필이름영역";
    이름.className = "프로필이름";
    이름.textContent = 프로필.name || "";
    if (프로필.nameHref) 이름.href = 프로필.nameHref;
    영문이름.className = "프로필영문이름";
    영문이름.textContent = 프로필.englishName || "";
    상세목록.className = "프로필상세목록";
    이름영역.append(이름, 영문이름);

    (프로필.details ?? []).forEach(function (상세정보) {
        const 행 = document.createElement("div");
        const 라벨 = document.createElement("dt");
        const 값 = document.createElement("dd");

        행.className = "프로필상세행";
        라벨.textContent = 상세정보.label || "";
        값.textContent = 상세정보.value || "";
        행.append(라벨, 값);
        상세목록.appendChild(행);
    });

    if (프로필.links?.length) {
        const 링크행 = document.createElement("div");
        const 링크라벨 = document.createElement("dt");
        const 링크목록 = document.createElement("dd");

        링크행.className = "프로필상세행";
        링크라벨.textContent = "링크";
        링크목록.className = "프로필링크목록";

        프로필.links.forEach(function (링크정보, 순서) {
            const 링크 = document.createElement("a");

            링크.href = 링크정보.href || "#";
            링크.textContent = 링크정보.text || "";
            if (순서 > 0) {
                const 구분자 = document.createElement("span");
                구분자.className = "프로필링크구분자";
                구분자.textContent = " | ";
                링크목록.appendChild(구분자);
            }
            링크목록.appendChild(링크);
        });

        링크행.append(링크라벨, 링크목록);
        상세목록.appendChild(링크행);
    }

    영역.replaceChildren(이름영역, 상세목록);
}

function 작품정보탭연결() {
    const 탭버튼목록 = document.querySelectorAll(".작품정보탭버튼");
    const 패널목록 = document.querySelectorAll(".작품정보패널");

    탭버튼목록.forEach(function (버튼) {
        버튼.addEventListener("click", function () {
            const 선택한패널아이디 = 버튼.dataset.panel;

            탭버튼목록.forEach(function (탭버튼) {
                const 선택됨 = 탭버튼 === 버튼;
                탭버튼.classList.toggle("활성", 선택됨);
                탭버튼.setAttribute("aria-selected", String(선택됨));
            });

            패널목록.forEach(function (패널) {
                const 선택됨 = 패널.id === 선택한패널아이디;
                패널.classList.toggle("활성", 선택됨);
                패널.hidden = !선택됨;
            });

            document.querySelector(".작품정보더보기버튼")
                ?.setAttribute("aria-controls", 선택한패널아이디);
        });
    });
}

function 작품정보더보기연결() {
    const 작품정보영역 = document.querySelector(".작품정보");
    const 더보기버튼 = document.querySelector(".작품정보더보기버튼");
    const 버튼문구 = 더보기버튼?.querySelector(".작품정보더보기문구");

    if (!작품정보영역 || !더보기버튼 || !버튼문구) return;

    더보기버튼.addEventListener("click", function () {
        const 펼쳐짐 = 작품정보영역.classList.toggle("펼침");

        더보기버튼.setAttribute("aria-expanded", String(펼쳐짐));
        버튼문구.textContent = 펼쳐짐 ? "접기" : "더보기";
    });
}

function 작가정보탭연결() {
    const 작가정보영역 = document.querySelector(".작가정보");
    const 탭버튼목록 = document.querySelectorAll(".작가정보탭버튼");
    const 패널목록 = document.querySelectorAll(".작가정보패널");
    const 더보기버튼 = document.querySelector(".작가소개더보기버튼");
    const 더보기문구 = 더보기버튼?.querySelector(".작가소개더보기문구");

    if (!작가정보영역) return;

    탭버튼목록.forEach(function (버튼) {
        버튼.addEventListener("click", function () {
            const 선택한패널아이디 = 버튼.dataset.panel;
            const 작가소개선택됨 = 선택한패널아이디 === "작가소개";

            탭버튼목록.forEach(function (탭버튼) {
                const 선택됨 = 탭버튼 === 버튼;
                탭버튼.classList.toggle("활성", 선택됨);
                탭버튼.setAttribute("aria-selected", String(선택됨));
            });

            패널목록.forEach(function (패널) {
                const 선택됨 = 패널.id === 선택한패널아이디;
                패널.classList.toggle("활성", 선택됨);
                패널.hidden = !선택됨;
            });

            작가정보영역.classList.toggle("소개선택", 작가소개선택됨);

            if (더보기버튼) 더보기버튼.hidden = !작가소개선택됨;

            if (!작가소개선택됨) {
                작가정보영역.classList.remove("펼침");
                더보기버튼?.setAttribute("aria-expanded", "false");
                if (더보기문구) 더보기문구.textContent = "더보기";
            }
        });
    });
}

function 작가소개더보기연결() {
    const 작가정보영역 = document.querySelector(".작가정보");
    const 더보기버튼 = document.querySelector(".작가소개더보기버튼");
    const 버튼문구 = 더보기버튼?.querySelector(".작가소개더보기문구");

    if (!작가정보영역 || !더보기버튼 || !버튼문구) return;

    더보기버튼.addEventListener("click", function () {
        const 펼쳐짐 = 작가정보영역.classList.toggle("펼침");

        더보기버튼.setAttribute("aria-expanded", String(펼쳐짐));
        버튼문구.textContent = 펼쳐짐 ? "접기" : "더보기";
    });
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
    글자넣기(".리뷰평점", 리뷰.rating);
    글자넣기(".리뷰평가수", 리뷰.ratingCount);
    글자넣기(".구매자리뷰수", 리뷰.buyerCount);
    글자넣기(".전체리뷰수", 리뷰.totalCount);

    const 요약별점 = document.querySelector(".리뷰요약별점");
    if (요약별점) 요약별점.replaceChildren(별점표시만들기(리뷰.scoreStars));

    const 목록 = document.querySelector(".댓글목록");
    const 더보기버튼 = document.querySelector(".댓글더보기버튼");
    if (!목록) return;

    목록.replaceChildren();
    (리뷰.comments ?? []).forEach(function (댓글, 순서) {
        const 카드 = document.createElement("article");
        const 별점 = 별점표시만들기(댓글.rating);
        const 내용 = document.createElement("p");
        const 사용자줄 = document.createElement("div");
        const 작성자 = document.createElement("strong");
        const 아랫줄 = document.createElement("div");
        const 메타정보 = document.createElement("div");
        const 날짜 = document.createElement("time");
        const 신고버튼 = document.createElement("button");
        const 차단버튼 = document.createElement("button");
        const 반응버튼영역 = document.createElement("div");
        const 댓글버튼 = document.createElement("button");
        const 추천버튼 = document.createElement("button");

        카드.className = "댓글카드";
        카드.hidden = 순서 >= 3;
        별점.classList.add("댓글별점");
        내용.className = "댓글내용";
        사용자줄.className = "댓글사용자줄";
        작성자.className = "댓글작성자";
        아랫줄.className = "댓글아랫줄";
        메타정보.className = "댓글메타정보";
        날짜.className = "댓글날짜";
        신고버튼.className = "댓글관리버튼";
        차단버튼.className = "댓글관리버튼";
        반응버튼영역.className = "댓글반응버튼영역";
        댓글버튼.className = "댓글반응버튼";
        추천버튼.className = "댓글반응버튼 추천버튼";

        내용.textContent = 댓글.content ?? "";
        작성자.textContent = 댓글.writer ?? "";
        날짜.textContent = 댓글.date ?? "";
        신고버튼.type = "button";
        신고버튼.textContent = "신고";
        차단버튼.type = "button";
        차단버튼.textContent = "차단";
        댓글버튼.type = "button";
        댓글버튼.textContent = `댓글 ${댓글.replyCount ?? 0}`;
        추천버튼.type = "button";
        추천버튼.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3Zm0 10h10.2a2 2 0 0 0 1.9-1.4l1.7-5.4A2.5 2.5 0 0 0 18.4 10H14l.7-3.1A2.4 2.4 0 0 0 12.4 4L7 10Z"/></svg><span></span>';
        추천버튼.querySelector("span").textContent = 댓글.likeCount ?? 0;

        if (댓글.buyer) {
            const 구매자표시 = document.createElement("span");
            구매자표시.className = "댓글구매자표시";
            구매자표시.textContent = "구매자";
            사용자줄.appendChild(구매자표시);
        }

        사용자줄.appendChild(작성자);
        메타정보.append(날짜, 신고버튼, 차단버튼);
        반응버튼영역.append(댓글버튼, 추천버튼);
        아랫줄.append(메타정보, 반응버튼영역);
        카드.append(별점, 내용, 사용자줄, 아랫줄);
        목록.appendChild(카드);
    });

    document.querySelector(".리뷰영역")?.classList.remove("펼침");
    if (더보기버튼) {
        더보기버튼.hidden = !(리뷰.comments?.length > 3);
        더보기버튼.setAttribute("aria-expanded", "false");
        const 버튼문구 = 더보기버튼.querySelector(".댓글더보기문구");
        if (버튼문구) 버튼문구.textContent = "더보기";
    }
}

function 별점표시만들기(점수 = 0) {
    const 별점 = document.createElement("span");
    별점.className = "별점표시";

    for (let 순서 = 1; 순서 <= 5; 순서 += 1) {
        const 별 = document.createElement("span");
        별.className = 순서 <= 점수 ? "채운별" : "빈별";
        별.textContent = "★";
        별점.appendChild(별);
    }

    return 별점;
}

function 리뷰입력연결() {
    const 별버튼목록 = document.querySelectorAll(".리뷰별점입력 button");
    const 입력창 = document.querySelector(".리뷰입력창");
    const 등록버튼 = document.querySelector(".리뷰등록버튼");
    let 선택별점 = 0;

    function 입력상태갱신() {
        별버튼목록.forEach(function (별버튼) {
            별버튼.classList.toggle("선택", Number(별버튼.dataset.rating) <= 선택별점);
        });

        if (등록버튼) {
            등록버튼.disabled = 선택별점 === 0 || (입력창?.value.trim().length ?? 0) < 10;
        }
    }

    별버튼목록.forEach(function (별버튼) {
        별버튼.addEventListener("click", function () {
            선택별점 = Number(별버튼.dataset.rating);
            입력상태갱신();
        });
    });

    입력창?.addEventListener("input", 입력상태갱신);

    document.querySelectorAll(".댓글정렬 button").forEach(function (버튼) {
        버튼.addEventListener("click", function () {
            document.querySelectorAll(".댓글정렬 button").forEach(function (정렬버튼) {
                정렬버튼.classList.toggle("활성", 정렬버튼 === 버튼);
            });
        });
    });

    document.querySelectorAll(".리뷰종류탭 button").forEach(function (버튼) {
        버튼.addEventListener("click", function () {
            document.querySelectorAll(".리뷰종류탭 button").forEach(function (종류버튼) {
                const 선택됨 = 종류버튼 === 버튼;
                종류버튼.classList.toggle("활성", 선택됨);
                종류버튼.setAttribute("aria-selected", String(선택됨));
            });
        });
    });
}

function 리뷰더보기연결() {
    const 리뷰영역 = document.querySelector(".리뷰영역");
    const 더보기버튼 = document.querySelector(".댓글더보기버튼");
    const 버튼문구 = 더보기버튼?.querySelector(".댓글더보기문구");

    if (!리뷰영역 || !더보기버튼 || !버튼문구) return;

    더보기버튼.addEventListener("click", function () {
        const 펼쳐짐 = 리뷰영역.classList.toggle("펼침");

        document.querySelectorAll(".댓글카드").forEach(function (댓글카드, 순서) {
            댓글카드.hidden = !펼쳐짐 && 순서 >= 3;
        });

        더보기버튼.setAttribute("aria-expanded", String(펼쳐짐));
        버튼문구.textContent = 펼쳐짐 ? "접기" : "더보기";
    });
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
    const 목록 = document.querySelector(".연관작품목록");
    const 이전버튼 = document.querySelector(".연관작품이전버튼");
    const 다음버튼 = document.querySelector(".연관작품다음버튼");
    const 한페이지권수 = 5;
    const 마지막시작순서 = Math.max(0, 책목록.length - 한페이지권수);
    const 페이지시작순서목록 = [];
    let 현재페이지 = 0;

    if (!목록 || !이전버튼 || !다음버튼) return;

    for (let 시작순서 = 0; 시작순서 < 마지막시작순서; 시작순서 += 한페이지권수) {
        페이지시작순서목록.push(시작순서);
    }
    if (!페이지시작순서목록.includes(마지막시작순서)) {
        페이지시작순서목록.push(마지막시작순서);
    }

    목록.replaceChildren();
    책목록.forEach(function (책) {
        목록.appendChild(도서카드만들기(책));
    });

    function 현재페이지로이동() {
        const 시작순서 = 페이지시작순서목록[현재페이지] ?? 0;
        const 목록스타일 = window.getComputedStyle(목록);
        const 간격 = Number.parseFloat(목록스타일.columnGap) || 14;
        const 카드너비 = (목록.clientWidth - 간격 * (한페이지권수 - 1)) / 한페이지권수;
        const 이동거리 = 시작순서 * (카드너비 + 간격);

        목록.style.transform = `translateX(-${이동거리}px)`;
        이전버튼.hidden = 현재페이지 === 0;
        다음버튼.hidden = 현재페이지 === 페이지시작순서목록.length - 1;
    }

    이전버튼.onclick = function () {
        if (현재페이지 === 0) return;
        현재페이지 -= 1;
        현재페이지로이동();
    };

    다음버튼.onclick = function () {
        if (현재페이지 >= 페이지시작순서목록.length - 1) return;
        현재페이지 += 1;
        현재페이지로이동();
    };

    window.addEventListener("resize", 현재페이지로이동);
    현재페이지로이동();
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
