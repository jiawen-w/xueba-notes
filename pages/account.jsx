// 个人中心：额度 + 订单 + 邀请返现
function AccountPage({ navigate, user, setUser, subroute, tutorials = [] }) {
  const tab = subroute || 'overview'; // overview / orders / invite / settings

  return (
    <div className="container" data-screen-label="06 个人中心" style={{maxWidth: 1100}}>
      <div style={{display:'grid', gridTemplateColumns:'220px 1fr', gap: 24, alignItems: 'flex-start'}}>
        {/* 侧栏 */}
        <aside style={{position:'sticky', top: 88}}>
          {/* 用户卡 */}
          <div className="card" style={{padding: 20, marginBottom: 16, textAlign: 'center'}}>
            <div className="avatar" style={{
              width: 64, height: 64, fontSize: 22,
              margin: '0 auto 12px',
            }}>{user.name[0]}</div>
            <div style={{fontSize: 15, fontWeight: 600}}>{user.name}</div>
            <div className="text-xs t-faint">{user.email}</div>
            <div style={{marginTop: 12}}>
              {user.tier === 'free' && <span className="tag">尝鲜用户</span>}
              {user.tier === 'pack' && <span className="tag tag-pink">10 次卡 · {user.credits}/10</span>}
              {user.tier === 'pro' && <span className="tag tag-vip"><IconCrown size={11}/> PRO 会员</span>}
            </div>
          </div>

          {/* 菜单 */}
          <div className="card" style={{padding: 8}}>
            {[
              { id: 'overview', label: '总览', icon: IconHome },
              { id: 'orders', label: '订单 & 发票', icon: IconCoin },
              { id: 'invite', label: '邀请有奖', icon: IconGift },
              { id: 'settings', label: '账号设置', icon: IconUser },
            ].map(item => {
              const I = item.icon;
              const active = tab === item.id;
              return (
                <button key={item.id}
                  onClick={() => navigate(item.id === 'overview' ? 'account' : `account/${item.id}`)}
                  style={{
                    display:'flex', alignItems:'center', gap: 10,
                    width: '100%', padding: '10px 12px',
                    borderRadius: 'var(--r-sm)',
                    color: active ? 'var(--bili-pink)' : 'var(--ink-1)',
                    background: active ? 'var(--bili-pink-soft)' : 'transparent',
                    fontSize: 13, fontWeight: active ? 600 : 500,
                    cursor: 'pointer', transition: 'all .15s',
                    textAlign: 'left',
                  }}>
                  <I size={16}/> {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* 内容 */}
        <main>
          {tab === 'overview' && <Overview navigate={navigate} user={user} tutorials={tutorials}/>}
          {tab === 'orders' && <Orders user={user}/>}
          {tab === 'invite' && <Invite user={user}/>}
          {tab === 'settings' && <Settings user={user} setUser={setUser}/>}
        </main>
      </div>
    </div>
  );
}

function Overview({ navigate, user, tutorials }) {
  return (
    <div>
      <h1 className="h-2" style={{margin: '0 0 24px'}}>账号总览</h1>

      {/* 额度卡 */}
      <div style={{
        padding: 28,
        borderRadius: 'var(--r-xl)',
        background: user.tier === 'pro'
          ? 'linear-gradient(135deg, #1A1B1F 0%, #2A2B30 100%)'
          : 'linear-gradient(135deg, #FB7299 0%, #FF8AB1 100%)',
        color: '#fff',
        marginBottom: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{position:'absolute', top: -40, right: -40, width: 200, height: 200,
          borderRadius:'50%', background:'rgba(255,255,255,.1)'}}/>
        <div style={{position: 'relative'}}>
          <div style={{
            display:'flex', alignItems:'center', gap: 8,
            fontSize: 13, opacity: .8, marginBottom: 12,
          }}>
            {user.tier === 'pro' ? <><IconCrown size={14}/> PRO 会员</> : user.tier === 'pack' ? '10 次卡' : '尝鲜用户'}
          </div>
          <div style={{display:'flex', alignItems:'baseline', gap: 12}}>
            <span style={{fontSize: 48, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1}}>
              {user.tier === 'pro' ? '∞' : user.tier === 'pack' ? user.credits : user.freeTrialsRemain}
            </span>
            <span style={{fontSize: 14, opacity: .8}}>
              {user.tier === 'pro' ? '无限次转换' : `剩余次数 / ${user.tier === 'pack' ? 10 : 1}`}
            </span>
          </div>
          {user.tier === 'pro' && (
            <div style={{marginTop: 12, fontSize: 13, opacity: .8}}>
              月卡有效期至 2026-06-27 · 自动续费已开启
            </div>
          )}
          {user.tier === 'pack' && (
            <>
              <div style={{
                marginTop: 16, marginBottom: 16,
                height: 6, borderRadius: 999,
                background: 'rgba(255,255,255,.2)',
                overflow: 'hidden',
              }}>
                <div style={{height:'100%', width:`${user.credits/10*100}%`, background:'#fff', borderRadius: 999}}/>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize: 12, opacity: .8}}>
                <span>已用 {10 - user.credits} 次</span>
                <span>剩余 {user.credits} 次</span>
              </div>
            </>
          )}
          {user.tier !== 'pro' && (
            <button onClick={() => navigate('pricing')} style={{
              marginTop: 20,
              padding: '8px 18px',
              borderRadius: 'var(--r-full)',
              background: '#fff',
              color: 'var(--bili-pink)',
              fontWeight: 600, fontSize: 13,
              cursor: 'pointer',
              display:'inline-flex', alignItems:'center', gap: 6,
            }}>
              <IconCrown size={14}/> 升级 PRO 无限畅享
            </button>
          )}
        </div>
      </div>

      {/* 数据 */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 16,
        marginBottom: 20,
      }}>
        <StatCard num={tutorials.length} label="累计教程" icon={IconBook}/>
        <StatCard num="48.2 小时" label="累计视频时长" icon={IconClock}/>
        <StatCard num="¥38" label="邀请收益" icon={IconCoin}/>
      </div>

      {/* 最近教程 */}
      <div style={{marginBottom: 24}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12}}>
          <h3 className="h-4" style={{margin: 0}}>最近的教程</h3>
          <button onClick={() => navigate('library')} className="btn btn-ghost btn-sm">
            查看全部 <IconChevronRight size={12}/>
          </button>
        </div>
        {tutorials.length === 0 ? (
          <div className="card" style={{padding: 24, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13}}>
            还没有教程，去<button onClick={() => navigate('workbench')} style={{color:'var(--bili-pink)', cursor:'pointer', fontWeight:600}}>转换一个</button>吧
          </div>
        ) : (
        <div className="card" style={{padding: 0, overflow:'hidden'}}>
          {tutorials.slice(0, 4).map((t, i, arr) => (
            <div key={t.id} onClick={() => {
              window.__currentTutorialId = t.id;
              navigate('result');
            }}
              style={{
                display:'flex', alignItems:'center', gap: 12,
                padding: 12,
                borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--line-soft)',
                cursor: 'pointer',
              }}>
              <div style={{
                width: 56, height: 32, borderRadius: 6,
                background: 'linear-gradient(135deg, #FB7299, #FFB36B)',
                flexShrink: 0,
              }}/>
              <div style={{flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                {t.title}
              </div>
              <span className="text-xs t-faint">{t.createdAt}</span>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ num, label, icon: I }) {
  return (
    <div className="card" style={{padding: 16, display:'flex', alignItems:'center', gap: 14}}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'var(--bili-pink-soft)',
        color: 'var(--bili-pink-deep)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <I size={20}/>
      </div>
      <div>
        <div style={{fontSize: 20, fontWeight: 700, letterSpacing:'-.01em'}}>{num}</div>
        <div className="text-xs t-muted">{label}</div>
      </div>
    </div>
  );
}

function Orders({ user }) {
  const orders = [
    { id: 'O202605270142', date: '2026-05-27', name: 'PRO 会员 · 月卡', amount: '¥29.00', status: '已支付' },
    { id: 'O202604270089', date: '2026-04-27', name: 'PRO 会员 · 月卡', amount: '¥29.00', status: '已支付' },
    { id: 'O202603270001', date: '2026-03-27', name: 'PRO 会员 · 月卡', amount: '¥29.00', status: '已支付' },
    { id: 'O202602281245', date: '2026-02-28', name: '10 次卡', amount: '¥9.90', status: '已支付' },
  ];

  return (
    <div>
      <h1 className="h-2" style={{margin: '0 0 24px'}}>订单 & 发票</h1>
      {/* 订阅管理 */}
      {user.tier === 'pro' && (
        <div className="card" style={{padding: 20, marginBottom: 20,
          background: 'linear-gradient(135deg, #FFFBEC, #FFF)'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontSize: 14, fontWeight: 600, marginBottom: 4}}>
                <IconCrown size={14} style={{display:'inline', verticalAlign:'middle', color:'var(--vip)'}}/> PRO 月卡订阅
              </div>
              <div className="text-xs t-muted">下次扣费 ¥29.00 · 2026-06-27</div>
            </div>
            <button className="btn btn-outline btn-sm">关闭自动续费</button>
          </div>
        </div>
      )}
      {/* 订单列表 */}
      <div className="card" style={{padding: 0, overflow:'hidden'}}>
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr auto', padding:'14px 20px',
          borderBottom: '1px solid var(--line)', fontSize: 12, color:'var(--ink-3)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '.06em'}}>
          <div>订单</div>
          <div>日期</div>
          <div>金额</div>
          <div>状态</div>
          <div></div>
        </div>
        {orders.map((o, i) => (
          <div key={o.id} style={{
            display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr auto',
            padding: '16px 20px',
            borderBottom: i === orders.length - 1 ? 'none' : '1px solid var(--line-soft)',
            alignItems: 'center', fontSize: 13,
          }}>
            <div>
              <div style={{fontWeight: 500}}>{o.name}</div>
              <div className="text-xs t-faint" style={{fontFamily: 'var(--font-mono)'}}>{o.id}</div>
            </div>
            <div className="t-muted">{o.date}</div>
            <div style={{fontWeight: 600}}>{o.amount}</div>
            <div><span className="tag" style={{background: 'var(--bili-pink-soft)', color:'var(--bili-pink-deep)'}}>{o.status}</span></div>
            <button className="btn btn-ghost btn-sm" style={{fontSize: 12}}>开发票</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Invite({ user }) {
  const [copied, setCopied] = useState(false);
  const inviteLink = 'https://xueba.note/r/xy7k9p';
  return (
    <div>
      <h1 className="h-2" style={{margin: '0 0 24px'}}>邀请有奖 · 拉新返现</h1>

      <div style={{
        padding: '40px 48px',
        borderRadius: 'var(--r-2xl)',
        background: 'linear-gradient(135deg, #FB7299 0%, #FFB36B 100%)',
        color: '#fff',
        marginBottom: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{position:'absolute', bottom: -30, right: 20, opacity: .15}}>
          <IconGift size={180}/>
        </div>
        <div style={{position:'relative', maxWidth: 480}}>
          <div className="tag" style={{
            background:'rgba(255,255,255,.2)', color:'#fff',
            marginBottom: 16, padding: '4px 10px',
          }}>
            <IconCoin size={11}/> PRO 用户专享更高返现
          </div>
          <h2 style={{fontSize: 32, fontWeight: 700, margin: '0 0 12px', letterSpacing: '-.02em', lineHeight: 1.2}}>
            邀请 1 人获得 <span style={{color: '#FFE9B0'}}>¥10</span><br/>
            被邀请人也立得 <span style={{color: '#FFE9B0'}}>¥5</span> 体验金
          </h2>
          <p style={{fontSize: 13, opacity: .85, margin: '0 0 20px'}}>
            朋友通过你的链接注册并开通 PRO，¥10 直接入账，可提现或抵扣下月续费
          </p>
          {/* 链接卡 */}
          <div style={{
            display:'flex', gap: 8, padding: 6,
            background:'rgba(255,255,255,.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--r-full)',
          }}>
            <div style={{padding: '8px 14px', fontSize: 13, fontFamily: 'var(--font-mono)', flex: 1, color: '#fff'}}>
              {inviteLink}
            </div>
            <button onClick={() => {setCopied(true); setTimeout(()=>setCopied(false),1500);}}
              style={{
                padding: '8px 20px',
                background: '#fff', color: 'var(--bili-pink)',
                borderRadius: 'var(--r-full)',
                fontWeight: 600, fontSize: 13,
                cursor: 'pointer',
                display:'flex', alignItems:'center', gap: 6,
              }}>
              {copied ? <><IconCheck size={13}/> 已复制</> : <><IconCopy size={13}/> 复制链接</>}
            </button>
          </div>
        </div>
      </div>

      {/* 数据 */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16, marginBottom: 24}}>
        <StatCard num="12" label="累计邀请人数" icon={IconUser}/>
        <StatCard num="8" label="已成功开通" icon={IconCheck}/>
        <StatCard num="¥80" label="累计奖励" icon={IconCoin}/>
        <StatCard num="¥38" label="可提现" icon={IconGift}/>
      </div>

      {/* 邀请记录 */}
      <h3 className="h-4" style={{margin: '0 0 12px'}}>邀请记录</h3>
      <div className="card" style={{padding: 0, overflow:'hidden'}}>
        {[
          { name: '糖**糖', date: '2026-05-26', status: '开通 PRO', reward: '+¥10' },
          { name: 'Vee****', date: '2026-05-22', status: '开通 PRO', reward: '+¥10' },
          { name: '阿**', date: '2026-05-15', status: '注册', reward: '待开通' },
          { name: '果**', date: '2026-05-10', status: '开通 10 次卡', reward: '+¥3' },
          { name: 'zz_***', date: '2026-05-08', status: '开通 PRO', reward: '+¥10' },
        ].map((r, i, arr) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr',
            padding: '14px 20px',
            borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--line-soft)',
            fontSize: 13,
          }}>
            <div style={{display:'flex', alignItems:'center', gap: 8}}>
              <div className="avatar" style={{width: 24, height: 24, fontSize: 11}}>
                {r.name[0]}
              </div>
              {r.name}
            </div>
            <div className="t-muted">{r.date}</div>
            <div>{r.status}</div>
            <div style={{color: r.reward.startsWith('+') ? 'var(--success)' : 'var(--ink-3)', fontWeight: 600}}>
              {r.reward}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings({ user, setUser }) {
  return (
    <div>
      <h1 className="h-2" style={{margin: '0 0 24px'}}>账号设置</h1>
      <div className="card" style={{padding: 24}}>
        <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
          <Field label="昵称" value={user.name}/>
          <Field label="邮箱" value={user.email}/>
          <Field label="手机号" value="138 **** 8888" suffix="修改"/>
          <Field label="密码" value="********" suffix="修改"/>
        </div>
        <div style={{height: 1, background: 'var(--line-soft)', margin: '24px 0'}}/>
        <div style={{fontSize: 13, fontWeight: 600, marginBottom: 12}}>偏好设置</div>
        <div style={{display:'flex', flexDirection: 'column', gap: 12}}>
          <ToggleRow label="生成完成邮件通知" defaultOn/>
          <ToggleRow label="新功能上线推送" defaultOn/>
          <ToggleRow label="允许将我的教程作为公开案例（额外 +5 积分/次）"/>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, suffix }) {
  return (
    <div>
      <div className="text-xs t-muted" style={{marginBottom: 6}}>{label}</div>
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: '10px 14px',
        background: 'var(--bg)',
        borderRadius: 'var(--r-md)',
        fontSize: 13,
      }}>
        <span>{value}</span>
        {suffix && <button style={{color:'var(--bili-pink)', fontSize: 12, cursor:'pointer'}}>{suffix}</button>}
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultOn }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize: 13}}>
      <span>{label}</span>
      <button onClick={() => setOn(!on)} style={{
        width: 40, height: 22, borderRadius: 999,
        background: on ? 'var(--bili-pink)' : 'var(--line)',
        position: 'relative', transition: 'background .15s',
        cursor: 'pointer',
      }}>
        <div style={{
          position:'absolute', top: 2, left: on ? 20 : 2,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff',
          transition: 'left .2s',
        }}/>
      </button>
    </div>
  );
}

Object.assign(window, { AccountPage });
