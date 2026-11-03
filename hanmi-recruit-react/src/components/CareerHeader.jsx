import { useEffect, useRef, useState } from 'react';

const links = [
  ['직무소개', '#tasks'],
  ['지원자격 및 접수방법', '#requirement'],
  ['채용설명회 일정', '#exposition'],
];

export default function CareerHeader() {
  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('top');

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let updatePending = false;

    function updateHeader() {
      if (updatePending) return;
      updatePending = true;
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (menuOpen) {
          setScrollDirection('visible');
        } else if (currentScrollY <= 0) {
          setScrollDirection('top');
        } else if (currentScrollY > previousScrollY + 4) {
          setScrollDirection('hidden');
        } else if (currentScrollY < previousScrollY - 4) {
          setScrollDirection('visible');
        }
        previousScrollY = currentScrollY;
        updatePending = false;
      });
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    const onResize = () => {
      if (window.innerWidth > 390) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', updateHeader);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle('is-menu-open', menuOpen);
    const header = headerRef.current;

    if (!menuOpen) return undefined;

    function closeOutside(event) {
      if (header && !header.contains(event.target)) setMenuOpen(false);
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('click', closeOutside);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.documentElement.classList.remove('is-menu-open');
      document.removeEventListener('click', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const headerClass = [
    'header',
    menuOpen && 'is-menu-open',
    scrollDirection === 'hidden' && 'is-hidden',
    (scrollDirection === 'visible' || menuOpen) && 'is-visible',
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClass} ref={headerRef}>
      <div className="header__inner">
        <a className="header__logo" href="#" aria-label="한미그룹 홈">
          <img src="./images/logo.svg" alt="Hanmi 한미그룹" />
        </a>
        <nav className="nav" id="site-nav" aria-label="주요 메뉴">
          <ul className="nav__list">
            {links.map(([label, href]) => (
              <li key={href}>
                <a className="nav__link" href={href} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn-apply" href="#requirement">
            <span>지원하기</span>
            <svg viewBox="0 0 7 12" fill="none" aria-hidden="true">
              <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </nav>
        <a className="btn-apply btn-apply--mo" href="#requirement">지원하기</a>
        <button
          className="btn-menu"
          type="button"
          aria-label={menuOpen ? '전체 메뉴 닫기' : '전체 메뉴 열기'}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 20 18" fill="none" aria-hidden="true">
            <g className="btn-menu__bars" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M1 2h18M1 9h18M1 16h18" />
            </g>
            <g className="btn-menu__close" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3 2l14 14M17 2L3 16" />
            </g>
          </svg>
        </button>
      </div>
    </header>
  );
}
