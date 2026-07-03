import { resumePortfolio } from '../data/resumePortfolio.js'

export const KHAS_OS_PROMPTS = [
  'Why should we interview Khas?',
  'Show AI agent projects',
  'Summarize LLMOps experience',
  'Best project for backend role',
  'What has Khas shipped?',
  'Explain PrimitiveBench',
  'Compare Khas to other interns',
]

const stopWords = new Set(['a', 'about', 'and', 'are', 'erdene', 'for', 'how', 'i', 'in', 'is', 'khas', 'me', 'my', 'of', 'on', 'or', 'the', 'to', 'what', 'why', 'with'])
const expansions = {
  agent: ['agentic', 'langgraph', 'langchain', 'tool', 'orchestration'],
  agents: ['agentic', 'langgraph', 'langchain', 'tool', 'orchestration'],
  llmops: ['evaluation', 'eval', 'tracing', 'observability', 'deployment', 'structured'],
  rag: ['retrieval', 'vector', 'grounding', 'chroma'],
  vision: ['vlm', 'multimodal', 'image', 'recognition'],
  founder: ['startup', 'operator', 'revenue', 'funding', 'users'],
  hire: ['role', 'fit', 'engineering', 'operator', 'impact'],
}

function tokenize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+.$-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token))
}

function expandedTokens(query) {
  const tokens = tokenize(query)
  return [...new Set(tokens.flatMap((token) => [token, ...(expansions[token] || [])]))]
}

const projectDocuments = resumePortfolio.projects.map((project) => ({
  id: project.slug,
  title: project.title,
  href: `/projects/${project.slug}`,
  label: `${project.title} case study`,
  tags: [project.type, project.role, ...project.stack].join(' '),
  body: [project.description, project.problem, project.built, project.impact, project.learned].join(' '),
  excerpt: `${project.description} ${project.impact}`,
}))

const experienceDocuments = resumePortfolio.experience.map((item) => ({
  id: `${item.company}-${item.role}`,
  title: item.company,
  href: '/#experience',
  label: 'Experience timeline',
  tags: `${item.role} ${item.tech.join(' ')}`,
  body: item.detail,
  excerpt: `${item.role} at ${item.company}: ${item.detail}`,
}))

const skillDocuments = resumePortfolio.skills.map((group) => ({
  id: group.group,
  title: group.group,
  href: '/#skills',
  label: 'Technical stack',
  tags: group.items.join(' '),
  body: `${group.group}: ${group.items.join(', ')}`,
  excerpt: `${group.group}: ${group.items.join(', ')}.`,
}))

const profileDocuments = [
  {
    id: 'profile',
    title: 'Founder-engineer profile',
    href: '/#resume',
    label: 'Founder profile',
    tags: 'Berkeley EECS founder operator startup business AI systems LLMOps role fit',
    body: `${resumePortfolio.intro} Khas is a Berkeley EECS founder-engineer who has built businesses before tech, ships zero-to-one products, and connects model quality to users, distribution, revenue, and technical reliability.`,
    excerpt: 'Berkeley EECS founder-engineer specializing in agentic AI and LLMOps, with production product, startup, revenue, funding, and open-source experience.',
  },
  {
    id: 'proof',
    title: 'Operating proof',
    href: '/#projects',
    label: 'Selected work',
    tags: 'metrics users revenue stars students hackathon funding proof',
    body: '2,500+ NutrioMN users, $5K PrimitiveBench MRR, 100+ GitHub stars, 40,000+ students reached through CourseLynx, three hackathon wins across seven hackathons, and an angel-funded grant.',
    excerpt: 'Proof includes 2,500+ product users, $5K PrimitiveBench MRR, 100+ GitHub stars, 40,000+ students reached, and three hackathon wins.',
  },
]

const knowledgeBase = [...profileDocuments, ...projectDocuments, ...experienceDocuments, ...skillDocuments]

export function retrieveKhasKnowledge(query, limit = 3) {
  const tokens = expandedTokens(query)
  return knowledgeBase
    .map((document) => {
      const title = document.title.toLowerCase()
      const tags = document.tags.toLowerCase()
      const body = document.body.toLowerCase()
      const score = tokens.reduce((total, token) => total
        + (title.includes(token) ? 6 : 0)
        + (tags.includes(token) ? 3 : 0)
        + (body.includes(token) ? 1 : 0), 0)
      return { ...document, score }
    })
    .filter((document) => document.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

const sources = {
  profile: [{ label: 'Resume snapshot', href: '/#resume' }, { label: 'Experience', href: '/#experience' }],
  primitive: [{ label: 'PrimitiveBench', href: '/projects/primitivebench' }, { label: 'AI systems', href: '/#systems' }],
  nutrio: [{ label: 'NutrioMN', href: '/projects/nutriomn' }],
  comparison: [{ label: 'PM.ai', href: '/projects/pm-ai' }, { label: 'NeuronBook', href: '/projects/neuron-book' }],
  stack: [{ label: 'Technical stack', href: '/#skills' }, { label: 'Agent systems', href: '/#systems' }],
}

function isFollowUp(query) {
  return /^(and\b|but\b|go deeper|how\b|more detail|tell me more|what about|what stack|what was hard|why\b)/i.test(query.trim())
}

function projectFromContext(context) {
  const projectSource = context?.previousSources?.find((source) => source.href?.startsWith('/projects/'))
  if (!projectSource) return null
  const slug = projectSource.href.split('/').filter(Boolean).pop()
  return resumePortfolio.projects.find((project) => project.slug === slug) || null
}

function intentFor(query) {
  const value = query.toLowerCase()
  if (/^(hi|hey|hello|yo|sup|good morning|good afternoon|good evening)\b/.test(value)) return 'greeting'
  if (value.includes('how are you') || value.includes('how is it going')) return 'wellbeing'
  if (/\b(thanks|thank you|appreciate it)\b/.test(value)) return 'thanks'
  if (/\b(bye|goodbye|see you)\b/.test(value)) return 'goodbye'
  if (value.includes('what can you do') || value === 'help' || value.includes('how do i use')) return 'help'
  if (value.includes('who are you') || value.includes('are you an ai')) return 'identity'
  if (value.includes('available') || value.includes('open to work') || value.includes('looking for') || value.includes('internship') || value.includes('full-time') || value.includes('full time') || value.includes('role is he seeking')) return 'availability'
  if (value.includes('education') || value.includes('berkeley') || value.includes('degree') || value.includes('graduate')) return 'education'
  if (value.includes('where are you') || value.includes('location') || value.includes('based')) return 'location'
  if (value.includes('contact') || value.includes('email') || value.includes('linkedin') || value.includes('github')) return 'contact'
  if (value.includes('metric') || value.includes('numbers') || value.includes('traction') || value.includes('users') || value.includes('revenue')) return 'metrics'
  if (value.includes('all project') || value === 'projects' || value.includes('what have you built') || value.includes('what has khas shipped') || value.includes('show ai agent')) return 'projects'
  if (value.includes('business') || value.includes('startup') || value.includes('operator')) return 'operator'
  if (value.includes('hackathon')) return 'hackathons'
  if (value.includes('compare khas') || value.includes('other interns')) return 'differentiation'
  if (value.includes('compare') || (value.includes('pm.ai') && value.includes('neuron'))) return 'comparison'
  if (value.includes('why hire') || value.includes('why should we interview') || value.includes('role fit') || value.includes('fit for')) return 'hire'
  if (value.includes('interview')) return 'interview'
  if (value.includes('backend role')) return 'backend'
  if (value.includes('strongest') || value.includes('best project')) return 'strongest'
  if (value.includes('primitivebench')) return 'primitive'
  if (value.includes('nutrio')) return 'nutrio'
  if (value.includes('llmops') || value.includes('eval') || value.includes('reliab')) return 'llmops'
  if (value.includes('stack') || value.includes('technologies') || value.includes('skills')) return 'stack'
  if (value.includes('summary') || value.includes('recruiter') || value.includes('who is')) return 'summary'
  return 'retrieval'
}

export function answerKhasQuestion(query, context = {}) {
  const contextualProject = isFollowUp(query) ? projectFromContext(context) : null
  if (contextualProject) {
    const value = query.toLowerCase()
    if (value.includes('stack') || value.includes('technolog')) return {
      text: `For ${contextualProject.title}, I used ${contextualProject.stack.join(', ')}. The important part was how those pieces worked together: ${contextualProject.built}`,
      sources: [{ label: `${contextualProject.title} case study`, href: `/projects/${contextualProject.slug}` }],
    }
    if (value.includes('hard') || value.includes('challenge') || value.includes('learn')) return {
      text: `The core challenge behind ${contextualProject.title} was this: ${contextualProject.problem} The durable lesson was: ${contextualProject.learned}`,
      sources: [{ label: `${contextualProject.title} case study`, href: `/projects/${contextualProject.slug}` }],
    }
    return {
      text: `Here’s the deeper version of ${contextualProject.title}: ${contextualProject.built} ${contextualProject.impact}`,
      sources: [{ label: `${contextualProject.title} case study`, href: `/projects/${contextualProject.slug}` }],
    }
  }

  const contextualQuery = isFollowUp(query) && context.previousQuestion ? `${context.previousQuestion} ${query}` : query
  const intent = intentFor(contextualQuery)

  if (intent === 'greeting') return {
    text: 'Hey—good to meet you. I’m KhasOS, the local portfolio agent for Khas-Erdene. I can give you a quick recruiter summary, unpack a project, explain my LLMOps work, compare systems, or assess role fit. What are you curious about?',
    sources: [],
  }
  if (intent === 'wellbeing') return {
    text: 'Running locally, fully grounded, and not spending a cent on API calls—so I’m doing pretty well. More usefully: I’m ready to answer anything supported by the portfolio.',
    sources: [],
  }
  if (intent === 'thanks') return {
    text: 'Anytime. If you’re evaluating fit, the most revealing next questions are usually about PrimitiveBench, how I engineer reliable agents, or what I owned beyond the code.',
    sources: [{ label: 'Selected work', href: '/#projects' }],
  }
  if (intent === 'goodbye') return {
    text: 'Thanks for stopping by. The case studies and GitHub are the best places to verify the work—hope we get to build something ambitious together.',
    sources: [{ label: 'GitHub', href: resumePortfolio.github }, { label: 'Case studies', href: '/#projects' }],
  }
  if (intent === 'help') return {
    text: 'You can ask me naturally about projects, architecture, AI agents, LLMOps, RAG, evaluation, technical stack, startup experience, traction, education, availability, or role fit. I can also handle follow-ups like “tell me more,” “what stack did you use?” and “what was hard?”',
    sources: [{ label: 'Portfolio knowledge base', href: '/#projects' }],
  }
  if (intent === 'identity') return {
    text: 'I’m KhasOS: a local, source-grounded portfolio assistant for Khas-Erdene. I run entirely in the browser, route questions to verified portfolio context, rank relevant sources, and return grounded answers without an external model or API.',
    sources: [{ label: 'AI systems', href: '/#systems' }],
  }
  if (intent === 'availability') return {
    text: 'I’m seeking AI systems, LLMOps, applied AI, backend, and startup engineering roles. Before graduating, I’m open to internships and high-ownership part-time opportunities; full-time roles should align with my expected Fall 2027 graduation timeline.',
    sources: [{ label: 'Contact and role fit', href: '/#contact' }, { label: 'Experience', href: '/#experience' }],
  }
  if (intent === 'education') return {
    text: 'I’m studying Electrical Engineering and Computer Science at UC Berkeley, with an expected graduation in Fall 2027. My coursework includes data structures, machine learning and AI systems, probability, computer systems, and software engineering.',
    sources: [{ label: 'Career profile', href: '/#resume' }],
  }
  if (intent === 'location') return {
    text: 'I’m based in Berkeley, California, with strong roots in Ulaanbaatar, Mongolia. That cross-market perspective shows up most directly in NutrioMN, which I built specifically around Mongolian food, language, and payment realities.',
    sources: [{ label: 'NutrioMN', href: '/projects/nutriomn' }, { label: 'Resume snapshot', href: '/#resume' }],
  }
  if (intent === 'contact') return {
    text: `You can contact me at ${resumePortfolio.email}, connect on LinkedIn, or review my GitHub. The contact section keeps all three verified links together.`,
    sources: [{ label: 'Email Khas', href: `mailto:${resumePortfolio.email}` }, { label: 'LinkedIn', href: resumePortfolio.linkedin }, { label: 'GitHub', href: resumePortfolio.github }],
  }
  if (intent === 'metrics') return {
    text: 'The headline proof points are 2,500+ NutrioMN users, $5K PrimitiveBench MRR, 100+ GitHub stars, 40,000+ students reached through CourseLynx, a 300+ person NutrioMN waitlist, and three wins across seven hackathons.',
    sources: [{ label: 'Selected outcomes', href: '/#home' }, { label: 'Selected work', href: '/#projects' }],
  }
  if (intent === 'projects') return {
    text: 'I’ve shipped PrimitiveBench, NutrioMN, CourseLynx systems, Curio AI infrastructure, NeuronBook, PM.ai, VAULT Collection OS, and a Google Ads Transparency Monitor. The clearest agent projects are CourseLynx, Curio AI, NeuronBook, and PM.ai; PrimitiveBench is the strongest evaluation-infrastructure proof.',
    sources: [{ label: 'All case studies', href: '/#projects' }],
  }
  if (intent === 'operator') return {
    text: 'I approach engineering like an operator: start with a painful problem, ship the smallest credible product, get it in front of users, and connect what works to distribution or revenue. I ran three businesses before tech, have led interns, raised angel funding, pitched to founders and investors, and built both consumer products and technical infrastructure.',
    sources: sources.profile,
  }
  if (intent === 'hackathons') return {
    text: 'I’ve participated in seven hackathons and won three. The important signal is repeated execution under pressure: NeuronBook demonstrates grounded Socratic learning from PDFs, while PM.ai demonstrates multi-agent planning and structured project state.',
    sources: sources.comparison,
  }

  if (intent === 'summary') return {
    text: 'I’m a Berkeley EECS founder-engineer specializing in agentic AI and LLMOps. I’ve built vendor-neutral evaluation infrastructure, multimodal consumer AI, retrieval agents, and full-stack products—and I pair that technical depth with an operator mindset: 2,500+ users, $5K PrimitiveBench MRR, 100+ GitHub stars, an angel-funded product, and experience shipping inside early-stage teams.',
    sources: sources.profile,
  }
  if (intent === 'strongest') return {
    text: 'PrimitiveBench is my strongest LLMOps signal. I co-founded the vendor-neutral evaluation layer, designed its dataset → adapter → scorer → result-schema architecture, added statistical separability and held-out evaluation controls, reached 100+ GitHub stars, converted evaluation work into $5K MRR, and established CalCompute partnership proof. NutrioMN is the complementary founder signal because it shows I can turn AI into a funded product with 2,500+ users.',
    sources: [...sources.primitive, ...sources.nutrio],
  }
  if (intent === 'primitive') return {
    text: 'PrimitiveBench is vendor-neutral evaluation infrastructure for the primitives behind AI systems, including search, extraction, reranking, retrieval, OCR, vector databases, and memory. I designed a modular dataset → adapter → scorer → result-schema pipeline with reproducible runs, held-out evaluation, confidence intervals, and slice-level reporting. It reached 100+ GitHub stars, generated $5K MRR from early evaluation customers, and earned CalCompute partnership proof.',
    sources: sources.primitive,
  }
  if (intent === 'llmops') return {
    text: 'My clearest LLMOps proof is PrimitiveBench: golden datasets, reproducible adapters, statistical scoring, slice-level leaderboards, held-out answers, and MCP-accessible benchmark results. Across other projects, I also use JSON Schema validation, deterministic fallbacks, tool-call boundaries, RAG grounding, LangGraph orchestration, CI/CD eval gates, and tracing-oriented system design. My specialty is making probabilistic model behavior measurable enough to ship.',
    sources: sources.primitive,
  }
  if (intent === 'nutrio') return {
    text: 'NutrioMN is my Mongolian-first multimodal nutrition product. I built the React Native app around a fine-tuned vision-language model trained on 400 labeled Mongolian food images, routed inference through Supabase Edge Functions, validated calorie and macro outputs into structured product state, and added local-food matching plus manual fallbacks. It reached 2,500+ users, went through 8+ TestFlight iterations, built a 300+ person waitlist, and received an angel-funded grant.',
    sources: sources.nutrio,
  }
  if (intent === 'comparison') return {
    text: 'PM.ai is an agent-orchestration project: it converts unstructured briefs into validated roles, tasks, subtasks, and Supabase-backed execution state through planner and specialist-agent stages. NeuronBook is an AI learning system: it grounds Socratic questioning in page-level PDF context, persists concept memory, and visualizes knowledge decay through Neural Trace. PM.ai demonstrates multi-agent decomposition and structured outputs; NeuronBook demonstrates grounded RAG, stateful learning memory, and human-centered AI interaction.',
    sources: sources.comparison,
  }
  if (intent === 'hire') return {
    text: 'I’m strongest when a role needs both AI-systems depth and zero-to-one ownership. I can design an eval harness, retrieval or tool-calling workflow, structured output contract, backend, and polished product surface—then talk to users, lead a small team, pitch, iterate, and connect engineering decisions to distribution or revenue. My best fit is an AI agent, LLMOps, applied AI, or founder-engineer role where reliability matters as much as demo velocity.',
    sources: sources.profile,
  }
  if (intent === 'backend') return {
    text: 'PrimitiveBench is the strongest backend-role case study because it demonstrates modular Python evaluation infrastructure, reproducible run contracts, scorer and statistics layers, result schemas, and an MCP query surface. CourseLynx adds production API, ingestion, validation, and test coverage; NutrioMN adds edge inference and persistent product state.',
    sources: [{ label: 'PrimitiveBench', href: '/projects/primitivebench' }, { label: 'CourseLynx', href: '/projects/courselynx' }, { label: 'NutrioMN', href: '/projects/nutriomn' }],
  }
  if (intent === 'differentiation') return {
    text: 'Compared with a typical internship profile, my differentiator is ownership breadth backed by evidence. I’ve contributed inside startups, but I’ve also co-founded evaluation infrastructure, built a funded consumer AI product to 2,500+ users, led interns, earned revenue, shipped open source, and repeatedly turned model behavior into reliable product state. That makes me useful beyond a narrow ticket queue.',
    sources: sources.profile,
  }
  if (intent === 'interview') return {
    text: 'Good interview questions: 1) How did you prevent PrimitiveBench from producing misleading “one winner” rankings? 2) How would you design an eval gate for a tool-using RAG agent? 3) What failed during NutrioMN’s vision and localization loop? 4) Why did PM.ai need multiple agent stages instead of one prompt? 5) How did CourseLynx separate flexible reasoning from trusted course facts? 6) What would you instrument with OpenTelemetry in a production agent?',
    sources: [{ label: 'Case studies', href: '/#projects' }, { label: 'AI systems', href: '/#systems' }],
  }
  if (intent === 'stack') return {
    text: 'Core AI/LLMOps: Python, LangChain, LangGraph, RAG, vector search, fine-tuned VLMs, JSON Schema, structured outputs, agent orchestration, OpenAI APIs, evaluation harnesses, and OpenTelemetry. Product stack: TypeScript, JavaScript, React, Next.js, React Native, FastAPI, Node.js, Supabase, Firebase, Postgres, Redis, Chroma, Docker, GitHub Actions, REST APIs, analytics, and CI/CD.',
    sources: sources.stack,
  }

  const matches = retrieveKhasKnowledge(contextualQuery)
  if (!matches.length) return {
    text: 'I could not find a confident match in the portfolio knowledge base. Try asking about a named project, AI agents, LLMOps, technical stack, startup experience, metrics, or role fit.',
    sources: [{ label: 'Browse selected work', href: '/#projects' }],
    lowConfidence: true,
  }

  return {
    text: `The closest evidence in my portfolio is ${matches.map((match) => match.title).join(' and ')}. ${matches.map((match) => match.excerpt).join(' ')}`,
    sources: matches.map((match) => ({ label: match.label, href: match.href })),
  }
}
