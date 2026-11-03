import { useEffect, useRef, useState } from 'react';
import benefitGroups from '../data/benefit_data.json';
import campusSchedule from '../data/campus_recruiting_schedule.json';
import taskCategories from '../data/task_data.json';
import taskDetails from '../data/task_popup_data.json';
import CanvasWalker from './CanvasWalker.jsx';

const departments = [
  { id: 'rnd', name: 'R&D' },
  { id: 'prod', name: '생산/품질' },
  { id: 'sales', name: '영업' },
  { id: 'mps', name: '경영관리' },
  { id: 'cl', name: '임상' },
  { id: 'global', name: '글로벌' },
  { id: 'healthcare', name: '헬스케어' },
];

const regions = ['서울', '경기', '강원', '경상', '충청', '전라'];
const weekdays = ['월', '화', '수', '목', '금'];
const applicationDeadline = new Date('2026-10-18T23:59:59+09:00').getTime();

const fairWeeks = [
  {
    dates: ['8월 31일 (월)', '9월 1일 (화)', '9월 2일 (수)', '9월 3일 (목)', '9월 4일 (금)'],
    events: [['KAIST'], ['서울대학교', '서강대학교', '연세대학교'], ['UNIST', '한양대학교'], ['GIST'], ['고려대학교', '성균관대학교(자연)']],
  },
  {
    dates: ['9월 7일 (월)', '9월 8일 (화)', '9월 9일 (수)', '', '10월 7일 (수)'],
    events: [['KIST', '동국대학교'], ['이화여자대학교', '중견기업박람회(대전)'], ['POSTECH'], [], ['서울고용센터']],
  },
];

const hiringProcesses = [
  {
    title: '영업직군',
    steps: [
      ['apply', '지원접수', '9.28~10.18'],
      ['doc', '서류전형', '10.19~10.20'],
      ['ai', 'AI역량검사', '10.21~10.25'],
      ['interview1', '1차면접', '11월 중'],
      ['field', '현장체험', '12월 초'],
      ['interview2', '2차면접', '12월 중'],
      ['edu', '교육전형', '27.1.4~'],
    ],
  },
  {
    title: '영업 외 전직군',
    steps: [
      ['apply', '지원접수', '9.28~10.18'],
      ['doc', '서류전형', '10.19~10.20'],
      ['ai', 'AI역량검사', '10.21~10.25'],
      ['interview1', '1차면접', '11월 중'],
      ['interview2', '2차면접', '12월 중'],
      ['join', '입사', '27.1.4 (경력직 협의 가능)'],
    ],
  },
];

function moveTabFocus(event, index, select) {
  const { key } = event;
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(key)) return;
  event.preventDefault();
  const tabs = [...event.currentTarget.querySelectorAll('[role="tab"]')];
  const next = key === 'Home'
    ? 0
    : key === 'End'
      ? tabs.length - 1
      : (index + (key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  select(next);
  tabs[next]?.focus();
}

function BenefitsSection() {
  return (
    <section className="welfare" id="welfare" aria-labelledby="welfare-title">
      <div className="welfare__inner">
        <header className="welfare__hero scroll-reveal">
          <h2 className="welfare__title" id="welfare-title">한미 생활을 더 즐겁게 만드는 방법</h2>
          <p className="welfare__lead">건강부터 성장, 휴식까지 알차게 준비한 복지를 소개할게요.</p>
          <img className="welfare__hero-char updown" src="./images/con5_char.png" alt="돋보기를 든 주황색 한미 캐릭터" />
        </header>
        <div className="welfare__scroll" tabIndex={0} aria-label="한미그룹 복지 카드 목록">
          {benefitGroups.map((group, groupIndex) => {
            const iconOffset = benefitGroups
              .slice(0, groupIndex)
              .reduce((total, previousGroup) => total + previousGroup.benefits.length, 0);

            return (
              <section
                className="welfare__group scroll-reveal"
                key={group.category}
                aria-labelledby={`welfare-group-title-${groupIndex + 1}`}
              >
                <header className="welfare__group-head">
                  <h3 className="welfare__group-title" id={`welfare-group-title-${groupIndex + 1}`}>
                    <img src={`./images/wf_tit${groupIndex + 1}.png`} alt="" aria-hidden="true" />
                    {group.category}
                  </h3>
                  <p className="welfare__group-copy">{group.description}</p>
                </header>
                <ul className="welfare__list" aria-label={`${group.category} 복지`}>
                  {group.benefits.map((benefit, benefitIndex) => (
                    <li className="welfare__card scroll-reveal" key={benefit.title}>
                      <div className="welfare__card-copy">
                        <h4 className="welfare__card-title">{benefit.title}</h4>
                        <p className="welfare__card-description">{benefit.description}</p>
                      </div>
                      <img className="welfare__card-icon" src={`./images/wf_ico${iconOffset + benefitIndex + 1}.png`} alt="" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function JobModal({ job, dialogRef, onDismiss }) {
  return (
    <dialog
      className="tasks__modal"
      ref={dialogRef}
      aria-labelledby="tasks-modal-title"
      onClose={onDismiss}
    >
      {job && (
        <>
          <img className="tasks__modal-banner" src={job.imgSrc} alt="" />
          <button
            className="tasks__modal-close"
            type="button"
            aria-label="상세 창 닫기"
            onClick={() => dialogRef.current?.close()}
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="tasks__modal-content">
            <div className="tasks__modal-heading">
              <span className="tasks__modal-category">{job.category}</span>
              <h3 className="tasks__modal-title" id="tasks-modal-title">{job.title}</h3>
              <p className="tasks__modal-location">{job.department}</p>
              <p className="tasks__modal-career">{job.target}</p>
            </div>
            <div className="tasks__modal-sections">
              {Object.entries(job.details).map(([title, items]) => (
                <section className="tasks__modal-section" key={title}>
                  <h4>{title}</h4>
                  <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              ))}
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}

function TasksSection() {
  const [selectedDepartment, setSelectedDepartment] = useState('rnd');
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState('');
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (selectedJob && !dialog.open) dialog.showModal();
    if (!selectedJob && dialog.open) dialog.close();
    return undefined;
  }, [selectedJob]);

  function showJob(title) {
    const job = taskDetails.jobs.find((item) => item.title === title);
    if (!job) {
      setError(`「${title}」 직무 상세 정보를 찾을 수 없습니다.`);
      return;
    }
    setError('');
    setSelectedJob(job);
  }

  return (
    <section className="tasks" id="tasks" aria-labelledby="tasks-title">
      <header className="tasks__hero">
        <div className="tasks__visual">
          <img className="tasks__watermark" src="./images/tasks_bg_title.png" alt="" aria-hidden="true" />
          <CanvasWalker
            variant="reading"
            className="hanmi-walker tasks__character"
            ariaLabel="돋보기를 들고 직무를 살펴보는 보라색 한미 캐릭터"
          />
        </div>
      </header>
      <div className="tasks__inner">
        <div className="tasks__intro scroll-reveal">
          <h2 className="tasks__title" id="tasks-title">알약이를 따라<br />나에게 맞는 직무를 찾아봐요!</h2>
          <p className="tasks__lead">연구부터 생산, 영업, 경영지원까지 당신의 가능성이 빛날 자리를 안내해 드릴게요.</p>
        </div>
        <div className="tasks__tabs scroll-reveal" role="tablist" aria-label="직무 분야" onKeyDown={(event) => {
          const index = departments.findIndex((department) => department.id === selectedDepartment);
          moveTabFocus(event, index, (next) => setSelectedDepartment(departments[next].id));
        }}>
          {departments.map((department) => (
            <button
              className="tasks__tab"
              type="button"
              key={department.id}
              id={`tasks-tab-${department.id}`}
              role="tab"
              aria-controls={`tasks-panel-${department.id}`}
              aria-selected={selectedDepartment === department.id}
              tabIndex={selectedDepartment === department.id ? 0 : -1}
              onClick={() => setSelectedDepartment(department.id)}
            >
              {department.name}
            </button>
          ))}
        </div>
        <div className="tasks__panels">
          {taskCategories.data.map((category) => (
            <div
              className="tasks__panel scroll-reveal"
              id={`tasks-panel-${category.category}`}
              role="tabpanel"
              aria-labelledby={`tasks-tab-${category.category}`}
              key={category.category}
              hidden={selectedDepartment !== category.category}
              tabIndex={0}
            >
              {category.infoList.map((group) => (
                <details className="tasks__group" key={group.location}>
                  <summary className="tasks__group-head">
                    <span className="tasks__group-title">{group.location}</span>
                    <span className="tasks__count" aria-label={`${group.jobs.length}개 직무`}>{group.jobs.length}</span>
                  </summary>
                  <div className="tasks__group-content">
                    <div className="tasks__group-content-inner">
                      <div className="tasks__jobs">
                        {group.jobs.map((title) => (
                          <button className="tasks__job" type="button" key={title} onClick={() => showJob(title)}>
                            <span>{title}</span>
                            <span className="tasks__job-arrow" aria-hidden="true">→</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>
        {error && <p className="welfare__error" role="alert">{error}</p>}
      </div>
      <JobModal
        job={selectedJob}
        dialogRef={dialogRef}
        onDismiss={() => setSelectedJob(null)}
      />
    </section>
  );
}

function RequirementSection() {
  const [activeTab, setActiveTab] = useState('qualification');

  return (
    <section className="requirement" id="requirement" aria-labelledby="requirement-title">
      <div className="requirement__inner">
        <h2 className="requirement__title scroll-reveal" id="requirement-title">
          한미그룹과 함께하는 문은<br />활짝 열려 있습니다
        </h2>
        <div className="requirement__tabs scroll-reveal" role="tablist" aria-label="지원 안내" onKeyDown={(event) => {
          const index = activeTab === 'qualification' ? 0 : 1;
          moveTabFocus(event, index, (next) => setActiveTab(next === 0 ? 'qualification' : 'process'));
        }}>
          {[
            ['qualification', '지원자격'],
            ['process', '전형절차 및 접수방법'],
          ].map(([id, label]) => (
            <button
              className="requirement__tab"
              id={`requirement-tab-${id}`}
              type="button"
              role="tab"
              aria-controls={`requirement-panel-${id}`}
              aria-selected={activeTab === id}
              tabIndex={activeTab === id ? 0 : -1}
              key={id}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="requirement__panel" id="requirement-panel-qualification" role="tabpanel" aria-labelledby="requirement-tab-qualification" tabIndex={0} hidden={activeTab !== 'qualification'}>
          <div className="requirement__eligibility scroll-reveal">
            <div className="requirement__qualification">
              <img src="./images/require_ico_calendar_3d_.png" alt="" aria-hidden="true" />
              <p>27년 1월 입사가 가능한 자</p>
            </div>
            <span className="requirement__divider" aria-hidden="true" />
            <div className="requirement__qualification">
              <img src="./images/require_ico_gradcap_3d_.png" alt="" aria-hidden="true" />
              <p>기졸업자 또는 27년 2월 졸업 예정자</p>
            </div>
          </div>
          <ul className="requirement__notes scroll-reveal">
            <li>남성의 경우 병역을 마쳤거나 면제인 분</li>
            <li>해외여행 (또는 해외 출장)에 결격사유가 없는 분</li>
            <li>취업보호대상자는 관련 법령에 의거하여 우대</li>
          </ul>
          <p className="requirement__notice scroll-reveal">
            모집 직무별로 지원자격이 상이하오니 반드시 <strong>채용 공고</strong>를 확인해 주시기 바랍니다.
          </p>
        </div>

        <div className="requirement__panel" id="requirement-panel-process" role="tabpanel" aria-labelledby="requirement-tab-process" tabIndex={0} hidden={activeTab !== 'process'}>
          {hiringProcesses.map((process) => (
            <section className="requirement__process-group scroll-reveal" key={process.title}>
              <h3>{process.title}</h3>
              <ol className="requirement__steps">
                {process.steps.map(([icon, label, date], index) => (
                  <li className="requirement__step" key={`${label}-${date}`}>
                    <span className="requirement__step-icon" aria-hidden="true">
                      <img src={`./images/require_ico_step_${icon}_.png`} alt="" />
                    </span>
                    <span className="requirement__step-label">
                      {label}<span className="requirement__step-date">{date}</span>
                    </span>
                    {index < process.steps.length - 1 && (
                      <ul className="requirement__step-arrow-list" aria-hidden="true">
                        <li className="requirement__step-arrow" />
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          ))}
          <ul className="requirement__process-notes scroll-reveal">
            <li>상기 일정은 상황에 따라 변경될 수 있으며 각 전형별 상세 일정은 대상자에 한해 개별 안내 예정입니다.</li>
            <li>입사지원서에 허위 기재가 있거나 제출서류가 허위로 판명되는 경우, 입사가 취소될 수 있습니다.</li>
            <li>지원서 제출 후에는 수정이 불가하오니, 주의하시기 바랍니다.</li>
            <li>전형단계별 결과는 E-Mail 및 SMS를 통하여 안내하오니 연락처를 정확히 기재해 주시기 바랍니다.</li>
            <li>입사 후 3개월간 수습기간이 적용되며, 수습 중 직무 수행 능력이 부족하다고 판단되는 경우 입사가 취소될 수 있습니다.</li>
          </ul>
        </div>
      </div>
      <div className="requirement__bulb" aria-hidden="true">
        <img src="./images/require_obj_bulb_.png" alt="" className="updown" />
      </div>
    </section>
  );
}

function parseCampusWeeks(schedule, region) {
  const weeks = new Map();
  const matches = schedule
    .filter((item) => item.region === region)
    .map((item) => {
      const match = item.date.match(/^(\d{1,2})월\s*(\d{1,2})일\s*\(([월화수목금])\)$/);
      if (!match) throw new Error(`캠퍼스 일정 날짜 형식이 올바르지 않습니다: ${item.date}`);
      return {
        ...item,
        month: Number(match[1]),
        day: Number(match[2]),
        weekdayIndex: weekdays.indexOf(match[3]),
      };
    })
    .sort((left, right) => left.month - right.month || left.day - right.day);

  for (const event of matches) {
    const date = new Date(2026, event.month - 1, event.day);
    if (date.getMonth() !== event.month - 1 || date.getDate() !== event.day) {
      throw new Error(`캠퍼스 일정 날짜가 올바르지 않습니다: ${event.date}`);
    }
    if ((date.getDay() + 6) % 7 !== event.weekdayIndex) {
      throw new Error(`캠퍼스 일정 요일이 올바르지 않습니다: ${event.date}`);
    }
    const monday = new Date(date);
    monday.setDate(date.getDate() - event.weekdayIndex);
    const weekKey = monday.toISOString().slice(0, 10);
    if (!weeks.has(weekKey)) {
      weeks.set(weekKey, { monday, days: Array.from({ length: 5 }, () => []) });
    }
    weeks.get(weekKey).days[event.weekdayIndex].push(event);
  }

  return [...weeks.values()].map(({ monday, days }, weekIndex, allWeeks) => {
    const lastDay = days.reduce((last, day, index) => (day.length ? index : last), 0);
    const dayCount = weekIndex === allWeeks.length - 1 ? lastDay + 1 : 5;
    return {
      dates: days.slice(0, dayCount).map((_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[index]})`;
      }),
      events: days.slice(0, dayCount),
    };
  });
}

function EventCalendar({ weeks, interactive }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="exposition__calendar">
      {weeks.map((week, weekIndex) => (
        <div className="exposition__week scroll-reveal" key={`${week.dates[0]}-${weekIndex}`}>
          <div className="exposition__week-dates">
            {week.dates.map((date, index) => (
              <div
                className={`exposition__date exposition__date--row-${Math.floor(index / 2) * 2 + 1} exposition__date--column-${(index % 2) + 1}`}
                key={`${date}-${index}`}
              >
                {date}
              </div>
            ))}
          </div>
          <div className="exposition__week-events">
            {week.events.map((events, index) => {
              const row = Math.floor(index / 2) * 2 + 1;
              const column = (index % 2) + 1;
              return (
                <div className={`exposition__day exposition__day--row-${row} exposition__day--column-${column}`} key={`${week.dates[index]}-${index}`}>
                  {events.map((event, eventIndex) => {
                    if (!interactive || typeof event === 'string') {
                      return <span className="exposition__event exposition__event--static" key={typeof event === 'string' ? event : event.school}>{typeof event === 'string' ? event : event.school}</span>;
                    }
                    const eventKey = `${event.region}-${event.date}-${event.school}`;
                    const detailId = `event-detail-${weekIndex}-${index}-${eventIndex}`;
                    const open = selectedEvent === eventKey;
                    return (
                      <div className="exposition__event-wrap" key={eventKey}>
                        <button
                          className="exposition__event"
                          type="button"
                          aria-expanded={open}
                          aria-controls={detailId}
                          onClick={() => setSelectedEvent(open ? null : eventKey)}
                        >
                          {event.school}
                        </button>
                        {open && (
                          <div className="exposition__event-detail" id={detailId} role="group" aria-label={`${event.school} 방문 상세 일정`}>
                            <div className="exposition__event-detail-row">
                              <span className="exposition__event-detail-label exposition__event-detail-label--place">장소</span>
                              <span className="exposition__event-detail-value">{event.location || '추후 안내'}</span>
                            </div>
                            <div className="exposition__event-detail-row">
                              <span className="exposition__event-detail-label exposition__event-detail-label--time">시간</span>
                              <span className="exposition__event-detail-value">{event.time || '추후 안내'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExpositionSection() {
  const [activeTab, setActiveTab] = useState('fair');
  const [selectedRegion, setSelectedRegion] = useState('서울');

  return (
    <section className="exposition" id="exposition" aria-labelledby="exposition-title">
      <div className="exposition__inner">
        <header className="exposition__hero scroll-reveal">
          <h2 className="exposition__title" id="exposition-title">Hanmi 박람회/캠퍼스로 출발!</h2>
          <p className="exposition__lead">
            한미그룹이 여러분을 만나러 박람회와 캠퍼스로 찾아갑니다.<br />
            우리가 어디서 만날지 궁금하다면 아래 지역에서 찾아보세요!
          </p>
          <p className="exposition__guide">학교명/장소를 확인해 주세요.</p>
          <div className="exposition__character updown" aria-hidden="true">
            <span className="exposition__speech">우리 학교에도 한미가 찾아올까?</span>
            <img src="./images/expo_con3_char.png" alt="" />
          </div>
        </header>
        <div className="exposition__tabs scroll-reveal" role="tablist" aria-label="채용 행사 구분" onKeyDown={(event) => {
          const index = activeTab === 'fair' ? 0 : 1;
          moveTabFocus(event, index, (next) => setActiveTab(next === 0 ? 'fair' : 'campus'));
        }}>
          {[
            ['fair', '박람회'],
            ['campus', '캠퍼스'],
          ].map(([id, label]) => (
            <button
              className="exposition__tab"
              type="button"
              role="tab"
              id={`exposition-tab-${id}`}
              aria-controls={`exposition-panel-${id}`}
              aria-selected={activeTab === id}
              tabIndex={activeTab === id ? 0 : -1}
              key={id}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="exposition__panel" id="exposition-panel-fair" role="tabpanel" aria-labelledby="exposition-tab-fair" tabIndex={0} hidden={activeTab !== 'fair'}>
          <EventCalendar weeks={fairWeeks} interactive={false} />
        </div>
        <div className="exposition__panel" id="exposition-panel-campus" role="tabpanel" aria-labelledby="exposition-tab-campus" tabIndex={0} hidden={activeTab !== 'campus'}>
          <div
            className="exposition__regions scroll-reveal"
            role="tablist"
            aria-label="캠퍼스 방문 지역"
            onKeyDown={(event) => {
              const index = regions.indexOf(selectedRegion);
              moveTabFocus(event, index, (next) => setSelectedRegion(regions[next]));
            }}
          >
            {regions.map((region, index) => (
              <button
                className="exposition__region"
                id={`exposition-region-${index}`}
                type="button"
                role="tab"
                aria-controls={`exposition-region-panel-${index}`}
                aria-selected={selectedRegion === region}
                tabIndex={selectedRegion === region ? 0 : -1}
                key={region}
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </button>
            ))}
          </div>
          {regions.map((region, index) => (
            <div
              className="exposition__region-panel"
              id={`exposition-region-panel-${index}`}
              role="tabpanel"
              tabIndex={0}
              key={region}
              hidden={selectedRegion !== region}
            >
              <EventCalendar key={region} weeks={parseCampusWeeks(campusSchedule, region)} interactive />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShortcutSection() {
  const [remaining, setRemaining] = useState(() => Math.max(0, applicationDeadline - Date.now()));

  useEffect(() => {
    if (Date.now() >= applicationDeadline) return undefined;
    const timer = window.setInterval(() => {
      const nextRemaining = Math.max(0, applicationDeadline - Date.now());
      setRemaining(nextRemaining);
      if (nextRemaining === 0) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const seconds = Math.floor(remaining / 1000);

  return (
    <>
      <section className="con8" aria-label="한미그룹 바로가기">
        <div className="con8__inner">
          <a className="con8__link scroll-reveal" href="#welfare">
            <span className="con8__image-wrap">
              <span className="con8__photo"><img className="con8__image" src="./images/con8_img1.jpg" alt="한미그룹 구성원들이 손을 모은 모습" /></span>
              <img className="con8__mark con8__mark--left-arrow" src="./images/con8_Image.png" alt="" />
              <img className="con8__mark con8__mark--star" src="./images/con8_Image-2.png" alt="" />
            </span>
            <span className="con8__copy">
              <span className="con8__question">한미그룹의 <span className="con8__underlined-phrase">문화와 복지<img className="con8__underline" src="./images/con8_Image-1.png" alt="" /></span>가 궁금하다면?</span>
              <span className="con8__action">한미그룹 문화와 복지 보기<span className="con8__arrow" aria-hidden="true">›</span></span>
            </span>
          </a>
          <a className="con8__link scroll-reveal" href="#tasks">
            <span className="con8__image-wrap">
              <span className="con8__photo"><img className="con8__image" src="./images/con8_img2.jpg" alt="촬영 장비를 비춘 이미지" /></span>
              <img className="con8__mark con8__mark--job-arrow" src="./images/con8_Image-4.png" alt="" />
            </span>
            <span className="con8__copy">
              <span className="con8__question">한미그룹의 <span className="con8__circled-word">직무<img className="con8__circle" src="./images/con8_Image-3.png" alt="" /></span>가 궁금하다면?</span>
              <span className="con8__action">한미그룹 직무 소개 페이지<span className="con8__arrow" aria-hidden="true">›</span></span>
            </span>
          </a>
          <a className="con8__link scroll-reveal" href="#requirement">
            <span className="con8__image-wrap">
              <span className="con8__photo"><img className="con8__image" src="./images/con8_img3.jpg" alt="한미약품 연구센터 전경" /></span>
            </span>
            <span className="con8__copy">
              <span className="con8__question">한미그룹의 <span className="con8__underlined-phrase">채용소식<img className="con8__underline" src="./images/con8_Image-5.png" alt="" /></span>을 빠르게 받고 싶다면?</span>
              <span className="con8__action">한미그룹 채용 페이지<span className="con8__arrow" aria-hidden="true">›</span></span>
            </span>
          </a>
        </div>
        <img className="con8__character updown" src="./images/con8_char.png" alt="" />
      </section>
      <section className="con9" aria-labelledby="con9-title">
        <img className="con9__cloud con9__cloud--left" src="./images/con9_cloud_l.png" alt="" />
        <img className="con9__cloud con9__cloud--right" src="./images/con9_cloud_r.png" alt="" />
        <h2 className="con9__title scroll-reveal" id="con9-title">당신에게 딱 맞는 자리를 찾으러 출발!</h2>
        {remaining > 0 ? (
          <p className="con9__countdown scroll-reveal" aria-label="지원 마감까지 남은 시간">
            <span><span className="con9__countdown-unit">{Math.floor(seconds / 86400)}</span>일</span>
            <span><span className="con9__countdown-unit">{Math.floor((seconds % 86400) / 3600)}</span>시간</span>
            <span><span className="con9__countdown-unit">{Math.floor((seconds % 3600) / 60)}</span>분</span>
            <span><span className="con9__countdown-unit">{seconds % 60}</span>초 남았어요</span>
          </p>
        ) : (
          <p className="con9__expired">모집이 마감되었습니다.</p>
        )}
        <a className="con9__earth-link scroll-reveal" href="#requirement" aria-label="지원 자격 및 접수 방법 보기">
          <img className="con9__earth" src="./images/con9_earth.png" alt="" />
          <span className="con9__apply">지원하기<span className="con8__arrow" aria-hidden="true">›</span></span>
        </a>
        <p className="con9__hint">아이콘을 클릭해서 지원해 주세요!</p>
      </section>
    </>
  );
}

export {
  BenefitsSection,
  ExpositionSection,
  RequirementSection,
  ShortcutSection,
  TasksSection,
};
