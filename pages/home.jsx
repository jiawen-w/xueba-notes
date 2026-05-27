// 首页：Hero + 转换入口 + 工作流展示 + 价格预告
function HomePage({ navigate, user }) {
  const [url, setUrl] = useState('');
  const [showDemoTip, setShowDemoTip] = useState(false);
  const inputRef = useRef(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setShowDemoTip(false);
      inputRef.current?.focus();
    } catch {
      inputRef.current?.focus();
    }
  };

  const startConvert = () => {
    if (!url.trim()) {
      inputRef.current?.focus();
      return;
    }
    // 演示模式：不跳工作台，直接给出提示
    if (IS_DEMO_HOST) {
      setShowDemoTip(true);
      return;
    }
    window.__pendingUrl = url.trim();
    navigate('workbench');
  };

  return (
    <div data-screen-label="01 首页">
      {/* ───── Hero ───── */}
      <section style={{position:'relative', overflow:'hidden', paddingBottom: 60}}>
        {/* 装饰光斑 */}
        <div className="blob" style={{
          width: 600, height: 600, top: -200, right: -200,
          background: 'radial-gradient(circle, #FFE9F1 0%, transparent 70%)',
        }}/>
        <div className="blob" style={{
          width: 500, height: 500, bottom: -200, left: -200,
          background: 'radial-gradient(circle, #E3F4FB 0%, transparent 70%)',
        }}/>

        <div className="container" style={{position:'relative', paddingTop: 60}}>
          <div style={{display:'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'center'}}>
            <div className="anim-fadeUp">
              <div style={{
                display:'inline-flex', alignItems:'center', gap: 8,
                padding: '6px 14px',
                borderRadius: 'var(--r-full)',
                background: 'rgba(255,255,255,.7)',
                border: '1px solid var(--bili-pink-soft)',
                fontSize: 13, color: 'var(--bili-pink-deep)',
                fontWeight: 500,
                marginBottom: 24,
              }}>
                <IconSparkles size={14}/>
                <span>支持 B 站 / YouTube · 单集 + 合集多 P</span>
              </div>
              <h1 className="h-display" style={{margin: '0 0 20px'}}>
                把<span className="t-grad">视频</span><br/>
                变成<span className="t-grad">能读</span>的<br/>
                <span className="t-grad">学霸笔记</span>
              </h1>
              <p className="text-lg t-muted" style={{margin: '0 0 32px', maxWidth: 480}}>
                粘贴 B 站链接，AI 自动转录 + 截关键帧 + 写笔记。
                100 分钟视频 → 5 分钟读完的图文教程。
              </p>

              {/* ───── 一步式输入框 ───── */}
              <div style={{
                display:'flex', gap: 8, alignItems:'center',
                padding: 6,
                background: '#fff',
                borderRadius: 'var(--r-full)',
                boxShadow: 'var(--sh-md)',
                maxWidth: 560,
              }}>
                <div style={{paddingLeft: 14, color: 'var(--bili-pink)'}}><IconLink size={20}/></div>
                <input ref={inputRef}
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && startConvert()}
                  placeholder="粘贴 B 站视频链接 或 BV 号..."
                  style={{
                    flex: 1, height: 44, border: 0, outline: 'none',
                    fontSize: 15, background: 'transparent', fontFamily: 'inherit',
                  }}/>
                {!url && (
                  <button onClick={handlePaste} className="btn btn-ghost btn-sm"
                    style={{fontSize: 12, padding: '6px 12px'}}>
                    <IconPaste size={14}/> 粘贴
                  </button>
                )}
                <button onClick={startConvert} className="btn btn-primary"
                  style={{height: 44, padding: '0 22px', fontWeight: 600}}>
                  开始转换 <IconArrowRight size={16}/>
                </button>
              </div>

              {/* 演示模式内嵌提示 */}
              {showDemoTip && (
                <div style={{
                  marginTop: 16, maxWidth: 560,
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg,#FFF5E0,#FFF0F5)',
                  border: '1px solid #FFD9A0',
                  borderRadius: 'var(--r-lg)',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <span style={{fontSize: 20, flexShrink: 0}}>🖥️</span>
                  <div style={{fontSize: 13, color: '#92400E', flex: 1}}>
                    <strong>在线演示版</strong>——AI 转换需要本地 Python 后端，这里无法运行。
                    <br/>不过你可以先浏览预设的示例教程，体验完整的阅读功能！
                    <div style={{display:'flex', gap: 8, marginTop: 10, flexWrap: 'wrap'}}>
                      <button onClick={() => navigate('library')} style={{
                        padding: '6px 14px', borderRadius: 'var(--r-sm)',
                        background: '#FB7299', color: '#fff',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}>查看示例教程 →</button>
                      <button onClick={() => { setShowDemoTip(false); navigate('workbench'); }} style={{
                        padding: '6px 14px', borderRadius: 'var(--r-sm)',
                        background: 'transparent', color: '#92400E',
                        border: '1px solid #FFD9A0',
                        fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      }}>了解如何本地部署</button>
                    </div>
                  </div>
                </div>
              )}

              {!showDemoTip && (
                <div style={{display:'flex', alignItems:'center', gap: 20, marginTop: 24, color: 'var(--ink-3)', fontSize: 13}}>
                  <span style={{display:'flex', alignItems:'center', gap: 6}}>
                    <IconCheck size={14} style={{color: 'var(--success)'}}/> 无需登录可试 1 次
                  </span>
                  <span style={{display:'flex', alignItems:'center', gap: 6}}>
                    <IconCheck size={14} style={{color: 'var(--success)'}}/> 平均 3-5 分钟出结果
                  </span>
                  <span style={{display:'flex', alignItems:'center', gap: 6}}>
                    <IconCheck size={14} style={{color: 'var(--success)'}}/> 支持合集
                  </span>
                </div>
              )}
            </div>

            {/* 右侧：装饰预览卡 + 喵 */}
            <div style={{position:'relative'}}>
              <div className="mascot" style={{position:'absolute', top: -40, right: -10, zIndex: 2}}>
                <Mascot size={110}/>
              </div>
              <PreviewStack/>
            </div>
          </div>

          {/* ── 数据条 ── */}
          <div style={{
            display:'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
            marginTop: 80,
            padding: '32px 40px',
            background: 'rgba(255,255,255,.6)',
            borderRadius: 'var(--r-xl)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #fff',
          }}>
            <StatCol num="186,420" label="累计转换教程"/>
            <StatCol num="62.4万" label="服务用户"/>
            <StatCol num="3.8 min" label="平均处理时长" hint=""/>
            <StatCol num="98.7%" label="生成成功率"/>
          </div>
        </div>
      </section>

      {/* ───── 工作流 ───── */}
      <section style={{padding: '80px 0', background: '#fff'}}>
        <div className="container">
          <div style={{textAlign:'center', marginBottom: 56}}>
            <div className="tag tag-blue" style={{marginBottom: 12}}>
              <IconBolt size={12}/> 完整流水线
            </div>
            <h2 className="h-1" style={{margin:'0 0 12px'}}>从一条链接到一篇教程</h2>
            <p className="text-lg t-muted" style={{margin:0}}>幕后是一条完整的 AI 流水线 · 7 个步骤全自动</p>
          </div>

          <div style={{
            display:'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0,
            position: 'relative',
          }}>
            {/* 连接线 */}
            <div style={{
              position:'absolute', top: 28, left: '7%', right: '7%',
              height: 2, background: 'var(--line)',
              zIndex: 0,
            }}/>
            {PIPELINE_STAGES.map((stage, i) => {
              const IconC = window[stage.icon];
              const color = i < 3 ? 'var(--bili-pink)' : i < 5 ? 'var(--bili-blue)' : '#FF8AB1';
              return (
                <div key={stage.id} style={{
                  display:'flex', flexDirection:'column', alignItems:'center',
                  position: 'relative', zIndex: 1,
                  textAlign: 'center', padding: '0 6px',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: '#fff',
                    border: `2px solid ${color}`,
                    color: color,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    marginBottom: 16,
                    boxShadow: `0 4px 12px ${color}33`,
                  }}>
                    <IconC size={22}/>
                  </div>
                  <div style={{fontWeight: 600, fontSize: 13, marginBottom: 4}}>{stage.name}</div>
                  <div style={{fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.4}}>{stage.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── 案例 ───── */}
      <section style={{padding: '80px 0', background: 'var(--bg)'}}>
        <div className="container">
          <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: 32}}>
            <div>
              <div className="tag tag-pink" style={{marginBottom: 12}}><IconFire size={12}/> 最近热门</div>
              <h2 className="h-1" style={{margin:0}}>看看大家都在学什么</h2>
            </div>
            <button onClick={() => navigate('library')} className="btn btn-outline">
              查看更多 <IconArrowRight size={14}/>
            </button>
          </div>
          <div style={{
            display:'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}>
            {SAMPLE_TUTORIALS.slice(0, 3).map(t => (
              <TutorialCard key={t.id} tutorial={t} onClick={() => {
                window.__currentTutorialId = t.id;
                navigate('result');
              }}/>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 价格速览 ───── */}
      <section style={{padding: '80px 0', background: '#fff'}}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #FFF5F8 0%, #E3F4FB 100%)',
            borderRadius: 'var(--r-2xl)',
            padding: '56px 64px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 40,
          }}>
            <div style={{flex: 1}}>
              <div className="tag tag-vip" style={{marginBottom: 16}}>
                <IconCrown size={12}/> 限时优惠
              </div>
              <h2 className="h-1" style={{margin:'0 0 12px'}}>
                <span className="t-grad">9.9 起</span>
                <span style={{color:'var(--ink-1)'}}>，开学了</span>
              </h2>
              <p className="text-lg t-muted" style={{margin: '0 0 24px'}}>
                10 次卡 ¥9.9 / 月卡无限 ¥29
              </p>
              <button onClick={() => navigate('pricing')} className="btn btn-vip btn-lg">
                查看会员权益 <IconArrowRight size={16}/>
              </button>
            </div>
            <div style={{display:'flex', gap: 20}}>
              <PriceMini name="10次卡" price="9.9" period="买断" highlight={false}/>
              <PriceMini name="月卡 PRO" price="29" period="/月 · 无限" highlight={true}/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCol({ num, label, hint }) {
  return (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize: 32, fontWeight: 700, letterSpacing: '-.02em', color:'var(--ink-1)'}}>
        {num}
      </div>
      <div className="t-muted" style={{fontSize: 13, marginTop: 4}}>{label}</div>
      {hint && <div className="t-faint" style={{fontSize: 11, marginTop: 2}}>{hint}</div>}
    </div>
  );
}

function PreviewStack() {
  // 装饰：3 张错落的"教程预览"卡片
  return (
    <div style={{position:'relative', height: 380}}>
      {/* 背后卡片：视频缩略图 */}
      <div style={{
        position:'absolute', top: 16, right: 40, width: 280, height: 160,
        borderRadius: 'var(--r-lg)',
        background: 'linear-gradient(135deg, #FB7299 0%, #FFB36B 100%)',
        boxShadow: 'var(--sh-md)',
        transform: 'rotate(-3deg)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color: '#fff',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,255,255,.3)',
          backdropFilter: 'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <IconPlay size={22}/>
        </div>
        <div style={{
          position:'absolute', bottom: 12, left: 16, right: 16,
          fontSize: 12, fontWeight: 600,
        }}>硅谷大佬教你写 PRD</div>
        <div style={{
          position:'absolute', top: 12, right: 12,
          background: 'rgba(0,0,0,.5)', padding: '2px 6px', borderRadius: 4,
          fontSize: 11,
        }}>47:23</div>
      </div>
      {/* 前面：教程预览 */}
      <div className="card" style={{
        position:'absolute', top: 130, left: 0, width: 340,
        padding: 20,
        transform: 'rotate(2deg)',
        boxShadow: 'var(--sh-lg)',
      }}>
        <div style={{
          fontSize: 11, color: 'var(--bili-pink)', fontWeight: 600, marginBottom: 8,
        }}># 第 3 节 · PRD 标准模板</div>
        <div style={{
          height: 80,
          borderRadius: 'var(--r-md)',
          background: 'linear-gradient(135deg, #ECEDEF, #F6F7F8)',
          marginBottom: 12,
          display:'flex', alignItems:'center', justifyContent:'center',
          color: 'var(--ink-4)', fontSize: 11,
        }}>
          <IconImage size={28}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap: 6}}>
          <div style={{height: 8, borderRadius: 4, background:'var(--line-soft)', width: '92%'}}/>
          <div style={{height: 8, borderRadius: 4, background:'var(--line-soft)', width: '78%'}}/>
          <div style={{height: 8, borderRadius: 4, background:'var(--line-soft)', width: '88%'}}/>
        </div>
      </div>
      {/* 悬浮 chip */}
      <div className="card" style={{
        position:'absolute', bottom: 0, right: 0,
        padding: '10px 16px',
        display:'flex', alignItems:'center', gap: 10,
        boxShadow: 'var(--sh-md)',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--bili-blue-soft)',
          color: 'var(--bili-blue)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <IconSparkles size={14}/>
        </div>
        <div>
          <div style={{fontSize: 12, fontWeight: 600}}>AI 识别 14 个知识点</div>
          <div style={{fontSize: 11, color: 'var(--ink-3)'}}>耗时 3 分 24 秒</div>
        </div>
      </div>
    </div>
  );
}

function PriceMini({ name, price, period, highlight }) {
  return (
    <div style={{
      padding: '24px 28px',
      background: highlight ? 'var(--ink-1)' : '#fff',
      color: highlight ? '#fff' : 'var(--ink-1)',
      borderRadius: 'var(--r-xl)',
      minWidth: 180,
      boxShadow: highlight ? 'var(--sh-lg)' : 'var(--sh-sm)',
      position: 'relative',
    }}>
      {highlight && (
        <div className="tag tag-vip" style={{
          position:'absolute', top: -10, right: 16,
          padding: '4px 10px', fontSize: 11, fontWeight: 600,
        }}>
          <IconCrown size={11}/> 热门
        </div>
      )}
      <div style={{fontSize: 13, opacity: .7, marginBottom: 4}}>{name}</div>
      <div style={{display:'flex', alignItems:'baseline', gap: 4}}>
        <span style={{fontSize: 14}}>¥</span>
        <span style={{fontSize: 36, fontWeight: 700, letterSpacing:'-.02em'}}>{price}</span>
      </div>
      <div style={{fontSize: 12, opacity: .6}}>{period}</div>
    </div>
  );
}

function TutorialCard({ tutorial, onClick }) {
  const gradients = {
    'gradient-1': 'linear-gradient(135deg, #FB7299 0%, #FFB36B 100%)',
    'gradient-2': 'linear-gradient(135deg, #00AEEC 0%, #6DD4F8 100%)',
    'gradient-3': 'linear-gradient(135deg, #8B5CF6 0%, #FB7299 100%)',
    'gradient-4': 'linear-gradient(135deg, #22C55E 0%, #00AEEC 100%)',
    'gradient-5': 'linear-gradient(135deg, #F59E0B 0%, #FB7299 100%)',
    'gradient-6': 'linear-gradient(135deg, #6366F1 0%, #FB7299 100%)',
  };
  return (
    <div className="card card-hover" onClick={onClick} style={{cursor:'pointer', overflow:'hidden'}}>
      {/* 封面 */}
      <div style={{
        height: 160,
        background: gradients[tutorial.cover] || gradients['gradient-1'],
        position: 'relative',
        display:'flex', alignItems:'center', justifyContent:'center',
        color: '#fff',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(255,255,255,.25)', backdropFilter: 'blur(10px)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <IconPlay size={20}/>
        </div>
        <div style={{
          position:'absolute', top: 12, right: 12,
          background: 'rgba(0,0,0,.5)', color:'#fff',
          padding: '3px 8px', borderRadius: 4, fontSize: 11,
        }}>{tutorial.duration}</div>
        {tutorial.isPlaylist && (
          <div style={{
            position:'absolute', top: 12, left: 12,
            background: 'rgba(0,0,0,.5)', color:'#fff',
            padding: '3px 8px', borderRadius: 4, fontSize: 11,
            display:'flex', alignItems:'center', gap: 4,
          }}><IconList size={11}/> {tutorial.episodes} 集</div>
        )}
        <div style={{
          position:'absolute', bottom: 12, left: 16, right: 16,
          fontSize: 11, fontWeight: 600, opacity: .9,
        }}>{tutorial.keypointCount} 个知识点 · AI 笔记</div>
      </div>
      {/* 信息 */}
      <div style={{padding: 16}}>
        <div style={{
          fontSize: 15, fontWeight: 600, lineHeight: 1.4,
          display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical',
          overflow:'hidden', height: 42, marginBottom: 12,
        }}>{tutorial.title}</div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap: 8}}>
            <div className="avatar" style={{width: 22, height: 22, fontSize: 10}}>
              {tutorial.authorAvatar}
            </div>
            <span style={{fontSize: 12, color: 'var(--ink-2)'}}>{tutorial.author}</span>
          </div>
          <div style={{fontSize: 11, color: 'var(--ink-3)', display:'flex', alignItems:'center', gap: 4}}>
            <IconPlay size={10}/> {tutorial.views}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomePage, TutorialCard });
