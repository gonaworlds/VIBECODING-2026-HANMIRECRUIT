export default function HeroSection({ onScrollNext }) {
  return (
    <section className="mv" id="mv" aria-labelledby="mv-title">
      <div className="mv__inner">
        <div className="mv__visual" aria-hidden="true">
          <span className="mv__ring mv__ring--glow" />
          <span className="mv__ring mv__ring--line" />
          <img className="mv__img mv__micro updown" src="./images/mv_micro.png" alt="" />
          <img className="mv__char1 mv__img updown" src="./images/mv_char1.png" alt="" />
          <img className="mv__img mv__char2 updown" src="./images/mv_char2.png" alt="" />
          <img className="mv__img mv__char3 updown" src="./images/mv_char3.png" alt="" />
          <img className="mv__img mv__char4 updown" src="./images/mv_char4.png" alt="" />
          {['1', '2', '3', '3b', '4'].map((star) => (
            <span key={star} className={`mv__star mv__star--${star} updown`} />
          ))}
        </div>
        <div className="mv__text">
          <div className="mv__head">
            <p className="mv__season">2026년 하반기</p>
            <h1 className="mv__title" id="mv-title">
              <span className="mv__brand">한미그룹</span>
              <span className="mv__type">공개채용</span>
            </h1>
            <p className="mv__period">
              모집기간 : 2026.9.28(월) ~ 2026.10.18(일) 23:59까지
            </p>
          </div>
          <a className="btn-cta" href="#tasks">모집직무 바로가기!</a>
        </div>
      </div>
      <button className="btn-scroll" type="button" aria-label="아래로 스크롤" onClick={onScrollNext}>
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M10 16l10 10 10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
