// 工作台：单页内多状态机
// states: empty → probing → single | playlist → converting → done
// 把 "M:SS" 或 "H:MM:SS" 字符串解析成秒
function parseDurSec(s) {
  if (!s) return 0;
  const parts = s.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

// 视频秒数 × 2 → 预计转换时间字符串
function estimateConvertTime(videoSec) {
  const min = Math.round(videoSec * 2 / 60);
  if (min >= 60) return '1小时+';
  return `约 ${Math.max(2, min)} 分钟`;
}

// IS_DEMO_HOST 由 data.jsx 定义（最先加载），这里直接使用

function WorkbenchPage({ navigate, user, setUser, addTutorial }) {
  const [state, setState] = useState('empty'); // empty / probing / single / playlist / converting / done
  const [url, setUrl] = useState('');
  const [probed, setProbed] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [rangeSpec, setRangeSpec] = useState('1-5');
  const [pipeline, setPipeline] = useState({ stage: 0, percent: 0, logs: [] });
  const [resultData, setResultData] = useState(null);
  const [probeError, setProbeError] = useState('');
  const esRef = useRef(null);

  // 接收首页传来的 URL
  useEffect(() => {
    if (window.__pendingUrl) {
      setUrl(window.__pendingUrl);
      probeUrl(window.__pendingUrl);
      window.__pendingUrl = null;
    }
    return () => { if (esRef.current) esRef.current.close(); };
  }, []);

  const probeUrl = async (u) => {
    setProbeError('');
    setState('probing');
    try {
      const resp = await fetch(`${BACKEND_URL}/api/probe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: u.trim() }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ detail: '请求失败' }));
        throw new Error(err.detail || '请求失败');
      }
      const data = await resp.json();
      setProbed(data);
      if (data.type === 'playlist') {
        setEpisodes(data.episodes.map(e => ({ ...e })));
        setState('playlist');
      } else {
        setState('single');
      }
    } catch (e) {
      setState('empty');
      // 区分：后端不存在（演示模式）vs 真正的请求错误
      const isNetErr = e instanceof TypeError || e.message.includes('Failed to fetch') || e.message.includes('网络');
      if (isNetErr) {
        setProbeError('backend_unavailable');
      } else {
        setProbeError(e.message);
      }
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!url.trim()) return;
    probeUrl(url.trim());
  };

  const startConvert = async () => {
    setState('converting');
    setPipeline({ stage: 1, percent: 0, logs: ['正在提交转换任务...'] });

    const urls = probed?.type === 'playlist'
      ? episodes.filter(e => e.selected).map(e => e.url)
      : [url.trim()];

    try {
      const resp = await fetch(`${BACKEND_URL}/api/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      if (!resp.ok) throw new Error('提交失败');
      const { job_id } = await resp.json();
      listenJob(job_id);
    } catch (e) {
      alert('提交失败：' + e.message);
      setState('single');
    }
  };

  const listenJob = (jobId) => {
    if (esRef.current) esRef.current.close();
    const es = new EventSource(`${BACKEND_URL}/api/stream/${jobId}`);
    esRef.current = es;

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'log') {
        const msg = data.msg.trim();
        if (!msg) return;
        const stageMatch = msg.match(/\[(\d)\/7\]/);
        setPipeline(p => ({
          ...p,
          stage: stageMatch ? parseInt(stageMatch[1]) : p.stage,
          logs: [...p.logs, msg],
        }));
      } else if (data.type === 'done') {
        es.close();
        const result = data.result;
        if (!result) {
          alert('转换失败：未能生成教程，请查看日志了解原因');
          setState('single');
          return;
        }
        setResultData(result);
        setState('done');
        addTutorial?.(result);
        if (user.tier === 'pack' && user.credits > 0) {
          setUser({ ...user, credits: user.credits - 1 });
        }
      } else if (data.type === 'error') {
        es.close();
        alert('转换失败：' + data.msg);
        setState('single');
      }
    };

    es.onerror = () => {
      es.close();
      alert('转换连接断开，请重试');
      setState('single');
    };
  };

  const reset = () => {
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
    setState('empty');
    setUrl('');
    setProbed(null);
    setEpisodes([]);
    setPipeline({ stage: 0, percent: 0, logs: [] });
    setResultData(null);
  };

  return (
    <div className="container" data-screen-label="02 转换工作台" style={{maxWidth: 960}}>

      {/* ── 演示模式提示条（仅在没有后端时显示）── */}
      {IS_DEMO_HOST && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          background: 'linear-gradient(135deg,#FFF5E0,#FFF0F5)',
          border: '1px solid #FFD9A0',
          borderRadius: 'var(--r-lg)',
          padding: '12px 18px',
          marginBottom: 24,
          fontSize: 13,
        }}>
          <span style={{fontSize: 18}}>🖥️</span>
          <div style={{flex: 1, minWidth: 200}}>
            <strong style={{color:'#B45309'}}>在线演示版</strong>
            <span style={{color:'#92400E', marginLeft: 6}}>
              AI 转换功能需要在本地运行后端服务（Python + FastAPI）。
              在线版可以浏览示例教程，体验完整阅读功能。
            </span>
          </div>
          <button
            onClick={() => navigate('library')}
            style={{
              padding: '6px 14px', borderRadius: 'var(--r-sm)',
              background: '#FB7299', color: '#fff',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
            查看示例教程 →
          </button>
        </div>
      )}

      {/* 标题区 */}
      <div style={{textAlign:'center', marginBottom: 32}}>
        <div className="tag tag-pink" style={{marginBottom: 12}}>
          <IconWand size={12}/> 转换工作台
        </div>
        <h1 className="h-2" style={{margin: '0 0 8px'}}>粘贴视频链接，AI 自动转笔记</h1>
        <p className="t-muted" style={{margin: 0}}>支持 B 站 / YouTube · 单集 + 合集多 P</p>
      </div>

      {/* 主区域：根据 state 切换 */}
      {(state === 'empty' || state === 'probing') && (
        <>
          <EmptyState
            url={url}
            setUrl={setUrl}
            onSubmit={handleSubmit}
            probing={state === 'probing'}
          />
          {/* 探测错误内嵌提示 */}
          {probeError && (
            <div style={{
              maxWidth: 720, margin: '16px auto 0',
              padding: '14px 18px',
              borderRadius: 'var(--r-lg)',
              background: probeError === 'backend_unavailable' ? '#FFF5E0' : '#FFF5F8',
              border: `1px solid ${probeError === 'backend_unavailable' ? '#FFD9A0' : '#FFBDD0'}`,
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <span style={{fontSize: 18, flexShrink: 0}}>
                {probeError === 'backend_unavailable' ? '💡' : '⚠️'}
              </span>
              <div style={{fontSize: 13, color: probeError === 'backend_unavailable' ? '#92400E' : '#c0392b'}}>
                {probeError === 'backend_unavailable' ? (
                  <>
                    <strong>后端服务未连接</strong>——在线版无法执行 AI 转换。
                    如需使用转换功能，请在本地启动后端：
                    <code style={{display:'block', marginTop: 6, padding: '6px 10px',
                      background:'rgba(0,0,0,.05)', borderRadius: 4, fontSize: 12, userSelect:'all'}}>
                      cd backend && uvicorn main:app --host 0.0.0.0 --port 8000
                    </code>
                    <button onClick={() => navigate('library')} style={{
                      marginTop: 8, padding: '4px 12px',
                      background: '#FB7299', color: '#fff',
                      borderRadius: 'var(--r-sm)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>或浏览示例教程 →</button>
                  </>
                ) : (
                  <><strong>探测失败</strong>：{probeError}</>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {state === 'single' && (
        <SingleVideoState
          info={probed}
          url={url}
          onCancel={reset}
          onStart={startConvert}
          user={user}
        />
      )}

      {state === 'playlist' && (
        <PlaylistState
          probed={probed}
          episodes={episodes}
          setEpisodes={setEpisodes}
          rangeSpec={rangeSpec}
          setRangeSpec={setRangeSpec}
          onCancel={reset}
          onStart={startConvert}
          user={user}
        />
      )}

      {state === 'converting' && (
        <ConvertingState pipeline={pipeline} info={probed}/>
      )}

      {state === 'done' && (
        <DoneState
          info={probed}
          result={resultData}
          onView={() => {
            window.__currentTutorial = resultData;
            navigate('result');
          }}
          onAnother={reset}
        />
      )}
    </div>
  );
}

// ───── 1. 空状态：粘贴框 ─────
function EmptyState({ url, setUrl, onSubmit, probing }) {
  return (
    <form onSubmit={onSubmit} className="anim-fadeUp" style={{
      background: '#fff',
      borderRadius: 'var(--r-2xl)',
      padding: 48,
      boxShadow: 'var(--sh-md)',
      maxWidth: 720, margin: '0 auto',
    }}>
      <div style={{textAlign:'center', marginBottom: 28}}>
        <div style={{
          width: 72, height: 72,
          borderRadius: '50%',
          background: 'var(--bili-pink-soft)',
          color: 'var(--bili-pink)',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin: '0 auto 16px',
        }}>
          <IconLink size={32}/>
        </div>
        <h3 className="h-3" style={{margin: 0}}>把链接放进来</h3>
        <p className="t-muted text-sm" style={{margin: '8px 0 0'}}>
          B 站视频 / 合集 / 多 P · YouTube · BV 号都可以
        </p>
      </div>

      <div style={{display:'flex', gap: 10}}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.bilibili.com/video/BV..."
          className="input"
          style={{flex: 1, height: 52, fontSize: 15}}
          disabled={probing}
          autoFocus
        />
        <button type="submit" className="btn btn-primary btn-lg" disabled={probing || !url.trim()}
          style={{height: 52, padding: '0 28px', opacity: probing || !url.trim() ? .5 : 1}}>
          {probing ? (
            <><Spinner/> 探测中 ...</>
          ) : (
            <>下一步 <IconArrowRight size={16}/></>
          )}
        </button>
      </div>

      {/* 链接示例 */}
      <div style={{marginTop: 24}}>
        <div className="text-xs t-faint" style={{marginBottom: 10}}>试试这些示例链接：</div>
        <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
          {[
            { label: '单集视频', url: 'https://www.bilibili.com/video/BV1Xb4y1k7gw' },
            { label: '合集（14 集）', url: 'https://www.bilibili.com/video/BV1Nx411Q7Bh' },
            { label: 'YouTube', url: 'https://youtube.com/watch?v=abc123' },
          ].map(d => (
            <button key={d.label} type="button"
              onClick={() => setUrl(d.url)}
              style={{
                padding: '5px 12px', fontSize: 12,
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-full)',
                color: 'var(--ink-2)',
                cursor: 'pointer',
              }}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 提示行 */}
      <div style={{
        marginTop: 28, padding: '14px 16px',
        background: 'var(--bili-blue-soft)',
        borderRadius: 'var(--r-md)',
        fontSize: 12, color: 'var(--bili-blue-deep)',
        display:'flex', gap: 10, alignItems:'flex-start',
      }}>
        <IconSparkles size={16} style={{flexShrink:0, marginTop:1}}/>
        <span>
          <b>小贴士：</b>
          视频越短笔记越精准。30 分钟内的视频效果最好。
          合集模式可以一次性把整套课程转成系列教程。
        </span>
      </div>
    </form>
  );
}

// ───── 2. 单视频确认 ─────
function SingleVideoState({ info, url, onCancel, onStart, user }) {
  const convertTime = estimateConvertTime(parseDurSec(info.duration));
  const gradients = {
    'gradient-1': 'linear-gradient(135deg, #FB7299 0%, #FFB36B 100%)',
    'gradient-2': 'linear-gradient(135deg, #00AEEC 0%, #6DD4F8 100%)',
    'gradient-3': 'linear-gradient(135deg, #8B5CF6 0%, #FB7299 100%)',
    'gradient-4': 'linear-gradient(135deg, #22C55E 0%, #00AEEC 100%)',
    'gradient-5': 'linear-gradient(135deg, #F59E0B 0%, #FB7299 100%)',
    'gradient-6': 'linear-gradient(135deg, #6366F1 0%, #FB7299 100%)',
  };
  const grad = gradients[info.cover] || gradients['gradient-1'];

  const canConvert = user.tier !== 'free' || user.freeTrialsRemain > 0;

  return (
    <div className="anim-fadeUp" style={{
      background: '#fff',
      borderRadius: 'var(--r-2xl)',
      padding: 32,
      boxShadow: 'var(--sh-md)',
    }}>
      <div className="tag tag-blue" style={{marginBottom: 16}}>
        <IconCheck size={12}/> 识别为单集视频
      </div>

      <div style={{display:'flex', gap: 24, marginBottom: 24}}>
        {/* 封面 */}
        <div style={{
          width: 240, height: 135, flexShrink: 0,
          borderRadius: 'var(--r-md)',
          background: grad,
          position:'relative',
          display:'flex', alignItems:'center', justifyContent:'center',
          color: '#fff',
        }}>
          <IconPlay size={28}/>
          <div style={{
            position:'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,.6)',
            padding: '2px 6px', borderRadius: 3,
            fontSize: 11,
          }}>{info.duration}</div>
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div className="h-4" style={{marginBottom: 8, lineHeight: 1.4}}>{info.title}</div>
          <div style={{display:'flex', alignItems:'center', gap: 14, color: 'var(--ink-2)', fontSize: 13, marginBottom: 12}}>
            <div style={{display:'flex', alignItems:'center', gap: 6}}>
              <div className="avatar" style={{width: 20, height: 20, fontSize: 10}}>{info.authorAvatar}</div>
              {info.author}
            </div>
            <span>·</span>
            <span><IconPlay size={11} style={{display:'inline'}}/> {info.views}</span>
            <span>·</span>
            <span>{info.uploadDate}</span>
          </div>
          <div style={{
            padding: 12, background: 'var(--bg)', borderRadius: 'var(--r-md)',
            fontSize: 12, color: 'var(--ink-2)',
            fontFamily: 'var(--font-mono)',
            wordBreak: 'break-all',
          }}>{url}</div>
        </div>
      </div>

      {/* 预估 + 操作 */}
      <div style={{
        padding: 16,
        background: 'linear-gradient(135deg, #FFF5F8 0%, #FFFBF0 100%)',
        borderRadius: 'var(--r-md)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        marginBottom: 20,
      }}>
        <div style={{display:'flex', gap: 24}}>
          <Estimate label="预计耗时" value={convertTime} icon={IconClock}/>
          <Estimate label="预计知识点" value="12-20 个" icon={IconList}/>
          <Estimate label="消耗额度" value="1 次" icon={IconCoin}/>
        </div>
        {user.tier === 'pack' && (
          <div className="text-xs t-muted">
            10次卡余额：<b style={{color:'var(--bili-pink)'}}>{user.credits}/10</b>
          </div>
        )}
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <button onClick={onCancel} className="btn btn-ghost">
          <IconArrowLeft size={14}/> 换一个链接
        </button>
        <button onClick={onStart} className="btn btn-primary btn-lg" disabled={!canConvert}>
          {canConvert ? <>开始转换 <IconWand size={16}/></> : '额度不足，去开通'}
        </button>
      </div>
    </div>
  );
}

function Estimate({ label, value, icon: I }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap: 10}}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'rgba(255,255,255,.7)',
        color: 'var(--bili-pink)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <I size={16}/>
      </div>
      <div>
        <div className="text-xs t-muted">{label}</div>
        <div style={{fontSize: 14, fontWeight: 600}}>{value}</div>
      </div>
    </div>
  );
}

// ───── 3. 合集选集 ─────
function PlaylistState({ probed, episodes, setEpisodes, rangeSpec, setRangeSpec, onCancel, onStart, user }) {
  const selectedCount = episodes.filter(e => e.selected).length;
  const totalDurationSec = episodes.filter(e => e.selected).reduce((s, e) => {
    return s + parseDurSec(e.duration);
  }, 0);
  const totalMin = Math.round(totalDurationSec / 60);

  const toggleEp = (idx) => {
    setEpisodes(episodes.map(e => e.idx === idx ? {...e, selected: !e.selected} : e));
  };

  const applyRange = () => {
    const indices = parseRange(rangeSpec, episodes.length);
    setEpisodes(episodes.map(e => ({...e, selected: indices.has(e.idx)})));
  };

  const selectAll = () => setEpisodes(episodes.map(e => ({...e, selected: true})));
  const selectNone = () => setEpisodes(episodes.map(e => ({...e, selected: false})));

  const canConvert = (user.tier === 'pro') || (user.tier === 'pack' && user.credits >= selectedCount) || (user.tier === 'free' && user.freeTrialsRemain >= selectedCount);

  return (
    <div className="anim-fadeUp" style={{
      background: '#fff',
      borderRadius: 'var(--r-2xl)',
      padding: 32,
      boxShadow: 'var(--sh-md)',
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 16}}>
        <div className="tag tag-pink">
          <IconList size={12}/> 识别为合集
        </div>
        <span className="text-xs t-muted">共 {episodes.length} 集</span>
      </div>

      <div style={{display:'flex', gap: 24, marginBottom: 24}}>
        <div style={{
          width: 200, height: 112, flexShrink: 0,
          borderRadius: 'var(--r-md)',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #FB7299 100%)',
          position:'relative',
          display:'flex', alignItems:'center', justifyContent:'center',
          color: '#fff',
        }}>
          <IconList size={32}/>
          <div style={{
            position:'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,.6)',
            padding: '2px 6px', borderRadius: 3,
            fontSize: 11, fontWeight: 600,
          }}>{episodes.length} P</div>
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div className="h-4" style={{marginBottom: 8, lineHeight: 1.4}}>{probed.title}</div>
          <div style={{display:'flex', alignItems:'center', gap: 14, color: 'var(--ink-2)', fontSize: 13}}>
            <div style={{display:'flex', alignItems:'center', gap: 6}}>
              <div className="avatar" style={{width: 20, height: 20, fontSize: 10}}>{probed.authorAvatar}</div>
              {probed.author}
            </div>
            <span>·</span>
            <span><IconClock size={11} style={{display:'inline'}}/> 总时长 {probed.totalDuration}</span>
            <span>·</span>
            <span><IconPlay size={11} style={{display:'inline'}}/> {probed.totalViews}</span>
          </div>
        </div>
      </div>

      {/* 范围选择器 */}
      <div style={{
        padding: 16,
        background: 'var(--bg)',
        borderRadius: 'var(--r-md)',
        marginBottom: 16,
      }}>
        <div style={{fontSize: 13, fontWeight: 600, marginBottom: 10}}>快速选择</div>
        <div style={{display:'flex', gap: 8, alignItems:'center', flexWrap:'wrap'}}>
          <input
            value={rangeSpec}
            onChange={e => setRangeSpec(e.target.value)}
            placeholder="如：1-10 / 1,3,5 / all"
            className="input"
            style={{height: 36, flex: 1, minWidth: 200, fontSize: 13, fontFamily: 'var(--font-mono)'}}
          />
          <button onClick={applyRange} className="btn btn-ghost btn-sm">应用</button>
          <div style={{height: 20, width: 1, background: 'var(--line)'}}/>
          <button onClick={selectAll} className="btn btn-outline btn-sm">全选</button>
          <button onClick={selectNone} className="btn btn-outline btn-sm">清空</button>
        </div>
        <div className="text-xs t-faint" style={{marginTop: 8}}>
          支持：<code>all</code> · <code>1-10</code> · <code>1,3,5</code> · <code>1-5,8,10-14</code>
        </div>
      </div>

      {/* 集数列表 */}
      <div style={{
        maxHeight: 320,
        overflowY: 'auto',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-md)',
        marginBottom: 16,
      }}>
        {episodes.map(ep => (
          <label key={ep.idx} style={{
            display:'flex', alignItems:'center', gap: 12,
            padding: '10px 16px',
            borderBottom: '1px solid var(--line-soft)',
            cursor: 'pointer',
            background: ep.selected ? 'var(--bili-pink-faint)' : '#fff',
            transition: 'background .15s',
          }}>
            <input type="checkbox" checked={ep.selected}
              onChange={() => toggleEp(ep.idx)}
              style={{
                width: 16, height: 16, accentColor: 'var(--bili-pink)',
                cursor: 'pointer',
              }}/>
            <span style={{
              minWidth: 32, fontSize: 12, color: 'var(--ink-3)',
              fontFamily: 'var(--font-mono)',
            }}>P{ep.idx.toString().padStart(2,'0')}</span>
            <span style={{flex: 1, fontSize: 13, color: ep.selected ? 'var(--ink-1)' : 'var(--ink-2)'}}>{ep.title}</span>
            <span style={{
              fontSize: 11, color: 'var(--ink-3)',
              fontFamily: 'var(--font-mono)',
            }}>{ep.duration}</span>
          </label>
        ))}
      </div>

      {/* 汇总 */}
      <div style={{
        padding: 16,
        background: 'linear-gradient(135deg, #FFF5F8 0%, #FFFBF0 100%)',
        borderRadius: 'var(--r-md)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        marginBottom: 20,
      }}>
        <div style={{display:'flex', gap: 24}}>
          <Estimate label="选中集数" value={`${selectedCount} 集`} icon={IconCheck}/>
          <Estimate label="预计耗时" value={estimateConvertTime(totalDurationSec)} icon={IconClock}/>
          <Estimate label="消耗额度" value={`${selectedCount} 次`} icon={IconCoin}/>
        </div>
        {user.tier === 'pack' && (
          <div className="text-xs t-muted">
            10次卡余额：<b style={{color:'var(--bili-pink)'}}>{user.credits}/10</b>
          </div>
        )}
        {user.tier === 'pro' && (
          <div className="tag tag-vip">
            <IconCrown size={11}/> PRO 不限次
          </div>
        )}
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <button onClick={onCancel} className="btn btn-ghost">
          <IconArrowLeft size={14}/> 换一个链接
        </button>
        <button onClick={onStart}
          className="btn btn-primary btn-lg"
          disabled={selectedCount === 0 || !canConvert}>
          {selectedCount === 0 ? '选择至少 1 集' :
           !canConvert ? '额度不足，去开通' :
           <>开始转换 {selectedCount} 集 <IconWand size={16}/></>}
        </button>
      </div>
    </div>
  );
}

// ───── 4. 转换进行中 ─────
function ConvertingState({ pipeline, info }) {
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [pipeline.logs.length]);

  const overall = Math.round(((pipeline.stage - 1) / 7 + pipeline.percent / 100 / 7) * 100);

  return (
    <div className="anim-fadeIn" style={{
      background: '#fff',
      borderRadius: 'var(--r-2xl)',
      padding: 32,
      boxShadow: 'var(--sh-md)',
    }}>
      <div style={{textAlign: 'center', marginBottom: 24}}>
        <div className="mascot" style={{display:'inline-block', marginBottom: 12}}>
          <Mascot size={80}/>
        </div>
        <h3 className="h-3" style={{margin: '0 0 4px'}}>学霸喵正在拼命整理笔记 ...</h3>
        <p className="t-muted text-sm" style={{margin: 0}}>
          《{info?.title?.slice(0, 30) || '...'}{info?.title?.length > 30 ? '...' : ''}》
        </p>
      </div>

      {/* 总进度 */}
      <div style={{marginBottom: 24}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom: 8, fontSize: 13}}>
          <span style={{fontWeight: 600}}>整体进度</span>
          <span style={{color: 'var(--bili-pink)', fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{overall}%</span>
        </div>
        <div className="progress-track" style={{height: 10}}>
          <div className="progress-fill" style={{width: `${overall}%`}}/>
        </div>
      </div>

      {/* 7 阶段 */}
      <div style={{
        display:'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 8,
        marginBottom: 24,
      }}>
        {PIPELINE_STAGES.map((stage, i) => {
          const stageNum = i + 1;
          const isActive = pipeline.stage === stageNum;
          const isDone = pipeline.stage > stageNum;
          const IconC = window[stage.icon];
          const color = isDone ? 'var(--success)' :
                        isActive ? 'var(--bili-pink)' :
                        'var(--ink-4)';
          return (
            <div key={stage.id} style={{
              display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: isActive ? 'var(--bili-pink-soft)' : isDone ? '#E8F8EE' : 'var(--bg)',
                color: color,
                display:'flex', alignItems:'center', justifyContent:'center',
                position: 'relative',
                transition: 'all .3s',
              }}>
                {isDone ? <IconCheck size={18}/> :
                 isActive ? (
                   <>
                     <IconC size={18}/>
                     <div style={{
                       position:'absolute', inset: -3,
                       borderRadius: '50%',
                       border: '2px solid var(--bili-pink)',
                       borderTopColor: 'transparent',
                       animation: 'spin 1s linear infinite',
                     }}/>
                   </>
                 ) : <IconC size={18}/>}
              </div>
              <div style={{
                fontSize: 11,
                color: isActive ? 'var(--ink-1)' : 'var(--ink-3)',
                fontWeight: isActive ? 600 : 500,
                marginTop: 6,
              }}>{stage.name}</div>
            </div>
          );
        })}
      </div>

      {/* 实时日志 */}
      <div ref={logRef} style={{
        height: 200,
        background: '#0F1117',
        borderRadius: 'var(--r-md)',
        padding: 16,
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: '#9DA5B4',
        overflowY: 'auto',
        lineHeight: 1.7,
      }}>
        {pipeline.logs.map((line, i) => {
          const isStageMarker = line.startsWith('———');
          const isSuccess = line.startsWith('✓');
          return (
            <div key={i} style={{
              color: isStageMarker ? '#FB7299' :
                     isSuccess ? '#22C55E' :
                     '#9DA5B4',
              fontWeight: isStageMarker ? 600 : 400,
              marginTop: isStageMarker && i > 0 ? 6 : 0,
            }}>
              {!isStageMarker && !isSuccess && <span style={{color: '#646E84'}}>$ </span>}
              {line}
            </div>
          );
        })}
        <div style={{display:'inline-block', width: 8, height: 14, background: '#FB7299', verticalAlign: 'middle',
          animation: 'pulse 1s infinite'}}/>
      </div>

      <div style={{
        marginTop: 16, padding: 12,
        background: 'var(--bili-blue-soft)',
        borderRadius: 'var(--r-md)',
        fontSize: 12, color: 'var(--bili-blue-deep)',
        display:'flex', alignItems:'center', gap: 8,
      }}>
        <IconSparkles size={14}/>
        <span>转换完成后会自动通知，关掉页面也没关系，可以在「我的教程」里找到。</span>
      </div>
    </div>
  );
}

// ───── 5. 完成 ─────
function DoneState({ info, result, onView, onAnother }) {
  return (
    <div className="anim-fadeUp" style={{
      background: '#fff',
      borderRadius: 'var(--r-2xl)',
      padding: 48,
      boxShadow: 'var(--sh-md)',
      textAlign: 'center',
    }}>
      <div style={{position:'relative', display:'inline-block', marginBottom: 16}}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'linear-gradient(135deg, #22C55E 0%, #00AEEC 100%)',
          color: '#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow: '0 8px 32px rgba(34, 197, 94, .3)',
        }}>
          <IconCheck size={42}/>
        </div>
        {/* 烟花装饰 */}
        {[-30, -10, 10, 30].map(deg => (
          <div key={deg} style={{
            position:'absolute', top: '50%', left: '50%',
            width: 4, height: 4, borderRadius: '50%',
            background: ['#FB7299', '#00AEEC', '#FFB400', '#22C55E'][Math.floor(Math.random()*4)],
            transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-60px)`,
          }}/>
        ))}
      </div>
      <h2 className="h-2" style={{margin: '0 0 8px'}}>笔记生成完成 🎉</h2>
      <p className="t-muted" style={{margin: '0 0 8px'}}>
        《{info?.title || '...'}》
      </p>
      <div style={{display:'flex', gap: 24, justifyContent:'center', margin: '20px 0 32px'}}>
        <ResultStat num={result?.keypointCount ?? 14} label="知识点"/>
        <ResultStat num={result?.keypoints?.reduce((s, k) => s + (k.frames || 0), 0) ?? 22} label="关键帧"/>
        <ResultStat num="--" label="耗时"/>
        <ResultStat num={result?.title ? '完成' : '--'} label="状态"/>
      </div>
      <div style={{display:'flex', gap: 12, justifyContent:'center'}}>
        <button onClick={onAnother} className="btn btn-outline">
          <IconRefresh size={14}/> 再转一个
        </button>
        <button onClick={onView} className="btn btn-primary btn-lg">
          查看教程 <IconArrowRight size={16}/>
        </button>
      </div>
    </div>
  );
}

function ResultStat({ num, label }) {
  return (
    <div>
      <div style={{fontSize: 24, fontWeight: 700, color: 'var(--bili-pink)'}}>{num}</div>
      <div className="text-xs t-muted">{label}</div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 14, height: 14, borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      animation: 'spin 1s linear infinite',
      display: 'inline-block',
    }}/>
  );
}

// 解析 "1-10 / 1,3,5 / all"
function parseRange(spec, total) {
  const out = new Set();
  const s = spec.trim().toLowerCase();
  if (s === 'all' || s === '全部' || s === '') {
    for (let i = 1; i <= total; i++) out.add(i);
    return out;
  }
  for (const part of s.split(',')) {
    const p = part.trim();
    if (p.includes('-')) {
      const [a, b] = p.split('-').map(x => parseInt(x));
      if (!isNaN(a) && !isNaN(b)) {
        for (let i = a; i <= b; i++) if (i >= 1 && i <= total) out.add(i);
      }
    } else {
      const n = parseInt(p);
      if (!isNaN(n) && n >= 1 && n <= total) out.add(n);
    }
  }
  return out;
}

Object.assign(window, { WorkbenchPage });
