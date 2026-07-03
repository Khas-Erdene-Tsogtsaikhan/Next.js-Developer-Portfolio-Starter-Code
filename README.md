# Khas-Erdene Tsogtsaikhan — Portfolio

Production portfolio for Khas-Erdene Tsogtsaikhan, a UC Berkeley EECS student and founder-engineer focused on AI systems, LLMOps, evaluation infrastructure, and zero-to-one products.

## Highlights

- Recruiter-focused project gallery with technical case studies
- KhasOS, a local assistant grounded in verified portfolio data
- AI systems and agent architecture visualizations
- Responsive motion with reduced-motion support
- Static Next.js pages with no paid model or chatbot API

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run build
```

GitHub Actions runs both checks on pushes and pull requests.

## Structure

- `src/components/ai/` — portfolio and KhasOS interface
- `src/data/resumePortfolio.js` — verified portfolio content
- `src/lib/khas-os.js` — local retrieval and response logic
- `src/pages/projects/[slug].js` — case-study routes
- `public/evidence/` — project evidence and screenshots

## Contact

- Email: `khaserdene_ts@berkeley.edu`
- LinkedIn: `https://www.linkedin.com/in/khas-erdene-tsogtsaikhan/`
- GitHub: `https://github.com/Khas-Erdene-Tsogtsaikhan`
