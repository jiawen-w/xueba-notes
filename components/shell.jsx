// 应用外壳：顶部导航 + 全局布局
const { useState, useEffect, useMemo, useRef } = React;

function TopNav({ route, navigate, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id: 'home', label: '首页', icon: IconHome },
    { id: 'workbench', label: '转教程', icon: IconWand },
    { id: 'library', label: '我的教程', icon: IconBook },
    { id: 'pricing', label: '会员', icon: IconCrown },
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line-soft)',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:32}}>
          <button onClick={() => navigate('home')} style={{cursor:'pointer'}}>
            <Logo />
          </button>
          <nav style={{display:'flex', gap: 4}}>
            {navItems.map(item => {
              const active = route.startsWith(item.id);
              const I = item.icon;
              return (
                <button key={item.id}
                  onClick={() => navigate(item.id)}
                  style={{
                    display:'flex', alignItems:'center', gap: 6,
                    padding: '8px 14px',
                    borderRadius: 'var(--r-full)',
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--bili-pink)' : 'var(--ink-2)',
                    background: active ? 'var(--bili-pink-soft)' : 'transparent',
                    transition: 'all .18s',
                  }}>
                  <I size={16}/> {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {/* 搜索框 */}
          <div style={{
            position:'relative', width: 220,
          }}>
            <IconSearch size={16}
              style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--ink-3)'}}/>
            <input placeholder="搜索教程..."
              style={{
                width:'100%', height: 36, paddingLeft: 36, paddingRight: 12,
                borderRadius: 'var(--r-full)',
                border:'1px solid var(--line)',
                background: 'var(--bg)',
                fontSize: 13, outline: 'none',
                fontFamily: 'inherit',
              }}/>
          </div>
          {user.isLoggedIn ? (
            <>
              <button title="通知" style={{
                width: 36, height: 36, borderRadius: '50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                color: 'var(--ink-2)',
                transition: 'background .18s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-deep)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <IconBell size={18}/>
              </button>
              {/* 额度小药丸 */}
              {user.tier === 'free' && (
                <button onClick={() => navigate('pricing')}
                  className="tag tag-vip" style={{cursor:'pointer', padding:'4px 10px', fontWeight: 600}}>
                  <IconCrown size={12}/> 升级会员
                </button>
              )}
              {user.tier === 'pack' && (
                <button onClick={() => navigate('pricing')}
                  className="tag tag-pink" style={{cursor:'pointer', padding:'4px 10px'}}>
                  剩余 {user.credits} 次
                </button>
              )}
              {user.tier === 'pro' && (
                <span className="tag tag-vip" style={{padding:'4px 10px', fontWeight: 600}}>
                  <IconCrown size={12}/> PRO 会员
                </span>
              )}
              {/* 头像菜单 */}
              <div style={{position:'relative'}}>
                <button onClick={() => setMenuOpen(!menuOpen)}
                  className="avatar" style={{width: 36, height: 36, fontSize: 14, cursor:'pointer'}}>
                  {user.name[0]}
                </button>
                {menuOpen && (
                  <>
                    <div onClick={() => setMenuOpen(false)}
                      style={{position:'fixed', inset:0, zIndex: 100}}/>
                    <div style={{
                      position:'absolute', top:'calc(100% + 8px)', right: 0,
                      width: 220,
                      background: '#fff',
                      borderRadius: 'var(--r-lg)',
                      boxShadow: 'var(--sh-lg)',
                      padding: 8,
                      zIndex: 101,
                    }}>
                      <div style={{padding: '10px 12px', borderBottom: '1px solid var(--line-soft)', marginBottom: 4}}>
                        <div style={{fontWeight: 600, fontSize: 14}}>{user.name}</div>
                        <div className="text-xs t-muted">{user.email}</div>
                      </div>
                      <MenuRow icon={IconUser} label="个人中心" onClick={()=>{navigate('account'); setMenuOpen(false);}}/>
                      <MenuRow icon={IconBook} label="我的教程" onClick={()=>{navigate('library'); setMenuOpen(false);}}/>
                      <MenuRow icon={IconCrown} label="会员中心" onClick={()=>{navigate('pricing'); setMenuOpen(false);}}/>
                      <MenuRow icon={IconGift} label="邀请有奖" onClick={()=>{navigate('account/invite'); setMenuOpen(false);}}/>
                      <MenuRow icon={IconHeadset} label="客服中心" onClick={()=>{setMenuOpen(false);}}/>
                      <div style={{height:1, background:'var(--line-soft)', margin:'4px 0'}}/>
                      <MenuRow icon={IconLogout} label="退出登录" onClick={()=>{onLogout(); setMenuOpen(false);}}/>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate('auth')} className="btn btn-outline btn-sm">登录</button>
              <button onClick={() => navigate('auth')} className="btn btn-primary btn-sm">注册</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuRow({ icon: I, label, onClick }) {
  return (
    <button onClick={onClick}
      style={{
        display:'flex', alignItems:'center', gap: 10, width:'100%',
        padding:'8px 12px', borderRadius: 'var(--r-sm)',
        fontSize: 13, color: 'var(--ink-1)',
        transition: 'background .15s',
      }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
      <I size={16}/> {label}
    </button>
  );
}

function Footer() {
  return (
    <footer style={{
      background: '#fff',
      borderTop: '1px solid var(--line-soft)',
      padding: '32px 0 24px',
      color: 'var(--ink-3)',
      fontSize: 12,
    }}>
      <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap: 16}}>
        <div style={{display:'flex', alignItems:'center', gap: 12}}>
          <Logo/>
          <span>· 让每一段视频都变成可读的笔记</span>
        </div>
        <div style={{display:'flex', gap: 20}}>
          <a href="#">关于我们</a>
          <a href="#">服务条款</a>
          <a href="#">隐私政策</a>
          <a href="#">联系客服</a>
        </div>
        <div>© 2026 学霸笔记 · 沪ICP备 2026000000 号</div>
      </div>
    </footer>
  );
}

Object.assign(window, { TopNav, Footer, MenuRow });
