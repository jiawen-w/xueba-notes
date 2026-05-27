// 我的教程：列表 + 搜索 + 状态筛选
function LibraryPage({ navigate, user, tutorials: allTutorials = [] }) {
  const [filter, setFilter] = useState('all');
  const [searchKw, setSearchKw] = useState('');
  const [view, setView] = useState('grid');

  const tutorials = allTutorials.filter(t => {
    if (filter === 'processing' && t.status !== 'processing') return false;
    if (filter === 'done' && t.status !== 'done') return false;
    if (filter === 'starred' && !t.starred) return false;
    if (searchKw && !t.title.includes(searchKw)) return false;
    return true;
  });

  return (
    <div className="container" data-screen-label="04 我的教程">
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 24}}>
        <div>
          <h1 className="h-2" style={{margin: '0 0 4px'}}>我的教程</h1>
          <p className="t-muted text-sm" style={{margin: 0}}>
            {allTutorials.length > 0
              ? `共 ${allTutorials.length} 篇 · 永久保存 · 随时回看`
              : '转换完成后会自动出现在这里'}
          </p>
        </div>
        <button onClick={() => navigate('workbench')} className="btn btn-primary">
          <IconPlus size={14}/> 新建教程
        </button>
      </div>

      {/* 筛选条 */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        marginBottom: 20, gap: 16, flexWrap:'wrap',
      }}>
        <div style={{display:'flex', gap: 4, background:'#fff', padding: 4, borderRadius: 'var(--r-full)', boxShadow:'var(--sh-sm)'}}>
          {[
            { id: 'all', label: '全部', count: allTutorials.length },
            { id: 'done', label: '已完成', count: allTutorials.filter(t=>t.status==='done').length },
            { id: 'processing', label: '处理中', count: allTutorials.filter(t=>t.status==='processing').length },
            { id: 'starred', label: '收藏', count: allTutorials.filter(t=>t.starred).length },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 16px', borderRadius: 'var(--r-full)',
                fontSize: 13, fontWeight: filter === f.id ? 600 : 500,
                background: filter === f.id ? 'var(--bili-pink)' : 'transparent',
                color: filter === f.id ? '#fff' : 'var(--ink-2)',
                cursor: 'pointer', transition: 'all .15s',
              }}>
              {f.label} <span style={{opacity: .8, fontSize: 11}}>{f.count}</span>
            </button>
          ))}
        </div>

        <div style={{display:'flex', gap: 8, alignItems:'center'}}>
          <div style={{position:'relative'}}>
            <IconSearch size={14} style={{position:'absolute', left: 10, top: '50%', transform:'translateY(-50%)', color:'var(--ink-3)'}}/>
            <input value={searchKw} onChange={e=>setSearchKw(e.target.value)}
              placeholder="搜索标题..."
              style={{
                paddingLeft: 32, paddingRight: 12, height: 36,
                width: 200, fontSize: 13,
                background: '#fff', border: '1px solid var(--line)',
                borderRadius: 'var(--r-full)', outline: 'none',
                fontFamily: 'inherit',
              }}/>
          </div>
          <div style={{display:'flex', background:'#fff', borderRadius:'var(--r-md)', padding: 3, boxShadow:'var(--sh-sm)'}}>
            <button onClick={() => setView('grid')} style={{
              width: 32, height: 30, display:'flex', alignItems:'center', justifyContent:'center',
              borderRadius: 'var(--r-sm)',
              background: view === 'grid' ? 'var(--bili-pink-soft)' : 'transparent',
              color: view === 'grid' ? 'var(--bili-pink)' : 'var(--ink-3)',
              cursor: 'pointer',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor"/><rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor"/><rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor"/><rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor"/></svg>
            </button>
            <button onClick={() => setView('list')} style={{
              width: 32, height: 30, display:'flex', alignItems:'center', justifyContent:'center',
              borderRadius: 'var(--r-sm)',
              background: view === 'list' ? 'var(--bili-pink-soft)' : 'transparent',
              color: view === 'list' ? 'var(--bili-pink)' : 'var(--ink-3)',
              cursor: 'pointer',
            }}>
              <IconList size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* 列表 */}
      {tutorials.length === 0 ? (
        <EmptyLibrary onCreate={() => navigate('workbench')}/>
      ) : view === 'grid' ? (
        <div style={{
          display:'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {tutorials.map(t => (
            <LibraryCard key={t.id} t={t} onClick={() => {
              window.__currentTutorialId = t.id;
              navigate('result');
            }}/>
          ))}
        </div>
      ) : (
        <div className="card" style={{padding: 0, overflow:'hidden'}}>
          {tutorials.map((t, i) => (
            <LibraryRow key={t.id} t={t} last={i === tutorials.length - 1}
              onClick={() => {
                window.__currentTutorialId = t.id;
                navigate('result');
              }}/>
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryCard({ t, onClick }) {
  const gradients = {
    'gradient-1': 'linear-gradient(135deg, #FB7299 0%, #FFB36B 100%)',
    'gradient-2': 'linear-gradient(135deg, #00AEEC 0%, #6DD4F8 100%)',
    'gradient-3': 'linear-gradient(135deg, #8B5CF6 0%, #FB7299 100%)',
    'gradient-4': 'linear-gradient(135deg, #22C55E 0%, #00AEEC 100%)',
    'gradient-5': 'linear-gradient(135deg, #F59E0B 0%, #FB7299 100%)',
    'gradient-6': 'linear-gradient(135deg, #6366F1 0%, #FB7299 100%)',
  };

  return (
    <div className="card card-hover" onClick={onClick}
      style={{cursor:'pointer', overflow:'hidden', position: 'relative'}}>
      {/* 封面 */}
      <div style={{
        height: 150,
        background: gradients[t.cover] || gradients['gradient-1'],
        position: 'relative',
        display:'flex', alignItems:'center', justifyContent:'center',
        color: '#fff',
      }}>
        {t.status === 'processing' ? (
          <div style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap: 8,
            color: '#fff',
          }}>
            <Spinner/>
            <div style={{fontSize: 12, opacity: .9}}>{t.progress}% · {t.progressStage}</div>
          </div>
        ) : (
          <>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,.25)', backdropFilter: 'blur(10px)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}><IconPlay size={18}/></div>
          </>
        )}
        <div style={{
          position:'absolute', top: 10, right: 10,
          background: 'rgba(0,0,0,.5)', padding: '2px 6px', borderRadius: 3,
          fontSize: 11,
        }}>{t.duration}</div>
        {t.isPlaylist && (
          <div style={{
            position:'absolute', top: 10, left: 10,
            background: 'rgba(0,0,0,.5)', padding: '2px 6px', borderRadius: 3,
            fontSize: 11, display:'flex', alignItems:'center', gap: 4,
          }}><IconList size={11}/> {t.episodes} 集</div>
        )}
        {t.starred && (
          <div style={{
            position:'absolute', bottom: 10, right: 10,
            color: '#FFB400',
          }}><IconStar size={16} style={{fill: '#FFB400'}}/></div>
        )}
        {t.status === 'processing' && (
          <div style={{
            position:'absolute', bottom: 0, left: 0, right: 0,
            height: 3, background: 'rgba(0,0,0,.2)',
          }}>
            <div style={{height:'100%', width:`${t.progress}%`, background:'#fff'}}/>
          </div>
        )}
      </div>
      <div style={{padding: 14}}>
        <div style={{
          fontSize: 14, fontWeight: 600, lineHeight: 1.4,
          display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical',
          overflow:'hidden', height: 38, marginBottom: 10,
        }}>{t.title}</div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', fontSize: 12}}>
          <div style={{display:'flex', alignItems:'center', gap: 6, color: 'var(--ink-2)'}}>
            <IconList size={11}/> {t.keypointCount} 节
          </div>
          <span className="t-faint" style={{fontSize: 11}}>{t.createdAt}</span>
        </div>
      </div>
    </div>
  );
}

function LibraryRow({ t, last, onClick }) {
  const gradients = {
    'gradient-1': 'linear-gradient(135deg, #FB7299, #FFB36B)',
    'gradient-2': 'linear-gradient(135deg, #00AEEC, #6DD4F8)',
    'gradient-3': 'linear-gradient(135deg, #8B5CF6, #FB7299)',
    'gradient-4': 'linear-gradient(135deg, #22C55E, #00AEEC)',
    'gradient-5': 'linear-gradient(135deg, #F59E0B, #FB7299)',
    'gradient-6': 'linear-gradient(135deg, #6366F1, #FB7299)',
  };
  return (
    <div onClick={onClick} style={{
      display:'flex', alignItems:'center', gap: 16,
      padding: 16,
      borderBottom: last ? 'none' : '1px solid var(--line-soft)',
      cursor: 'pointer',
      transition: 'background .15s',
    }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
      onMouseOut={e => e.currentTarget.style.background = '#fff'}>
      <div style={{
        width: 96, height: 56, borderRadius: 8,
        background: gradients[t.cover],
        flexShrink: 0, position: 'relative',
        display:'flex', alignItems:'center', justifyContent:'center',
        color: '#fff',
      }}>
        {t.isPlaylist ? <IconList size={18}/> : <IconPlay size={16}/>}
        <div style={{
          position:'absolute', bottom: 3, right: 4,
          background: 'rgba(0,0,0,.5)', padding: '1px 4px', borderRadius: 2,
          fontSize: 9,
        }}>{t.duration}</div>
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontSize: 14, fontWeight: 600, marginBottom: 4, lineHeight: 1.4}}>{t.title}</div>
        <div style={{display:'flex', alignItems:'center', gap: 12, fontSize: 12, color: 'var(--ink-2)'}}>
          <span>{t.author}</span>
          <span>·</span>
          <span>{t.keypointCount} 节</span>
          <span>·</span>
          <span>{t.createdAt}</span>
          {t.status === 'processing' && (
            <>
              <span>·</span>
              <span style={{color: 'var(--bili-pink)'}}>{t.progress}% {t.progressStage}</span>
            </>
          )}
        </div>
      </div>
      <div style={{display:'flex', gap: 4}}>
        {t.starred && <IconStar size={14} style={{color: '#FFB400', fill: '#FFB400'}}/>}
        <IconChevronRight size={16} style={{color: 'var(--ink-3)'}}/>
      </div>
    </div>
  );
}

function EmptyLibrary({ onCreate }) {
  return (
    <div style={{
      padding: '80px 24px', textAlign: 'center',
      background: '#fff', borderRadius: 'var(--r-xl)',
    }}>
      <div className="mascot" style={{display:'inline-block', marginBottom: 16}}>
        <Mascot size={100}/>
      </div>
      <h3 className="h-3" style={{margin:'0 0 8px'}}>还没有教程哦</h3>
      <p className="t-muted" style={{margin:'0 0 24px'}}>粘贴一条 B 站链接，5 分钟内生成第一篇</p>
      <button onClick={onCreate} className="btn btn-primary btn-lg">
        <IconWand size={16}/> 立即创建
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      border: '3px solid rgba(255,255,255,.3)',
      borderTopColor: '#fff',
      animation: 'spin 1s linear infinite',
    }}/>
  );
}

Object.assign(window, { LibraryPage });
