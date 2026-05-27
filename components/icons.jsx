// 学霸笔记 · 图标库（线条风，1.6px stroke）
const Icon = ({ children, size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

const IconHome = (p) => <Icon {...p}><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></Icon>;
const IconWand = (p) => <Icon {...p}>
  <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5M12.2 11.8 11 13"/>
</Icon>;
const IconBook = (p) => <Icon {...p}>
  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
</Icon>;
const IconCrown = (p) => <Icon {...p}>
  <path d="M2 6l5 5 5-7 5 7 5-5-2 13H4z"/><path d="M5 19h14"/>
</Icon>;
const IconUser = (p) => <Icon {...p}>
  <circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>
</Icon>;
const IconSearch = (p) => <Icon {...p}>
  <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
</Icon>;
const IconBell = (p) => <Icon {...p}>
  <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>
</Icon>;
const IconLink = (p) => <Icon {...p}>
  <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/>
  <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>
</Icon>;
const IconPaste = (p) => <Icon {...p}>
  <path d="M8 4h8M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/>
</Icon>;
const IconCheck = (p) => <Icon {...p}><path d="m5 12 5 5L20 6"/></Icon>;
const IconClose = (p) => <Icon {...p}><path d="M6 6l12 12M18 6 6 18"/></Icon>;
const IconChevronRight = (p) => <Icon {...p}><path d="m9 6 6 6-6 6"/></Icon>;
const IconChevronDown = (p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>;
const IconDownload = (p) => <Icon {...p}><path d="M12 3v13M6 13l6 6 6-6M5 21h14"/></Icon>;
const IconShare = (p) => <Icon {...p}>
  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
  <path d="m8.5 10.5 7-4M8.5 13.5l7 4"/>
</Icon>;
const IconCopy = (p) => <Icon {...p}>
  <rect x="9" y="9" width="13" height="13" rx="2"/>
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
</Icon>;
const IconPlay = (p) => <Icon {...p}><path d="M5 3.5v17l15-8.5z" fill="currentColor"/></Icon>;
const IconClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IconStar = (p) => <Icon {...p}>
  <path d="m12 3 2.7 5.7 6.3.9-4.5 4.4 1 6.3L12 17.3 6.5 20.3l1-6.3L3 9.6l6.3-.9z"/>
</Icon>;
const IconSparkles = (p) => <Icon {...p}>
  <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8zM5 14l.6 1.6L7 16l-1.4.4L5 18l-.6-1.6L3 16l1.4-.4z" fill="currentColor" stroke="none"/>
</Icon>;
const IconFire = (p) => <Icon {...p}>
  <path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7l-1 2c-1-2-3-4-3-7-3 2-5 5-5 9 0 4 2 10 5 10z"/>
</Icon>;
const IconBolt = (p) => <Icon {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor"/></Icon>;
const IconFileText = (p) => <Icon {...p}>
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <path d="M14 2v6h6M8 13h8M8 17h5M8 9h2"/>
</Icon>;
const IconImage = (p) => <Icon {...p}>
  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>
</Icon>;
const IconPdf = (p) => <Icon {...p}>
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <path d="M14 2v6h6"/><text x="8" y="18" fontSize="6" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="700">PDF</text>
</Icon>;
const IconWord = (p) => <Icon {...p}>
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <path d="M14 2v6h6"/><text x="9" y="18" fontSize="6" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="700">W</text>
</Icon>;
const IconMd = (p) => <Icon {...p}>
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <path d="M14 2v6h6"/><text x="7" y="18" fontSize="5.5" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="700">MD</text>
</Icon>;
const IconQrcode = (p) => <Icon {...p}>
  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
  <rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v3M14 21h7M17 17v4"/>
</Icon>;
const IconList = (p) => <Icon {...p}>
  <path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>
</Icon>;
const IconHeart = (p) => <Icon {...p}>
  <path d="M12 21s-7-4.5-9-9c-1.5-3.5 1-7 4.5-7 1.7 0 3.4.8 4.5 2 1.1-1.2 2.8-2 4.5-2 3.5 0 6 3.5 4.5 7-2 4.5-9 9-9 9z"/>
</Icon>;
const IconCoin = (p) => <Icon {...p}>
  <circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10c0-1 1-2 3-2s3 1 3 2-1 1.5-3 2-3 1-3 2 1 2 3 2 3-1 3-2"/>
</Icon>;
const IconGift = (p) => <Icon {...p}>
  <rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13M8 8c-3 0-3-5 0-5s4 5 4 5h-4zM16 8c3 0 3-5 0-5s-4 5-4 5h4z"/>
</Icon>;
const IconHeadset = (p) => <Icon {...p}>
  <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-7h3zM3 19a2 2 0 0 0 2 2h1v-7H3z"/>
</Icon>;
const IconArrowRight = (p) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>;
const IconArrowLeft = (p) => <Icon {...p}><path d="M19 12H5M11 5l-7 7 7 7"/></Icon>;
const IconRefresh = (p) => <Icon {...p}>
  <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>
</Icon>;
const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IconLogout = (p) => <Icon {...p}>
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
</Icon>;

// 学霸喵吉祥物（自定义可爱图标，避免侵权 22 娘）
const Mascot = ({ size = 96 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    {/* 头 */}
    <ellipse cx="60" cy="68" rx="38" ry="34" fill="#FFE9F1"/>
    <ellipse cx="60" cy="66" rx="36" ry="32" fill="#FFFFFF"/>
    {/* 耳朵 */}
    <path d="M28 42 L24 22 L46 38 Z" fill="#FB7299"/>
    <path d="M30 40 L29 28 L42 38 Z" fill="#FFB3C9"/>
    <path d="M92 42 L96 22 L74 38 Z" fill="#FB7299"/>
    <path d="M90 40 L91 28 L78 38 Z" fill="#FFB3C9"/>
    {/* 头顶发箍 */}
    <rect x="48" y="34" width="24" height="6" rx="3" fill="#00AEEC"/>
    <circle cx="60" cy="32" r="3" fill="#FFB400"/>
    {/* 眼睛 */}
    <ellipse cx="46" cy="64" rx="4" ry="6" fill="#18191C"/>
    <ellipse cx="74" cy="64" rx="4" ry="6" fill="#18191C"/>
    <circle cx="47" cy="62" r="1.5" fill="#fff"/>
    <circle cx="75" cy="62" r="1.5" fill="#fff"/>
    {/* 腮红 */}
    <ellipse cx="38" cy="74" rx="5" ry="3" fill="#FFB3C9" opacity=".7"/>
    <ellipse cx="82" cy="74" rx="5" ry="3" fill="#FFB3C9" opacity=".7"/>
    {/* 嘴 */}
    <path d="M55 76 Q60 80 65 76" stroke="#18191C" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    {/* 小书本 */}
    <rect x="42" y="92" width="36" height="22" rx="2" fill="#00AEEC"/>
    <rect x="44" y="94" width="32" height="18" rx="1" fill="#fff"/>
    <path d="M50 100h20M50 104h16M50 108h12" stroke="#9499A0" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

// 简版 Logo（文字 + 喵脸）
const Logo = () => (
  <div style={{display:'flex',alignItems:'center',gap:8}}>
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <rect x="2" y="6" width="26" height="20" rx="6" fill="#FB7299"/>
      <path d="M9 6 L6 1 L13 5 Z" fill="#FB7299"/>
      <path d="M21 6 L24 1 L17 5 Z" fill="#FB7299"/>
      <ellipse cx="11" cy="16" rx="2" ry="2.6" fill="#fff"/>
      <ellipse cx="19" cy="16" rx="2" ry="2.6" fill="#fff"/>
      <circle cx="11.5" cy="15" r=".8" fill="#18191C"/>
      <circle cx="19.5" cy="15" r=".8" fill="#18191C"/>
      <path d="M13 21 Q15 23 17 21" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
    <span style={{
      fontSize: 18, fontWeight: 700, letterSpacing: '-.01em',
      color: 'var(--ink-1)'
    }}>学霸笔记</span>
  </div>
);

Object.assign(window, {
  IconHome, IconWand, IconBook, IconCrown, IconUser, IconSearch, IconBell,
  IconLink, IconPaste, IconCheck, IconClose, IconChevronRight, IconChevronDown,
  IconDownload, IconShare, IconCopy, IconPlay, IconClock, IconStar, IconSparkles,
  IconFire, IconBolt, IconFileText, IconImage, IconPdf, IconWord, IconMd, IconQrcode,
  IconList, IconHeart, IconCoin, IconGift, IconHeadset, IconArrowRight, IconArrowLeft,
  IconRefresh, IconPlus, IconLogout,
  Mascot, Logo,
});
