import CanvasWalker from './CanvasWalker.jsx';

export function MiraeSection() {
  return (
    <section className="mirae" id="mirae" aria-labelledby="mirae-title">
      <div className="mirae__stage">
        <h2 className="mirae__title scroll-reveal" id="mirae-title">
          <span className="mirae__point">새로운 미래</span>를 향해 나아갑니다
        </h2>
        <div className="mirae__deco">
          <img className="mirae__img mirae__img--cloudl" src="./images/mirae_cloud1.png" alt="왼쪽 위에 흐릿하게 번진 큰 구름" />
          <img className="mirae__img mirae__img--cloud2" src="./images/mirae_cloud2.png" alt="오른쪽 아래에 흐릿하게 번진 작은 구름" />
          <img className="mirae__img mirae__img--cloud3" src="./images/mirae_cloud3.png" alt="화면 왼쪽 가장자리에 걸친 하얀 입체 구름" />
          <img className="mirae__img mirae__img--cloud4" src="./images/mirae_cloud4.png" alt="화면 오른쪽 가장자리에 걸친 하얀 입체 구름" />
          <img className="mirae__img mirae__img--star1" src="./images/mirae_star1.png" alt="캐릭터 오른쪽 위에서 반짝이는 노란 별" />
          <img className="mirae__img mirae__img--star2" src="./images/mirae_star2.png" alt="캐릭터 왼쪽 아래에서 반짝이는 노란 별" />
        </div>
        <figure className="mirae__figure scroll-reveal">
          <CanvasWalker variant="walking" className="hanmi-walker mirae__walker" ariaLabel="사원증을 목에 건 한미 캐릭터가 초록 언덕 위를 힘차게 걸어가는 모습" />
        </figure>
      </div>
    </section>
    
  );
}

export function HistorySection({ expanded, onToggle }) {
  return (
    <section className="history" id="history" aria-labelledby="history-title">
      <div className="history__inner">
        <div className={`history__fold${expanded ? ' is-expanded' : ''}`} id="history-fold">
          <header className="history__head scroll-reveal">
            <h2 className="history__title" id="history-title">
              <span>한미의 도전은 작은 가능성에서</span>
              <span>시작되었습니다.</span>
            </h2>
            <p className="history__count">
              <span className="sr-only">53주년</span>
              <span aria-hidden="true">53</span>
              <span className="history__count-suffix" aria-hidden="true">th</span>
            </p>
            <img className="history__deco history__deco--star updown" src="./images/obj_star_big.png" alt="" aria-hidden="true" />
          </header>
          <ol className="history__timeline">
            <li className="era era--odd era--1 scroll-reveal">
              <h3 className="era__period">1973~2001</h3>
              <p className="era__lead">한계를 하나씩 넘을 때마다,</p>
              <ul className="era__list">
                <li className="era__item">
                  <time className="era__year" dateTime={1973}>1973</time>
                  <p className="era__text">한미약품공업주식회사 설립</p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={1984}>1984</time>
                  <p className="era__text">팔탄 GMP 공장 신축</p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={1989}>1989</time>
                  <p className="era__text">
                    세프트리악손 제조방법 Roche사 기술 수출
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={1997}>1997</time>
                  <p className="era__text">
                    마이크로에멀젼 제제기술 Novartis사 기술 수출
                  </p>
                </li>
              </ul>
              <span className="era__dots" aria-hidden="true" />
              <figure className="era__figure">
                <img src="./images/his1.png" alt="한미약품의 초기 대표 제품인 텐텐과 쎄쎄 제품 이미지" />
              </figure>
              <img className="history__deco history__deco--beaker updown" src="./images/obj_beaker.png" alt="" aria-hidden="true" />
            </li>
            <li className="era era--even era--2 scroll-reveal">
              <h3 className="era__period">2002~2010</h3>
              <ul className="era__list">
                <li className="era__item">
                  <time className="era__year" dateTime={2004}>2004</time>
                  <p className="era__text">
                    국내 최초 고혈압치료제 ‘아모디핀’ 미국특허 획득
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2006}>2006</time>
                  <p className="era__text">
                    세계 최초 유소아 해열 시럽제 개량신약 ‘맥시부펜’ 개발 성공
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2008}>2008</time>
                  <p className="era__text">
                    국내 최초 주사용항생제 세프트리악손 美 FDA 승인
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2009}>2009</time>
                  <p className="era__text">
                    세계최초 암로디핀+로살탄 복합제 ‘아모잘탄’ 발매
                  </p>
                </li>
              </ul>
              <span className="era__dots" aria-hidden="true" />
              <figure className="era__figure">
                <img src="./images/his2.png" alt="노을 지는 해변에서 손을 잡고 함께 점프하는 사람들의 실루엣" />
              </figure>
              <img className="history__deco history__deco--ring-blue" src="./images/obj_mol_blur1.png" alt="" aria-hidden="true" />
              <img className="history__deco history__deco--microscope updown" src="./images/obj_microscope.png" alt="" aria-hidden="true" />
            </li>
            <li className="era era--odd era--3 scroll-reveal">
              <h3 className="era__period">2011~2015</h3>
              <p className="era__lead">새로운 가능성이 현실이 되었어요.</p>
              <ul className="era__list">
                <li className="era__item">
                  <time className="era__year" dateTime={2011}>2011</time>
                  <p className="era__text">
                    MSD와 ‘아모잘탄’ 50여개국 수출 계약 체결
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2012}>2012</time>
                  <p className="era__text">
                    ‘LAPS-GCSF’ 美 스펙트럼사와 공동개발 및 상업화 계약
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2013}>2013</time>
                  <p className="era__text">
                    국내 개량신약 최초 미국 FDA 승인 및 미국 출시 ‘에소메졸’
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2014}>2014</time>
                  <p className="era__text">
                    ‘트리약손’ 국내 최초 유럽 4개국 시판 허가
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2015}>2015</time>
                  <p className="era__text">한국 사상 최대규모 릴레이 기술수출</p>
                </li>
              </ul>
              <span className="era__dots" aria-hidden="true" />
              <figure className="era__figure">
                <img src="./images/his3.png" alt="스펙트럼 파마슈티컬스 로고와 에소메졸 제품 이미지" />
              </figure>
              <img className="history__deco history__deco--ring-gray updown" src="./images/obj_mol_blur2.png" alt="" aria-hidden="true" />
            </li>
            <li className="era era--even era--4 scroll-reveal">
              <h3 className="era__period">2016~2020</h3>
              <ul className="era__list">
                <li className="era__item">
                  <time className="era__year" dateTime={2016}>2016</time>
                  <p className="era__text">
                    차세대 RAF 저해제, Roche 제넨텍 기술수출
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2017}>2017</time>
                  <p className="era__text">
                    ‘에소메졸’ 국내 제약회사 최초 미국약전(USP) 등재
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2018}>2018</time>
                  <p className="era__text">
                    ‘Glucagon Analog’, ‘오락솔’ 차세대 AML 치료제 美
                    희귀의약품 지정
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2019}>2019</time>
                  <p className="era__text">
                    최근 10년간 처방실적 최다 4조 4,176억원
                  </p>
                </li>
              </ul>
              <span className="era__dots" aria-hidden="true" />
              <figure className="era__figure">
                <img src="./images/his4.png" alt="ASCO 로고, 로수젯 제품 이미지, USP 로고" />
              </figure>
            </li>
            <li className="era era--odd era--5 scroll-reveal">
              <h3 className="era__period">2021~2026</h3>
              <p className="era__lead">
                하지만 아직, 가야 할 길이 더 남아 있습니다.
              </p>
              <ul className="era__list">
                <li className="era__item">
                  <time className="era__year" dateTime={2021}>2021</time>
                  <p className="era__text">
                    ‘로수젯’, 국내사 개발 처방의약품 매출 1위 달성
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2022}>2022</time>
                  <div className="era__text">
                    <p>‘롤론티스’ 한국 최초 FDA 허가 받은 바이오신약 등재</p>
                    <p>
                      ‘로수젯 RACING 연구’ 세계 최고 권위 의학저널 ‘LANCET’
                      등재
                    </p>
                  </div>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2023}>2023</time>
                  <p className="era__text">비만 프로젝트 ‘H.O.P’ 프로젝트 가동</p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2024}>2024</time>
                  <p className="era__text">
                    근손실 한계 뛰어넘은 신개념 비만 신약 ‘HM17321’ 발표
                  </p>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2025}>2025</time>
                  <div className="era__text">
                    <p>‘로수젯’ 한국 전문의약품 시장 1위 품목 등록</p>
                    <p>한미약품 8년 연속 원외처방 1위</p>
                    <p>
                      미국암연구학회(AACR)서 국내 최다 11개 연구 성과 발표
                    </p>
                    <p>한미사이언스 약국화장품 ‘EGF크림’ 27만개 완판</p>
                  </div>
                </li>
                <li className="era__item">
                  <time className="era__year" dateTime={2026}>2026</time>
                  <div className="era__text">
                    <p>희귀질환치료제 ‘LAPS-GLP2’ 릴리 기술수출</p>
                    <p>한미 ‘완전두유·케어미’ 국제 우수 미각상 수상</p>
                  </div>
                </li>
              </ul>
              <span className="era__dots" aria-hidden="true" />
              <figure className="era__figure">
                <img src="./images/his5.png" alt="랜싯 200주년 표지, 롤론티스 작용 원리 도식, 롤론티스 제품 이미지" />
              </figure>
              <img className="history__deco history__deco--molecule updown" src="./images/obj_mol_big.png" alt="" aria-hidden="true" />
            </li>
          </ol>
          <div className="history__end">
            <p className="history__count history__count--end">
              <span className="sr-only">100주년</span>
              <span aria-hidden="true">100</span>
              <span className="history__count-suffix" aria-hidden="true">th</span>
            </p>
            <div className="history__closing">
              <p className="history__closing-sub">
                <span className="s">한계를 넘을 때마다, 건강한 미래는 가까워졌습니다.</span>
                <span className="s">한계를 넘는 일, 우리에게는 꽤 익숙하니까.</span>
              </p>
              <p className="history__closing-lead">
                <span className="s">
                  <span className="c">수많은 도전이</span>
                  <span className="c">오늘의 한미를 만들었습니다.</span>
                </span>
                <br />
                <span className="s">
                  <span className="c">이제 또 다른 가능성을 향해</span>
                  <span className="c">당신과 함께 나아갑니다.</span>
                </span>
              </p>
            </div>
            <img className="history__deco history__deco--cloud updown" src="./images/cloud_blur_medium.png" alt="" aria-hidden="true" />
            <img className="history__deco history__deco--char updown leftright" src="./images/con2_char.png" alt="" aria-hidden="true" />
          </div>
        </div>
        <button className="history__toggle" type="button" aria-expanded={expanded} aria-controls="history-fold" onClick={onToggle}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 13l6-6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 19l6-6 6 6" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="history__toggle-text">{expanded ? '접기' : '펼치기'}</span>
        </button>
      </div>
    </section>
    
  );
}

export function JobsSection() {
  return (
    <section className="jobs" id="jobs" aria-labelledby="jobs-title">
      <div className="cont__inner">
        <div className="cont__body">
          <header className="cont__intro scroll-reveal">
            <div className="cont__headline">
              <img className="cont__badge updown" src="./images/con3_logo.png" alt="붉은 타원형 Hanmi 로고" />
              <h2 className="cont__title" id="jobs-title">
                한미에서는 어떤 일을 할까요?
              </h2>
            </div>
            <p className="cont__lead">
              일의 보람부터 성장의 순간까지, 먼저 경험한 현직자들이 솔직하게
              들려드립니다.
            </p>
            <img className="cont__char leftright" src="./images/con3_char.png" alt="사원증을 목에 걸고 서류가방을 든 보라색 한미 캐릭터" />
          </header>
          <div className="cont__cards">
            <ul className="cont__list">
              <li className="cont__item scroll-reveal">
                <a className="cont__card" href="#interview-1">
                  <figure className="cont__photo">
                    <img src="./images/con3_int1.jpg" alt="실험 장비가 놓인 연구실에서 주먹을 쥐어 보이며 웃고 있는 한미약품 품질관리 이건호 사원" />
                  </figure>
                  <p className="cont__desc">
                    정밀한 시험과 분석으로 의약품의 품질을 확인해 안전하고
                    신뢰할 수 있는 의약품을 만들어갑니다.
                  </p>
                  <div className="cont__meta">
                    <p className="cont__who">
                      <span>한미약품 품질관리</span>
                      <span>이건호 사원</span>
                    </p>
                    <span className="cont__arrow" aria-hidden="true">
                      <svg viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </a>
              </li>
              <li className="cont__item scroll-reveal">
                <a className="cont__card" href="#interview-2">
                  <figure className="cont__photo">
                    <img src="./images/con3_int2.jpg" alt="가죽 소파에 앉아 미소 짓고 있는 한미약품 전임상연구 박진아 연구원" />
                  </figure>
                  <p className="cont__desc">
                    신약 후보물질의 가능성을 과학적으로 검증해 새로운 치료제가
                    환자에게 향하는 첫걸음을 만듭니다.
                  </p>
                  <div className="cont__meta">
                    <p className="cont__who">
                      <span>한미약품 전임상연구</span>
                      <span>박진아 연구원</span>
                    </p>
                    <span className="cont__arrow" aria-hidden="true">
                      <svg viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </a>
              </li>
            </ul>
            <img className="cont__bottle updown" src="./images/con3_bottle.png" alt="" aria-hidden="true" />
          </div>
          <div className="cont__cta-wrap scroll-reveal">
            <a className="cont__cta" href="#interview-all">모든 현직자 알아가기!</a>
          </div>
        </div>
      </div>
    </section>
    
  );
}

export function InnovationSection() {
  return (
    <section className="innovation" id="innovation" aria-labelledby="innovation-title">
      <div className="cont__inner">
        <div className="cont__body">
          <div className="cont__glow" aria-hidden="true" />
          <div className="cont__glow cont__glow--bl" aria-hidden="true" />
          <header className="cont__growth scroll-reveal">
            <h2 className="cont__title" id="innovation-title">
              당신의 가능성,<br />한미그룹에서 더 크게 성장합니다
            </h2>
            <p className="cont__lead">
              연구와 혁신으로 성장하며 글로벌 제약/바이오 기업을 향해<br className="mo-only" />
              나아갑니다.
            </p>
          </header>
          <div className="cont__news" role="group" aria-labelledby="innovation-title">
            <img className="cont__formula" src="./images/inno_formula.png" alt="" aria-hidden="true" />
            <img className="cont__dna2 bigsmall" src="./images/inno_mol.png" alt="" aria-hidden="true" />
            <ul className="cont__bubbles">
              <li className="cont__bubble cont__bubble--point">
                <a href="#news-1">한미약품, 상반기 누적 매출 8,602억원…2분기 영업이익 117%
                  증가</a>
              </li>
              <li className="cont__bubble cont__bubble--white">
                <a href="#news-2">“사업형 지주사 경쟁력 입증”…한미사이언스, 2분기 영업이익
                  71%↑<br />2분기 매출 3,679억원…상반기 누적 매출 7,216억원
                  돌파</a>
              </li>
              <li className="cont__bubble cont__bubble--point">
                <a href="#news-3">한미약품, 로슈 제넨텍에 비만신약 기술수출…최대 3조 2,000억
                  규모</a>
              </li>
              <li className="cont__bubble cont__bubble--white">
                <a href="#news-4">“UCN2 이어 또…” 한미약품, 두 번째 근육 증가 비만신약
                  공개</a>
              </li>
              <li className="cont__bubble cont__bubble--point">
                <a href="#news-5">명품 반열 오른 한미 ‘로수젯’…압도적 데이터 경쟁력으로 시장
                  석권<br />2년 연속 국내사 개발 전문의약품 시장 ‘1위’…올해
                  상반기 누적 처방액도 선두</a>
              </li>
              <li className="cont__bubble cont__bubble--white">
                <a href="#news-6">“비만 넘어 항암으로 혁신 확장”…한미, AACR서 차세대 신약
                  대거 공개</a>
              </li>
              <li className="cont__bubble cont__bubble--point">
                <a href="#news-7">한미 완전두유·케어미, 영양에 ‘맛’까지 인정…국제 우수 미각상
                  수상</a>
              </li>
            </ul>
            <p className="cont__notice">
              말풍선을 클릭해서 기사를 확인해 보세요.
            </p>
          </div>
          <img className="cont__molecule updown" src="./images/inno_dna2.png" alt="" aria-hidden="true" />
        </div>
      </div>
    </section>
    
  );
}
