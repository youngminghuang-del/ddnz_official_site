import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clipboard,
  Download,
  ExternalLink,
  FileSearch,
  Languages,
  LoaderCircle,
  PencilLine,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SOCIAL_CHANNELS, SOCIAL_PUBLISHING_PLATFORMS, type SocialPublishingPlatform } from '../../config/socialChannels';
import type { AiJobStage, ContentLanguage, ContentOpsAiJob, ContentPackage, PublicationRecord } from '../../types/contentOps';

export type AiCapabilities = {
  modelConnected: boolean;
  models: { strategy: string; adaptation: string; classification: string };
  persistence: string;
  recentJobs: ContentOpsAiJob[];
  channels: Record<SocialPublishingPlatform, {
    configured: boolean;
    verified?: boolean;
    directPublish: boolean;
    requiresMediaUrl?: boolean;
    reason?: string;
    verification?: { status: string; message: string; checkedAt: string };
  }>;
};

type TopicCandidate = {
  title: string;
  category: ContentPackage['parentTopic']['category'];
  market: string;
  buyerQuestion: string;
  angle: string;
  whyNow: string;
  primaryQuery: string;
  targetPath: string;
  suggestedLanguages: ContentLanguage[];
};

type TopicResult = { weeklyRationale: string; topics: TopicCandidate[] };
type AuditResult = { audit: ContentPackage['audit']; package: ContentPackage };
type PublishResult = {
  record: PublicationRecord;
  manualPackage: {
    copy: string;
    hashtags: string[];
    targetUrl: string;
    mediaBrief: string;
    accountUrl: string;
  };
};

const API_ROOT = '/api/content-ops';
const STORAGE_KEY = 'ddnz-content-ops-ai-jobs-v1';
const languageLabels: Record<ContentLanguage, string> = {
  en: 'English',
  ar: 'العربية',
  es: 'Español',
  fr: 'Français',
};
const stageLabels: Record<AiJobStage, string> = {
  topics: '选题',
  research: '研究',
  generate: '生成',
  audit: '审计',
  revise: '修改',
};
const steps = [
  ['01', '选题', '每周 3 个母选题'],
  ['02', '研究', '来源与事实台账'],
  ['03', '生成', '英文主内容与渠道版本'],
  ['04', '审计', '六项强制闸门'],
  ['05', '批准', '人工实名确认'],
  ['06', '发布', '直发或人工出口'],
] as const;

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const payload = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error || `请求失败（${response.status}）`);
  return payload;
}

function isContentPackage(value: unknown): value is ContentPackage {
  const candidate = value as ContentPackage;
  return Boolean(candidate?.id && candidate?.website?.title && Array.isArray(candidate?.socialPosts));
}

function loadStoredJobIds() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Partial<Record<AiJobStage, string>>;
    return value;
  } catch {
    return {};
  }
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ContentWorkflowWizard({
  capabilities,
  modelConnected,
}: {
  capabilities?: AiCapabilities;
  modelConnected: boolean;
}) {
  const [brief, setBrief] = useState('本周值得进口商关注的运输、商厨设备与户外产品决策');
  const [markets, setMarkets] = useState('Saudi Arabia, UAE, Latin America, West Africa, North Africa');
  const [languages, setLanguages] = useState<ContentLanguage[]>(['en']);
  const [jobs, setJobs] = useState<Partial<Record<AiJobStage, ContentOpsAiJob>>>({});
  const [topicResult, setTopicResult] = useState<TopicResult | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicCandidate | null>(null);
  const [research, setResearch] = useState<Record<string, unknown> | null>(null);
  const [contentPackage, setContentPackage] = useState<ContentPackage | null>(null);
  const [activePlatform, setActivePlatform] = useState<SocialPublishingPlatform>('linkedin');
  const [activeLanguage, setActiveLanguage] = useState<ContentLanguage>('en');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [approved, setApproved] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [editingPost, setEditingPost] = useState(false);
  const [postEdit, setPostEdit] = useState({ copy: '', hashtags: '', targetUrl: '', mediaBrief: '' });
  const [publishResults, setPublishResults] = useState<Partial<Record<SocialPublishingPlatform, PublishResult>>>({});
  const [busyStage, setBusyStage] = useState<AiJobStage | 'publish' | ''>('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const ingestJob = useCallback((job: ContentOpsAiJob) => {
    setJobs((current) => ({ ...current, [job.stage]: job }));
    if (job.status !== 'completed') return;
    if (job.stage === 'topics') {
      const result = job.result as TopicResult;
      if (Array.isArray(result?.topics)) setTopicResult(result);
    }
    if (job.stage === 'research' && job.result && typeof job.result === 'object') {
      setResearch(job.result as Record<string, unknown>);
      const topic = job.input.topic as TopicCandidate | undefined;
      if (topic?.title) setSelectedTopic(topic);
    }
    if ((job.stage === 'generate' || job.stage === 'revise') && isContentPackage(job.result)) {
      setContentPackage(job.result);
      setConfirmationTitle('');
      setApproved(false);
    }
    if (job.stage === 'audit') {
      const result = job.result as AuditResult;
      if (isContentPackage(result?.package)) setContentPackage(result.package);
    }
  }, []);

  useEffect(() => {
    const stored = loadStoredJobIds();
    Object.values(stored).filter(Boolean).forEach((jobId) => {
      void apiRequest<ContentOpsAiJob>(`/ai/jobs/${jobId}`)
        .then(ingestJob)
        .catch(() => undefined);
    });
  }, [ingestJob]);

  useEffect(() => {
    const ids = Object.fromEntries(Object.entries(jobs).map(([stage, job]) => [stage, job?.id]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [jobs]);

  useEffect(() => {
    const active = Object.values(jobs).filter((job) => job && ['queued', 'in_progress'].includes(job.status));
    if (!active.length) return;
    const timer = window.setInterval(() => {
      active.forEach((job) => {
        void apiRequest<ContentOpsAiJob>(`/ai/jobs/${job!.id}`)
          .then((next) => {
            ingestJob(next);
            if (next.status === 'failed') setError(next.error || `${stageLabels[next.stage]}任务失败，内容与任务记录已保留。`);
          })
          .catch((pollError) => setError(pollError instanceof Error ? pollError.message : '读取任务状态失败。'));
      });
    }, 2800);
    return () => window.clearInterval(timer);
  }, [ingestJob, jobs]);

  const startJob = useCallback(async (stage: AiJobStage, input: Record<string, unknown>) => {
    setBusyStage(stage);
    setError('');
    setNotice('');
    try {
      const job = await apiRequest<ContentOpsAiJob>(`/ai/${stage}`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      ingestJob(job);
      setNotice(`${stageLabels[stage]}任务已保存并进入队列。可以离开页面，回来后会继续显示进度。`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : `${stageLabels[stage]}任务无法启动。`);
    } finally {
      setBusyStage('');
    }
  }, [ingestJob]);

  const activeJob = Object.values(jobs).find((job) => job && ['queued', 'in_progress'].includes(job.status));
  const failedJob = Object.values(jobs)
    .filter((job): job is ContentOpsAiJob => Boolean(job?.status === 'failed'))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0];
  const currentStep = contentPackage?.workflowStatus === 'Audit Passed'
    ? 5
    : contentPackage
      ? 4
      : research
        ? 3
        : selectedTopic
          ? 2
          : topicResult
            ? 1
            : 0;
  const selectedPost = useMemo(() => {
    if (!contentPackage) return null;
    return contentPackage.socialPosts.find((post) => post.platform === activePlatform && post.language === activeLanguage)
      || contentPackage.socialPosts.find((post) => post.platform === activePlatform && post.language === 'en')
      || null;
  }, [activeLanguage, activePlatform, contentPackage]);

  useEffect(() => {
    setEditingPost(false);
    setPostEdit({
      copy: selectedPost?.copy || '',
      hashtags: selectedPost?.hashtags.join(' ') || '',
      targetUrl: selectedPost?.targetUrl || '',
      mediaBrief: selectedPost?.mediaBrief || '',
    });
  }, [selectedPost]);
  const directAvailable = Boolean(
    activePlatform !== 'tiktok'
      && capabilities?.channels?.[activePlatform]?.configured
      && capabilities?.channels?.[activePlatform]?.directPublish,
  );
  const auditPassed = contentPackage?.workflowStatus === 'Audit Passed' && contentPackage.audit.status === 'pass';
  const humanApprovalReady = Boolean(auditPassed && approved && reviewer.trim() && confirmationTitle === contentPackage?.website.title);

  const toggleLanguage = (language: ContentLanguage) => {
    if (language === 'en') return;
    setLanguages((current) => current.includes(language)
      ? current.filter((item) => item !== language)
      : [...current, language]);
  };

  const publish = async () => {
    if (!contentPackage) return;
    setBusyStage('publish');
    setError('');
    setNotice('');
    try {
      const result = await apiRequest<PublishResult>(`/publish/${activePlatform}`, {
        method: 'POST',
        body: JSON.stringify({
          package: contentPackage,
          language: activeLanguage,
          reviewer,
          confirmationTitle,
          approved,
          mode: directAvailable ? 'direct' : 'manual',
          mediaUrl,
        }),
      });
      setPublishResults((current) => ({ ...current, [activePlatform]: result }));
      setNotice(result.record.message);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : '发布请求失败；ContentPackage 仍保留在本地。');
    } finally {
      setBusyStage('');
    }
  };

  const copyManualPackage = async () => {
    const manual = publishResults[activePlatform]?.manualPackage;
    if (!manual) return;
    await navigator.clipboard.writeText(`${manual.copy}\n\n${manual.hashtags.join(' ')}\n${manual.targetUrl}`);
    setNotice(`${SOCIAL_CHANNELS[activePlatform].label} 文案与追踪链接已复制。`);
  };

  const saveManualPostEdit = () => {
    if (!contentPackage || !selectedPost) return;
    try {
      const target = new URL(postEdit.targetUrl);
      const requiredTracking = ['utm_source', 'utm_campaign', 'utm_content'];
      if (!['www.ddnzglobal.com', 'ddnzglobal.com'].includes(target.hostname) || requiredTracking.some((key) => !target.searchParams.get(key))) {
        throw new Error('目标链接必须是 DDNZ 官网链接，并保留 utm_source、utm_campaign 与 utm_content。');
      }
    } catch (editError) {
      setError(editError instanceof Error ? editError.message : '目标链接格式无效。');
      return;
    }
    const now = new Date().toISOString();
    setContentPackage((current) => current ? {
      ...current,
      version: current.version + 1,
      workflowStatus: 'Draft',
      updatedAt: now,
      audit: {
        status: 'pending',
        score: 0,
        summary: '人工修改了渠道版本，必须重新执行六项审计。',
        gates: [],
        blockers: [],
        requiredChanges: [],
        model: '',
        auditedAt: '',
      },
      socialPosts: current.socialPosts.map((post) => post.platform === selectedPost.platform && post.language === selectedPost.language ? {
        ...post,
        copy: postEdit.copy.trim(),
        hashtags: postEdit.hashtags.split(/\s+/).map((tag) => tag.trim()).filter(Boolean),
        targetUrl: postEdit.targetUrl.trim(),
        mediaBrief: postEdit.mediaBrief.trim(),
      } : post),
    } : current);
    setApproved(false);
    setConfirmationTitle('');
    setEditingPost(false);
    setError('');
    setNotice('人工修改已保存为新版本；原审计结果已撤销，请回到左侧重新执行六项审计。');
  };

  return (
    <section className="overflow-hidden border border-slate-300 bg-[#f7f8fa]" aria-labelledby="ai-workflow-title">
      <header className="border-b border-slate-300 bg-[#0b1f3a] px-5 py-6 text-white sm:px-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.17em] text-amber-400">
              <Sparkles className="h-4 w-4" /> GPT-5.6 content desk
            </div>
            <h2 id="ai-workflow-title" className="mt-2 text-2xl font-black sm:text-3xl">从一个母选题到四个平台发布包</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Sol 负责选题、联网研究、英文主内容和终审；Terra 负责渠道改写与翻译。系统只能输出草稿或“审计通过”，批准与发布始终由你完成。</p>
          </div>
          <div className={`inline-flex min-h-11 items-center gap-2 self-start border px-4 text-sm font-black ${modelConnected ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200' : 'border-amber-400/50 bg-amber-400/10 text-amber-200'}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${modelConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {modelConnected ? 'GPT-5.6 已连接' : '等待 OPENAI_API_KEY'}
          </div>
        </div>
      </header>

      <ol className="grid border-b border-slate-300 bg-white sm:grid-cols-3 xl:grid-cols-6" aria-label="内容运营六步流程">
        {steps.map(([number, label, description], index) => (
          <li key={label} className={`min-h-[92px] border-b border-slate-200 px-4 py-4 sm:border-r xl:border-b-0 ${index <= currentStep ? 'bg-sky-50' : ''}`} aria-current={index === currentStep ? 'step' : undefined}>
            <div className="flex items-center justify-between gap-2">
              <span className={`font-mono text-xs font-black ${index <= currentStep ? 'text-[#0b4f8a]' : 'text-slate-400'}`}>{number}</span>
              {index < currentStep && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            </div>
            <p className="mt-2 text-sm font-black text-slate-900">{label}</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">{description}</p>
          </li>
        ))}
      </ol>

      {(error || notice || activeJob) && (
        <div className={`border-b px-5 py-4 ${error ? 'border-rose-200 bg-rose-50' : 'border-sky-200 bg-sky-50'}`} role="status" aria-live="polite">
          <div className="flex items-start gap-3">
            {activeJob ? <LoaderCircle className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-[#0b4f8a]" /> : error ? <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />}
            <div className="min-w-0 flex-1">
              {activeJob && <p className="font-black text-slate-900">{stageLabels[activeJob.stage]}进行中 · {activeJob.phase} · {activeJob.model}</p>}
              <p className={`text-sm leading-6 ${error ? 'text-rose-800' : 'text-slate-700'}`}>{error || notice || '正在处理，任务已保存。'}</p>
              {activeJob && <p className="mt-1 text-xs text-slate-500">后台任务编号：{activeJob.id}</p>}
              {!activeJob && failedJob && (
                <button type="button" disabled={Boolean(busyStage)} onClick={() => void startJob(failedJob.stage, failedJob.input)} className="mt-3 inline-flex min-h-10 items-center gap-2 border border-rose-300 bg-white px-3 text-xs font-black text-rose-800 hover:bg-rose-50 disabled:opacity-50">
                  <RefreshCw className="h-4 w-4" />重试上次{stageLabels[failedJob.stage]}任务
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,.85fr)]">
        <div className="space-y-6 p-4 sm:p-6">
          <section className="border border-slate-300 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#0b4f8a]">01 · 本周选题</p>
              <h3 className="mt-1 text-lg font-black text-slate-900">告诉系统本周重点，生成三个不重复的母选题</h3>
            </div>
            <div className="space-y-4 p-5">
              <label className="block text-sm font-black text-slate-700">运营重点
                <textarea value={brief} onChange={(event) => setBrief(event.target.value)} rows={3} className="mt-2 w-full border border-slate-300 p-3 text-base leading-6 outline-none focus:border-[#0b4f8a] focus:ring-2 focus:ring-sky-100" />
              </label>
              <label className="block text-sm font-black text-slate-700">目标市场
                <input value={markets} onChange={(event) => setMarkets(event.target.value)} className="mt-2 min-h-11 w-full border border-slate-300 px-3 text-base outline-none focus:border-[#0b4f8a] focus:ring-2 focus:ring-sky-100" />
              </label>
              <fieldset>
                <legend className="text-sm font-black text-slate-700">输出语言（英文固定为主语言）</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(languageLabels) as ContentLanguage[]).map((language) => {
                    const active = languages.includes(language);
                    return <button key={language} type="button" onClick={() => toggleLanguage(language)} aria-pressed={active} className={`min-h-11 border px-3 text-sm font-black ${active ? 'border-[#0b4f8a] bg-[#0b4f8a] text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'} ${language === 'en' ? 'cursor-default' : ''}`}>{active && <Check className="mr-1 inline h-4 w-4" />}{languageLabels[language]}</button>;
                  })}
                </div>
              </fieldset>
              <button type="button" disabled={!modelConnected || Boolean(activeJob) || busyStage === 'topics'} onClick={() => {
                setTopicResult(null); setSelectedTopic(null); setResearch(null); setContentPackage(null); setPublishResults({});
                void startJob('topics', { brief, markets, languages, weeklyTopicCount: 3 });
              }} className="inline-flex min-h-11 items-center gap-2 bg-amber-500 px-5 text-sm font-black text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50">
                {busyStage === 'topics' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}生成本周 3 个母选题
              </button>
            </div>
          </section>

          {topicResult && (
            <section className="border border-slate-300 bg-white">
              <div className="border-b border-slate-200 px-5 py-4">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#0b4f8a]">02 · 选择与研究</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{topicResult.weeklyRationale}</p>
              </div>
              <div className="divide-y divide-slate-200">
                {topicResult.topics.map((topic) => {
                  const selected = selectedTopic?.title === topic.title;
                  return (
                    <button key={`${topic.category}-${topic.title}`} type="button" onClick={() => setSelectedTopic(topic)} className={`block w-full px-5 py-5 text-left hover:bg-slate-50 ${selected ? 'border-l-4 border-[#0b4f8a] bg-sky-50' : 'border-l-4 border-transparent'}`}>
                      <span className="text-[11px] font-black uppercase tracking-[0.12em] text-amber-700">{topic.category} · {topic.market}</span>
                      <span className="mt-1 block text-base font-black text-slate-900">{topic.title}</span>
                      <span className="mt-2 block text-sm leading-6 text-slate-600">{topic.angle}</span>
                      <span className="mt-2 block text-xs text-slate-500">为什么现在：{topic.whyNow}</span>
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-slate-200 bg-slate-50 p-4 sm:px-5">
                <button type="button" disabled={!selectedTopic || Boolean(activeJob) || busyStage === 'research'} onClick={() => selectedTopic && void startJob('research', { topic: selectedTopic, languages, operatorContext: { brief, markets } })} className="inline-flex min-h-11 items-center gap-2 bg-[#0b4f8a] px-5 text-sm font-black text-white hover:bg-[#083b68] disabled:opacity-50">
                  {busyStage === 'research' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}联网研究所选主题
                </button>
              </div>
            </section>
          )}

          {research && selectedTopic && (
            <section className="border border-slate-300 bg-white">
              <div className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-[#0b4f8a]">03 · 生成</p>
                  <h3 className="mt-1 text-lg font-black text-slate-900">研究包已完成，可以生成统一 ContentPackage</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">来源台账、未解决问题和市场限定已进入生成上下文；英文正文由 Sol 生成，渠道和多语言版本由 Terra 完成。</p>
                </div>
                <button type="button" disabled={Boolean(activeJob) || busyStage === 'generate'} onClick={() => void startJob('generate', { topic: selectedTopic, research, languages })} className="inline-flex min-h-11 items-center justify-center gap-2 bg-amber-500 px-5 text-sm font-black text-slate-950 hover:bg-amber-400 disabled:opacity-50">
                  {busyStage === 'generate' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}生成主内容与渠道版本
                </button>
              </div>
            </section>
          )}

          {contentPackage && (
            <section className="border border-slate-300 bg-white">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.15em] text-[#0b4f8a]">04 · 六项审计</p>
                    <h3 className="mt-1 text-lg font-black text-slate-900">{contentPackage.website.title}</h3>
                  </div>
                  <span className={`border px-3 py-1.5 text-xs font-black ${auditPassed ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : contentPackage.audit.status === 'needs_changes' ? 'border-rose-300 bg-rose-50 text-rose-800' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>{contentPackage.workflowStatus} · v{contentPackage.version}</span>
                </div>
              </div>
              <div className="p-5">
                {contentPackage.audit.gates.length > 0 && (
                  <div className="grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2">
                    {contentPackage.audit.gates.map((gate) => (
                      <div key={gate.gate} className="bg-white p-3">
                        <p className={`text-xs font-black uppercase ${gate.result === 'pass' ? 'text-emerald-700' : 'text-rose-700'}`}>{gate.gate} · {gate.result}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{gate.finding}</p>
                      </div>
                    ))}
                  </div>
                )}
                {contentPackage.audit.status === 'needs_changes' && (
                  <div className="mt-4 border-l-4 border-rose-600 bg-rose-50 p-4">
                    <p className="font-black text-rose-900">必须修改</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-rose-800">{contentPackage.audit.requiredChanges.map((change) => <li key={change}>{change}</li>)}</ul>
                    <label className="mt-4 block text-sm font-black text-slate-700">人工修改要求
                      <textarea value={revisionNotes} onChange={(event) => setRevisionNotes(event.target.value)} rows={3} className="mt-2 w-full border border-rose-200 bg-white p-3 text-base outline-none focus:border-rose-500" />
                    </label>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  {contentPackage.audit.status === 'needs_changes' ? (
                    <button type="button" disabled={Boolean(activeJob) || busyStage === 'revise'} onClick={() => void startJob('revise', { package: contentPackage, audit: contentPackage.audit, operatorNotes: revisionNotes })} className="inline-flex min-h-11 items-center gap-2 bg-rose-700 px-5 text-sm font-black text-white hover:bg-rose-800 disabled:opacity-50"><RefreshCw className="h-4 w-4" />按审计意见修改</button>
                  ) : (
                    <button type="button" disabled={Boolean(activeJob) || busyStage === 'audit' || auditPassed} onClick={() => void startJob('audit', { package: contentPackage })} className="inline-flex min-h-11 items-center gap-2 bg-[#0b4f8a] px-5 text-sm font-black text-white hover:bg-[#083b68] disabled:opacity-50"><ShieldCheck className="h-4 w-4" />执行来源、事实、品牌、语言、敏感与平台审计</button>
                  )}
                  {contentPackage.audit.status === 'pending' && <button type="button" onClick={() => downloadJson(`${contentPackage.website.slug}-draft.json`, contentPackage)} className="inline-flex min-h-11 items-center gap-2 border border-slate-300 px-4 text-sm font-black text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" />下载草稿</button>}
                </div>
              </div>
            </section>
          )}
        </div>

        <aside className="border-t border-slate-300 bg-white p-4 sm:p-6 xl:border-l xl:border-t-0">
          <div className="sticky top-6 space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#0b4f8a]">05–06 · 预览、批准与发布</p>
              <h3 className="mt-1 text-lg font-black text-slate-900">四个平台统一出口</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">未审计通过时，批准控件会保持锁定。TikTok 第一阶段始终导出人工发布包。</p>
            </div>

            <div className="grid grid-cols-2 gap-px border border-slate-300 bg-slate-300" role="tablist" aria-label="平台预览">
              {SOCIAL_PUBLISHING_PLATFORMS.map((platform) => (
                <button key={platform} type="button" role="tab" aria-selected={activePlatform === platform} onClick={() => setActivePlatform(platform)} className={`min-h-11 bg-white px-3 text-sm font-black ${activePlatform === platform ? 'bg-[#0b4f8a] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{SOCIAL_CHANNELS[platform].label}</button>
              ))}
            </div>

            {contentPackage ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {contentPackage.requestedLanguages.map((language) => <button key={language} type="button" onClick={() => setActiveLanguage(language)} className={`min-h-10 border px-3 text-xs font-black ${activeLanguage === language ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-300 text-slate-600'}`}>{languageLabels[language]}</button>)}
                </div>
                <article className="border border-slate-300 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <a href={SOCIAL_CHANNELS[activePlatform].publicUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-black text-[#0b4f8a] hover:underline">{SOCIAL_CHANNELS[activePlatform].handle}<ExternalLink className="h-3.5 w-3.5" /></a>
                    <span className={`text-[10px] font-black uppercase ${directAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>{directAvailable ? 'API 直发已配置' : '人工发布出口'}</span>
                  </div>
                  {!directAvailable && capabilities?.channels?.[activePlatform]?.verification?.message && (
                    <p className="mt-2 text-[11px] leading-5 text-amber-800">{capabilities.channels[activePlatform].verification!.message}</p>
                  )}
                  {selectedPost ? (
                    <>
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-800">{selectedPost.copy}</p>
                      <p className="mt-3 text-xs font-bold leading-5 text-[#0b4f8a]">{selectedPost.hashtags.join(' ')}</p>
                      <a href={selectedPost.targetUrl} target="_blank" rel="noreferrer" className="mt-3 block break-all text-xs text-slate-500 underline">{selectedPost.targetUrl}</a>
                      <div className="mt-4 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-600"><strong>素材说明：</strong>{selectedPost.mediaBrief}</div>
                    </>
                  ) : <p className="mt-4 text-sm text-rose-700">这个平台没有所选语言版本。</p>}
                </article>

                {selectedPost && (
                  <div className="border border-slate-300 bg-white">
                    <button type="button" onClick={() => setEditingPost((current) => !current)} aria-expanded={editingPost} className="flex min-h-11 w-full items-center justify-between gap-3 px-4 text-left text-sm font-black text-slate-800 hover:bg-slate-50">
                      <span className="inline-flex items-center gap-2"><PencilLine className="h-4 w-4 text-[#0b4f8a]" />人工修改当前渠道版本</span>
                      <span className="text-[10px] font-bold text-amber-700">修改后必须重审</span>
                    </button>
                    {editingPost && (
                      <div className="space-y-3 border-t border-slate-200 bg-slate-50 p-4">
                        <label className="block text-xs font-black text-slate-700">平台文案<textarea value={postEdit.copy} onChange={(event) => setPostEdit((current) => ({ ...current, copy: event.target.value }))} rows={7} className="mt-1 w-full border border-slate-300 bg-white p-3 text-base leading-6 outline-none focus:border-[#0b4f8a]" /></label>
                        <label className="block text-xs font-black text-slate-700">标签（用空格分隔）<input value={postEdit.hashtags} onChange={(event) => setPostEdit((current) => ({ ...current, hashtags: event.target.value }))} className="mt-1 min-h-11 w-full border border-slate-300 bg-white px-3 text-base outline-none focus:border-[#0b4f8a]" /></label>
                        <label className="block text-xs font-black text-slate-700">带 UTM 的官网目标链接<input value={postEdit.targetUrl} onChange={(event) => setPostEdit((current) => ({ ...current, targetUrl: event.target.value }))} className="mt-1 min-h-11 w-full border border-slate-300 bg-white px-3 text-base outline-none focus:border-[#0b4f8a]" /></label>
                        <label className="block text-xs font-black text-slate-700">素材说明<textarea value={postEdit.mediaBrief} onChange={(event) => setPostEdit((current) => ({ ...current, mediaBrief: event.target.value }))} rows={3} className="mt-1 w-full border border-slate-300 bg-white p-3 text-base leading-6 outline-none focus:border-[#0b4f8a]" /></label>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={saveManualPostEdit} disabled={!postEdit.copy.trim() || !postEdit.targetUrl.trim()} className="min-h-10 bg-[#0b4f8a] px-4 text-xs font-black text-white hover:bg-[#083b68] disabled:opacity-50">保存为新版本并重新审计</button>
                          <button type="button" onClick={() => setEditingPost(false)} className="min-h-10 border border-slate-300 bg-white px-4 text-xs font-black text-slate-600 hover:bg-slate-50">取消</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className={`border-l-4 p-4 ${auditPassed ? 'border-emerald-600 bg-emerald-50' : 'border-slate-400 bg-slate-50'}`}>
                  <p className="flex items-center gap-2 font-black text-slate-900"><ShieldCheck className="h-4 w-4" />人工批准</p>
                  <div className="mt-3 space-y-3">
                    <label className="block text-sm font-black text-slate-700">审核人姓名<input value={reviewer} onChange={(event) => setReviewer(event.target.value)} disabled={!auditPassed} className="mt-1 min-h-11 w-full border border-slate-300 bg-white px-3 text-base disabled:bg-slate-100" /></label>
                    <label className="block text-sm font-black text-slate-700">准确输入内容标题确认<input value={confirmationTitle} onChange={(event) => setConfirmationTitle(event.target.value)} disabled={!auditPassed} placeholder={contentPackage.website.title} className="mt-1 min-h-11 w-full border border-slate-300 bg-white px-3 text-base disabled:bg-slate-100" /></label>
                    <label className="flex min-h-11 items-start gap-3 text-sm font-bold leading-6 text-slate-700"><input type="checkbox" checked={approved} onChange={(event) => setApproved(event.target.checked)} disabled={!auditPassed} className="mt-1 h-5 w-5 accent-[#0b4f8a]" />我已人工核对来源、事实、品牌、语言、敏感信息、素材与目标链接，并授权本次发布。</label>
                  </div>
                </div>

                {activePlatform === 'instagram' && directAvailable && <label className="block text-sm font-black text-slate-700">Instagram 公开图片 URL<input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} placeholder="https://www.ddnzglobal.com/images/..." className="mt-1 min-h-11 w-full border border-slate-300 px-3 text-base" /></label>}

                <button type="button" disabled={!humanApprovalReady || !selectedPost || busyStage === 'publish'} onClick={() => void publish()} className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-amber-500 px-5 text-sm font-black text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                  {busyStage === 'publish' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{directAvailable ? `发布到 ${SOCIAL_CHANNELS[activePlatform].label}` : `生成 ${SOCIAL_CHANNELS[activePlatform].label} 人工发布包`}
                </button>

                {publishResults[activePlatform] && (
                  <div className="border border-emerald-300 bg-emerald-50 p-4">
                    <p className="font-black text-emerald-900">{publishResults[activePlatform]!.record.status === 'published' ? '平台已返回发布回执' : '人工发布包已准备好'}</p>
                    <p className="mt-1 text-xs leading-5 text-emerald-800">{publishResults[activePlatform]!.record.message}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => void copyManualPackage()} className="inline-flex min-h-10 items-center gap-2 border border-emerald-400 bg-white px-3 text-xs font-black text-emerald-900"><Clipboard className="h-4 w-4" />复制文案</button>
                      <button type="button" onClick={() => downloadJson(`${contentPackage.website.slug}-${activePlatform}-${activeLanguage}.json`, publishResults[activePlatform])} className="inline-flex min-h-10 items-center gap-2 border border-emerald-400 bg-white px-3 text-xs font-black text-emerald-900"><Download className="h-4 w-4" />下载包与回执</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                <FileSearch className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 font-black text-slate-700">先完成左侧选题、研究与生成</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">生成后，这里会自动显示四个平台和多语言预览。</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
