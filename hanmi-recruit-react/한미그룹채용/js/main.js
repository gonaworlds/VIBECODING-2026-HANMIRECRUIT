(function () {
  var countdown = document.querySelector(".con9__countdown");
  var expiredMessage = document.querySelector("[data-countdown-expired]");
  if (!countdown || !expiredMessage) return;

  var deadline = new Date("2026-10-18T23:59:59+09:00").getTime();
  var units = {
    days: countdown.querySelector('[data-countdown="days"]'),
    hours: countdown.querySelector('[data-countdown="hours"]'),
    minutes: countdown.querySelector('[data-countdown="minutes"]'),
    seconds: countdown.querySelector('[data-countdown="seconds"]'),
  };
  var timer;

  function updateCountdown() {
    var remaining = deadline - Date.now();
    if (remaining <= 0) {
      Object.keys(units).forEach(function (unit) {
        units[unit].textContent = "0";
      });
      expiredMessage.hidden = false;
      if (timer) window.clearInterval(timer);
      return;
    }

    var seconds = Math.floor(remaining / 1000);
    units.days.textContent = String(Math.floor(seconds / 86400));
    units.hours.textContent = String(Math.floor((seconds % 86400) / 3600));
    units.minutes.textContent = String(Math.floor((seconds % 3600) / 60));
    units.seconds.textContent = String(seconds % 60);
  }

  updateCountdown();
  if (deadline > Date.now()) {
    timer = window.setInterval(updateCountdown, 1000);
  }
})();

(function () {
  var root = document.documentElement;
  var motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  var toggleLabel = document.createElement("label");
  var smoothScrollToggle = document.createElement("input");
  var animationFrame = 0;
  var targetScrollY = window.scrollY;
  var lastFrameTime = 0;
  var smoothScrollEnabled = !motionPreference.matches;

  toggleLabel.className = "scroll-smooth-toggle";
  smoothScrollToggle.type = "checkbox";
  smoothScrollToggle.id = "disable-smooth-scroll";
  smoothScrollToggle.checked = !smoothScrollEnabled;
  toggleLabel.htmlFor = smoothScrollToggle.id;
  toggleLabel.appendChild(smoothScrollToggle);
  toggleLabel.appendChild(
    document.createTextNode(" "),
  );
  document.body.appendChild(toggleLabel);

  function getMaxScrollY() {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
  }

  function animateScroll(timestamp) {
    var elapsed = lastFrameTime ? timestamp - lastFrameTime : 16;
    lastFrameTime = timestamp;
    targetScrollY = Math.min(targetScrollY, getMaxScrollY());
    var currentScrollY = window.scrollY;
    var distance = targetScrollY - currentScrollY;

    if (Math.abs(distance) < 0.75) {
      window.scrollTo(0, targetScrollY);
      animationFrame = 0;
      lastFrameTime = 0;
      return;
    }

    var progress = 1 - Math.exp(-elapsed / 160); // 숫자가 커질수록 부드럽게, 작아질수록 빠르게
    window.scrollTo(0, currentScrollY + distance * progress);
    animationFrame = window.requestAnimationFrame(animateScroll);
  }

  function scrollToPosition(position) {
    targetScrollY = Math.max(0, Math.min(position, getMaxScrollY()));
    if (!smoothScrollEnabled) {
      window.scrollTo(0, targetScrollY);
      return;
    }
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(animateScroll);
    }
  }
  window.scrollPageTo = scrollToPosition;

  window.addEventListener(
    "scroll",
    function () {
      if (!animationFrame) targetScrollY = window.scrollY;
    },
    { passive: true },
  );

  function canScrollInsideTarget(event) {
    var element = event.target instanceof Element ? event.target : null;
    if (
      !element ||
      element.closest(
        "input, textarea, select, [contenteditable='true']",
      )
    ) {
      return true;
    }

    for (
      var ancestor = element;
      ancestor && ancestor !== document.body;
      ancestor = ancestor.parentElement
    ) {
      var style = window.getComputedStyle(ancestor);
      var isScrollable =
        /(auto|scroll|overlay)/.test(style.overflowY) &&
        ancestor.scrollHeight > ancestor.clientHeight;
      if (!isScrollable) continue;

      if (event.deltaY < 0 && ancestor.scrollTop > 0) return true;
      if (
        event.deltaY > 0 &&
        ancestor.scrollTop + ancestor.clientHeight <
          ancestor.scrollHeight - 1
      ) {
        return true;
      }
    }
    return false;
  }

  window.addEventListener(
    "wheel",
    function (event) {
      if (
        !smoothScrollEnabled ||
        root.classList.contains("is-menu-open") ||
        event.defaultPrevented ||
        event.ctrlKey ||
        !event.deltaY ||
        canScrollInsideTarget(event)
      ) {
        return;
      }

      if (!animationFrame) targetScrollY = window.scrollY;
      var delta = event.deltaY;
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16;
      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        delta *= window.innerHeight;
      }

      var nextTarget = Math.max(
        0,
        Math.min(targetScrollY + delta, getMaxScrollY()),
      );
      if (nextTarget === targetScrollY) return;

      event.preventDefault();
      targetScrollY = nextTarget;
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animateScroll);
      }
    },
    { passive: false },
  );

  smoothScrollToggle.addEventListener("change", function () {
    smoothScrollEnabled = !smoothScrollToggle.checked;
    targetScrollY = window.scrollY;
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastFrameTime = 0;
    }
  });

  document.addEventListener("click", function (event) {
    if (!smoothScrollEnabled || event.defaultPrevented) return;
    var clickedElement =
      event.target instanceof Element ? event.target : null;
    var link = clickedElement
      ? clickedElement.closest("a[href^='#']")
      : null;
    if (
      !link ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")
    ) {
      return;
    }

    var hash = link.getAttribute("href").slice(1);
    var target = hash ? document.getElementById(hash) : null;
    if (hash && !target) return;

    event.preventDefault();
    if (hash) {
      if (window.location.hash !== "#" + hash) {
        window.history.pushState(null, "", "#" + hash);
      }
      if (target.hasAttribute("tabindex")) {
        target.focus({ preventScroll: true });
      }
      scrollToPosition(
        target.getBoundingClientRect().top + window.scrollY,
      );
    } else {
      window.history.pushState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
      scrollToPosition(0);
    }
  });

  // 아래로 스크롤 버튼: 다음 섹션이 있으면 해당 위치로, 없으면 메인 비주얼 높이만큼 이동
  var btn = document.querySelector("[data-scroll-next]");
  var mv = document.getElementById("main_visual");
  if (btn && mv) {
    btn.addEventListener("click", function () {
      var next = mv.nextElementSibling;
      var top = next
        ? next.getBoundingClientRect().top + window.scrollY
        : mv.offsetHeight;
      scrollToPosition(top);
    });
  }

  // 모바일 햄버거 메뉴: 열기/닫기, 바깥 영역 클릭, Escape, 링크 클릭 시 닫기, 배경 스크롤 방지(CSS .is-menu-open)
  var header = document.querySelector(".header");
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.getElementById("site-nav");
  var mobileMq = window.matchMedia("(max-width: 390px)");

  function isMenuOpen() {
    return header.classList.contains("is-menu-open");
  }
  function setMenu(open) {
    header.classList.toggle("is-menu-open", open);
    header.classList.toggle("is-hidden", false);
    header.classList.toggle("is-visible", open || window.scrollY > 0);
    root.classList.toggle("is-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "전체 메뉴 닫기" : "전체 메뉴 열기",
    );
  }

  if (header && toggle && nav) {
    var lastScrollY = window.scrollY;
    var scrollUpdatePending = false;

    if (lastScrollY > 0) header.classList.add("is-visible");

    window.addEventListener(
      "scroll",
      function () {
        if (scrollUpdatePending) return;
        scrollUpdatePending = true;
        window.requestAnimationFrame(function () {
          var currentScrollY = Math.max(0, window.scrollY);
          if (currentScrollY === 0) {
            header.classList.remove("is-hidden", "is-visible");
          } else if (isMenuOpen()) {
            header.classList.remove("is-hidden");
            header.classList.add("is-visible");
          } else if (currentScrollY > lastScrollY + 4) {
            header.classList.add("is-hidden");
            header.classList.remove("is-visible");
          } else if (currentScrollY < lastScrollY - 4) {
            header.classList.remove("is-hidden");
            header.classList.add("is-visible");
          }
          lastScrollY = currentScrollY;
          scrollUpdatePending = false;
        });
      },
      { passive: true },
    );

    toggle.addEventListener("click", function () {
      setMenu(!isMenuOpen());
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("click", function (e) {
      if (
        isMenuOpen() &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)
      )
        setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMenuOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });

    // 화면이 모바일 범위를 벗어나면(회전/리사이즈) 메뉴 상태와 스크롤 잠금 해제
    var onMqChange = function () {
      if (!mobileMq.matches && isMenuOpen()) setMenu(false);
    };
    if (mobileMq.addEventListener)
      mobileMq.addEventListener("change", onMqChange);
    else if (mobileMq.addListener) mobileMq.addListener(onMqChange);
  }

  // 대상 요소가 없는 앵커는 기본 동작(최상단 점프) 방지
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1 && !document.querySelector(id))
        e.preventDefault();
    });
  });
})();

(function () {
  var targetSelector = [
    "#mirae .mirae__title",
    "#mirae .mirae__figure",
    "#history .history__head",
    "#history .history__timeline > .era",
    "#jobs .cont__intro",
    "#jobs .cont__item",
    "#jobs .cont__cta-wrap",
    "#innovation .cont__growth",
    "#innovation .cont__item",
    "#welfare .welfare__hero",
    "#welfare .welfare__group",
    "#welfare .welfare__card",
    "#tasks .tasks__intro",
    "#tasks .tasks__tabs",
    "#tasks .tasks__panels > *",
    "#requirement .requirement__title",
    "#requirement .requirement__tabs",
    "#requirement .requirement__eligibility",
    "#requirement .requirement__notes",
    "#requirement .requirement__notice",
    "#requirement .requirement__process-group",
    "#requirement .requirement__process-notes",
    "#exposition .exposition__hero",
    "#exposition .exposition__tabs",
    "#exposition .exposition__regions",
    "#exposition .exposition__week",
    ".con8 .con8__link",
    ".con9 .con9__title",
    ".con9 .con9__countdown",
    ".con9 .con9__earth-link",
  ].join(", ");
  var targets = new Set(document.querySelectorAll(targetSelector));
  if (!targets.size) return;

  if (!("IntersectionObserver" in window)) {
    document.documentElement.classList.remove("has-scroll-reveal");
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle(
          "is-revealed",
          entry.isIntersecting,
        );
      });
    },
    {
      rootMargin: "-25% 0px -25% 0px",
      threshold: 0,
    },
  );

  function observeTarget(target) {
    if (targets.has(target)) return;
    targets.add(target);
    target.classList.add("scroll-reveal");
    observer.observe(target);
  }

  targets.forEach(function (target) {
    target.classList.add("scroll-reveal");
    observer.observe(target);
  });

  var additionsObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (node.matches(targetSelector)) observeTarget(node);
        node.querySelectorAll(targetSelector).forEach(observeTarget);
      });
    });
  });
  additionsObserver.observe(document.querySelector("main"), {
    childList: true,
    subtree: true,
  });
})();

// 연혁 섹션 펼치기/접기: .is-expanded 토글 + 버튼 텍스트('펼치기' ↔ '접기') 변경
(function () {
  var section = document.getElementById("history");
  var fold = document.getElementById("history-fold");
  var btn = document.querySelector("[data-history-toggle]");
  if (!section || !fold || !btn) return;
  var label = btn.querySelector(".history__toggle-text");

  btn.addEventListener("click", function () {
    var expanded = fold.classList.toggle("is-expanded");
    btn.setAttribute("aria-expanded", String(expanded));
    label.textContent = expanded ? "접기" : "펼치기";

    // 접을 때는 섹션 상단으로 되돌려 화면 위치를 잃지 않게 함
    if (!expanded) {
      window.scrollPageTo(
        section.getBoundingClientRect().top + window.scrollY,
      );
    }
  });
})();

// 복지 카드 목록은 JSON 데이터로 구성하고, file://에서는 내장 스냅샷을 사용
(function () {
  var welfare = document.getElementById("welfare");
  if (!welfare) return;

  var scroll = welfare.querySelector(".welfare__scroll");
  var embeddedData = document.getElementById("welfare-data");
  if (!scroll || !embeddedData) return;

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function validateData(data) {
    if (!Array.isArray(data) || data.length === 0 || data.length > 3) {
      throw new Error("복지 그룹 데이터는 1~3개 그룹이어야 합니다.");
    }

    var benefitCount = 0;
    data.forEach(function (group) {
      if (
        !group ||
        typeof group.category !== "string" ||
        !group.category.trim() ||
        typeof group.description !== "string" ||
        !group.description.trim() ||
        !Array.isArray(group.benefits)
      ) {
        throw new Error("복지 그룹 데이터 형식이 올바르지 않습니다.");
      }

      group.benefits.forEach(function (benefit) {
        if (
          !benefit ||
          typeof benefit.title !== "string" ||
          !benefit.title.trim() ||
          typeof benefit.description !== "string" ||
          !benefit.description.trim()
        ) {
          throw new Error("복지 항목 데이터 형식이 올바르지 않습니다.");
        }
        benefitCount += 1;
      });
    });

    if (benefitCount > 23) {
      throw new Error("복지 항목 아이콘은 최대 23개까지 사용할 수 있습니다.");
    }
    return data;
  }

  function renderGroups(data) {
    var fragment = document.createDocumentFragment();
    var iconIndex = 0;

    data.forEach(function (group, groupIndex) {
      var titleId = "welfare-group-title-" + (groupIndex + 1);
      var groupElement = createElement("section", "welfare__group");
      var header = createElement("header", "welfare__group-head");
      var heading = createElement("h3", "welfare__group-title");
      var groupIcon = createElement("img");
      groupIcon.src = "./images/wf_tit" + (groupIndex + 1) + ".png";
      groupIcon.alt = "";
      groupIcon.setAttribute("aria-hidden", "true");
      heading.id = titleId;
      heading.appendChild(groupIcon);
      heading.appendChild(document.createTextNode(group.category));

      var copy = createElement(
        "p",
        "welfare__group-copy",
        group.description,
      );
      header.appendChild(heading);
      header.appendChild(copy);
      groupElement.setAttribute("aria-labelledby", titleId);
      groupElement.appendChild(header);

      var list = createElement("ul", "welfare__list");
      list.setAttribute("aria-label", group.category + " 복지");
      group.benefits.forEach(function (benefit) {
        iconIndex += 1;
        var card = createElement("li", "welfare__card");
        var cardCopy = createElement("div", "welfare__card-copy");
        var title = createElement(
          "h4",
          "welfare__card-title",
          benefit.title,
        );
        var description = createElement(
          "p",
          "welfare__card-description",
          benefit.description,
        );
        var icon = createElement("img", "welfare__card-icon");
        icon.src = "./images/wf_ico" + iconIndex + ".png";
        icon.alt = "";
        icon.setAttribute("aria-hidden", "true");
        cardCopy.appendChild(title);
        cardCopy.appendChild(description);
        card.appendChild(cardCopy);
        card.appendChild(icon);
        list.appendChild(card);
      });
      groupElement.appendChild(list);
      fragment.appendChild(groupElement);
    });

    scroll.replaceChildren(fragment);
  }

  function showDataError(error) {
    console.error("복지 데이터를 불러오지 못했습니다.", error);
    var message = createElement(
      "p",
      "welfare__error",
      "복지 정보를 불러오지 못했습니다. data/benefit_data.json 파일을 확인해 주세요.",
    );
    scroll.replaceChildren(message);
  }

  Promise.resolve()
    .then(function () {
      if (window.location.protocol === "file:") {
        return JSON.parse(embeddedData.textContent);
      }
      return fetch("./data/benefit_data.json").then(function (response) {
        if (!response.ok) {
          throw new Error(
            "복지 JSON 요청 실패: HTTP " + response.status,
          );
        }
        return response.json();
      });
    })
    .then(validateData)
    .then(renderGroups)
    .catch(showDataError);
})();

// 박람회 및 캠퍼스 방문 일정
(function () {
  var exposition = document.getElementById("exposition");
  if (!exposition) return;

  var fairCalendar = exposition.querySelector("#exposition-fair-calendar");
  var campusCalendar = exposition.querySelector(
    "#exposition-campus-calendar",
  );
  var mainTabs = exposition.querySelectorAll(
    ".exposition__tabs [role=tab]",
  );
  var mainPanels = exposition.querySelectorAll(
    ".exposition__tabs ~ .exposition__panel",
  );
  var regionTabs = exposition.querySelectorAll(
    ".exposition__region[role=tab]",
  );
  var regionPanels = exposition.querySelectorAll(
    ".exposition__region-panel",
  );
  if (!fairCalendar || !campusCalendar) return;

  var fairWeeks = [
    {
      dates: [
        "8월 31일 (월)",
        "9월 1일 (화)",
        "9월 2일 (수)",
        "9월 3일 (목)",
        "9월 4일 (금)",
      ],
      events: [
        ["KAIST"],
        ["서울대학교", "서강대학교", "연세대학교"],
        ["UNIST", "한양대학교"],
        ["GIST"],
        ["고려대학교", "성균관대학교(자연)"],
      ],
    },
    {
      dates: [
        "9월 7일 (월)",
        "9월 8일 (화)",
        "9월 9일 (수)",
        "",
        "10월 7일 (수)",
      ],
      events: [
        ["KIST", "동국대학교"],
        ["이화여자대학교", "중견기업박람회(대전)"],
        ["POSTECH"],
        [],
        ["서울고용센터"],
      ],
    },
  ];
  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function parseScheduleDate(value) {
    var match = value.match(
      /^(\d{1,2})월\s*(\d{1,2})일\s*\(([월화수목금토일])\)$/,
    );
    if (!match) {
      throw new Error("캠퍼스 일정 날짜 형식이 올바르지 않습니다: " + value);
    }
    var month = Number(match[1]);
    var day = Number(match[2]);
    var date = new Date(2026, month - 1, day);
    var weekdayIndex = ["월", "화", "수", "목", "금"].indexOf(match[3]);
    if (date.getMonth() !== month - 1 || date.getDate() !== day) {
      throw new Error("캠퍼스 일정 날짜가 올바르지 않습니다: " + value);
    }
    if (weekdayIndex === -1) {
      throw new Error("캠퍼스 일정은 평일이어야 합니다: " + value);
    }
    return { date: date, weekdayIndex: weekdayIndex };
  }

  function validateSchedule(data) {
    if (!Array.isArray(data)) {
      throw new Error("캠퍼스 일정 JSON은 배열이어야 합니다.");
    }
    data.forEach(function (item, index) {
      if (
        !item ||
        typeof item.region !== "string" ||
        typeof item.date !== "string" ||
        typeof item.school !== "string" ||
        typeof item.location !== "string" ||
        typeof item.time !== "string"
      ) {
        throw new Error(
          "캠퍼스 일정 JSON의 " + (index + 1) + "번째 항목 형식이 올바르지 않습니다.",
        );
      }
      item.parsedDate = parseScheduleDate(item.date);
    });
    return data;
  }

  function createCampusWeeks(schedule, region) {
    var regionSchedule = schedule
      .filter(function (item) {
        return item.region === region;
      })
      .sort(function (left, right) {
        return left.parsedDate.date - right.parsedDate.date;
      });
    var weekMap = new Map();

    regionSchedule.forEach(function (item) {
      var weekStart = new Date(item.parsedDate.date);
      weekStart.setDate(weekStart.getDate() - item.parsedDate.weekdayIndex);
      var weekKey = weekStart.getTime();
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          start: weekStart,
          eventsByDay: [[], [], [], [], []],
          lastEventDay: 0,
        });
      }
      var week = weekMap.get(weekKey);
      var dayIndex = item.parsedDate.weekdayIndex;
      week.eventsByDay[dayIndex].push({
        name: item.school,
        location: item.location,
        time: item.time,
      });
      week.lastEventDay = Math.max(week.lastEventDay, dayIndex);
    });

    var orderedWeeks = Array.from(weekMap.values()).sort(function (
      left,
      right,
    ) {
      return left.start - right.start;
    });
    return orderedWeeks.map(function (week, weekIndex) {
      var isLastWeek = weekIndex === orderedWeeks.length - 1;
      var dayCount = isLastWeek ? week.lastEventDay + 1 : 5;
      var dates = [];
      var events = [];
      for (var dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
        var date = new Date(week.start);
        date.setDate(date.getDate() + dayIndex);
        dates.push(
          date.getMonth() +
            1 +
            "월 " +
            date.getDate() +
            "일 (" +
            ["월", "화", "수", "목", "금"][dayIndex] +
            ")",
        );
        events.push(week.eventsByDay[dayIndex]);
      }
      return { dates: dates, events: events };
    });
  }

  function loadCampusSchedule() {
    var fallback = document.getElementById("campus-schedule-data");
    if (window.location.protocol === "file:") {
      if (!fallback) {
        return Promise.reject(
          new Error("캠퍼스 일정 JSON 스냅샷을 찾을 수 없습니다."),
        );
      }
      return Promise.resolve().then(function () {
        return JSON.parse(fallback.textContent);
      });
    }
    return fetch("./data/campus_recruiting_schedule.json").then(
      function (response) {
        if (!response.ok) {
          throw new Error(
            "캠퍼스 일정 요청 실패: HTTP " + response.status,
          );
        }
        return response.json();
      },
    );
  }

  var campusEventIndex = 0;

  function renderCalendar(container, weeks, campusCalendar) {
    var fragment = document.createDocumentFragment();
    weeks.forEach(function (week) {
      var weekElement = createElement("div", "exposition__week");
      var dates = createElement("div", "exposition__week-dates");
      var events = createElement("div", "exposition__week-events");

      week.dates.forEach(function (date, index) {
        var dateElement = createElement(
          "div",
          "exposition__date",
          date,
        );
        var mobileDateRow = Math.floor(index / 2) * 2 + 1;
        var mobileColumn = (index % 2) + 1;
        dateElement.classList.add(
          "exposition__date--row-" + mobileDateRow,
          "exposition__date--column-" + mobileColumn,
        );
        dates.appendChild(dateElement);
        var day = createElement("div", "exposition__day");
        day.classList.add(
          "exposition__day--row-" + mobileDateRow,
          "exposition__day--column-" + mobileColumn,
        );
        (week.events[index] || []).forEach(function (event) {
          if (!campusCalendar) {
            day.appendChild(
              createElement(
                "span",
                "exposition__event exposition__event--static",
                event,
              ),
            );
            return;
          }

          var eventName =
            typeof event === "string" ? event : event.name;
          campusEventIndex += 1;
          var detailId = "exposition-event-detail-" + campusEventIndex;
          var eventButton = createElement(
            "button",
            "exposition__event",
            eventName,
          );
          eventButton.type = "button";
          eventButton.setAttribute("aria-expanded", "false");
          eventButton.setAttribute("aria-controls", detailId);

          var detail = createElement(
            "div",
            "exposition__event-detail",
          );
          detail.id = detailId;
          detail.hidden = true;
          detail.setAttribute(
            "aria-label",
            eventName + " 방문 상세 일정",
          );
          detail.setAttribute("role", "group");
          detail.tabIndex = -1;
          [
            {
              label: "장소",
              value: event.location || "추후 안내",
              className: "place",
            },
            {
              label: "시간",
              value: event.time || "추후 안내",
              className: "time",
            },
          ].forEach(function (item) {
            var row = createElement(
              "div",
              "exposition__event-detail-row",
            );
            var label = createElement(
              "span",
              "exposition__event-detail-label exposition__event-detail-label--" +
                item.className,
              item.label,
            );
            var value = createElement(
              "span",
              "exposition__event-detail-value",
              item.value,
            );
            row.appendChild(label);
            row.appendChild(value);
            detail.appendChild(row);
          });

          function closeDetail(returnFocus) {
            detail.hidden = true;
            eventButton.setAttribute("aria-expanded", "false");
            if (returnFocus) eventButton.focus();
          }

          eventButton.addEventListener("click", function () {
            if (eventButton.getAttribute("aria-expanded") === "true") {
              closeDetail(true);
              return;
            }
            container
              .querySelectorAll(".exposition__event-detail:not([hidden])")
              .forEach(function (openDetail) {
                var openButton = container.querySelector(
                  '[aria-controls="' + openDetail.id + '"]',
                );
                openDetail.hidden = true;
                if (openButton) {
                  openButton.setAttribute("aria-expanded", "false");
                }
              });
            detail.hidden = false;
            eventButton.setAttribute("aria-expanded", "true");
            detail.focus();
          });
          detail.addEventListener("click", function () {
            closeDetail(true);
          });
          day.addEventListener("focusout", function (event) {
            if (!day.contains(event.relatedTarget)) {
              closeDetail(false);
            }
          });

          day.appendChild(eventButton);
          day.appendChild(detail);
        });
        events.appendChild(day);
      });

      weekElement.appendChild(dates);
      weekElement.appendChild(events);
      fragment.appendChild(weekElement);
    });
    container.replaceChildren(fragment);
  }

  function selectTab(tabs, panels, index, moveFocus) {
    tabs.forEach(function (tab, tabIndex) {
      var selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[tabIndex].hidden = !selected;
      if (selected && moveFocus) tab.focus();
    });
  }

  function addTabBehavior(tabs, panels, onSelect) {
    tabs.forEach(function (tab, index) {
      function select(moveFocus) {
        selectTab(tabs, panels, index, moveFocus);
        if (onSelect) onSelect(index);
      }

      tab.addEventListener("click", function () {
        select(false);
      });
      tab.addEventListener("keydown", function (event) {
        if (
          event.key !== "ArrowRight" &&
          event.key !== "ArrowLeft" &&
          event.key !== "Home" &&
          event.key !== "End"
        ) {
          return;
        }
        event.preventDefault();
        var next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : (index +
                  (event.key === "ArrowRight" ? 1 : -1) +
                  tabs.length) %
                tabs.length;
        selectTab(tabs, panels, next, true);
        if (onSelect) onSelect(next);
      });
    });
  }

  renderCalendar(fairCalendar, fairWeeks, false);
  loadCampusSchedule()
    .then(validateSchedule)
    .then(function (schedule) {
      regionPanels.forEach(function (panel, index) {
        var calendar = panel.querySelector(".exposition__calendar");
        if (!calendar) {
          calendar = createElement("div", "exposition__calendar");
          panel.appendChild(calendar);
        }
        renderCalendar(
          calendar,
          createCampusWeeks(schedule, regionTabs[index].textContent.trim()),
          true,
        );
      });
    })
    .catch(function (error) {
      console.error("캠퍼스 일정을 불러오지 못했습니다.", error);
      regionPanels.forEach(function (panel) {
        var message = createElement(
          "p",
          "exposition__schedule-error",
          "캠퍼스 일정을 불러오지 못했습니다. data/campus_recruiting_schedule.json 파일을 확인해 주세요.",
        );
        message.setAttribute("role", "alert");
        panel.replaceChildren(message);
      });
    });
  addTabBehavior(mainTabs, mainPanels);
  addTabBehavior(regionTabs, regionPanels);
})();

// 지원자격과 전형절차 탭 전환
(function () {
  var tabs = document.querySelectorAll(".requirement__tab");
  var panels = document.querySelectorAll(".requirement__panel");
  if (!tabs.length || tabs.length !== panels.length) return;

  function selectTab(index, moveFocus) {
    tabs.forEach(function (tab, tabIndex) {
      var selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[tabIndex].hidden = !selected;
      if (selected && moveFocus) tab.focus();
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectTab(index, false);
    });
    tab.addEventListener("keydown", function (event) {
      if (
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft" &&
        event.key !== "Home" &&
        event.key !== "End"
      ) {
        return;
      }
      event.preventDefault();
      var next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (index +
                (event.key === "ArrowRight" ? 1 : -1) +
                tabs.length) %
              tabs.length;
      selectTab(next, true);
    });
  });
})();

// 직무소개 탭, 그룹 아코디언, 직무 상세 모달
(function () {
  var tasks = document.getElementById("tasks");
  if (!tasks) return;

  var categoryNames = {
    rnd: "R&D",
    prod: "생산/품질",
    sales: "영업",
    mps: "경영관리",
    cl: "임상",
    global: "글로벌",
    healthcare: "헬스케어",
  };
  var departments;
  var tabList = tasks.querySelector(".tasks__tabs");
  var panels = tasks.querySelector(".tasks__panels");
  var modal = tasks.querySelector(".tasks__modal");
  var modalBanner = tasks.querySelector(".tasks__modal-banner");
  var modalTitle = tasks.querySelector(".tasks__modal-title");
  var modalCategory = tasks.querySelector(".tasks__modal-category");
  var modalLocation = tasks.querySelector(".tasks__modal-location");
  var modalCareer = tasks.querySelector(".tasks__modal-career");
  var modalSections = tasks.querySelector(".tasks__modal-sections");
  var closeButton = tasks.querySelector(".tasks__modal-close");

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function addModalSection(title, items) {
    var section = createElement("section", "tasks__modal-section");
    var heading = createElement("h4", "", title);
    var list = document.createElement("ul");
    items.forEach(function (item) {
      list.appendChild(createElement("li", "", item));
    });
    section.appendChild(heading);
    section.appendChild(list);
    modalSections.appendChild(section);
  }

  function openJobModal(job) {
    modalTitle.textContent = job.title;
    modalCategory.textContent = job.category;
    modalLocation.textContent = job.department;
    modalCareer.textContent = job.target;
    modalBanner.src = job.imgSrc;
    modalSections.replaceChildren();
    Object.keys(job.details).forEach(function (sectionTitle) {
      addModalSection(sectionTitle, job.details[sectionTitle]);
    });
    modal.showModal();
  }

  function createDepartments(menuData, popupData) {
    if (!menuData || !Array.isArray(menuData.data)) {
      throw new Error("직무 메뉴 데이터 형식이 올바르지 않습니다.");
    }
    if (
      !popupData ||
      !Array.isArray(popupData.jobs) ||
      popupData.totalCount !== popupData.jobs.length
    ) {
      throw new Error("직무 상세 데이터 형식이 올바르지 않습니다.");
    }

    var jobsByTitle = new Map();
    popupData.jobs.forEach(function (job) {
      var jobKey = JSON.stringify([job.category, job.title]);
      if (jobsByTitle.has(jobKey)) {
        throw new Error(
          "중복된 직무 상세 데이터가 있습니다: " + job.title,
        );
      }
      jobsByTitle.set(jobKey, job);
    });

    var seenCategories = new Set();
    var seenJobCodes = new Set();
    var result = menuData.data.map(function (category) {
      var name = categoryNames[category.category];
      if (!name || seenCategories.has(category.category)) {
        throw new Error(
          "직무 메뉴 카테고리를 확인할 수 없습니다: " + category.category,
        );
      }
      seenCategories.add(category.category);

      return {
        key: category.category,
        name: name,
        groups: category.infoList.map(function (group) {
          var jobs = group.jobs.map(function (title) {
            var job = jobsByTitle.get(JSON.stringify([name, title]));
            if (!job) {
              throw new Error("직무 상세 정보가 없습니다: " + title);
            }
            if (seenJobCodes.has(job.jobCode)) {
              throw new Error(
                "직무가 메뉴에 중복 등록되어 있습니다: " + title,
              );
            }
            seenJobCodes.add(job.jobCode);
            return job;
          });
          if (Number(group.count) !== jobs.length) {
            throw new Error(
              "직무 개수와 그룹 인원수가 일치하지 않습니다: " +
                group.location,
            );
          }
          return {
            name: group.location,
            count: group.count,
            jobs: jobs,
          };
        }),
      };
    });

    if (
      seenCategories.size !== Object.keys(categoryNames).length ||
      seenJobCodes.size !== popupData.jobs.length
    ) {
      throw new Error(
        "메뉴와 직무 상세 데이터의 항목 수가 일치하지 않습니다.",
      );
    }
    return result;
  }

  function showDataError(error) {
    console.error("직무소개 데이터를 불러오지 못했습니다.", error);
    var message = createElement(
      "p",
      "tasks__error",
      "직무 정보를 불러오지 못했습니다. 페이지를 웹 서버에서 열고 data 폴더의 JSON 파일을 확인해 주세요.",
    );
    panels.replaceChildren(message);
  }

  function selectDepartment(index, moveFocus) {
    var tabs = tabList.querySelectorAll('[role="tab"]');
    var departmentPanels = panels.querySelectorAll('[role="tabpanel"]');
    departmentPanels.forEach(function (panel, panelIndex) {
      if (panelIndex !== index) {
        panel.querySelectorAll(".tasks__group[open]").forEach(function (group) {
          group.open = false;
        });
      }
    });
    tabs.forEach(function (tab, tabIndex) {
      var selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      departmentPanels[tabIndex].hidden = !selected;
      if (selected && moveFocus) tab.focus();
    });
  }

  function renderDepartments() {
    tabList.replaceChildren();
    panels.replaceChildren();

    departments.forEach(function (department, index) {
      var tabId = "tasks-tab-" + department.key;
      var panelId = "tasks-panel-" + department.key;
      var tab = createElement("button", "tasks__tab", department.name);
      tab.type = "button";
      tab.id = tabId;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panelId);
      tab.setAttribute("aria-selected", String(index === 0));
      tab.tabIndex = index === 0 ? 0 : -1;
      tabList.appendChild(tab);

      var panel = createElement("div", "tasks__panel");
      panel.id = panelId;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tabId);
      panel.hidden = index !== 0;

      department.groups.forEach(function (group) {
        var details = createElement("details", "tasks__group");
        var summary = createElement("summary", "tasks__group-head");
        var heading = createElement(
          "span",
          "tasks__group-title",
          group.name,
        );
        var count = createElement(
          "span",
          "tasks__count",
          String(group.count),
        );
        count.setAttribute("aria-label", group.count + "개 직무");
        summary.appendChild(heading);
        summary.appendChild(count);
        details.appendChild(summary);

        var groupContent = createElement("div", "tasks__group-content");
        var contentInner = createElement(
          "div",
          "tasks__group-content-inner",
        );
        var jobList = createElement("div", "tasks__jobs");
        group.jobs.forEach(function (job) {
          var button = createElement("button", "tasks__job");
          var name = createElement("span", "", job.title);
          var arrow = createElement("span", "tasks__job-arrow", "→");
          arrow.setAttribute("aria-hidden", "true");
          button.type = "button";
          button.appendChild(name);
          button.appendChild(arrow);
          button.addEventListener("click", function () {
            openJobModal(job);
          });
          jobList.appendChild(button);
        });
        contentInner.appendChild(jobList);
        groupContent.appendChild(contentInner);
        details.appendChild(groupContent);
        details.addEventListener("toggle", function () {
          if (!details.open) return;
          panel
            .querySelectorAll(".tasks__group[open]")
            .forEach(function (other) {
              if (other !== details) other.open = false;
            });
        });
        panel.appendChild(details);
      });
      panels.appendChild(panel);
    });

    tabList.addEventListener("click", function (event) {
      var tab = event.target.closest('[role="tab"]');
      if (!tab) return;
      selectDepartment(
        Array.prototype.indexOf.call(tabList.children, tab),
        false,
      );
    });

    tabList.addEventListener("keydown", function (event) {
      if (
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft" &&
        event.key !== "Home" &&
        event.key !== "End"
      )
        return;
      event.preventDefault();
      var current = Array.prototype.indexOf.call(
        tabList.children,
        document.activeElement,
      );
      var next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? departments.length - 1
            : (current +
                (event.key === "ArrowRight" ? 1 : -1) +
                departments.length) %
              departments.length;
      selectDepartment(next, true);
    });

    closeButton.addEventListener("click", function () {
      modal.close();
    });
    modal.addEventListener("click", function (event) {
      if (event.target === modal) modal.close();
    });
  }

  var menuDataElement = tasks.querySelector("#tasks-menu-data");
  var popupDataElement = tasks.querySelector("#tasks-popup-data");
  try {
    if (!menuDataElement || !popupDataElement) {
      throw new Error(
        "직무 JSON 데이터가 페이지에 포함되어 있지 않습니다.",
      );
    }
    departments = createDepartments(
      JSON.parse(menuDataElement.textContent),
      JSON.parse(popupDataElement.textContent),
    );
  } catch (error) {
    showDataError(error);
    return;
  }
  renderDepartments();
})();
