// App 主入口：路由 + 用户状态 + Tweaks
const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "userTier": "pack",
  "accentColor": "#FB7299",
  "darkMode": false,
  "showMascot": true
}/*EDITMODE-END*/;

function App() {
  const [route, setRoute] = useStateApp(() => {
    const hash = window.location.hash.replace(/^#\/?/, '') || 'home';
    return hash;
  });

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [userTutorials, setUserTutorials] = useStateApp(() => {
    try {
      const saved = localStorage.getItem('xueba_tutorials');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const addTutorial = (tutorial) => {
    if (!tutorial) return;
    const entry = {
      ...tutorial,
      id: tutorial.id || `u_${Date.now()}`,
      status: 'done',
      starred: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setUserTutorials(prev => {
      const next = [entry, ...prev];
      try { localStorage.setItem('xueba_tutorials', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // 用户状态（默认按 tweak 配置）
  const [user, setUser] = useStateApp(() => {
    const tier = tweaks.userTier;
    return {
      isLoggedIn: tier !== 'guest',
      name: '小笔头',
      email: 'xiaobitou@example.com',
      tier: tier,
      credits: tier === 'pack' ? 7 : 0,
      freeTrialsRemain: tier === 'free' ? 1 : 0,
    };
  });

  // tweak 改变 → 同步用户层级
  useEffectApp(() => {
    const tier = tweaks.userTier;
    setUser(u => ({
      ...u,
      isLoggedIn: tier !== 'guest',
      tier,
      credits: tier === 'pack' ? (u.tier === 'pack' ? u.credits : 7) : 0,
      freeTrialsRemain: tier === 'free' ? 1 : 0,
    }));
  }, [tweaks.userTier]);

  // 主题色
  useEffectApp(() => {
    document.documentElement.style.setProperty('--bili-pink', tweaks.accentColor);
  }, [tweaks.accentColor]);

  // 暗色模式
  useEffectApp(() => {
    if (tweaks.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [tweaks.darkMode]);

  // 路由 hash 同步
  useEffectApp(() => {
    const onHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') || 'home';
      setRoute(hash);
      window.scrollTo({top: 0, behavior: 'instant'});
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (path) => {
    window.location.hash = `/${path}`;
    setRoute(path);
    window.scrollTo({top: 0, behavior: 'instant'});
  };

  // 解析 route：可能是 "account/invite" 这种
  const [mainRoute, subRoute] = route.split('/');

  const logout = () => {
    setUser({
      isLoggedIn: false,
      name: '游客',
      email: '',
      tier: 'guest',
      credits: 0,
      freeTrialsRemain: 1,
    });
    setTweak('userTier', 'guest');
    navigate('home');
  };

  return (
    <div className="app-shell">
      <TopNav route={route} navigate={navigate} user={user} onLogout={logout}/>
      <main className="app-main">
        {mainRoute === 'home' && <HomePage navigate={navigate} user={user}/>}
        {mainRoute === 'workbench' && <WorkbenchPage navigate={navigate} user={user} setUser={setUser} addTutorial={addTutorial}/>}
        {mainRoute === 'result' && <ResultPage navigate={navigate} user={user} tutorials={userTutorials}/>}
        {mainRoute === 'library' && <LibraryPage navigate={navigate} user={user} tutorials={userTutorials}/>}
        {mainRoute === 'pricing' && <PricingPage navigate={navigate} user={user} setUser={setUser}/>}
        {mainRoute === 'account' && <AccountPage navigate={navigate} user={user} setUser={setUser} subroute={subRoute} tutorials={userTutorials}/>}
        {mainRoute === 'auth' && <AuthPage navigate={navigate} setUser={setUser}/>}
        {!['home','workbench','result','library','pricing','account','auth'].includes(mainRoute) && (
          <HomePage navigate={navigate} user={user}/>
        )}
      </main>
      <Footer/>

      {/* 客服悬浮按钮 */}
      <FloatingService/>

      {/* Tweaks 面板 */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="账号">
          <TweakRadio label="用户层级"
            value={tweaks.userTier}
            onChange={v => setTweak('userTier', v)}
            options={[
              { value: 'guest', label: '未登录' },
              { value: 'free', label: '尝鲜' },
              { value: 'pack', label: '10次卡' },
              { value: 'pro', label: 'PRO' },
            ]}/>
        </TweakSection>
        <TweakSection label="主题">
          <TweakColor label="品牌色"
            value={tweaks.accentColor}
            onChange={v => setTweak('accentColor', v)}
            options={['#FB7299', '#FF6A8B', '#8B5CF6', '#00AEEC', '#22C55E']}/>
          <TweakToggle label="吉祥物 学霸喵"
            value={tweaks.showMascot}
            onChange={v => setTweak('showMascot', v)}/>
        </TweakSection>
        <TweakSection label="快速跳转">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 6}}>
            {[
              { id: 'home', label: '首页' },
              { id: 'workbench', label: '工作台' },
              { id: 'result', label: '结果详情' },
              { id: 'library', label: '我的教程' },
              { id: 'pricing', label: '会员定价' },
              { id: 'account', label: '个人中心' },
              { id: 'account/invite', label: '邀请有奖' },
              { id: 'auth', label: '登录注册' },
            ].map(p => (
              <button key={p.id} onClick={() => navigate(p.id)} style={{
                padding: '6px 10px', fontSize: 12,
                borderRadius: 6, border: '1px solid var(--line)',
                background: route.startsWith(p.id) ? 'var(--bili-pink-soft)' : '#fff',
                color: route.startsWith(p.id) ? 'var(--bili-pink)' : 'var(--ink-2)',
                cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 500,
                textAlign: 'left',
              }}>
                {p.label}
              </button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function FloatingService() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        position:'fixed', bottom: 24, right: 24,
        width: 52, height: 52, borderRadius: '50%',
        background: 'var(--bili-pink)',
        color: '#fff',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow: '0 8px 24px rgba(251,114,153,.35)',
        cursor: 'pointer',
        zIndex: 99,
        transition: 'all .2s',
      }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? <IconClose size={20}/> : <IconHeadset size={22}/>}
      </button>
      {open && (
        <div style={{
          position:'fixed', bottom: 88, right: 24,
          width: 280,
          background: '#fff',
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--sh-lg)',
          padding: 20,
          zIndex: 99,
          animation: 'fadeUp .25s cubic-bezier(.2,.8,.2,1)',
        }}>
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 12}}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--bili-pink-soft)', color: 'var(--bili-pink)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <IconHeadset size={18}/>
            </div>
            <div>
              <div style={{fontWeight: 600, fontSize: 14}}>学霸客服</div>
              <div className="text-xs t-faint">通常 1 小时内响应</div>
            </div>
          </div>
          <div style={{
            padding: 12, background: 'var(--bg)', borderRadius: 'var(--r-md)',
            fontSize: 12, lineHeight: 1.7, color: 'var(--ink-2)',
            marginBottom: 12,
          }}>
            扫码加客服微信，或发邮件到 <b>help@xueba.note</b>，常见问题先看 FAQ 哦～
          </div>
          <div style={{
            width: 140, height: 140, margin: '0 auto',
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-md)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color: 'var(--ink-3)',
          }}>
            <IconQrcode size={64}/>
          </div>
          <div style={{textAlign:'center', fontSize: 11, color: 'var(--ink-3)', marginTop: 8}}>
            扫码加客服微信
          </div>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
