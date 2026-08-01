import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  BookOpenCheck,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  Clock3,
  Eye,
  FileCheck2,
  FileSearch,
  Filter,
  Gauge,
  History,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  WandSparkles,
  X,
} from 'lucide-react';

type Article = {
  id: string;
  url: string;
  title: string;
  status: string;
  leadGoal: string;
  productCategory: string;
  productSubcategory: string;
  audienceMarket: string;
  searchIntent: string;
  primaryQuery: string;
  topicKey: string;
  contentType: string;
  qualityScore: number | null;
  reviewers: string[];
  lastVerified: string;
  primaryCTA: string;
  evidenceCount: number;
  auditCount: number;
  topicCount: number;
  language: string;
  date: string;
  slug: string;
  createdTime: string;
  lastEditedTime: string;
};

type Topic = {
  id: string;
  url: string;
  title: string;
  status: string;
  leadGoal: string;
  productCategory: string;
  productSubcategory: string;
  audienceMarket: string;
  searchIntent: string;
  primaryQuery: string;
  topicKey: string;
  coreAngle: string;
  candidateScore: number | null;
  duplicateDecision: string;
  duplicateNotes: string;
  week: string;
  createdTime: string;
  lastEditedTime: string;
};

type Evidence = {
  id: string;
  url: string;
  claim: string;
  status: string;
  sourceTier: string;
  sourceType: string;
  sourceUrl: string;
  publisher: string;
  market: string;
  summary: string;
  accessedDate: string;
  publishedDate: string;
  expires: string;
  verifiedBy: string[];
  articleCount: number;
  topicCount: number;
  createdTime: string;
  lastEditedTime: string;
};

type Audit = {
  id: string;
  url: string;
  title: string;
  stage: string;
  result: string;
  score: number | null;
  reviewers: string[];
  findings: string;
  blockers: string;
  runDate: string;
  modelVersion: string;
  articleCount: number;
  articleIds: string[];
  topicCount: number;
  evidenceCount: number;
  createdTime: string;
  lastEditedTime: string;
};

type ContentOpsData = {
  generatedAt: string;
  links: Record<'insights' | 'topics' | 'evidence' | 'audits' | 'runbook', string>;
  articles: Article[];
  topics: Topic[];
  evidence: Evidence[];
  audits: Audit[];
};

type ArticlePreview = {
  article: Article;
  summary: string;
  coverUrl: string;
  html: string;
  wordCount: number;
  readMinutes: number;
  eligibility: {
    canPublish: boolean;
    blockers: string[];
  };
};

type CandidatePreview = {
  title: string;
  leadGoal: string;
  productCategory: string;
  productSubcategory: string;
  audienceMarket: string;
  searchIntent: string;
  primaryQuery: string;
  coreAngle: string;
  contentType: string;
  candidateScore: number;
  evidencePlan: string;
  citationAsset: string;
  primaryCTA: string;
  topicKey: string;
  duplicateDecision: string;
  duplicateNotes: string;
  matchedRecord: { id: string; title: string; kind: string } | null;
  whyNow?: string;
  signalClass?: string;
  signalUrls?: string[];
};

type WorkflowStatus = {
  generatedAt: string;
  automationMaxStatus: string;
  writeNotice: string;
  capabilities: {
    candidateMode: string;
    canPersistTemplateCandidates: boolean;
    modelConnected: boolean;
    modelNotice: string;
  };
  queue: {
    candidateCount: number;
    selectedTopics: Topic[];
    articlesAwaitingHuman: Article[];
  };
};

type ArticleBrief = {
  article: Article;
  brief: {
    researchChecklist: string[];
    draftOutline: string[];
    requiredEvidence: Array<{ claim: string; tier: string; url: string; expires: string; status: string }>;
    imageBriefs: Array<{ placement: string; minimum?: string; count?: string; requirement: string }>;
    publishGate: string[];
  };
  automationMaxStatus: string;
};

type TabKey = 'overview' | 'generator' | 'articles' | 'topics' | 'evidence' | 'audits';
type GovernanceFilter = 'All' | 'Governed' | 'Review Pending' | 'Metadata Pending';
type UserDecision = 'pass' | 'changes' | 'continue';

const PIPELINE = [
  'Idea',
  'Duplicate Check',
  'Researching',
  'Evidence Ready',
  'Drafting',
  'Editorial Review',
  'Domain Review',
  'Approved',
  'Scheduled',
  'Published',
] as const;

const tabItems: Array<{ key: TabKey; label: string; icon: typeof Gauge }> = [
  { key: 'overview', label: '控制台', icon: Gauge },
  { key: 'generator', label: '文章生成器', icon: WandSparkles },
  { key: 'articles', label: '文章流转', icon: FileCheck2 },
  { key: 'topics', label: '选题与查重', icon: ListChecks },
  { key: 'evidence', label: '证据账本', icon: FileSearch },
  { key: 'audits', label: '审计记录', icon: History },
];

const statusLabels: Record<string, string> = {
  Idea: '选题想法',
  'Duplicate Check': '查重中',
  Researching: '搜集资料',
  'Evidence Ready': '证据就绪',
  Drafting: '写作中',
  Draft: '草稿',
  'Editorial Review': '编辑审核',
  'Domain Review': '专业审核',
  Approved: '已批准',
  Scheduled: '已排期',
  Published: '已发布',
  'Refresh Needed': '需要更新',
  Archived: '已归档',
  Candidate: '候选',
  Selected: '已选中',
  Rejected: '已拒绝',
  Merge: '合并处理',
  'Update Existing': '更新旧文',
  Clear: '无重复',
  'Needs Review': '需要人工查重',
  Verified: '已核验',
  Unverified: '未核验',
  Expired: '已过期',
  Pass: '通过',
  Fail: '未通过',
  Blocked: '受阻',
  'Needs Changes': '需要修改',
};

const decisionLabels: Record<UserDecision, { label: string; detail: string; tone: string }> = {
  pass: {
    label: '通过',
    detail: '本阶段已经完成，无需处理',
    tone: 'border-emerald-700 bg-emerald-700 text-white',
  },
  changes: {
    label: '需要修改',
    detail: '存在阻断项，处理后再继续',
    tone: 'border-amber-700 bg-amber-50 text-amber-950',
  },
  continue: {
    label: '可以继续',
    detail: '当前条件允许进入下一阶段',
    tone: 'border-[#0b4f8a] bg-sky-50 text-[#0b4f8a]',
  },
};

const tabGuidance: Record<TabKey, { purpose: string; focus: string; action: string }> = {
  overview: {
    purpose: '看本周整体进度、待处理问题和三类文章配比。',
    focus: '先处理黄色的“需要修改”，再处理蓝色的“可以继续”。',
    action: '从待处理审计或等待人工判断的文章开始。',
  },
  generator: {
    purpose: '按六个步骤完成本周选题、研究、写作、预览和人工发布。',
    focus: '系统先隐藏重复候选并标出近期信号；信号只用于发现角度，专业事实、审核和 Published 必须由你确认。',
    action: '从当前最靠前、且标记为“可以继续”的步骤开始。',
  },
  articles: {
    purpose: '这里只放真正的文章，显示它从想法到发布走到了哪一步。',
    focus: '查看治理进度、缺失字段、证据数量、Reviewer 和网站预览。',
    action: '打开“网站预览”，确认内容后才能一键 Published。',
  },
  topics: {
    purpose: '每一行是选题身份证和查重决定，不是第二篇文章。',
    focus: '评分至少 75，且查重决定允许创建、更新或合并。',
    action: 'Selected 才进入研究；Rejected 保留记录但不会写文章。',
  },
  evidence: {
    purpose: '每一行只支持一个重要论点，记录来源等级、市场和有效期。',
    focus: '优先检查未核验、即将过期、Tier C 或没有人工核验者的证据。',
    action: '证据不足时不能把文章推进到专业审核。',
  },
  audits: {
    purpose: '每一行是一次质量检查记录，不是文章，也不会直接显示在网站。',
    focus: 'Findings 是发现；Blockers 是必须解决的问题；Score 是当次审核分。',
    action: 'Pass 无需处理；Needs Changes 或 Blocked 要按阻断说明修复。',
  },
};

const generatorSteps = [
  { step: '01', title: '生成候选', owner: '自动化', body: '每周提出 8–12 个未重复候选，显示“为什么现在”；可换一批。' },
  { step: '02', title: '选择三篇', owner: '你确认', body: '选择货运、商厨、户外各一篇，低于 75 分不进入研究。' },
  { step: '03', title: '搜集证据', owner: '自动化 + 研究员', body: '创建研究请求，并把每个重要论点分别写入证据账本。' },
  { step: '04', title: '生成文章', owner: '自动化 + 研究员', body: '按 Brief 完成结构、正文、来源、图片方案和 CTA；未连接可信模型时不会伪造正文。' },
  { step: '05', title: '网站预览', owner: '你审核', body: '检查标题、格式、图片、专业事实和承接路径。' },
  { step: '06', title: '一键发布', owner: '你确认', body: '写入人工审核记录，将 Notion 改为 Published；网站每日 21:00 自动同步。' },
];

const glossary = [
  ['Primary Query', '用户最可能搜索的核心问题。'],
  ['Topic Key', '选题唯一指纹，用来阻止重复文章。'],
  ['Lead Goal', '文章服务于货运询价还是产品采购询价。'],
  ['Audience Market', '文章适用的国家或地区。'],
  ['Search Intent', '读者想看新闻、指南、比较、法规还是案例。'],
  ['Evidence A / B / C', 'A 为官方或一手来源；B 为权威行业来源；C 只能辅助发现线索。'],
  ['Reviewer', '完成专业审核并对发布负责的人。'],
  ['Last Verified', '资料最后一次核验日期，不等于文章发布日期。'],
  ['Quality Score', '事实、原创性、可读性、引用、转化和图片 SEO 的综合分。'],
  ['Primary CTA', '文章最终引导读者提交的货运或采购需求。'],
  ['Canonical Article', '重复或归档文章应该永久跳转到的权威文章。'],
];

const statusTone: Record<string, string> = {
  Idea: 'bg-slate-100 text-slate-700 border-slate-200',
  'Duplicate Check': 'bg-amber-50 text-amber-800 border-amber-200',
  Researching: 'bg-sky-50 text-sky-800 border-sky-200',
  'Evidence Ready': 'bg-cyan-50 text-cyan-800 border-cyan-200',
  Drafting: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Editorial Review': 'bg-violet-50 text-violet-800 border-violet-200',
  'Domain Review': 'bg-orange-50 text-orange-800 border-orange-200',
  Approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Scheduled: 'bg-lime-50 text-lime-800 border-lime-200',
  Published: 'bg-green-50 text-green-800 border-green-200',
  'Refresh Needed': 'bg-rose-50 text-rose-800 border-rose-200',
  Archived: 'bg-slate-100 text-slate-500 border-slate-200',
  Candidate: 'bg-slate-100 text-slate-700 border-slate-200',
  Selected: 'bg-sky-50 text-sky-800 border-sky-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  Merge: 'bg-amber-50 text-amber-800 border-amber-200',
  'Update Existing': 'bg-violet-50 text-violet-800 border-violet-200',
  Clear: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Needs Review': 'bg-amber-50 text-amber-800 border-amber-200',
  Verified: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Unverified: 'bg-amber-50 text-amber-800 border-amber-200',
  Expired: 'bg-rose-50 text-rose-800 border-rose-200',
  Pass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Fail: 'bg-rose-50 text-rose-800 border-rose-200',
  Blocked: 'bg-red-50 text-red-800 border-red-200',
  'Needs Changes': 'bg-amber-50 text-amber-800 border-amber-200',
};

const formatTime = (value: string) =>
  value
    ? new Intl.DateTimeFormat('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(value))
    : '—';

const formatDate = (value: string) =>
  value
    ? new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(value))
    : '未设置';

const daysUntil = (value: string) => {
  if (!value) return null;
  return Math.ceil((new Date(value).getTime() - Date.now()) / 86_400_000);
};

const metadataGaps = (article: Article) => [
  !article.leadGoal && 'Lead Goal',
  !article.productCategory && 'Product Category',
  !article.audienceMarket && 'Audience Market',
  !article.searchIntent && 'Search Intent',
  !article.primaryQuery && 'Primary Query',
  !article.topicKey && 'Topic Key',
  !article.contentType && 'Content Type',
  !article.primaryCTA && 'Primary CTA',
  !article.slug && 'slug',
].filter(Boolean) as string[];

const reviewerLabel = (article: Article) =>
  article.status === 'Archived'
    ? '不适用（已归档）'
    : article.reviewers.length
    ? article.reviewers.join(', ')
    : '缺少人工 Reviewer';

const reviewGaps = (article: Article) => [
  article.evidenceCount < 2 && '至少 2 条证据',
  article.topicCount < 1 && 'Topic 关联',
  ['Domain Review', 'Approved', 'Scheduled', 'Published'].includes(article.status) &&
    !article.reviewers.length &&
    '人工 Reviewer',
  !article.lastVerified && 'Last Verified',
  (article.qualityScore ?? 0) < 85 && 'Quality ≥ 85',
  article.auditCount < 1 && 'Audit History',
].filter(Boolean) as string[];

const governanceState = (article: Article) => {
  if (article.status === 'Archived') {
    return { metadata: [], review: [], all: [], percent: 100, archived: true };
  }
  const metadata = metadataGaps(article);
  const review = reviewGaps(article);
  return {
    metadata,
    review,
    all: [...metadata, ...review],
    percent: Math.round(((15 - metadata.length - review.length) / 15) * 100),
    archived: false,
  };
};

const articleDecision = (article: Article): { state: UserDecision; reason: string } => {
  const governance = governanceState(article);
  if (article.status === 'Archived') {
    return { state: 'pass', reason: '旧文已归档并完成权威文章承接' };
  }
  if (governance.all.length) {
    return { state: 'changes', reason: `缺少：${governance.all.slice(0, 2).join('、')}${governance.all.length > 2 ? '等' : ''}` };
  }
  if (article.status === 'Published') return { state: 'pass', reason: '文章已通过人工审核并发布' };
  if (article.status === 'Domain Review') return { state: 'continue', reason: '请完成人工专业确认和网站预览' };
  return { state: 'continue', reason: `当前阶段：${statusLabels[article.status] || article.status}` };
};

const topicDecision = (topic: Topic): { state: UserDecision; reason: string } => {
  if (topic.status === 'Published') return { state: 'pass', reason: '该选题已形成正式文章' };
  if (['Rejected', 'Merge'].includes(topic.status)) {
    return { state: 'pass', reason: topic.status === 'Rejected' ? '决定已记录：不采用' : '决定已记录：合并到已有文章' };
  }
  if ((topic.candidateScore ?? 0) < 75) return { state: 'changes', reason: '评分低于 75，不能进入研究' };
  if (!topic.topicKey || !topic.duplicateDecision) return { state: 'changes', reason: '查重或 Topic Key 尚未完成' };
  if (topic.status === 'Selected') return { state: 'continue', reason: '已入选，可以启动研究和起草' };
  if (topic.duplicateDecision === 'Update Existing') return { state: 'continue', reason: '应更新已有文章，不新建重复内容' };
  return { state: 'continue', reason: '候选合格，等待本周选择' };
};

const evidenceDecision = (item: Evidence): { state: UserDecision; reason: string } => {
  const days = daysUntil(item.expires);
  if (
    item.status === 'Expired' ||
    item.status === 'Unverified' ||
    !item.sourceTier ||
    !item.sourceUrl ||
    !item.market ||
    !item.verifiedBy.length
  ) {
    return { state: 'changes', reason: item.status === 'Expired' ? '证据已过期，需要重新核验' : '来源、市场或人工核验者信息不完整' };
  }
  if (days !== null && days <= 30) return { state: 'continue', reason: `仍可使用，但需在 ${Math.max(0, days)} 天内复核` };
  return { state: 'pass', reason: '来源、适用市场和有效期均已记录' };
};

const auditDecision = (audit: Audit): { state: UserDecision; reason: string } =>
  audit.result === 'Pass'
    ? { state: 'pass', reason: '本次检查已经完成' }
    : {
        state: 'changes',
        reason:
          audit.result === 'Blocked'
            ? '缺少外部条件，暂时无法完成'
            : audit.result === 'Fail'
              ? '检查未通过，不能继续'
              : '按阻断说明修改后重新检查',
      };

const isLocalHostname = () =>
  ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

function Pill({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-black tracking-wide ${
        statusTone[value] || 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      {statusLabels[value] || value || '未设置'}
    </span>
  );
}

function DecisionBadge({ state, reason, compact = false }: { state: UserDecision; reason: string; compact?: boolean }) {
  const config = decisionLabels[state];
  return (
    <div className={compact ? 'max-w-[240px]' : ''}>
      <span className={`inline-flex items-center border px-2.5 py-1 text-[11px] font-black ${config.tone}`}>
        {config.label}
      </span>
      <p className="mt-1.5 text-xs leading-5 text-slate-600">{reason}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border-y border-dashed border-slate-300 py-14 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-bold text-[#0b4f8a] hover:text-amber-700"
    >
      {children}<ArrowUpRight className="h-3.5 w-3.5" />
    </a>
  );
}

export default function ContentOpsDashboard() {
  const [data, setData] = useState<ContentOpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [governanceFilter, setGovernanceFilter] = useState<GovernanceFilter>('All');
  const [preview, setPreview] = useState<ArticlePreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(true);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus | null>(null);
  const [candidatePreview, setCandidatePreview] = useState<CandidatePreview[]>([]);
  const [candidateWarning, setCandidateWarning] = useState('');
  const [candidateBatch, setCandidateBatch] = useState(0);
  const [candidateHasMore, setCandidateHasMore] = useState(true);
  const [acknowledgeTemplates, setAcknowledgeTemplates] = useState(false);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Record<string, string>>({});
  const [workflowLoading, setWorkflowLoading] = useState('');
  const [workflowMessage, setWorkflowMessage] = useState('');
  const [workflowError, setWorkflowError] = useState('');
  const [articleActionFeedback, setArticleActionFeedback] = useState<Record<string, { tone: 'error' | 'success'; message: string }>>({});
  const [brief, setBrief] = useState<ArticleBrief | null>(null);

  const loadData = useCallback(async (force = false) => {
    setError('');
    force ? setRefreshing(true) : setLoading(true);
    try {
      const response = await fetch(`/api/content-ops${force ? '?refresh=1' : ''}`, {
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || '无法读取内容运营数据');
      setData(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '无法读取内容运营数据');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadWorkflowStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/content-ops/workflow/status', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || '无法读取生成器状态');
      setWorkflowStatus(payload);
    } catch (workflowLoadError) {
      setWorkflowError(workflowLoadError instanceof Error ? workflowLoadError.message : '无法读取生成器状态');
    }
  }, []);

  const runWorkflowAction = useCallback(async <T,>(
    key: string,
    path: string,
    body: Record<string, unknown> = {},
    onError?: (message: string) => void,
  ): Promise<T | null> => {
    setWorkflowLoading(key);
    setWorkflowError('');
    setWorkflowMessage('');
    try {
      const response = await fetch(`/api/content-ops${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || '操作未完成');
      return payload as T;
    } catch (workflowActionError) {
      const message = workflowActionError instanceof Error ? workflowActionError.message : '操作未完成';
      setWorkflowError(message);
      onError?.(message);
      return null;
    } finally {
      setWorkflowLoading('');
    }
  }, []);

  const previewCandidates = useCallback(async () => {
    const payload = await runWorkflowAction<{
      warning: string;
      candidates: CandidatePreview[];
      batch: number;
      nextBatch: number | null;
      availableCount: number;
      rejectedCount: number;
    }>('candidate-preview', '/workflow/candidates', { batch: candidateBatch });
    if (!payload) return;
    setCandidatePreview(payload.candidates);
    setCandidateWarning(payload.warning);
    setCandidateBatch(payload.nextBatch ?? payload.batch);
    setCandidateHasMore(payload.nextBatch !== null);
    setAcknowledgeTemplates(false);
    setWorkflowMessage(payload.candidates.length
      ? `已显示 ${payload.candidates.length} 个未被精确查重拦截的候选；另有 ${payload.rejectedCount} 个已存在模板自动隐藏。尚未写入 Notion。`
      : payload.warning);
  }, [candidateBatch, runWorkflowAction]);

  const persistCandidates = useCallback(async () => {
    if (!acknowledgeTemplates) {
      setWorkflowError('请先勾选确认：这些只是未研究模板，不能作为已核验事实或直接发布内容。');
      return;
    }
    const payload = await runWorkflowAction<{ warning: string; created: Array<{ title: string }> }>(
      'candidate-persist',
      '/workflow/candidates',
      {
        persist: true,
        acknowledgeTemplateCandidates: true,
        candidateTopicKeys: candidatePreview.map((candidate) => candidate.topicKey),
      },
    );
    if (!payload) return;
    setWorkflowMessage(`${payload.created.length} 个候选及其查重审计已保存。下一步请选择三类各一篇。`);
    setCandidatePreview([]);
    setCandidateBatch(0);
    setCandidateHasMore(true);
    await Promise.all([loadData(true), loadWorkflowStatus()]);
  }, [acknowledgeTemplates, candidatePreview, loadData, loadWorkflowStatus, runWorkflowAction]);

  const selectWeeklyCandidates = useCallback(async () => {
    const topicIds = ['Freight Export', 'Commercial Kitchen Equipment', 'Outdoor Products']
      .map((category) => selectedCandidateIds[category])
      .filter(Boolean);
    if (topicIds.length !== 3) {
      setWorkflowError('请选择货运、商用餐厨设备、户外用品各 1 篇。');
      return;
    }
    const payload = await runWorkflowAction<{ selected: Topic[]; nextAction: string }>(
      'weekly-select',
      '/workflow/select',
      { topicIds },
    );
    if (!payload) return;
    setWorkflowMessage(`已选中 ${payload.selected.length} 篇。${payload.nextAction}`);
    setSelectedCandidateIds({});
    await Promise.all([loadData(true), loadWorkflowStatus()]);
  }, [loadData, loadWorkflowStatus, runWorkflowAction, selectedCandidateIds]);

  const prepareTopic = useCallback(async (topic: Topic) => {
    const payload = await runWorkflowAction<{ request: { instructions: string }; reusedExistingArticle?: boolean }>(
      `prepare-${topic.id}`,
      `/workflow/topic/${topic.id}/prepare`,
    );
    if (!payload) return;
    setWorkflowMessage(payload.reusedExistingArticle ? '该选题已有文章，已保留原文章并提示继续研究。' : payload.request.instructions);
    await Promise.all([loadData(true), loadWorkflowStatus()]);
  }, [loadData, loadWorkflowStatus, runWorkflowAction]);

  const advanceArticle = useCallback(async (article: Article, action: string) => {
    if (article.evidenceCount < 2) {
      const message = `当前只有 ${article.evidenceCount}/2 条关联证据。请先在 Evidence Ledger 为本文补齐并关联至少 ${2 - article.evidenceCount} 条，再刷新证据数量。`;
      setArticleActionFeedback((current) => ({ ...current, [article.id]: { tone: 'error', message } }));
      setWorkflowError(message);
      return;
    }
    setArticleActionFeedback((current) => {
      const next = { ...current };
      delete next[article.id];
      return next;
    });
    const payload = await runWorkflowAction<{ request: { instructions: string } }>(
      `advance-${article.id}`,
      `/workflow/article/${article.id}/advance`,
      { action },
      (message) => setArticleActionFeedback((current) => ({ ...current, [article.id]: { tone: 'error', message } })),
    );
    if (!payload) return;
    setArticleActionFeedback((current) => ({
      ...current,
      [article.id]: { tone: 'success', message: payload.request.instructions },
    }));
    setWorkflowMessage(payload.request.instructions);
    await Promise.all([loadData(true), loadWorkflowStatus()]);
  }, [loadData, loadWorkflowStatus, runWorkflowAction]);

  const loadBrief = useCallback(async (article: Article) => {
    setWorkflowLoading(`brief-${article.id}`);
    setWorkflowError('');
    try {
      const response = await fetch(`/api/content-ops/workflow/article/${article.id}/brief`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || '无法读取研究与写作 Brief');
      setBrief(payload);
    } catch (briefError) {
      setWorkflowError(briefError instanceof Error ? briefError.message : '无法读取研究与写作 Brief');
    } finally {
      setWorkflowLoading('');
    }
  }, []);

  const openPreview = useCallback(async (articleId: string) => {
    setPreviewLoading(true);
    setPreviewMessage('');
    try {
      const response = await fetch(`/api/content-ops/article/${articleId}`, {
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || '无法生成网站预览');
      setPreview(payload);
    } catch (previewError) {
      setPreviewMessage(
        previewError instanceof Error ? previewError.message : '无法生成网站预览',
      );
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  const publishPreview = useCallback(async () => {
    if (!preview?.eligibility.canPublish) return;
    const confirmed = window.confirm(
      `确认你已经完成专业审核，并把这篇文章设为 Published？\n\n${preview.article.title}`,
    );
    if (!confirmed) return;

    setPublishing(true);
    setPreviewMessage('');
    try {
      const response = await fetch(`/api/content-ops/article/${preview.article.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationTitle: preview.article.title }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || '发布失败');
      setPreview((current) =>
        current
          ? {
              ...current,
              article: { ...current.article, status: 'Published' },
              eligibility: { canPublish: false, blockers: ['文章已经发布'] },
            }
          : current,
      );
      setPreviewMessage('已写入两条人工审核记录，并将 Notion 更新为 Published。GitHub Actions 会在每日 21:00（上海时间）自动同步网站；同步失败会保留上一版。');
      await loadData(true);
    } catch (publishError) {
      setPreviewMessage(
        publishError instanceof Error ? publishError.message : '发布失败',
      );
    } finally {
      setPublishing(false);
    }
  }, [loadData, preview]);

  useEffect(() => {
    if (!isLocalHostname()) return;
    void Promise.all([loadData(), loadWorkflowStatus()]);
    const timer = window.setInterval(() => void loadData(true), 60_000);
    return () => window.clearInterval(timer);
  }, [loadData, loadWorkflowStatus]);

  const articleCounts = useMemo(() => {
    const counts = Object.fromEntries(PIPELINE.map((stage) => [stage, 0])) as Record<string, number>;
    data?.articles.forEach((article) => {
      counts[article.status] = (counts[article.status] || 0) + 1;
    });
    return counts;
  }, [data]);

  const reviewQueue = useMemo(
    () =>
      (data?.articles || []).filter((article) =>
        ['Editorial Review', 'Domain Review', 'Approved', 'Refresh Needed'].includes(article.status),
      ),
    [data],
  );

  const unresolvedAudits = useMemo(() => {
    const activeArticleIds = new Set(
      (data?.articles || [])
        .filter((article) => article.status !== 'Archived')
        .map((article) => article.id),
    );
    return (data?.audits || []).filter(
      (item) =>
        item.result !== 'Pass' &&
        (!item.articleIds.length || item.articleIds.some((id) => activeArticleIds.has(id))),
    );
  }, [data]);

  const expiringEvidence = useMemo(
    () =>
      (data?.evidence || []).filter((item) => {
        const days = daysUntil(item.expires);
        return item.status === 'Expired' || (days !== null && days <= 30);
      }),
    [data],
  );

  const selectedTopics = useMemo(
    () => (data?.topics || []).filter((topic) => topic.status === 'Selected'),
    [data],
  );

  const governanceSummary = useMemo(() => {
    const articles = (data?.articles || []).filter((article) => article.status !== 'Archived');
    const governed = articles.filter((article) => !governanceState(article).all.length);
    const metadataPending = articles.filter((article) => governanceState(article).metadata.length);
    const reviewPending = articles.filter((article) => {
      const state = governanceState(article);
      return !state.metadata.length && state.review.length;
    });
    return {
      governed: governed.length,
      metadataPending: metadataPending.length,
      reviewPending: reviewPending.length,
    };
  }, [data]);

  const weeklyMix = useMemo(() => {
    const categories = [
      { label: '周一', name: 'Freight Export', matches: (item: Topic) => item.leadGoal === 'Freight Export' },
      { label: '周三', name: 'Commercial Kitchen', matches: (item: Topic) => item.productCategory === 'Commercial Kitchen Equipment' },
      { label: '周五', name: 'Outdoor Products', matches: (item: Topic) => item.productCategory === 'Outdoor Products' },
    ];
    return categories.map((category) => ({
      ...category,
      topic: selectedTopics.find(category.matches),
    }));
  }, [selectedTopics]);

  const candidateGroups = useMemo(() => {
    const candidates = (data?.topics || []).filter(
      (topic) =>
        topic.status === 'Candidate' &&
        (topic.candidateScore ?? 0) >= 75 &&
        topic.duplicateDecision === 'Clear',
    );
    return [
      {
        key: 'Freight Export',
        label: '周一 · 货运出口',
        items: candidates.filter((topic) => topic.leadGoal === 'Freight Export'),
      },
      {
        key: 'Commercial Kitchen Equipment',
        label: '周三 · 商用餐厨设备',
        items: candidates.filter((topic) => topic.productCategory === 'Commercial Kitchen Equipment'),
      },
      {
        key: 'Outdoor Products',
        label: '周五 · 户外用品',
        items: candidates.filter((topic) => topic.productCategory === 'Outdoor Products'),
      },
    ];
  }, [data]);

  const productionArticles = useMemo(
    () =>
      (data?.articles || []).filter((article) =>
        ['Researching', 'Evidence Ready', 'Drafting', 'Editorial Review', 'Domain Review'].includes(article.status),
      ),
    [data],
  );

  const actionForArticle = (article: Article) => {
    if (article.status === 'Researching') {
      return { action: 'mark-evidence-ready', label: '证据已补齐，推进证据就绪' };
    }
    if (article.status === 'Evidence Ready') {
      return { action: 'draft-request', label: '创建起草请求' };
    }
    if (article.status === 'Drafting') {
      return { action: 'editorial-ready', label: '正文已完成，送编辑审核' };
    }
    if (article.status === 'Editorial Review') {
      return { action: 'domain-ready', label: '编辑已通过，送专业审核' };
    }
    return null;
  };

  const statusOptions = useMemo(() => {
    if (activeTab === 'articles') return ['All', ...Array.from(new Set((data?.articles || []).map((item) => item.status)))];
    if (activeTab === 'topics') return ['All', ...Array.from(new Set((data?.topics || []).map((item) => item.status)))];
    if (activeTab === 'evidence') return ['All', ...Array.from(new Set((data?.evidence || []).map((item) => item.status)))];
    if (activeTab === 'audits') return ['All', ...Array.from(new Set((data?.audits || []).map((item) => item.result)))];
    return ['All'];
  }, [activeTab, data]);

  useEffect(() => {
    setStatusFilter('All');
    if (activeTab !== 'articles') setGovernanceFilter('All');
    setQuery('');
  }, [activeTab]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredArticles = (data?.articles || []).filter(
    (item) => {
      const governance = governanceState(item);
      const governanceMatch =
        governanceFilter === 'All' ||
        (governanceFilter === 'Governed' && !governance.all.length) ||
        (governanceFilter === 'Metadata Pending' && !!governance.metadata.length) ||
        (governanceFilter === 'Review Pending' &&
          !governance.metadata.length &&
          !!governance.review.length);
      return (
        (statusFilter === 'All' || item.status === statusFilter) &&
        governanceMatch &&
        (!normalizedQuery ||
          [
            item.title,
            item.primaryQuery,
            item.topicKey,
            item.productCategory,
            item.audienceMarket,
            ...governance.all,
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery))
      );
    },
  );
  const filteredTopics = (data?.topics || []).filter(
    (item) =>
      (statusFilter === 'All' || item.status === statusFilter) &&
      (!normalizedQuery ||
        [item.title, item.primaryQuery, item.topicKey, item.productCategory, item.audienceMarket]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)),
  );
  const filteredEvidence = (data?.evidence || []).filter(
    (item) =>
      (statusFilter === 'All' || item.status === statusFilter) &&
      (!normalizedQuery ||
        [item.claim, item.publisher, item.market, item.summary]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)),
  );
  const filteredAudits = (data?.audits || []).filter(
    (item) =>
      (statusFilter === 'All' || item.result === statusFilter) &&
      (!normalizedQuery ||
        [item.title, item.stage, item.findings, item.blockers]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)),
  );

  if (!isLocalHostname()) {
    return (
      <main className="min-h-[100dvh] bg-[#07182d] px-6 py-24 text-white">
        <div className="mx-auto max-w-xl border-l-4 border-amber-500 pl-6">
          <LockKeyhole className="h-8 w-8 text-amber-400" />
          <h1 className="mt-5 text-3xl font-black">内容运营控制台仅限本机</h1>
          <p className="mt-4 text-slate-300">请通过 localhost 或 127.0.0.1 打开，内部审计数据不会在生产网站提供。</p>
        </div>
      </main>
    );
  }

  return (
    <div
      className="min-h-[100dvh] bg-[#edf1f3] text-[#122033]"
      style={{ fontFamily: '"Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif' }}
    >
      <Helmet>
        <title>DDNZ Content Ops — Local</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07182d]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1580px] items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 font-serif text-xl font-black text-[#07182d]">
              D
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-black tracking-[0.16em]">DDNZ CONTENT OPS</p>
                <span className="hidden rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-black text-emerald-300 sm:inline">
                  LOCAL ONLY
                </span>
              </div>
              <p className="truncate text-[11px] text-slate-400">可审计内容生产控制室</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data && (
              <span className="hidden text-xs text-slate-400 md:inline">
                同步于 {formatTime(data.generatedAt)}
              </span>
            )}
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm font-bold hover:bg-white/10"
            >
              <BookOpenText className="h-4 w-4" />
              <span className="hidden sm:inline">使用说明</span>
            </button>
            <button
              type="button"
              onClick={() => void Promise.all([loadData(true), loadWorkflowStatus()])}
              disabled={refreshing}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm font-bold hover:bg-white/10 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">刷新全部</span>
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1580px] gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button
                type="button"
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`relative flex min-h-14 shrink-0 items-center gap-2 px-4 text-sm font-extrabold transition-colors ${
                  active ? 'text-[#0b4f8a]' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && <motion.span layoutId="ops-tab" className="absolute inset-x-3 bottom-0 h-0.5 bg-amber-600" />}
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {loading ? (
          <div className="flex min-h-[60dvh] items-center justify-center">
            <div className="text-center">
              <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-[#0b4f8a]" />
              <p className="mt-4 text-sm font-bold text-slate-600">正在读取四张 Notion 数据库…</p>
            </div>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-2xl border-l-4 border-rose-500 bg-white p-6 shadow-sm">
            <div className="flex gap-4">
              <AlertTriangle className="h-6 w-6 shrink-0 text-rose-600" />
              <div>
                <h1 className="font-black">控制台暂时无法连接 Notion</h1>
                <p className="mt-2 text-sm text-slate-600">{error}</p>
                <button onClick={() => void loadData(true)} className="mt-5 min-h-11 rounded-lg bg-[#0b4f8a] px-4 text-sm font-bold text-white">重新连接</button>
              </div>
            </div>
          </div>
        ) : data ? (
          <>
            {activeTab === 'overview' && (
              <>
                <section className="mb-5 border border-[#0b4f8a]/30 bg-[#f4f9fd]">
                  <button
                    type="button"
                    onClick={() => setOnboardingOpen((value) => !value)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left"
                    aria-expanded={onboardingOpen}
                  >
                    <span>
                      <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-[#0b4f8a]">第一次使用？从这里开始</span>
                      <span className="mt-1 block text-sm font-bold text-slate-700">先生成候选，再按“货运 + 商厨 + 户外”各选一篇；最后由你预览和发布。</span>
                    </span>
                    {onboardingOpen ? <ChevronUp className="h-5 w-5 shrink-0" /> : <ChevronDown className="h-5 w-5 shrink-0" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {onboardingOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-sky-200 px-5 py-5">
                          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                            {generatorSteps.map((item) => (
                              <div key={item.step} className="border-l-2 border-amber-500 pl-3">
                                <p className="font-mono text-xs font-black text-[#0b4f8a]">{item.step} · {item.owner}</p>
                                <p className="mt-1 text-sm font-black">{item.title}</p>
                                <p className="mt-1 text-xs leading-5 text-slate-600">{item.body}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-5 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveTab('generator')}
                              className="inline-flex min-h-11 items-center gap-2 bg-[#0b4f8a] px-4 text-sm font-black text-white hover:bg-[#083b68]"
                            >
                              打开文章生成器<ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setHelpOpen(true)}
                              className="min-h-11 border border-[#0b4f8a] px-4 text-sm font-black text-[#0b4f8a] hover:bg-white"
                            >
                              查看完整说明和标签词典
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
                <section className="grid divide-y divide-slate-200 border-y border-slate-300 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-5">
                  {[
                    { label: '文章总数', value: data.articles.length, note: `${articleCounts.Published || 0} 篇已发布`, icon: BookOpenCheck },
                    { label: '等待人工审核', value: reviewQueue.length, note: 'Domain Review / Refresh', icon: UserRoundCheck },
                    { label: '候选选题', value: data.topics.length, note: `${selectedTopics.length} 已选中`, icon: Sparkles },
                    { label: '证据记录', value: data.evidence.length, note: `${expiringEvidence.length} 即将到期或已过期`, icon: ShieldCheck },
                    { label: '未通过审计', value: unresolvedAudits.length, note: unresolvedAudits[0]?.result || '没有待处理项', icon: ClipboardCheck },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start justify-between gap-4 px-5 py-5">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                          <p className="mt-2 font-serif text-4xl font-black leading-none text-[#0b1f3a]">{item.value}</p>
                          <p className="mt-2 text-xs text-slate-500">{item.note}</p>
                        </div>
                        <Icon className="h-5 w-5 text-amber-700" />
                      </div>
                    );
                  })}
                </section>

                {unresolvedAudits.length > 0 && (
                  <section className="mt-5 grid gap-4 border-l-4 border-amber-600 bg-[#fff8e8] px-5 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-800">待处理审计是什么</p>
                      <p className="mt-1 font-black text-slate-900">{unresolvedAudits[0].title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {unresolvedAudits[0].blockers || unresolvedAudits[0].findings}
                      </p>
                      <p className="mt-2 text-xs font-bold text-amber-900">
                        当前：{governanceSummary.governed} 篇已完整治理 · {governanceSummary.metadataPending} 篇缺基础元数据 · {governanceSummary.reviewPending} 篇已补元数据、等待证据或复核。
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('articles');
                          setGovernanceFilter('Review Pending');
                        }}
                        className="min-h-11 bg-amber-700 px-4 text-sm font-black text-white hover:bg-amber-800"
                      >
                        打开逐篇迁移表
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('audits')}
                        className="min-h-11 border border-amber-700 px-4 text-sm font-black text-amber-900 hover:bg-amber-100"
                      >
                        查看审计原文
                      </button>
                    </div>
                  </section>
                )}

                <section className="mt-6 overflow-hidden border border-slate-300 bg-[#0b1f3a] text-white">
                  <div className="flex flex-col justify-between gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-400">Production chain</p>
                      <h1 className="mt-1 text-xl font-black">从 Idea 到 Published 的完整闸门</h1>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Bot className="h-4 w-4 text-sky-300" />自动化止于 Domain Review
                      <ChevronRight className="h-3.5 w-3.5" />
                      <UserRoundCheck className="h-4 w-4 text-amber-400" />人工批准发布
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="flex min-w-[1120px] px-5 py-6">
                      {PIPELINE.map((stage, index) => {
                        const count = articleCounts[stage] || 0;
                        const isAutomationEdge = stage === 'Domain Review';
                        return (
                          <div key={stage} className="relative flex flex-1 flex-col items-center px-1 text-center">
                            {index < PIPELINE.length - 1 && (
                              <div className={`absolute left-1/2 top-[17px] h-px w-full ${isAutomationEdge ? 'border-t border-dashed border-amber-400/70' : 'bg-white/20'}`} />
                            )}
                            <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black ${
                              count ? 'border-amber-400 bg-amber-400 text-[#07182d]' : 'border-white/20 bg-[#102947] text-slate-400'
                            }`}>
                              {count}
                            </div>
                            <p className="mt-3 max-w-[100px] text-[11px] font-bold leading-4 text-slate-300" title={stage}>{statusLabels[stage] || stage}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab !== 'overview' && (
              <section className="border-b border-slate-300 pb-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">当前工作区</p>
                <h1 className="mt-1 text-2xl font-black text-[#0b1f3a]">
                  {tabItems.find((item) => item.key === activeTab)?.label}
                </h1>
                <div className="mt-4 grid divide-y divide-slate-200 border border-slate-300 bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
                  {[
                    ['这是什么', tabGuidance[activeTab].purpose],
                    ['重点看什么', tabGuidance[activeTab].focus],
                    ['下一步', tabGuidance[activeTab].action],
                  ].map(([label, body]) => (
                    <div key={label} className="px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0b4f8a]">{label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{body}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!['overview', 'generator'].includes(activeTab) && (
              <section className="mt-4 flex flex-col gap-3 border-b border-slate-300 pb-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索标题、Topic Key、市场、来源…"
                    className="min-h-11 w-full border border-slate-300 bg-white pl-10 pr-10 text-base outline-none focus:border-[#0b4f8a] focus:ring-2 focus:ring-sky-100"
                  />
                  {query && (
                    <button aria-label="清除搜索" onClick={() => setQuery('')} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-900">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="relative sm:w-56">
                  <Filter className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="min-h-11 w-full appearance-none border border-slate-300 bg-white pl-10 pr-8 text-base font-bold outline-none focus:border-[#0b4f8a]"
                  >
                    {statusOptions.map((status) => <option key={status} value={status}>{status === 'All' ? '全部状态' : statusLabels[status] || status}</option>)}
                  </select>
                </div>
                {activeTab === 'articles' && (
                  <div className="relative sm:w-56">
                    <ShieldCheck className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <select
                      value={governanceFilter}
                      onChange={(event) => setGovernanceFilter(event.target.value as GovernanceFilter)}
                      className="min-h-11 w-full appearance-none border border-slate-300 bg-white pl-10 pr-8 text-base font-bold outline-none focus:border-[#0b4f8a]"
                    >
                      <option value="All">全部治理状态</option>
                      <option value="Governed">已完整治理</option>
                      <option value="Review Pending">等待证据或复核</option>
                      <option value="Metadata Pending">基础元数据仍缺失</option>
                    </select>
                  </div>
                )}
              </section>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="mt-6"
              >
                {activeTab === 'generator' && (
                  <div className="space-y-6">
                    <section className="grid gap-4 border-l-4 border-[#0b4f8a] bg-white px-5 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#0b4f8a]">安全边界</p>
                        <p className="mt-1 font-black text-slate-900">{workflowStatus?.writeNotice || '自动化最多推进到专业审核，不能替你发布。'}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {workflowStatus?.capabilities.modelNotice || '候选、研究请求与起草请求会保留完整审计；专业事实和最终发布必须由人确认。'}
                        </p>
                      </div>
                      <DecisionBadge
                        state="continue"
                        reason={workflowStatus?.capabilities.modelConnected ? '研究模型已连接，可以按闸门继续' : '信号候选模式可继续：发现角度不等于已核验事实'}
                      />
                    </section>

                    <section className="border border-slate-300 bg-[#fffaf0] px-5 py-5">
                      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr] lg:items-start">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-800">选题雷达 · 先看信号再写标题</p>
                          <h2 className="mt-1 text-xl font-black text-slate-950">近期关注度来自“变化 + 决策 + 时间窗口”</h2>
                          <p className="mt-2 text-sm leading-6 text-slate-600">候选卡会说明“为什么现在”。新闻或法规信号只负责发现角度；没有改变成本、流程、风险或产品选择时，应更新旧文，不应新建年份文章。</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[
                            ['一手需求', 'Search Console 上升查询、询价表、WhatsApp 和报价问题最接近真实客户。'],
                            ['官方变化', '海关、承运人、港口、SASO/标准机构的新规则与服务变化。'],
                            ['季节窗口', '海湾高温、户外采购季、酒店项目交付期等会改变选型与采购时间。'],
                            ['转化判断', '题目必须自然落到运价、采购、验货、集货或出口服务 CTA。'],
                          ].map(([title, body]) => (
                            <div key={title} className="border-l-2 border-amber-500 pl-3">
                              <p className="text-xs font-black text-slate-900">{title}</p>
                              <p className="mt-1 text-xs leading-5 text-slate-600">{body}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {(workflowError || workflowMessage) && (
                      <section className={`border-l-4 bg-white px-5 py-4 ${workflowError ? 'border-rose-600' : 'border-emerald-600'}`} role="status">
                        <div className="flex items-start justify-between gap-4">
                          <p className={`text-sm font-bold leading-6 ${workflowError ? 'text-rose-800' : 'text-emerald-800'}`}>
                            {workflowError || workflowMessage}
                          </p>
                          <button type="button" onClick={() => { setWorkflowError(''); setWorkflowMessage(''); }} aria-label="关闭提示">
                            <X className="h-4 w-4 text-slate-400" />
                          </button>
                        </div>
                      </section>
                    )}

                    <section className="border border-slate-300 bg-white">
                      <div className="grid gap-5 border-b border-slate-200 px-5 py-5 lg:grid-cols-[74px_1fr_auto] lg:items-center">
                        <div className="font-mono text-4xl font-black text-amber-600">01</div>
                        <div>
                          <h2 className="text-xl font-black">生成并预览 8–12 个候选</h2>
                          <p className="mt-1 text-sm leading-6 text-slate-600">先隐藏已存在的 Topic Key / Primary Query，再显示未重复候选；只有你确认后才写入 Notion。</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void previewCandidates()}
                          disabled={!!workflowLoading}
                          className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#0b4f8a] px-4 text-sm font-black text-white hover:bg-[#083b68] disabled:bg-slate-300"
                        >
                          {workflowLoading === 'candidate-preview' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
                          {candidatePreview.length
                            ? candidateHasMore ? '换一批未重复候选' : '重新检查当前批次'
                            : '预览本周候选'}
                        </button>
                      </div>
                      {selectedTopics.length === 3 && (
                        <div className="border-b border-sky-200 bg-sky-50 px-5 py-3 text-sm font-bold leading-6 text-sky-900">
                          本周 1 + 1 + 1 已经选完。这里的新候选只作为下周备选，不会替换当前三篇；当前任务请继续第 3 步创建研究文章。
                        </div>
                      )}
                      {candidatePreview.length > 0 && (
                        <div className="px-5 py-5">
                          <div className="border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-950">
                            {candidateWarning}
                          </div>
                          <div className="mt-4 grid gap-3 lg:grid-cols-3">
                            {candidatePreview.map((candidate) => (
                              <article key={candidate.topicKey} className="border border-slate-200 p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <Pill value={candidate.duplicateDecision} />
                                  <span className="font-mono text-sm font-black">{candidate.candidateScore}/100</span>
                                </div>
                                <h3 className="mt-3 text-sm font-black leading-6">{candidate.title}</h3>
                                <p className="mt-2 text-xs leading-5 text-slate-600">{candidate.audienceMarket} · {candidate.searchIntent}</p>
                                {candidate.whyNow && (
                                  <div className="mt-3 border-l-2 border-amber-500 bg-amber-50 px-3 py-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-800">为什么现在 · {candidate.signalClass || '需求信号'}</p>
                                    <p className="mt-1 text-xs leading-5 text-slate-700">{candidate.whyNow}</p>
                                  </div>
                                )}
                                <p className="mt-2 text-xs leading-5 text-slate-500">{candidate.duplicateNotes}</p>
                                <details className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-600">
                                  <summary className="cursor-pointer font-black text-[#0b4f8a]">查看证据计划和引用资产</summary>
                                  <p className="mt-2 leading-5"><strong>证据：</strong>{candidate.evidencePlan}</p>
                                  <p className="mt-2 leading-5"><strong>引用资产：</strong>{candidate.citationAsset}</p>
                                  {!!candidate.signalUrls?.length && (
                                    <p className="mt-2 leading-5">
                                      <strong>发现信号：</strong>{candidate.signalUrls.map((url, index) => (
                                        <span key={url}>{index > 0 ? ' · ' : ''}<a href={url} target="_blank" rel="noreferrer" className="font-bold text-[#0b4f8a] underline">官方来源 {index + 1}</a></span>
                                      ))}
                                    </p>
                                  )}
                                </details>
                              </article>
                            ))}
                          </div>
                          <label className="mt-5 flex items-start gap-3 border border-amber-300 bg-[#fffaf0] p-4 text-sm leading-6 text-slate-700">
                            <input
                              type="checkbox"
                              checked={acknowledgeTemplates}
                              onChange={(event) => setAcknowledgeTemplates(event.target.checked)}
                              className="mt-1 h-4 w-4 accent-[#0b4f8a]"
                            />
                            <span>我确认这些只是未研究的候选模板，不能作为事实、正文或可发布文章；保存后仍要人工选题和逐条补证据。</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => void persistCandidates()}
                            disabled={!acknowledgeTemplates || !!workflowLoading}
                            className="mt-3 inline-flex min-h-11 items-center gap-2 bg-amber-600 px-4 text-sm font-black text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            {workflowLoading === 'candidate-persist' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            确认并保存候选到 Notion
                          </button>
                        </div>
                      )}
                    </section>

                    <section className="border border-slate-300 bg-white">
                      <div className="grid gap-5 border-b border-slate-200 px-5 py-5 lg:grid-cols-[74px_1fr_auto] lg:items-center">
                        <div className="font-mono text-4xl font-black text-amber-600">02</div>
                        <div>
                          <h2 className="text-xl font-black">选择本周三篇</h2>
                          <p className="mt-1 text-sm leading-6 text-slate-600">必须恰好选择货运、商厨、户外各一篇；系统只列出评分 ≥75 且查重为 Clear 的候选。</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void selectWeeklyCandidates()}
                          disabled={!!workflowLoading || candidateGroups.some((group) => !selectedCandidateIds[group.key])}
                          className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#0b4f8a] px-4 text-sm font-black text-white hover:bg-[#083b68] disabled:bg-slate-300"
                        >
                          {workflowLoading === 'weekly-select' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ListChecks className="h-4 w-4" />}
                          确认本周 1 + 1 + 1
                        </button>
                      </div>
                      <div className="grid divide-y divide-slate-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                        {candidateGroups.map((group) => (
                          <div key={group.key} className="p-5">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0b4f8a]">{group.label}</p>
                            <select
                              value={selectedCandidateIds[group.key] || ''}
                              onChange={(event) => setSelectedCandidateIds((current) => ({ ...current, [group.key]: event.target.value }))}
                              className="mt-3 min-h-12 w-full border border-slate-300 bg-white px-3 text-sm font-bold outline-none focus:border-[#0b4f8a]"
                            >
                              <option value="">{group.items.length ? '请选择一篇合格候选' : '还没有合格候选'}</option>
                              {group.items.map((topic) => (
                                <option key={topic.id} value={topic.id}>{topic.candidateScore} 分 · {topic.title}</option>
                              ))}
                            </select>
                            <p className="mt-2 text-xs text-slate-500">当前可选 {group.items.length} 篇</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="border border-slate-300 bg-white">
                      <div className="grid gap-5 border-b border-slate-200 px-5 py-5 lg:grid-cols-[74px_1fr] lg:items-center">
                        <div className="font-mono text-4xl font-black text-amber-600">03</div>
                        <div>
                          <h2 className="text-xl font-black">为 Selected 选题创建研究请求</h2>
                          <p className="mt-1 text-sm leading-6 text-slate-600">这一步会创建或复用 Researching 文章，并记录证据缺口；不会自动写入未经核验的研究结论。</p>
                        </div>
                      </div>
                      {selectedTopics.length ? (
                        <div className="divide-y divide-slate-200">
                          {selectedTopics.map((topic) => (
                            <div key={topic.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
                              <div>
                                <ExternalLink href={topic.url}>{topic.title}</ExternalLink>
                                <p className="mt-1 text-xs text-slate-500">{topic.productCategory || topic.leadGoal} · {topic.audienceMarket}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => void prepareTopic(topic)}
                                disabled={!!workflowLoading}
                                className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#0b4f8a] px-3 text-xs font-black text-[#0b4f8a] hover:bg-sky-50 disabled:opacity-50"
                              >
                                {workflowLoading === `prepare-${topic.id}` ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}
                                创建或打开研究文章
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : <EmptyState text="还没有 Selected 选题；请先完成上一步三篇选择" />}
                    </section>

                    <section className="border border-slate-300 bg-white">
                      <div className="grid gap-5 border-b border-slate-200 px-5 py-5 lg:grid-cols-[74px_1fr] lg:items-center">
                        <div className="font-mono text-4xl font-black text-amber-600">04</div>
                        <div>
                          <h2 className="text-xl font-black">研究、起草并送到专业审核</h2>
                          <p className="mt-1 text-sm leading-6 text-slate-600">按当前状态显示唯一可执行的下一步。证据不足、正文过短或分数不足时，系统会阻止推进并说明原因。</p>
                        </div>
                      </div>
                      {productionArticles.length ? (
                        <div className="divide-y divide-slate-200">
                          {productionArticles.map((article) => {
                            const next = actionForArticle(article);
                            const missingEvidence = Math.max(0, 2 - article.evidenceCount);
                            const evidenceBlocked = !!next && missingEvidence > 0;
                            const actionFeedback = articleActionFeedback[article.id];
                            return (
                              <article key={article.id} className="px-5 py-5">
                                <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <ExternalLink href={article.url}>{article.title}</ExternalLink>
                                      <Pill value={article.status} />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">证据 {article.evidenceCount}/2 · Quality {article.qualityScore ?? '—'}/100 · {reviewerLabel(article)}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => void loadBrief(article)}
                                      disabled={!!workflowLoading}
                                      className="inline-flex min-h-10 items-center gap-1.5 border border-slate-400 px-3 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                    >
                                      {workflowLoading === `brief-${article.id}` ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <BookOpenText className="h-4 w-4" />}
                                      研究/写作 Brief
                                    </button>
                                    {evidenceBlocked ? (
                                      <>
                                        <ExternalLink href={data.links.evidence}>打开证据账本补齐 {missingEvidence} 条</ExternalLink>
                                        <button
                                          type="button"
                                          onClick={() => void Promise.all([loadData(true), loadWorkflowStatus()])}
                                          disabled={refreshing || !!workflowLoading}
                                          className="inline-flex min-h-10 items-center gap-1.5 bg-amber-600 px-3 text-xs font-black text-white hover:bg-amber-700 disabled:bg-slate-300"
                                        >
                                          {refreshing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                          已在 Notion 补齐，刷新数量
                                        </button>
                                      </>
                                    ) : next ? (
                                      <button
                                        type="button"
                                        onClick={() => void advanceArticle(article, next.action)}
                                        disabled={!!workflowLoading}
                                        className="inline-flex min-h-10 items-center gap-1.5 bg-[#0b4f8a] px-3 text-xs font-black text-white hover:bg-[#083b68] disabled:bg-slate-300"
                                      >
                                        {workflowLoading === `advance-${article.id}` ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                                        {next.label}
                                      </button>
                                    ) : (
                                    <button
                                      type="button"
                                      onClick={() => void openPreview(article.id)}
                                      className="inline-flex min-h-10 items-center gap-1.5 bg-amber-600 px-3 text-xs font-black text-white hover:bg-amber-700"
                                    >
                                      <Eye className="h-4 w-4" />进入最终网站预览
                                    </button>
                                    )}
                                  </div>
                                </div>
                                {evidenceBlocked && (
                                  <div className="mt-4 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950" role="status">
                                    <strong>当前不能推进：</strong>本文只有 {article.evidenceCount}/2 条关联证据。请在 Evidence Ledger 中按“一条重要论点一行”新增记录，并在 <strong>Article</strong> 关系中选择本文；完成核验后点击“刷新数量”。
                                  </div>
                                )}
                                {actionFeedback && (
                                  <div className={`mt-4 border-l-4 px-4 py-3 text-xs leading-5 ${actionFeedback.tone === 'error' ? 'border-rose-600 bg-rose-50 text-rose-950' : 'border-emerald-600 bg-emerald-50 text-emerald-950'}`} role="status">
                                    {actionFeedback.message}
                                  </div>
                                )}
                              </article>
                            );
                          })}
                        </div>
                      ) : <EmptyState text="当前没有正在研究、起草或审核中的文章" />}
                    </section>

                    <section className="grid gap-px border border-slate-300 bg-slate-300 md:grid-cols-2">
                      <div className="bg-[#0b1f3a] p-5 text-white">
                        <p className="font-mono text-4xl font-black text-amber-400">05</p>
                        <h2 className="mt-3 text-xl font-black">网站预览</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">Notion 的标题、加粗、列表、折叠、表格、图片和图注会按网站样式渲染；在这里检查最终效果。</p>
                      </div>
                      <div className="bg-white p-5">
                        <p className="font-mono text-4xl font-black text-amber-600">06</p>
                        <h2 className="mt-3 text-xl font-black">人工一键 Published</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">只有 Domain Review、分数和治理字段全部达标时，预览底部才会启用发布按钮。系统会先写入人工审核记录，再更新 Notion。</p>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'overview' && (
                  <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
                    <section className="border border-slate-300 bg-white">
                      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0b4f8a]">Human review desk</p>
                          <h2 className="mt-1 text-xl font-black">等待人工判断的文章</h2>
                        </div>
                        <button onClick={() => setActiveTab('articles')} className="text-xs font-black text-amber-700 hover:underline">查看全部</button>
                      </div>
                      {reviewQueue.length ? (
                        <div className="divide-y divide-slate-200">
                          {reviewQueue.slice(0, 7).map((article) => (
                            <div key={article.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
                              <div className="min-w-0">
                                <ExternalLink href={article.url}>{article.title}</ExternalLink>
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                  <span>{article.productCategory || article.leadGoal || '未分类'}</span>
                                  <span>证据 {article.evidenceCount}</span>
                                  <span>审核 {article.auditCount}</span>
                                  <span>{reviewerLabel(article)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {article.qualityScore !== null && <span className="font-mono text-sm font-black">{article.qualityScore}/100</span>}
                                <Pill value={article.status} />
                                <button
                                  type="button"
                                  onClick={() => void openPreview(article.id)}
                                  className="inline-flex min-h-10 items-center gap-1.5 bg-[#0b4f8a] px-3 text-xs font-black text-white hover:bg-[#083b68]"
                                >
                                  <Eye className="h-4 w-4" />网站预览
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <EmptyState text="当前没有待人工判断的文章" />}
                    </section>

                    <div className="space-y-6">
                      <section className="border border-slate-300 bg-[#fffaf0]">
                        <div className="border-b border-amber-200 px-5 py-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">Weekly 1 + 1 + 1</p>
                          <h2 className="mt-1 text-xl font-black">本周三篇内容配比</h2>
                        </div>
                        <div className="divide-y divide-amber-200">
                          {weeklyMix.map((item) => (
                            <div key={item.name} className="flex gap-4 px-5 py-4">
                              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.topic ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-800'}`}>
                                {item.topic ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black text-amber-900">{item.label} · {item.name}</p>
                                {item.topic ? (
                                  <a href={item.topic.url} target="_blank" rel="noreferrer" className="mt-1 block text-sm font-bold leading-5 hover:text-[#0b4f8a]">{item.topic.title}</a>
                                ) : (
                                  <p className="mt-1 text-sm text-slate-600">尚未选中合格选题</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="border border-slate-300 bg-white">
                        <div className="border-b border-slate-200 px-5 py-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-rose-700">Evidence clock</p>
                          <h2 className="mt-1 text-xl font-black">证据到期提醒</h2>
                        </div>
                        {expiringEvidence.length ? (
                          <div className="divide-y divide-slate-200">
                            {expiringEvidence.slice(0, 5).map((item) => {
                              const days = daysUntil(item.expires);
                              return (
                                <div key={item.id} className="px-5 py-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <a href={item.url} target="_blank" rel="noreferrer" className="text-sm font-bold leading-5 hover:text-[#0b4f8a]">{item.claim}</a>
                                    <span className={`shrink-0 font-mono text-xs font-black ${days !== null && days < 0 ? 'text-rose-700' : 'text-amber-700'}`}>
                                      {days === null ? '无期限' : days < 0 ? `逾期 ${Math.abs(days)}d` : `${days}d`}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-slate-500">{item.sourceTier || '未分级'} · {item.publisher || '未记录机构'}</p>
                                </div>
                              );
                            })}
                          </div>
                        ) : <EmptyState text="未来30天没有证据到期" />}
                      </section>
                    </div>
                  </div>
                )}

                {activeTab === 'articles' && (
                  <section>
                    <div className="mb-4 grid divide-y divide-slate-200 border border-slate-300 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                      <div className="px-5 py-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">Governed</p>
                        <p className="mt-1 font-mono text-2xl font-black">{governanceSummary.governed}</p>
                        <p className="mt-1 text-xs text-slate-500">证据、核验、人工 Reviewer 与审计均达标</p>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">Review pending</p>
                        <p className="mt-1 font-mono text-2xl font-black">{governanceSummary.reviewPending}</p>
                        <p className="mt-1 text-xs text-slate-500">基础元数据已补，等待事实、证据或复核</p>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-700">Metadata pending</p>
                        <p className="mt-1 font-mono text-2xl font-black">{governanceSummary.metadataPending}</p>
                        <p className="mt-1 text-xs text-slate-500">仍需补 Topic Key、市场、意图或 CTA</p>
                      </div>
                    </div>
                    <div className="overflow-hidden border border-slate-300 bg-white">
                      <div className="overflow-x-auto">
                        <table className="min-w-[1520px] w-full text-left">
                        <thead className="bg-[#0b1f3a] text-[11px] uppercase tracking-wider text-slate-300">
                          <tr>
                            <th className="px-4 py-3">文章</th><th className="px-4 py-3">发布状态</th><th className="px-4 py-3">当前操作</th><th className="px-4 py-3">市场/意图</th><th className="px-4 py-3">治理进度与问题</th><th className="px-4 py-3">证据/审核</th><th className="px-4 py-3">人工 Reviewer / 核验</th><th className="px-4 py-3">CTA</th><th className="px-4 py-3">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredArticles.map((article) => {
                            const governance = governanceState(article);
                            return (
                            <tr key={article.id} className="align-top hover:bg-slate-50">
                              <td className="max-w-[370px] px-4 py-4">
                                <ExternalLink href={article.url}>{article.title}</ExternalLink>
                                <p className="mt-1 truncate text-xs text-slate-500">{article.primaryQuery || article.topicKey || '缺少 Primary Query / Topic Key'}</p>
                              </td>
                              <td className="px-4 py-4"><Pill value={article.status} /></td>
                              <td className="max-w-[240px] px-4 py-4"><DecisionBadge {...articleDecision(article)} compact /></td>
                              <td className="px-4 py-4 text-sm"><p className="font-bold">{article.audienceMarket || '未设置市场'}</p><p className="mt-1 text-xs text-slate-500">{article.searchIntent || '未设置意图'} · {article.contentType || '未分类'}</p></td>
                              <td className="max-w-[360px] px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <span className={`font-mono text-lg font-black ${governance.percent === 100 ? 'text-emerald-700' : governance.metadata.length ? 'text-rose-700' : 'text-amber-700'}`}>
                                    {governance.percent}%
                                  </span>
                                  <div className="h-1.5 flex-1 overflow-hidden bg-slate-200">
                                    <div
                                      className={`h-full ${governance.percent === 100 ? 'bg-emerald-600' : governance.metadata.length ? 'bg-rose-600' : 'bg-amber-600'}`}
                                      style={{ width: `${Math.max(4, governance.percent)}%` }}
                                    />
                                  </div>
                                </div>
                                {governance.all.length ? (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {governance.all.map((gap) => (
                                      <span key={gap} className={`border px-1.5 py-0.5 text-[10px] font-bold ${governance.metadata.includes(gap) ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
                                        {gap}
                                      </span>
                                    ))}
                                  </div>
                                ) : governance.archived ? (
                                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-black text-slate-600"><CheckCircle2 className="h-4 w-4" />已归档并指向权威文章</p>
                                ) : (
                                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-black text-emerald-700"><CheckCircle2 className="h-4 w-4" />完整治理</p>
                                )}
                              </td>
                              <td className="px-4 py-4 text-sm"><p className="font-black">{article.evidenceCount} 条证据</p><p className="mt-1 text-xs text-slate-500">{article.auditCount} 次审核 · {article.topicCount} 个 Topic</p><p className="mt-1 font-mono text-xs font-black">{article.qualityScore ?? '—'}/100</p></td>
                              <td className="px-4 py-4 text-sm"><p>{reviewerLabel(article)}</p><p className="mt-1 text-xs text-slate-500">{formatDate(article.lastVerified)}</p></td>
                              <td className="px-4 py-4 text-sm">{article.primaryCTA || '未设置'}</td>
                              <td className="px-4 py-4">
                                <button
                                  type="button"
                                  onClick={() => void openPreview(article.id)}
                                  className="inline-flex min-h-10 items-center gap-1.5 border border-[#0b4f8a] px-3 text-xs font-black text-[#0b4f8a] hover:bg-sky-50"
                                >
                                  <Eye className="h-4 w-4" />网站预览
                                </button>
                              </td>
                            </tr>
                          )})}
                        </tbody>
                      </table>
                      </div>
                    </div>
                    {!filteredArticles.length && <EmptyState text="没有符合条件的文章" />}
                  </section>
                )}

                {activeTab === 'topics' && (
                  <section className="overflow-hidden border border-slate-300 bg-white">
                    <div className="overflow-x-auto">
                      <table className="min-w-[1360px] w-full text-left">
                        <thead className="bg-[#0b1f3a] text-[11px] uppercase tracking-wider text-slate-300">
                          <tr>
                            <th className="px-4 py-3">候选选题</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">当前操作</th><th className="px-4 py-3">评分</th><th className="px-4 py-3">分类/市场</th><th className="px-4 py-3">搜索意图</th><th className="px-4 py-3">查重决定</th><th className="px-4 py-3">Topic Key</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredTopics.map((topic) => (
                            <tr key={topic.id} className="align-top hover:bg-slate-50">
                              <td className="max-w-[340px] px-4 py-4"><ExternalLink href={topic.url}>{topic.title}</ExternalLink><p className="mt-1 text-xs text-slate-500">{topic.coreAngle || topic.primaryQuery || '未填写核心角度'}</p></td>
                              <td className="px-4 py-4"><Pill value={topic.status} /></td>
                              <td className="max-w-[240px] px-4 py-4"><DecisionBadge {...topicDecision(topic)} compact /></td>
                              <td className="px-4 py-4"><span className={`font-mono text-lg font-black ${(topic.candidateScore || 0) >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>{topic.candidateScore ?? '—'}</span><span className="text-xs text-slate-400"> /100</span></td>
                              <td className="px-4 py-4 text-sm"><p className="font-bold">{topic.productCategory || topic.leadGoal || '未分类'}</p><p className="mt-1 text-xs text-slate-500">{topic.audienceMarket || '未设置市场'}</p></td>
                              <td className="px-4 py-4 text-sm">{topic.searchIntent || '—'}</td>
                              <td className="px-4 py-4"><Pill value={topic.duplicateDecision || '未审计'} /><p className="mt-2 max-w-[220px] text-xs text-slate-500">{topic.duplicateNotes}</p></td>
                              <td className="max-w-[280px] px-4 py-4 font-mono text-xs text-slate-600">{topic.topicKey || '缺失'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {!filteredTopics.length && <EmptyState text="还没有候选选题；周日自动化会生成 8–12 个并记录拒绝项" />}
                  </section>
                )}

                {activeTab === 'evidence' && (
                  <section className="overflow-hidden border border-slate-300 bg-white">
                    <div className="overflow-x-auto">
                      <table className="min-w-[1320px] w-full text-left">
                        <thead className="bg-[#0b1f3a] text-[11px] uppercase tracking-wider text-slate-300">
                          <tr>
                            <th className="px-4 py-3">具体论点</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">当前操作</th><th className="px-4 py-3">等级/类型</th><th className="px-4 py-3">发布机构</th><th className="px-4 py-3">市场</th><th className="px-4 py-3">失效日</th><th className="px-4 py-3">关联</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredEvidence.map((item) => {
                            const days = daysUntil(item.expires);
                            return (
                              <tr key={item.id} className="align-top hover:bg-slate-50">
                                <td className="max-w-[380px] px-4 py-4"><ExternalLink href={item.url}>{item.claim}</ExternalLink>{item.sourceUrl && <p className="mt-1 truncate text-xs text-slate-500">{item.sourceUrl}</p>}</td>
                                <td className="px-4 py-4"><Pill value={item.status} /></td>
                                <td className="max-w-[240px] px-4 py-4"><DecisionBadge {...evidenceDecision(item)} compact /></td>
                                <td className="px-4 py-4 text-sm font-bold">{item.sourceTier || '—'}<p className="mt-1 text-xs font-normal text-slate-500">{item.sourceType || '未设置'}</p></td>
                                <td className="px-4 py-4 text-sm">{item.publisher || '未记录'}</td>
                                <td className="px-4 py-4 text-sm">{item.market || '未限定'}</td>
                                <td className="px-4 py-4 text-sm"><p className="font-bold">{formatDate(item.expires)}</p>{days !== null && <p className={`mt-1 text-xs font-black ${days < 0 ? 'text-rose-700' : days <= 30 ? 'text-amber-700' : 'text-slate-500'}`}>{days < 0 ? `已逾期 ${Math.abs(days)} 天` : `${days} 天后`}</p>}</td>
                                <td className="px-4 py-4 text-sm">文章 {item.articleCount}<br />选题 {item.topicCount}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {!filteredEvidence.length && <EmptyState text="还没有符合条件的证据记录" />}
                  </section>
                )}

                {activeTab === 'audits' && (
                  <section className="border border-slate-300 bg-white">
                    {filteredAudits.length ? (
                      <div className="divide-y divide-slate-200">
                        {filteredAudits.map((audit) => (
                          <article key={audit.id} className="grid gap-5 px-5 py-5 lg:grid-cols-[150px_1fr_240px_auto]">
                            <div>
                              <Pill value={audit.result} />
                              <p className="mt-3 text-xs font-black uppercase tracking-wider text-slate-500">{audit.stage || '未设置 Stage'}</p>
                              <p className="mt-1 text-sm font-bold">{formatDate(audit.runDate || audit.createdTime)}</p>
                            </div>
                            <div className="min-w-0">
                              <ExternalLink href={audit.url}>{audit.title}</ExternalLink>
                              {audit.findings && <p className="mt-2 text-sm leading-6 text-slate-700">{audit.findings}</p>}
                              {audit.blockers && (
                                <div className="mt-3 border-l-[3px] border-rose-500 bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-900">
                                  <strong>阻断：</strong>{audit.blockers}
                                </div>
                              )}
                            </div>
                            <DecisionBadge {...auditDecision(audit)} compact />
                            <div className="text-right text-xs text-slate-500">
                              {audit.score !== null && <p className="font-mono text-xl font-black text-slate-900">{audit.score}<span className="text-xs text-slate-400">/100</span></p>}
                              <p className="mt-2">{audit.reviewers.join(', ') || '未指定 Reviewer'}</p>
                              <p className="mt-1">文章 {audit.articleCount} · 选题 {audit.topicCount}</p>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : <EmptyState text="还没有符合条件的审计运行记录" />}
                  </section>
                )}
              </motion.div>
            </AnimatePresence>

            <footer className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-300 py-5 text-xs text-slate-500 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-4">
                <ExternalLink href={data.links.runbook}>治理手册</ExternalLink>
                <ExternalLink href={data.links.insights}>文章库</ExternalLink>
                <ExternalLink href={data.links.topics}>Topic Registry</ExternalLink>
                <ExternalLink href={data.links.evidence}>Evidence Ledger</ExternalLink>
                <ExternalLink href={data.links.audits}>Audit Runs</ExternalLink>
              </div>
              <p className="inline-flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5" />本机接口 · 仅人工确认可写入 Published</p>
            </footer>
          </>
        ) : null}
      </main>

      <AnimatePresence>
        {helpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] bg-[#07182d]/55 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setHelpOpen(false);
            }}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="content-ops-help-title"
              className="ml-auto h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl"
            >
              <header className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[#07182d] px-5 py-4 text-white">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">DDNZ Content Ops</p>
                  <h2 id="content-ops-help-title" className="mt-1 text-xl font-black">生成器使用说明</h2>
                </div>
                <button type="button" onClick={() => setHelpOpen(false)} aria-label="关闭使用说明" className="flex h-11 w-11 items-center justify-center border border-white/20 hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </header>
              <div className="space-y-9 px-5 py-6 sm:px-8 sm:py-8">
                <section>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0b4f8a]">这是什么</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    这是 DDNZ 内容生成、查重、证据和审核的统一工作台。同一个主题会在不同页面留下选题、文章、证据和审计记录，它们不是四批不同文章。系统负责建立研究和起草流程；Approved、Scheduled 和 Published 必须由人工确认。
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-black">第一次使用：4 步</h3>
                  <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      '先在控制台处理“需要修改”的项目。',
                      '打开“可以继续”的选题、文章或复核任务。',
                      '在网站预览中检查正文、来源、图片和 CTA。',
                      '完成专业审核后，再由人工确认 Published；“通过”的项目无需重复处理。',
                    ].map((item, index) => (
                      <li key={item} className="flex gap-3 border border-slate-200 p-4 text-sm leading-6 text-slate-700">
                        <span className="font-mono font-black text-amber-700">{index + 1}</span><span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section>
                  <h3 className="text-lg font-black">完整生产链</h3>
                  <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                    {generatorSteps.map((item) => (
                      <div key={item.step} className="grid gap-2 py-3 sm:grid-cols-[64px_100px_1fr] sm:items-start">
                        <span className="font-mono font-black text-amber-700">{item.step}</span>
                        <span className="text-sm font-black">{item.title}</span>
                        <span className="text-sm leading-6 text-slate-600"><strong>{item.owner}：</strong>{item.body}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-black">三个操作标签怎么读</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {(Object.keys(decisionLabels) as UserDecision[]).map((state) => (
                      <div key={state} className="border border-slate-200 p-4">
                        <DecisionBadge state={state} reason={decisionLabels[state].detail} />
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">流程阶段告诉你“做到哪一步”；操作标签告诉你“现在需不需要行动”。两者不是同一件事。</p>
                </section>

                <section>
                  <h3 className="text-lg font-black">各页面的用途</h3>
                  <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                    {tabItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.key} className="grid gap-3 py-4 sm:grid-cols-[170px_1fr]">
                          <p className="inline-flex items-center gap-2 text-sm font-black"><Icon className="h-4 w-4 text-[#0b4f8a]" />{item.label}</p>
                          <div className="text-sm leading-6 text-slate-600">
                            <p>{tabGuidance[item.key].purpose}</p>
                            <p className="mt-1"><strong>下一步：</strong>{tabGuidance[item.key].action}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-black">常用字段与标签</h3>
                  <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                    {glossary.map(([term, meaning]) => (
                      <div key={term} className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                        <dt className="font-mono text-xs font-black text-[#0b4f8a]">{term}</dt>
                        <dd className="text-sm leading-6 text-slate-600">{meaning}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section className="grid gap-px border border-slate-300 bg-slate-300 sm:grid-cols-2">
                  <div className="bg-sky-50 p-5">
                    <p className="text-sm font-black text-[#0b4f8a]">系统可以做</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">候选模板、机械查重、研究/起草请求、治理闸门、Notion 网站预览、审计记录，以及 Published 后的每日 GitHub 网站同步。</p>
                  </div>
                  <div className="bg-amber-50 p-5">
                    <p className="text-sm font-black text-amber-900">必须由人完成</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">确认产品/货运事实、认证和案例真实性，指定 Reviewer，完成专业审核，并最终点击 Published。</p>
                  </div>
                </section>
              </div>
            </motion.aside>
          </motion.div>
        )}

        {brief && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] overflow-y-auto bg-[#07182d]/75 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-brief-title"
          >
            <motion.section initial={{ y: 18 }} animate={{ y: 0 }} exit={{ y: 12 }} className="mx-auto max-w-4xl bg-white shadow-2xl">
              <header className="flex items-start justify-between gap-4 bg-[#0b1f3a] px-5 py-4 text-white">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">Research & writing brief</p>
                  <h2 id="article-brief-title" className="mt-1 text-lg font-black">{brief.article.title}</h2>
                </div>
                <button type="button" onClick={() => setBrief(null)} aria-label="关闭 Brief" className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </header>
              <div className="grid gap-6 px-5 py-6 lg:grid-cols-2">
                <section>
                  <h3 className="font-black">研究检查清单</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {brief.brief.researchChecklist.map((item) => <li key={item} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#0b4f8a]" />{item}</li>)}
                  </ul>
                </section>
                <section>
                  <h3 className="font-black">正文结构</h3>
                  <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {brief.brief.draftOutline.map((item, index) => <li key={item} className="flex gap-2"><span className="font-mono font-black text-amber-700">{index + 1}</span>{item}</li>)}
                  </ol>
                </section>
                <section>
                  <h3 className="font-black">当前关联证据</h3>
                  {brief.brief.requiredEvidence.length ? (
                    <div className="mt-3 space-y-3">
                      {brief.brief.requiredEvidence.map((item) => (
                        <div key={`${item.claim}-${item.url}`} className="border border-slate-200 p-3 text-xs leading-5 text-slate-600">
                          <p className="font-bold text-slate-900">{item.claim}</p>
                          <p className="mt-1">{item.tier || '未分级'} · {statusLabels[item.status] || item.status} · 到期 {formatDate(item.expires)}</p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="mt-3 text-sm text-amber-800">尚未关联证据，不能推进到证据就绪。</p>}
                </section>
                <section>
                  <h3 className="font-black">图片与发布闸门</h3>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                    {brief.brief.imageBriefs.map((item) => (
                      <p key={item.placement}><strong>{item.placement === 'cover' ? '封面' : '正文图'}：</strong>{item.minimum || item.count} · {item.requirement}</p>
                    ))}
                    <div className="border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-xs leading-5">
                      {brief.brief.publishGate.join(' · ')}
                    </div>
                  </div>
                </section>
              </div>
            </motion.section>
          </motion.div>
        )}

        {previewLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#07182d]/70 backdrop-blur-sm"
          >
            <div className="bg-white px-8 py-7 text-center shadow-2xl">
              <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[#0b4f8a]" />
              <p className="mt-3 text-sm font-black">正在把 Notion Blocks 渲染成网站文章…</p>
            </div>
          </motion.div>
        )}

        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] overflow-y-auto bg-[#07182d]/90 px-0 py-0 backdrop-blur-md sm:px-5 sm:py-5"
          >
            <motion.section
              initial={{ y: 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="mx-auto min-h-[100dvh] max-w-6xl bg-white shadow-2xl sm:min-h-0"
            >
              <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-[#07182d] px-4 py-3 text-white sm:px-6">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">Final website preview</p>
                  <p className="truncate text-sm font-black">Notion Blocks → DDNZ 网站样式</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={preview.article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 px-2 text-xs font-black text-sky-200 hover:text-amber-300"
                  >
                    在 Notion 打开<ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    aria-label="关闭网站预览"
                    onClick={() => {
                      setPreview(null);
                      setPreviewMessage('');
                    }}
                    className="flex h-11 w-11 items-center justify-center border border-white/20 text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <header className="relative overflow-hidden bg-[#0b1f3a] px-5 pb-24 pt-14 text-white sm:px-10 lg:px-20 lg:pb-32">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_85%_15%,#0b4f8a_0,transparent_38%),radial-gradient(circle_at_10%_85%,#d97706_0,transparent_28%)]" />
                <div className="relative mx-auto max-w-4xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <Pill value={preview.article.status} />
                    <span className="text-xs font-bold text-slate-300">
                      {preview.article.contentType || preview.article.searchIntent}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {preview.article.audienceMarket}
                    </span>
                  </div>
                  <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
                    {preview.article.title}
                  </h1>
                  {preview.summary && (
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">{preview.summary}</p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
                    <span>{preview.readMinutes} 分钟阅读</span>
                    <span>{preview.article.evidenceCount} 条证据</span>
                    <span>{preview.article.auditCount} 次审核</span>
                    <span>复核方式：{reviewerLabel(preview.article)}</span>
                  </div>
                </div>
              </header>

              <article className="mx-auto max-w-4xl px-4 pb-36 sm:px-7 lg:px-10">
                {preview.coverUrl && (
                  <figure className="relative z-10 -mt-16 mb-10 aspect-[16/9] overflow-hidden border border-slate-200 bg-slate-100 shadow-2xl">
                    <img
                      src={preview.coverUrl}
                      alt={`${preview.article.title} cover`}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </figure>
                )}
                <section className="mb-10 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-3">
                  <div className="bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Quality</p>
                    <p className="mt-1 font-mono text-xl font-black">{preview.article.qualityScore ?? '—'}/100</p>
                  </div>
                  <div className="bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Topic Key</p>
                    <p className="mt-1 line-clamp-2 text-xs font-bold leading-5">{preview.article.topicKey || '缺失'}</p>
                  </div>
                  <div className="bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Primary CTA</p>
                    <p className="mt-1 text-sm font-black">{preview.article.primaryCTA || '未设置'}</p>
                  </div>
                </section>

                <div
                  className="content-ops-article prose prose-slate lg:prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: preview.html }}
                />
              </article>

              <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-6xl -translate-x-1/2 border-t border-slate-200 bg-white/96 px-4 py-3 shadow-[0_-12px_40px_rgba(15,23,42,.16)] backdrop-blur-xl">
                <div className="mx-auto flex max-w-5xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    {preview.article.status === 'Published' ? (
                      <p className="inline-flex items-center gap-2 text-sm font-black text-emerald-800">
                        <CheckCircle2 className="h-5 w-5" />已发布：当前预览就是网站同步后的文章结构。
                      </p>
                    ) : preview.article.status === 'Archived' ? (
                      <div className="text-sm text-slate-700">
                        <p className="font-black">已归档</p>
                        <p className="mt-0.5 text-xs">该旧文不再发布，网站会跳转到关联的权威文章。</p>
                      </div>
                    ) : preview.eligibility.canPublish ? (
                      <p className="inline-flex items-center gap-2 text-sm font-black text-emerald-800">
                        <CheckCircle2 className="h-5 w-5" />全部发布闸门已通过，等待你的专业审核。
                      </p>
                    ) : (
                      <div className="text-sm text-amber-900">
                        <p className="font-black">暂不能发布</p>
                        <p className="mt-0.5 text-xs">{preview.eligibility.blockers.join('；')}</p>
                      </div>
                    )}
                    {previewMessage && <p className="mt-1 text-xs font-bold text-[#0b4f8a]">{previewMessage}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => void publishPreview()}
                    disabled={preview.article.status === 'Published' || preview.article.status === 'Archived' || !preview.eligibility.canPublish || publishing}
                    className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-amber-600 px-5 text-sm font-black text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {publishing ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    {publishing
                      ? '正在写入审计并发布…'
                      : preview.article.status === 'Published'
                        ? '已 Published'
                        : preview.article.status === 'Archived'
                          ? '已归档'
                          : '我已完成审核：一键 Published'}
                  </button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {previewMessage && !preview && (
        <div className="fixed bottom-5 right-5 z-[80] max-w-md border-l-4 border-rose-500 bg-white px-5 py-4 text-sm font-bold shadow-2xl">
          {previewMessage}
          <button type="button" onClick={() => setPreviewMessage('')} className="ml-4 text-slate-400">
            <X className="inline h-4 w-4" />
          </button>
        </div>
      )}

      <style>{`
        .content-ops-article { color: #334155; font-size: 1.075rem; line-height: 1.82; }
        .content-ops-article h2, .content-ops-article h3, .content-ops-article h4 { color: #0b1f3a; font-weight: 850; line-height: 1.3; }
        .content-ops-article h2 { margin: 2.8rem 0 1.1rem; border-left: 5px solid #d97706; padding-left: .9rem; font-size: 1.9rem; }
        .content-ops-article h3 { margin: 2.2rem 0 1rem; font-size: 1.5rem; }
        .content-ops-article h4 { margin: 1.8rem 0 .8rem; font-size: 1.25rem; }
        .content-ops-article p, .content-ops-article ul, .content-ops-article ol { margin-bottom: 1.4rem; }
        .content-ops-article ul, .content-ops-article ol { padding-left: 1.6rem; }
        .content-ops-article ul { list-style: disc; }
        .content-ops-article ol { list-style: decimal; }
        .content-ops-article li { margin-bottom: .55rem; }
        .content-ops-article a { color: #b45309; font-weight: 750; text-decoration: underline; text-underline-offset: 3px; }
        .content-ops-article blockquote { margin: 2rem 0; border-left: 4px solid #0b4f8a; background: #eff6ff; padding: 1.25rem 1.5rem; }
        .content-ops-article .article-callout { display: flex; gap: .9rem; margin: 2rem 0; padding: 1.25rem; border: 1px solid #fde68a; background: #fffbeb; }
        .content-ops-article .article-figure { margin: 2.2rem 0; }
        .content-ops-article .article-figure img { width: 100%; height: auto; border: 1px solid #e2e8f0; }
        .content-ops-article .article-figure figcaption { margin-top: .65rem; color: #64748b; font-size: .875rem; }
        .content-ops-article .article-table-wrap { overflow-x: auto; margin: 2rem 0; border: 1px solid #e2e8f0; }
        .content-ops-article table { width: 100%; min-width: 660px; border-collapse: collapse; background: white; }
        .content-ops-article th { background: #0b1f3a; color: white; text-align: left; font-size: .78rem; text-transform: uppercase; letter-spacing: .04em; }
        .content-ops-article th, .content-ops-article td { padding: .9rem 1rem; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
        .content-ops-article details { margin: 1.5rem 0; border: 1px solid #e2e8f0; padding: 1rem; }
        .content-ops-article summary { cursor: pointer; font-weight: 800; color: #0b1f3a; }
        @media (max-width: 768px) { .content-ops-article h2 { font-size: 1.5rem; } .content-ops-article h3 { font-size: 1.28rem; } }
      `}</style>
    </div>
  );
}
