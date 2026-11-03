import { useCallback, useEffect, useState } from 'react';
import CareerHeader from './components/CareerHeader.jsx';
import HeroSection from './components/HeroSection.jsx';
import {
  InnovationSection,
  JobsSection,
  MiraeSection,
  HistorySection,
} from './components/OriginalSections.jsx';
import {
  BenefitsSection,
  ExpositionSection,
  RequirementSection,
  ShortcutSection,
  TasksSection,
} from './components/RecruitmentSections.jsx';

function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.scroll-reveal');
    if (!('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('has-scroll-reveal');
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '-25% 0px -25% 0px' });

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);
}

function Footer() {
  return (
    <footer className="footer">
      <a href="#" aria-label="한미그룹 홈">
        <img className="footer__logo" src="./images/logo.svg" alt="한미그룹" />
      </a>
    </footer>
  );
}

export default function App() {
  const [historyExpanded, setHistoryExpanded] = useState(true);
  useScrollReveal();

  const scrollToNextSection = useCallback(() => {
    const visual = document.getElementById('mv');
    const nextSection = visual?.nextElementSibling;
    const top = nextSection
      ? nextSection.getBoundingClientRect().top + window.scrollY
      : visual?.offsetHeight ?? 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduceMotion ? 'instant' : 'smooth' });
  }, []);

  function toggleHistory() {
    const nextExpanded = !historyExpanded;
    setHistoryExpanded(nextExpanded);
    if (!nextExpanded) {
      const history = document.getElementById('history');
      history?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    }
  }

  return (
    <>
      <CareerHeader />
      <main>
        <HeroSection onScrollNext={scrollToNextSection} />
        <MiraeSection />
        <HistorySection expanded={historyExpanded} onToggle={toggleHistory} />
        <JobsSection />
        <InnovationSection />
        <BenefitsSection />
        <TasksSection />
        <RequirementSection />
        <ExpositionSection />
        <ShortcutSection />
      </main>
      <Footer />
    </>
  );
}
