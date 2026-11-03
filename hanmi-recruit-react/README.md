# Hanmi Careers React

한미그룹 채용 페이지를 React와 Vite로 옮긴 JavaScript 프로젝트입니다. 원본 사이트 파일은 별도로 보존하며, 이 폴더에서 개발·빌드·배포를 진행합니다.

## Requirements

- Node.js 20.19+ 또는 Node.js LTS
- npm 10+

## Run locally

```powershell
npm ci
npm run dev
```

Vite prints the local development URL after startup. Save a source file to have the page update automatically.

## Validate and build for deployment

```powershell
npm run lint
npm run build
npm run preview
```

The production-ready site is written to `dist/`. Deploy the contents of that folder to a static web host.

## Project structure

```text
src/
  components/  React page sections, navigation, and Canvas player
  data/        Recruitment, benefits, schedule, and animation metadata
  App.jsx      Application layout and shared scroll behavior
  main.jsx     React entry point
public/
  css/         Original site styles
  data/        Original JSON files retained for reference
  images/      Site illustrations and photographs
  hanmi-eye-tracking/assets/
  hanmi-reading-eye-tracking/assets/
```

The original styles and artwork are retained. The nine main content sections, recruitment tabs and job details, campus schedule, countdown, responsive navigation, and both Canvas animations render from React components. Reduced-motion preferences are respected by the animated characters.
