// 结果详情页：教程在线阅读 + 导出 + 分享
function ResultPage({ navigate, user, tutorials = [] }) {
  const tutId = window.__currentTutorialId || 't001';
  const tutorial = window.__currentTutorial
    || tutorials.find(t => t.id === tutId)
    || SAMPLE_TUTORIALS.find(t => t.id === tutId)
    || SAMPLE_TUTORIALS[0];
  const [activeKp, setActiveKp] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentRef = useRef(null);

  // 滚动监听 → 自动同步阅读进度
  useEffect(() => {
    const kps = tutorial.keypoints || [];
    if (!kps.length) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const i = parseInt(e.target.getAttribute('data-kp-idx'));
            if (!isNaN(i)) setActiveKp(i);
          }
        });
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 }
    );
    kps.forEach((_, i) => {
      const el = document.getElementById(`kp-${i}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tutorial]);

  // 滚动到锚点
  const scrollToKp = (idx) => {
    setActiveKp(idx);
    const el = document.getElementById(`kp-${idx}`);
    if (el && contentRef.current) {
      const containerTop = contentRef.current.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      window.scrollTo({
        top: window.scrollY + (elTop - containerTop) - 100,
        behavior: 'smooth',
      });
    }
  };

  const copyMd = async () => {
    const kps = tutorial.keypoints || [];
    const md = [
      `# ${tutorial.title}`,
      '',
      '## 视频总览',
      tutorial.overview || '',
      '',
      ...kps.flatMap(kp => [
        `## ${String(kp.idx).padStart(2, '0')} ${kp.title}`,
        '',
        kp.summary || '',
        '',
        '**核心要点**',
        ...(kp.coreBullets || []).map(b => `- ${b}`),
        '',
        ...(kp.detail ? [kp.detail, ''] : []),
        ...(kp.notes ? [`> ⚠️ ${kp.notes}`, ''] : []),
      ]),
    ].join('\n');
    try { await navigator.clipboard.writeText(md); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 生成导出用的 HTML 文档字符串（PDF / Word 共用）
  const buildExportHtml = (forWord = false) => {
    const kps = tutorial.keypoints || [];
    const bodyStyle = forWord
      ? 'font-family:"微软雅黑",Arial,sans-serif;max-width:740px;margin:0 auto;padding:40px;color:#18191C;line-height:1.8'
      : 'font-family:-apple-system,"PingFang SC","Helvetica Neue",sans-serif;max-width:800px;margin:0 auto;padding:48px;color:#18191C;line-height:1.8';
    return `<!DOCTYPE html>
<html lang="zh"><head><meta charset="UTF-8">
<title>${tutorial.title}</title>
<style>
body{${bodyStyle}}
h1{font-size:26px;font-weight:700;margin:0 0 8px;line-height:1.3}
h2{font-size:18px;font-weight:700;margin:40px 0 10px;color:#FB7299;border-bottom:2px solid #FFE8F0;padding-bottom:6px}
.meta{color:#888;font-size:13px;margin-bottom:36px}
.overview{background:#FFF5F8;border-left:3px solid #FB7299;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:40px;font-size:14px}
.summary{color:#666;font-style:italic;margin-bottom:14px;font-size:14px}
.bullets-box{background:#FFF5F8;border-radius:8px;padding:14px 20px;margin-bottom:14px}
.bullets-box h3{font-size:12px;font-weight:700;color:#FB7299;text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px}
.bullets-box ul{margin:0;padding-left:18px}
.bullets-box li{font-size:14px;margin-bottom:4px;line-height:1.7}
.detail{font-size:14px;margin-bottom:12px}
.notes{font-size:13px;color:#c0392b;background:#fff8f8;border-left:3px solid #e74c3c;padding:10px 14px;border-radius:0 6px 6px 0;margin-bottom:12px}
code{background:#f5f5f5;padding:1px 5px;border-radius:4px;font-size:.88em;font-family:monospace}
@media print{body{padding:20px}h2{break-before:auto}}
</style></head><body>
<h1>${tutorial.title}</h1>
<div class="meta">${tutorial.author || ''}${tutorial.author && tutorial.duration ? ' · ' : ''}${tutorial.duration || ''} · ${tutorial.keypointCount || kps.length} 个知识点</div>
<div class="overview"><strong>视频总览</strong><br>${tutorial.overview || '（暂无总览）'}</div>
${kps.map(kp => `
<h2>${String(kp.idx).padStart(2,'0')} ${kp.title}</h2>
<div class="summary">${kp.summary || ''}</div>
${(kp.coreBullets || []).length > 0 ? `<div class="bullets-box"><h3>核心要点</h3><ul>${(kp.coreBullets || []).map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
${kp.detail ? `<div class="detail">${kp.detail.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>')}</div>` : ''}
${kp.notes ? `<div class="notes">⚠️ ${kp.notes}</div>` : ''}
`).join('')}
</body></html>`;
  };

  const downloadPdf = () => {
    const w = window.open('', '_blank', 'width=960,height=700');
    if (!w) { alert('请先在浏览器中允许弹出窗口，再点击下载 PDF'); return; }
    w.document.write(buildExportHtml(false));
    w.document.close();
    // 稍作延迟确保字体/图片加载完毕
    setTimeout(() => { w.focus(); w.print(); }, 600);
  };

  const downloadWord = () => {
    const html = buildExportHtml(true);
    const blob = new Blob(['﻿', html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tutorial.title.slice(0, 50).replace(/[\\/:*?"<>|]/g,'_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const captureImage = async () => {
    // 动态加载 html2canvas（首次点击时才加载）
    if (!window.html2canvas) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        s.onload = resolve;
        s.onerror = () => reject(new Error('html2canvas 加载失败'));
        document.head.appendChild(s);
      }).catch(() => null);
      if (!window.html2canvas) { alert('长图生成插件加载失败，请检查网络后重试'); return; }
    }
    const el = contentRef.current;
    if (!el) return;
    try {
      const canvas = await window.html2canvas(el, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0, scrollY: -window.scrollY,
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tutorial.title.slice(0, 40).replace(/[\\/:*?"<>|]/g,'_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      alert('长图生成失败：' + e.message);
    }
  };

  return (
    <div data-screen-label="03 结果详情">
      {/* ───── 标题栏 ───── */}
      <div className="container-wide" style={{maxWidth: 1320}}>
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom: 24,
        }}>
          <button onClick={() => navigate('library')} className="btn btn-ghost btn-sm">
            <IconArrowLeft size={14}/> 我的教程
          </button>
          <div style={{display:'flex', gap: 8}}>
            <button className="btn btn-outline btn-sm">
              <IconHeart size={14}/> 收藏
            </button>
            <button onClick={() => setShareOpen(true)} className="btn btn-outline btn-sm">
              <IconShare size={14}/> 分享
            </button>
            <button onClick={() => setExportOpen(true)} className="btn btn-primary btn-sm">
              <IconDownload size={14}/> 导出
            </button>
          </div>
        </div>

        {/* ───── 三栏布局 ───── */}
        <div style={{
          display:'grid',
          gridTemplateColumns: '220px 1fr 280px',
          gap: 24,
          alignItems: 'flex-start',
        }}>
          {/* 左：目录 */}
          <div style={{
            position: 'sticky', top: 88,
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}>
            <div style={{fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase',
              letterSpacing: '.06em', marginBottom: 12, paddingLeft: 8}}>
              目录 · {tutorial.keypoints.length} 节
            </div>
            <div style={{display:'flex', flexDirection:'column', gap: 2}}>
              {tutorial.keypoints.map((kp, i) => (
                <button key={i} onClick={() => scrollToKp(i)}
                  style={{
                    display:'flex', alignItems:'flex-start', gap: 8,
                    padding: '8px 10px', borderRadius: 'var(--r-sm)',
                    textAlign:'left',
                    background: activeKp === i ? 'var(--bili-pink-soft)' : 'transparent',
                    color: activeKp === i ? 'var(--bili-pink-deep)' : 'var(--ink-2)',
                    transition: 'background .15s',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: activeKp === i ? 600 : 500,
                  }}>
                  <span style={{
                    minWidth: 18, height: 18, borderRadius: 4,
                    background: activeKp === i ? 'var(--bili-pink)' : 'var(--bg-deep)',
                    color: activeKp === i ? '#fff' : 'var(--ink-3)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize: 10, fontWeight: 600,
                    flexShrink: 0,
                  }}>{kp.idx}</span>
                  <span style={{lineHeight: 1.45}}>{kp.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 中：教程内容 */}
          <article ref={contentRef} style={{
            background: '#fff',
            borderRadius: 'var(--r-xl)',
            padding: '48px 56px',
            boxShadow: 'var(--sh-sm)',
            minWidth: 0,
          }}>
            {/* 标题区 */}
            <div style={{marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--line-soft)'}}>
              <div style={{display:'flex', gap: 6, marginBottom: 12, flexWrap:'wrap'}}>
                {tutorial.tags.map(t => <span key={t} className="tag tag-pink">{t}</span>)}
              </div>
              <h1 className="h-1" style={{margin: '0 0 16px', lineHeight: 1.3}}>{tutorial.title}</h1>
              <div style={{display:'flex', alignItems:'center', gap: 16, color: 'var(--ink-2)', fontSize: 13, flexWrap:'wrap'}}>
                <div style={{display:'flex', alignItems:'center', gap: 8}}>
                  <div className="avatar" style={{width: 26, height: 26, fontSize: 12}}>{tutorial.authorAvatar}</div>
                  <span>{tutorial.author}</span>
                </div>
                <span>·</span>
                <a href={tutorial.sourceUrl} target="_blank"
                  style={{color: 'var(--bili-blue)', display:'flex', alignItems:'center', gap: 4}}>
                  <IconPlay size={11}/> 原视频 ({tutorial.duration})
                </a>
                <span>·</span>
                <span>{tutorial.createdAt} 生成</span>
                <span>·</span>
                <span>{tutorial.keypointCount} 个知识点</span>
              </div>
            </div>

            {/* 总览 */}
            <section style={{marginBottom: 40}}>
              <h2 className="h-3" style={{
                margin: '0 0 12px',
                display:'flex', alignItems:'center', gap: 8,
              }}>
                <span style={{
                  display:'inline-block', width: 3, height: 22, borderRadius: 2,
                  background: 'var(--grad-brand)',
                }}/>
                视频总览
              </h2>
              <p style={{
                margin: 0, fontSize: 15, lineHeight: 1.8, color: 'var(--ink-1)',
                padding: 20,
                background: 'linear-gradient(135deg, #FFF5F8 0%, #E3F4FB 100%)',
                borderRadius: 'var(--r-md)',
                textWrap: 'pretty',
              }}>
                {tutorial.overview}
              </p>
            </section>

            {/* 各知识点 */}
            {tutorial.keypoints.map((kp, i) => (
              <KeypointSection key={i} kp={kp} idx={i} sourceUrl={tutorial.sourceUrl}/>
            ))}

            {/* 教程结束 */}
            <div style={{
              marginTop: 56, padding: '24px 0',
              borderTop: '1px solid var(--line-soft)',
              textAlign: 'center',
            }}>
              <div className="mascot" style={{display:'inline-block', marginBottom: 8}}>
                <Mascot size={60}/>
              </div>
              <p className="t-muted text-sm" style={{margin: 0}}>
                本教程由 学霸笔记 自动生成 · 觉得有用就转发给朋友吧
              </p>
            </div>
          </article>

          {/* 右：操作面板 */}
          <aside style={{
            position: 'sticky', top: 88,
            display:'flex', flexDirection:'column', gap: 16,
          }}>
            {/* 阅读进度 */}
            {(tutorial.keypoints || []).length > 0 && (
            <div className="card" style={{padding: 16}}>
              <div style={{fontSize: 12, fontWeight: 600, color: 'var(--ink-3)',
                textTransform:'uppercase', letterSpacing: '.06em', marginBottom: 12}}>
                阅读进度
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom: 6}}>
                <span style={{fontSize: 13, fontWeight: 600}}>第 {activeKp + 1} / {tutorial.keypoints.length} 节</span>
                <span style={{fontSize: 13, color: 'var(--bili-pink)', fontWeight: 700, fontVariantNumeric:'tabular-nums'}}>
                  {Math.round((activeKp + 1) / tutorial.keypoints.length * 100)}%
                </span>
              </div>
              <div className="progress-track" style={{height: 6}}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  width: `${(activeKp + 1) / tutorial.keypoints.length * 100}%`,
                  background: 'var(--grad-brand)',
                  transition: 'width .3s',
                }}/>
              </div>
            </div>
            )}

            {/* 快速导出 */}
            <div className="card" style={{padding: 16}}>
              <div style={{fontSize: 12, fontWeight: 600, color: 'var(--ink-3)',
                textTransform:'uppercase', letterSpacing: '.06em', marginBottom: 12}}>
                快速导出
              </div>
              <div style={{display:'flex', flexDirection:'column', gap: 4}}>
                <ExportRow icon={IconMd} label="复制 Markdown" hint="一键拷贝" onClick={copyMd} done={copied}/>
                <ExportRow icon={IconPdf} label="下载 PDF" hint="打印对话框另存为 PDF" onClick={downloadPdf}/>
                <ExportRow icon={IconWord} label="下载 Word" hint=".doc 可二次编辑" onClick={downloadWord}/>
                <ExportRow icon={IconImage} label="生成长图" hint="便于分享" onClick={captureImage}/>
                <ExportRow icon={IconFileText} label="同步到飞书" hint="一键创建文档" pro/>
              </div>
            </div>

            {/* AI 追问入口 */}
            <div style={{
              padding: 16, borderRadius: 'var(--r-md)',
              background: 'linear-gradient(135deg, #1A1B1F 0%, #2A2B30 100%)',
              color: '#fff',
            }}>
              <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
                <IconSparkles size={16} style={{color: '#FB7299'}}/>
                <span style={{fontWeight: 600, fontSize: 13}}>AI 追问</span>
                <span className="tag tag-vip" style={{padding: '1px 6px', fontSize: 10}}>PRO</span>
              </div>
              <p style={{margin: '0 0 10px', fontSize: 12, color: 'rgba(255,255,255,.7)'}}>
                没看懂？基于本教程内容向 AI 提问
              </p>
              <button style={{
                width: '100%', padding: '8px 12px',
                background: 'rgba(255,255,255,.1)',
                color: '#fff', borderRadius: 'var(--r-sm)',
                fontSize: 12, cursor: 'pointer',
                border: '1px solid rgba(255,255,255,.15)',
                textAlign: 'left',
              }}>问我任何问题 ...</button>
            </div>
          </aside>
        </div>
      </div>

      {/* 弹窗：导出 */}
      {exportOpen && <ExportModal onClose={() => setExportOpen(false)}
        onMd={copyMd} onPdf={downloadPdf} onWord={downloadWord} onImage={captureImage} copied={copied}/>}
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)}/>}
    </div>
  );
}

function KeypointSection({ kp, idx, sourceUrl }) {
  // 截帧用 gradient + 占位渲染
  const frameGrads = [
    'linear-gradient(135deg, #FFE9F1, #FFD0DA)',
    'linear-gradient(135deg, #E3F4FB, #B5E2F5)',
    'linear-gradient(135deg, #F0E8FF, #DCC8FF)',
    'linear-gradient(135deg, #E8F8EE, #C6F0D5)',
  ];
  return (
    <section id={`kp-${idx}`} data-kp-idx={idx} style={{marginBottom: 56, scrollMarginTop: 100}}>
      <div style={{display:'flex', alignItems:'baseline', gap: 12, marginBottom: 16}}>
        <span style={{
          fontSize: 36, fontWeight: 700, color: 'var(--bili-pink)',
          letterSpacing: '-.02em', lineHeight: 1,
        }}>{String(kp.idx).padStart(2, '0')}</span>
        <h2 className="h-3" style={{margin: 0}}>{kp.title}</h2>
      </div>
      <a href={`${sourceUrl}${sourceUrl.includes('?') ? '&' : '?'}t=${kp.ts}`} target="_blank"
        style={{
          display:'inline-flex', alignItems:'center', gap: 6,
          fontSize: 12, color: 'var(--bili-blue)',
          padding: '4px 10px', borderRadius: 'var(--r-full)',
          background: 'var(--bili-blue-soft)',
          marginBottom: 16,
        }}>
        <IconPlay size={11}/> 跳转视频 {kp.tsStr}
      </a>

      {/* 关键帧 */}
      {kp.frames > 0 && (
        <div style={{
          display:'grid',
          gridTemplateColumns: kp.frames >= 2 ? '1fr 1fr' : '1fr',
          gap: 12,
          marginBottom: 20,
        }}>
          {Array.from({length: kp.frames}).map((_, fi) => {
            const imgUrl = kp.frameUrls && kp.frameUrls[fi];
            return (
              <div key={fi} style={{
                aspectRatio: '16/9',
                borderRadius: 'var(--r-md)',
                background: imgUrl ? '#111' : frameGrads[(idx + fi) % frameGrads.length],
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--line-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {imgUrl ? (
                  <img src={imgUrl} alt={`frame ${fi + 1}`} style={{
                    width: '100%', height: '100%', objectFit: 'contain', display: 'block',
                  }}/>
                ) : (
                  <FakeScreenshot variant={(idx + fi) % 4}/>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 核心要点（仅在有内容时显示） */}
      {(kp.coreBullets || []).length > 0 && (
      <div style={{
        padding: 20,
        background: 'var(--bili-pink-faint)',
        border: '1px solid var(--bili-pink-soft)',
        borderLeft: '3px solid var(--bili-pink)',
        borderRadius: 'var(--r-md)',
        marginBottom: 20,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: 'var(--bili-pink-deep)',
          textTransform:'uppercase', letterSpacing: '.06em', marginBottom: 10,
        }}>核心要点</div>
        <ul style={{margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.8, color: 'var(--ink-1)'}}>
          {kp.coreBullets.map((b, bi) => (
            <li key={bi} style={{marginBottom: 4}} dangerouslySetInnerHTML={{__html: renderInlineMd(b)}}/>
          ))}
        </ul>
      </div>
      )}

      {/* 详细说明 */}
      {kp.detail && (
        <div style={{fontSize: 15, color: 'var(--ink-1)', marginBottom: kp.notes ? 20 : 0}}
          dangerouslySetInnerHTML={{__html: renderMd(kp.detail)}}/>
      )}

      {/* 注意事项 */}
      {kp.notes && (
        <div style={{
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #FFFBEC 0%, #FFF6D6 100%)',
          border: '1px solid #FFEAA8',
          borderRadius: 'var(--r-md)',
          fontSize: 13, lineHeight: 1.7, color: '#8A6A1A',
        }}
          dangerouslySetInnerHTML={{__html: renderInlineMd(kp.notes)}}/>
      )}
    </section>
  );
}

// 模拟视频截图占位
function FakeScreenshot({ variant }) {
  if (variant === 0) {
    // 像演讲幻灯片
    return (
      <div style={{position:'absolute', inset:0, padding: '12% 14%'}}>
        <div style={{fontSize: 14, fontWeight: 700, color: 'rgba(184,71,46,.85)', marginBottom: 8}}>
          PRD 标准模板
        </div>
        <div style={{display:'flex', flexDirection:'column', gap: 6, fontSize: 10, color: 'rgba(184,71,46,.65)'}}>
          {['1. 背景', '2. 目标 & 北极星', '3. 用户故事', '4. 功能详述', '5. 状态机/异常分支'].map((l, i) => (
            <div key={i} style={{display:'flex', gap: 6, alignItems:'center'}}>
              <div style={{width: 5, height: 5, borderRadius: '50%', background: 'currentColor'}}/>
              {l}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (variant === 1) {
    // 像代码 / 图表
    return (
      <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <svg width="60%" height="60%" viewBox="0 0 100 60">
          <rect x="10" y="20" width="20" height="30" fill="rgba(0,158,208,.5)" rx="2"/>
          <rect x="35" y="10" width="20" height="40" fill="rgba(0,158,208,.7)" rx="2"/>
          <rect x="60" y="25" width="20" height="25" fill="rgba(0,158,208,.4)" rx="2"/>
          <line x1="5" y1="55" x2="95" y2="55" stroke="rgba(0,80,120,.4)" strokeWidth=".5"/>
        </svg>
      </div>
    );
  }
  if (variant === 2) {
    // 像人脸 / 主讲
    return (
      <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'rgba(255,255,255,.4)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <IconUser size={32} style={{color: 'rgba(124,77,178,.7)'}}/>
        </div>
        <div style={{position:'absolute', bottom: '15%', left: '15%', right: '15%',
          height: 8, borderRadius: 4, background: 'rgba(124,77,178,.3)'}}/>
      </div>
    );
  }
  // 像 UI 截图
  return (
    <div style={{position:'absolute', inset:'15%'}}>
      <div style={{width: '100%', height: 18, background:'rgba(34,118,80,.3)', borderRadius: 3, marginBottom: 6}}/>
      <div style={{width: '85%', height: 8, background:'rgba(34,118,80,.2)', borderRadius: 2, marginBottom: 4}}/>
      <div style={{width: '70%', height: 8, background:'rgba(34,118,80,.2)', borderRadius: 2, marginBottom: 8}}/>
      <div style={{display:'flex', gap: 6}}>
        <div style={{width: 40, height: 24, background:'rgba(34,118,80,.4)', borderRadius: 3}}/>
        <div style={{width: 40, height: 24, background:'rgba(34,118,80,.2)', borderRadius: 3}}/>
      </div>
    </div>
  );
}

const CODE_STYLE = 'background:var(--bg);padding:1px 6px;border-radius:4px;font-size:.9em;font-family:var(--font-mono);color:var(--bili-pink-deep)';

// 内联格式：**加粗**、*斜体*、`代码`
function renderInlineMd(raw) {
  return (raw || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, `<code style="${CODE_STYLE}">$1</code>`);
}

// 完整 Markdown 渲染：标题 / 列表 / 段落 + 内联格式
function renderMd(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const out = [];
  let listBuf = [];
  let listType = '';

  const flushList = () => {
    if (!listBuf.length) return;
    const tag = listType === 'ol' ? 'ol' : 'ul';
    out.push(`<${tag} style="margin:0 0 14px;padding-left:22px;line-height:1.85">${listBuf.join('')}</${tag}>`);
    listBuf = []; listType = '';
  };

  for (const raw of lines) {
    const line = raw.trim();

    // 空行：清空列表缓冲
    if (!line) { flushList(); continue; }

    // 标题 # / ## / ###
    if (/^#{1,3} /.test(line)) {
      flushList();
      const level = line.match(/^(#+)/)[1].length;
      const content = line.replace(/^#+ /, '');
      const sz = level === 1 ? '17px' : level === 2 ? '15px' : '13px';
      const mt = level === 1 ? '20px' : '14px';
      out.push(`<div style="font-size:${sz};font-weight:700;margin:${mt} 0 8px;color:var(--ink-1)">${renderInlineMd(content)}</div>`);
      continue;
    }

    // 无序列表 - / *
    if (/^[-*] /.test(line)) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listBuf.push(`<li style="margin-bottom:4px">${renderInlineMd(line.slice(2))}</li>`);
      continue;
    }

    // 有序列表 1. 2. ...
    if (/^\d+\. /.test(line)) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listBuf.push(`<li style="margin-bottom:4px">${renderInlineMd(line.replace(/^\d+\. /, ''))}</li>`);
      continue;
    }

    flushList();
    out.push(`<p style="margin:0 0 12px;line-height:1.85">${renderInlineMd(line)}</p>`);
  }

  flushList();
  return out.join('');
}

function ExportRow({ icon: I, label, hint, onClick, done, pro }) {
  return (
    <button onClick={onClick} style={{
      display:'flex', alignItems:'center', gap: 10,
      padding: 10, borderRadius: 'var(--r-sm)',
      background: 'transparent', cursor: 'pointer',
      width: '100%', textAlign: 'left',
      transition: 'background .15s',
    }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'var(--bili-pink-soft)',
        color: 'var(--bili-pink-deep)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <I size={16}/>
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontSize: 13, fontWeight: 500, display:'flex', alignItems:'center', gap: 6}}>
          {label}
          {pro && <span className="tag tag-vip" style={{padding:'0 6px', fontSize: 9}}>PRO</span>}
        </div>
        <div className="text-xs t-faint">{hint}</div>
      </div>
      {done && <IconCheck size={16} style={{color: 'var(--success)'}}/>}
    </button>
  );
}

function ExportModal({ onClose, onMd, onPdf, onWord, onImage, copied }) {
  return (
    <Modal onClose={onClose} title="导出教程">
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12}}>
        {[
          {icon: IconMd,       label:'Markdown',    desc:'带本地图片路径',   size: copied ? '✓ 已复制' : '一键复制到剪贴板', pro: false, action: onMd},
          {icon: IconPdf,      label:'PDF',          desc:'打印对话框另存 PDF', size:'高清排版',          pro: false, action: onPdf},
          {icon: IconWord,     label:'Word (.doc)',  desc:'二次编辑友好',     size:'Word / WPS 可打开', pro: false, action: onWord},
          {icon: IconImage,    label:'长图 (PNG)',   desc:'手机分享',         size:'@2x 高清截图',      pro: false, action: onImage},
          {icon: IconFileText, label:'飞书文档',     desc:'自动创建并同步',   size:'实时',              pro: true,  action: null},
          {icon: IconLink,     label:'公开分享链接', desc:'任何人可看',       size:'1 个 URL',          pro: true,  action: null},
        ].map(opt => {
          const I = opt.icon;
          return (
            <button key={opt.label} onClick={opt.action || undefined} style={{
              padding: 16, borderRadius: 'var(--r-md)',
              border: '1px solid var(--line)',
              background: '#fff',
              textAlign: 'left',
              cursor: opt.action ? 'pointer' : 'default', position: 'relative',
              transition: 'all .15s',
              opacity: opt.action === null ? 0.6 : 1,
            }}
              onMouseOver={e => opt.action && (e.currentTarget.style.borderColor = 'var(--bili-pink)', e.currentTarget.style.boxShadow='var(--sh-sm)')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--line)', e.currentTarget.style.boxShadow='none')}>
              {opt.pro && <span className="tag tag-vip" style={{position:'absolute', top: 10, right: 10, padding: '1px 6px', fontSize: 9}}>PRO</span>}
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'var(--bili-pink-soft)',
                color: 'var(--bili-pink-deep)',
                display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom: 10,
              }}>
                <I size={18}/>
              </div>
              <div style={{fontSize: 14, fontWeight: 600, marginBottom: 2}}>{opt.label}</div>
              <div className="text-xs t-muted">{opt.desc}</div>
              <div className="text-xs t-faint" style={{marginTop: 4}}>{opt.size}</div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

function ShareModal({ onClose }) {
  const [isPublic, setIsPublic] = useState(true);
  return (
    <Modal onClose={onClose} title="分享教程">
      <div style={{display:'flex', flexDirection:'column', gap: 16}}>
        {/* 公开/私密 toggle */}
        <div style={{
          display:'flex', gap: 8, padding: 4,
          background: 'var(--bg)', borderRadius: 'var(--r-md)',
        }}>
          {['public', 'private'].map(t => (
            <button key={t} onClick={() => setIsPublic(t === 'public')}
              style={{
                flex: 1, padding: '8px 12px',
                background: (isPublic === (t === 'public')) ? '#fff' : 'transparent',
                color: 'var(--ink-1)',
                borderRadius: 'var(--r-sm)',
                fontSize: 13, fontWeight: 500,
                boxShadow: (isPublic === (t === 'public')) ? 'var(--sh-sm)' : 'none',
                cursor: 'pointer',
              }}>
              {t === 'public' ? '🌐 公开链接' : '🔒 私密链接（需密码）'}
            </button>
          ))}
        </div>
        {/* 链接 */}
        <div style={{
          padding: 12, background: 'var(--bg)', borderRadius: 'var(--r-md)',
          display:'flex', alignItems:'center', gap: 8,
        }}>
          <code style={{flex: 1, fontSize: 12, color: 'var(--ink-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
            https://xueba.note/share/t001-abc12345
          </code>
          <button className="btn btn-primary btn-sm">
            <IconCopy size={12}/> 复制
          </button>
        </div>
        {/* 二维码 + 平台 */}
        <div style={{display:'flex', gap: 20, alignItems:'flex-start'}}>
          <div style={{
            width: 120, height: 120,
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-md)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color: 'var(--ink-3)',
            flexShrink: 0,
          }}>
            <IconQrcode size={64}/>
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 12, color: 'var(--ink-3)', marginBottom: 8}}>一键分享到</div>
            <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
              {['微信', '微博', '小红书', '飞书', '钉钉', 'X'].map(p => (
                <button key={p} className="btn btn-outline btn-sm" style={{fontSize: 12}}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div style={{
      position:'fixed', inset: 0, zIndex: 200,
      background: 'rgba(24,25,28,.5)',
      display:'flex', alignItems:'center', justifyContent:'center',
      animation: 'fadeIn .2s ease',
      padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 'var(--r-xl)',
          width: '100%', maxWidth: 560,
          padding: 24,
          boxShadow: 'var(--sh-lg)',
          animation: 'fadeUp .25s cubic-bezier(.2,.8,.2,1)',
        }}>
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          marginBottom: 20,
        }}>
          <h3 className="h-4" style={{margin: 0}}>{title}</h3>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--bg)',
            color: 'var(--ink-2)',
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor: 'pointer',
          }}>
            <IconClose size={16}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { ResultPage, Modal });
