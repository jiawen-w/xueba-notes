// 登录/注册：合一表单 + 第三方
function AuthPage({ navigate, setUser }) {
  const [mode, setMode] = useState('login'); // login / register
  const [method, setMethod] = useState('phone'); // phone / email
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const submit = (e) => {
    e?.preventDefault();
    if (!agreed) {
      alert('请先勾选同意用户协议和隐私政策');
      return;
    }
    if (method === 'phone') {
      if (!phone.trim()) { alert('请输入手机号'); return; }
      if (!code.trim()) { alert('请输入验证码'); return; }
    } else {
      if (!email.trim()) { alert('请输入邮箱'); return; }
      if (!password.trim()) { alert('请输入密码'); return; }
    }
    setUser({
      isLoggedIn: true,
      name: '小笔头',
      email: email || `${phone}@phone.user`,
      tier: 'free',
      credits: 0,
      freeTrialsRemain: 1,
    });
    navigate('workbench');
  };

  return (
    <div data-screen-label="07 登录注册" style={{
      minHeight: 'calc(100vh - 64px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding: 24,
      position:'relative', overflow:'hidden',
    }}>
      {/* 装饰光斑 */}
      <div className="blob" style={{
        width: 500, height: 500, top: -100, left: -100,
        background: 'radial-gradient(circle, #FFE9F1 0%, transparent 70%)',
      }}/>
      <div className="blob" style={{
        width: 400, height: 400, bottom: -100, right: -100,
        background: 'radial-gradient(circle, #E3F4FB 0%, transparent 70%)',
      }}/>

      <div style={{
        display:'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
        background: '#fff',
        borderRadius: 'var(--r-2xl)',
        boxShadow: 'var(--sh-lg)',
        overflow: 'hidden',
        maxWidth: 960, width: '100%',
        position: 'relative',
      }}>
        {/* 左侧：插画/品牌 */}
        <div style={{
          background: 'linear-gradient(135deg, #FB7299 0%, #FFB36B 100%)',
          padding: '56px 48px',
          color: '#fff',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{position:'absolute', top: 0, right: 0, opacity: .15}}>
            <svg width="240" height="240" viewBox="0 0 240 240">
              <circle cx="180" cy="60" r="80" fill="#fff"/>
              <circle cx="60" cy="180" r="60" fill="#fff"/>
            </svg>
          </div>
          <Logo/>
          <h2 style={{
            fontSize: 32, fontWeight: 700,
            margin: '60px 0 16px',
            lineHeight: 1.25, letterSpacing:'-.01em',
          }}>
            欢迎回到<br/>
            <span style={{color: '#FFE9B0'}}>学霸笔记</span>
          </h2>
          <p style={{fontSize: 14, opacity: .9, margin: '0 0 32px', lineHeight: 1.7}}>
            登录后免费体验 1 次 AI 视频转教程<br/>
            老用户还可领取专属新功能
          </p>
          {/* 用户评价 */}
          <div style={{
            padding: 20,
            background: 'rgba(255,255,255,.15)',
            borderRadius: 'var(--r-md)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            marginTop: 60,
          }}>
            <div style={{fontSize: 13, lineHeight: 1.7, marginBottom: 12}}>
              "通勤路上学完一节，再也不用专门腾时间看视频了，
              <b>笔记直接搬到飞书里同事一起学</b>，PRO 月卡稳稳值。"
            </div>
            <div style={{display:'flex', alignItems:'center', gap: 8}}>
              <div className="avatar" style={{width: 28, height: 28, fontSize: 12, background: 'rgba(255,255,255,.3)', boxShadow: 'none'}}>
                Y
              </div>
              <div>
                <div style={{fontSize: 12, fontWeight: 600}}>Yoki · 字节产品经理</div>
                <div style={{fontSize: 11, opacity: .7}}>已是 PRO 用户</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：表单 */}
        <div style={{padding: '56px 48px'}}>
          <div style={{display:'flex', gap: 24, marginBottom: 32}}>
            {[
              { id: 'login', label: '登录' },
              { id: 'register', label: '注册' },
            ].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                fontSize: 22, fontWeight: 700,
                color: mode === m.id ? 'var(--ink-1)' : 'var(--ink-4)',
                position: 'relative', cursor:'pointer',
                paddingBottom: 8,
              }}>
                {m.label}
                {mode === m.id && (
                  <div style={{
                    position:'absolute', bottom: 0, left: 0,
                    width: 32, height: 3, borderRadius: 2,
                    background: 'var(--bili-pink)',
                  }}/>
                )}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap: 14}}>
            {/* 方式切换 */}
            <div style={{display:'flex', gap: 4, padding: 3, background: 'var(--bg)',
              borderRadius: 'var(--r-md)', alignSelf:'flex-start'}}>
              {[
                { id: 'phone', label: '手机号' },
                { id: 'email', label: '邮箱' },
              ].map(t => (
                <button key={t.id} type="button" onClick={() => setMethod(t.id)} style={{
                  padding: '5px 14px', borderRadius: 'var(--r-sm)',
                  fontSize: 12, fontWeight: 500,
                  background: method === t.id ? '#fff' : 'transparent',
                  color: method === t.id ? 'var(--ink-1)' : 'var(--ink-3)',
                  boxShadow: method === t.id ? 'var(--sh-sm)' : 'none',
                  cursor: 'pointer',
                }}>{t.label}</button>
              ))}
            </div>

            {method === 'phone' ? (
              <>
                <FormField label="手机号">
                  <div style={{display:'flex', gap: 6, alignItems:'stretch'}}>
                    <span style={{
                      padding:'0 12px', display:'flex', alignItems:'center',
                      background: 'var(--bg)', borderRadius: 'var(--r-md)',
                      fontSize: 13, color: 'var(--ink-2)', fontWeight: 500,
                    }}>+86</span>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className="input" placeholder="请输入手机号" style={{flex: 1}}/>
                  </div>
                </FormField>
                <FormField label="验证码">
                  <div style={{display:'flex', gap: 6}}>
                    <input value={code} onChange={e => setCode(e.target.value)}
                      className="input" placeholder="6 位数字" style={{flex: 1}}/>
                    <button type="button" className="btn btn-outline"
                      style={{height: 44, fontSize: 13, whiteSpace: 'nowrap'}}>
                      获取验证码
                    </button>
                  </div>
                </FormField>
              </>
            ) : (
              <>
                <FormField label="邮箱">
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    className="input" placeholder="your@email.com"/>
                </FormField>
                <FormField label="密码">
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                    className="input" placeholder="至少 8 位"/>
                </FormField>
              </>
            )}

            {mode === 'register' && (
              <FormField label="邀请码（选填）">
                <input className="input" placeholder="填写邀请码双方各得奖励"/>
              </FormField>
            )}

            <label style={{display:'flex', alignItems:'flex-start', gap: 8, fontSize: 12, color:'var(--ink-2)', marginTop: 4}}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}
                style={{marginTop: 2, accentColor: 'var(--bili-pink)'}}/>
              <span>
                我已阅读并同意
                <a href="#" style={{color:'var(--bili-pink)'}}>《用户协议》</a>
                和
                <a href="#" style={{color:'var(--bili-pink)'}}>《隐私政策》</a>
              </span>
            </label>

            <button type="submit" className="btn btn-primary btn-lg" style={{marginTop: 8, height: 48}}>
              {mode === 'login' ? '登录' : '注册并登录'} <IconArrowRight size={16}/>
            </button>

            {/* 分割 */}
            <div style={{display:'flex', alignItems:'center', gap: 12, color:'var(--ink-3)', fontSize: 12, margin:'8px 0'}}>
              <div style={{flex: 1, height: 1, background: 'var(--line-soft)'}}/>
              其他方式
              <div style={{flex: 1, height: 1, background: 'var(--line-soft)'}}/>
            </div>
            <div style={{display:'flex', justifyContent:'center', gap: 16}}>
              {[
                { name: '微信', color: '#07C160', icon: 'M' },
                { name: 'B 站', color: '#FB7299', icon: 'B' },
                { name: 'QQ', color: '#1296DB', icon: 'Q' },
                { name: 'Apple', color: '#000', icon: '' },
              ].map(p => (
                <button key={p.name} type="button" style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: p.color, fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
                  onMouseOver={e => {e.currentTarget.style.borderColor = p.color; e.currentTarget.style.background = `${p.color}15`;}}
                  onMouseOut={e => {e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = '#fff';}}>
                  {p.icon}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <div style={{fontSize: 12, color:'var(--ink-2)', fontWeight: 500, marginBottom: 6}}>{label}</div>
      {children}
    </div>
  );
}

Object.assign(window, { AuthPage });
