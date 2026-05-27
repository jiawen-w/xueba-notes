// 会员/定价页：9.9 / 29 / 298
function PricingPage({ navigate, user, setUser }) {
  const [billing, setBilling] = useState('monthly'); // monthly / yearly

  const handleUpgrade = (tier) => {
    if (tier === 'pack') {
      setUser({...user, tier: 'pack', credits: 10, isLoggedIn: true});
    } else if (tier === 'pro') {
      setUser({...user, tier: 'pro', isLoggedIn: true});
    }
    navigate('account');
  };

  return (
    <div className="container" data-screen-label="05 定价/会员" style={{maxWidth: 1100}}>
      {/* 标题 */}
      <div style={{textAlign: 'center', marginBottom: 40}}>
        <div className="tag tag-vip" style={{marginBottom: 12}}>
          <IconCrown size={12}/> 会员中心
        </div>
        <h1 className="h-1" style={{margin: '0 0 12px'}}>
          选个<span className="t-grad">适合自己</span>的方案
        </h1>
        <p className="text-lg t-muted" style={{margin: 0}}>
          先免费试一次 · 满意再付费 · 7 天无理由
        </p>
      </div>

      {/* 计费切换 */}
      <div style={{display:'flex', justifyContent:'center', marginBottom: 32}}>
        <div style={{
          display: 'flex', gap: 4,
          background: '#fff',
          padding: 4,
          borderRadius: 'var(--r-full)',
          boxShadow: 'var(--sh-sm)',
        }}>
          <button onClick={() => setBilling('monthly')} style={{
            padding: '8px 20px', borderRadius: 'var(--r-full)',
            fontSize: 13, fontWeight: 600,
            background: billing === 'monthly' ? 'var(--ink-1)' : 'transparent',
            color: billing === 'monthly' ? '#fff' : 'var(--ink-2)',
            cursor: 'pointer', transition: 'all .15s',
          }}>月付</button>
          <button onClick={() => setBilling('yearly')} style={{
            padding: '8px 20px', borderRadius: 'var(--r-full)',
            fontSize: 13, fontWeight: 600,
            background: billing === 'yearly' ? 'var(--ink-1)' : 'transparent',
            color: billing === 'yearly' ? '#fff' : 'var(--ink-2)',
            display:'flex', alignItems:'center', gap: 6,
            cursor: 'pointer', transition: 'all .15s',
          }}>
            年付
            <span className="tag" style={{
              padding: '0 6px', fontSize: 10,
              background: 'var(--bili-pink)', color:'#fff',
            }}>省 14%</span>
          </button>
        </div>
      </div>

      {/* 三档卡片 */}
      <div style={{
        display:'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
        marginBottom: 48,
      }}>
        {/* 体验版 */}
        <PriceCard
          name="尝鲜"
          subtitle="先免费试试看"
          price="0"
          originalPrice={null}
          period="无需注册"
          features={[
            '免费试用 1 次',
            '完整功能体验',
            '支持 30 分钟以内视频',
            '产出 Markdown / 在线阅读',
            { text: 'PDF / Word / 长图导出', no: true },
            { text: 'AI 追问 / 飞书同步', no: true },
          ]}
          cta={user.tier === 'free' ? '当前方案' : '免费体验'}
          ctaDisabled={user.tier === 'free'}
          onCta={() => navigate('workbench')}
        />

        {/* 10次卡 */}
        <PriceCard
          name="10 次卡"
          subtitle="按需购买 · 不限时长"
          price="9.9"
          originalPrice="29"
          period="买断 · 不过期"
          features={[
            <><b>10 次</b> 转换额度，永久有效</>,
            '单视频最长 2 小时',
            '所有导出格式（PDF/Word/长图）',
            '分享链接（公开 + 私密）',
            '高质量大模型',
            { text: 'AI 追问 / 飞书同步', no: true },
          ]}
          cta={user.tier === 'pack' ? `已开通（${user.credits}/10）` : '立即购买'}
          ctaDisabled={user.tier === 'pack'}
          onCta={() => handleUpgrade('pack')}
          badge="新人首选"
          accent="pink"
        />

        {/* PRO */}
        <PriceCard
          name="PRO 会员"
          subtitle="无限畅享 · 全功能"
          price={billing === 'monthly' ? '29' : '298'}
          originalPrice={billing === 'monthly' ? null : '348'}
          period={billing === 'monthly' ? '/月 · 自动续费' : '/年（约 24.8/月）'}
          features={[
            <><b>无限次</b>转换 · 不限视频时长</>,
            '所有导出格式 + 飞书同步',
            '<b>AI 追问</b> · 基于教程内容对话',
            '<b>合集批量转换</b> · 一键整套课',
            '专属 PRO 客服 1 对 1',
            '优先使用最新模型',
            '邀请返现 ¥10 / 人',
          ]}
          cta={user.tier === 'pro' ? '当前方案' : (billing === 'monthly' ? '开通月卡' : '开通年卡')}
          ctaDisabled={user.tier === 'pro'}
          onCta={() => handleUpgrade('pro')}
          badge={billing === 'yearly' ? '省 ¥50' : '热门'}
          accent="vip"
          highlight
        />
      </div>

      {/* 价值速览 */}
      <div style={{
        padding: '32px 40px',
        background: 'linear-gradient(135deg, #FFF5F8 0%, #E3F4FB 100%)',
        borderRadius: 'var(--r-2xl)',
        marginBottom: 48,
      }}>
        <h2 className="h-3" style={{margin: '0 0 24px', textAlign: 'center'}}>
          为什么<span className="t-grad">值这个价</span>？
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 24}}>
          {[
            {num:'¥0.8', label:'每次 PRO 平均成本', sub:'按每月 35 次估算'},
            {num:'95%', label:'节省的整理时间', sub:'一小时视频→5 分钟读完'},
            {num:'10+', label:'平均产出格式', sub:'MD / PDF / Word / 长图 / 飞书...'},
            {num:'24h', label:'极速客服响应', sub:'PRO 工作时间 1 小时内'},
          ].map((v, i) => (
            <div key={i} style={{textAlign:'center'}}>
              <div style={{fontSize: 32, fontWeight: 700, color: 'var(--bili-pink)', letterSpacing:'-.02em'}}>{v.num}</div>
              <div style={{fontSize: 14, fontWeight: 600, color: 'var(--ink-1)', marginTop: 4}}>{v.label}</div>
              <div className="text-xs t-muted" style={{marginTop: 4}}>{v.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 对比表 */}
      <FeatureTable/>

      {/* FAQ */}
      <FaqSection/>
    </div>
  );
}

function PriceCard({ name, subtitle, price, originalPrice, period, features, cta, ctaDisabled, onCta, badge, accent, highlight }) {
  const accentColor = accent === 'vip' ? 'var(--vip)' : accent === 'pink' ? 'var(--bili-pink)' : 'var(--ink-1)';
  return (
    <div style={{
      position: 'relative',
      padding: highlight ? 32 : 28,
      borderRadius: 'var(--r-xl)',
      background: highlight ? 'linear-gradient(180deg, #1A1B1F 0%, #2A2B30 100%)' : '#fff',
      color: highlight ? '#fff' : 'var(--ink-1)',
      boxShadow: highlight ? 'var(--sh-lg)' : 'var(--sh-sm)',
      border: highlight ? 'none' : '1px solid var(--line)',
      transform: highlight ? 'scale(1.04)' : 'scale(1)',
      zIndex: highlight ? 2 : 1,
    }}>
      {badge && (
        <div style={{
          position:'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          padding: '4px 14px',
          borderRadius: 'var(--r-full)',
          background: highlight ? 'linear-gradient(135deg, #FFB36B 0%, #FF6A8B 100%)' : 'var(--bili-pink)',
          color: '#fff', fontSize: 11, fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>{badge}</div>
      )}

      <div style={{marginBottom: 20}}>
        <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 4}}>
          <span style={{fontSize: 18, fontWeight: 700}}>{name}</span>
          {accent === 'vip' && <IconCrown size={16} style={{color: '#FFB36B'}}/>}
        </div>
        <div style={{fontSize: 13, opacity: highlight ? .65 : .55}}>{subtitle}</div>
      </div>

      <div style={{marginBottom: 24}}>
        <div style={{display:'flex', alignItems:'baseline', gap: 4}}>
          <span style={{fontSize: 16, opacity: .8}}>¥</span>
          <span style={{fontSize: 48, fontWeight: 700, letterSpacing:'-.03em', lineHeight: 1}}>{price}</span>
          {originalPrice && (
            <span style={{
              fontSize: 14, opacity: .5, textDecoration: 'line-through', marginLeft: 6,
            }}>¥{originalPrice}</span>
          )}
        </div>
        <div style={{fontSize: 12, opacity: highlight ? .6 : .5, marginTop: 6}}>{period}</div>
      </div>

      <button onClick={onCta} disabled={ctaDisabled} style={{
        width: '100%', height: 44,
        borderRadius: 'var(--r-md)',
        background: ctaDisabled
          ? (highlight ? 'rgba(255,255,255,.1)' : 'var(--bg)')
          : (highlight ? 'linear-gradient(135deg, #FFB36B 0%, #FF6A8B 100%)'
             : (accent === 'pink' ? 'var(--bili-pink)' : 'var(--ink-1)')),
        color: ctaDisabled
          ? (highlight ? 'rgba(255,255,255,.5)' : 'var(--ink-3)')
          : '#fff',
        fontSize: 14, fontWeight: 600,
        cursor: ctaDisabled ? 'default' : 'pointer',
        boxShadow: !ctaDisabled && highlight ? '0 8px 24px rgba(255, 122, 138, .35)' : 'none',
        marginBottom: 24,
      }}>{cta}</button>

      <div style={{height: 1, background: highlight ? 'rgba(255,255,255,.1)' : 'var(--line-soft)', marginBottom: 16}}/>

      <ul style={{margin: 0, padding: 0, listStyle: 'none', display:'flex', flexDirection: 'column', gap: 10}}>
        {features.map((f, i) => {
          const isNeg = typeof f === 'object' && !React.isValidElement(f) && f?.no;
          const text = isNeg ? f.text : f;
          return (
            <li key={i} style={{
              display:'flex', gap: 10, alignItems:'flex-start',
              fontSize: 13, lineHeight: 1.5,
              opacity: isNeg ? .35 : 1,
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                background: isNeg ? 'transparent' : (highlight ? 'rgba(255,179,107,.2)' : 'var(--bili-pink-soft)'),
                color: isNeg ? 'currentColor' : (highlight ? '#FFB36B' : 'var(--bili-pink)'),
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink: 0, marginTop: 1,
              }}>
                {isNeg ? <IconClose size={10}/> : <IconCheck size={10}/>}
              </span>
              <span style={{textDecoration: isNeg ? 'line-through' : 'none'}}
                dangerouslySetInnerHTML={typeof text === 'string' ? {__html: text} : undefined}>
                {typeof text !== 'string' ? text : undefined}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FeatureTable() {
  const rows = [
    { label: '可转换次数', free: '1 次', pack: '10 次', pro: '∞' },
    { label: '单视频最长', free: '30 分钟', pack: '2 小时', pro: '无限制' },
    { label: '合集批量转换', free: false, pack: '✓', pro: '✓ 整套课' },
    { label: '在线阅读', free: '✓', pack: '✓', pro: '✓' },
    { label: 'Markdown / PDF / Word', free: '只 MD', pack: '全部', pro: '全部' },
    { label: '长图 / 分享链接', free: false, pack: '✓', pro: '✓' },
    { label: '飞书一键同步', free: false, pack: false, pro: '✓' },
    { label: 'AI 追问对话', free: false, pack: false, pro: '✓' },
    { label: '客服响应', free: '社区', pack: '工作日 12h', pro: '1h 内' },
    { label: '邀请返现', free: '¥5', pack: '¥8', pro: '¥10' },
  ];

  return (
    <div style={{marginBottom: 48}}>
      <h2 className="h-3" style={{margin: '0 0 20px', textAlign:'center'}}>详细功能对比</h2>
      <div className="card" style={{padding: 0, overflow: 'hidden'}}>
        <div style={{display:'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid var(--line)'}}>
          <div style={{padding: '16px 24px', fontWeight: 600}}>功能</div>
          <div style={{padding: '16px', fontWeight: 600, textAlign:'center'}}>尝鲜</div>
          <div style={{padding: '16px', fontWeight: 600, textAlign:'center', color: 'var(--bili-pink)'}}>10 次卡</div>
          <div style={{padding: '16px', fontWeight: 600, textAlign:'center', color: 'var(--vip)'}}>
            <IconCrown size={14} style={{display:'inline', verticalAlign:'middle', marginRight: 4}}/>
            PRO
          </div>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--line-soft)',
            fontSize: 13,
          }}>
            <div style={{padding: '14px 24px', color: 'var(--ink-1)', fontWeight: 500}}>{r.label}</div>
            <Cell v={r.free}/>
            <Cell v={r.pack}/>
            <Cell v={r.pro} pro/>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({ v, pro }) {
  return (
    <div style={{padding: '14px', textAlign: 'center'}}>
      {v === false ? (
        <span style={{color: 'var(--ink-4)'}}><IconClose size={14}/></span>
      ) : v === '✓' || v === true ? (
        <span style={{color: pro ? 'var(--vip)' : 'var(--success)'}}><IconCheck size={16}/></span>
      ) : (
        <span style={{color: pro ? 'var(--vip)' : 'var(--ink-1)', fontWeight: 500}}>{v}</span>
      )}
    </div>
  );
}

function FaqSection() {
  const faqs = [
    { q: '不会自动扣费吗？', a: '月卡确实是自动续费，可以随时在「个人中心 → 订阅管理」一键关闭，关闭后当前周期内继续可用。10 次卡是买断的，不会自动扣费。' },
    { q: '转换失败会扣额度吗？', a: '不会。任何因系统原因导致的失败，都会自动退回额度。视频本身因为没有声音 / 加密等无法转换的，我们也会退回。' },
    { q: '可以退款吗？', a: '7 天无理由退款。月卡 / 年卡在首次开通的 7 天内，如果转换次数不超过 3 次，可全额退款。10 次卡未使用可全额退。' },
    { q: '我的隐私和视频版权？', a: '原视频不会被保存超过 7 天（仅用于本次转换），生成的笔记永久存储在你的账号下。你的私人笔记我们绝不会公开，分享链接需要你主动开启。' },
    { q: '支持英文 / 日文视频吗？', a: '支持。Whisper 自动检测语种，AI 笔记支持英 / 日 / 中输出（默认中文）。PRO 用户可自定义输出语言。' },
    { q: '可以企业开发票吗？', a: '可以。开通后联系客服微信，提供抬头和税号即可。增值税普通发票 / 专票都支持。' },
  ];
  const [open, setOpen] = useState(0);

  return (
    <div>
      <h2 className="h-3" style={{margin: '0 0 20px', textAlign: 'center'}}>常见问题</h2>
      <div className="card" style={{padding: 0, overflow: 'hidden'}}>
        {faqs.map((f, i) => (
          <div key={i} style={{borderBottom: i === faqs.length - 1 ? 'none' : '1px solid var(--line-soft)'}}>
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              width: '100%', padding: '16px 24px',
              fontSize: 14, fontWeight: 600,
              color: 'var(--ink-1)',
              cursor: 'pointer', textAlign:'left',
            }}>
              {f.q}
              <IconChevronDown size={16} style={{
                transform: open === i ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform .2s',
                color: 'var(--ink-3)',
              }}/>
            </button>
            {open === i && (
              <div style={{
                padding: '0 24px 16px',
                fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7,
                animation: 'fadeIn .2s ease',
              }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PricingPage });
