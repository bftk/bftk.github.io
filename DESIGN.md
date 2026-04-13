# BFTK Design System

## 1. Visual Theme

ダークベースにゴールドアクセント。インターフェースの大部分はダークグレーの階調で構成し、ゴールドの出現を限定することで、表示された時に確実に視線を捉える。赤や青ではなくゴールドを選んでいるのは、サイト全体に「格」と統一感を持たせるため。

書体は二層構造。Cinzel（セリフ体）をページタイトルにのみ使うことで、各ページの入口に重みを持たせる。Noto Sans JPが本文・UI全般を担い、日本語の可読性を確保する。Cinzelの使用箇所を絞ることで、タイトルが「特別な要素」として機能する。

**Key Characteristics:**
- ダーク背景（`#0A0A0A`）＋ゴールドアクセント（`#F9A825`）
- Cinzel（タイトル限定）+ Noto Sans JP（本文・UI）— Cinzelの希少性が格を作る
- border-radius 8px 基本 — ゲームUIとして自然な丸み
- 静的HTML + CSS + vanilla JS（GitHub Pages）
- box-shadow 不使用。深度は3層のサーフェスカラー（`#0A0A0A` → `#111` → `#151515`）とボーダーで表現。影がなくてもダーク面同士の明度差で階層が読める

## 2. Color Palette

### Primary
- **BFTK Gold** (`#F9A825`): CTA、タイトル、セクションラベル、ブランドマーク (--bftk-gold)
- **Bright Gold** (`#FFD54F`): タイトル用Gold Shimmerグラデーションの明るい側 (--bftk-gold-light)
- **Dark Gold** (`#C78D1E`): ホバー/押下時 (--bftk-gold-hover)

### Surface
- **Near Black** (`#0A0A0A`): body背景
- **Dark Surface** (`#111111`): ナビ、ヘッダー (--bftk-surface)
- **Card Surface** (`#151515`): カード、パネル (--bftk-card)
- **Overlay** (`hsla(0, 0%, 5%, 0.85)`): モーダル背景

### Border
- **Border Dark** (`#222222`): ナビ下線、フッター上線、セクション区切り (--bftk-border)
- **Border Card** (`#333333`): カード枠線 (--bftk-border-card)

### Text
- **White** (`#FFFFFF`): 見出し、強調
- **Light Gray** (`#CCCCCC`): 情報値
- **Body Gray** (`#BBBBBB`): 本文 (--bftk-text-body)
- **Muted Gray** (`#AAAAAA`): サブテキスト
- **Subtle Gray** (`#888888`): ナビリンク、補助ラベル (--bftk-text-subtle)
- **Footer Gray** (`#666666`): フッターリンク
- **Disabled Gray** (`#555555`): コピーライト、無効状態

### Semantic
- **Warning Red** (`#F13A2C`)
- **Success Green** (`#03904A`)
- **Info Blue** (`#4C98B9`)

### Gold Gradient
- **Gold Shimmer**: `linear-gradient(135deg, #F9A825, #FFD54F, #F9A825)` — タイトル専用、`background-clip: text`。メタリックな質感を出し、タイトルをサイト内で最も目を引く要素にする
- 通常UIは単色 `#F9A825`。グラデーションとの差でタイトルの特別感が際立つ

## 3. Typography

### Font Family
- **Cinzel** (Google Fonts): タイトル専用セリフ体。ウェイト600–900
  `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap')`
- **Noto Sans JP** (Google Fonts): 本文・UI全般。ウェイト300–700
  `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap')`
- **Fallback**: 'Segoe UI', Arial, Helvetica, sans-serif

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Font | Color |
|------|------|--------|-------------|----------------|------|-------|
| Hero Title | 2.5rem | 900 | 1.15 | 0.1em | Cinzel | Gold Shimmer |
| Page Title | 2rem | 900 | 1.20 | 0.1em | Cinzel | Gold Shimmer |
| Section Label | 0.85rem | 700 | 1.20 | 0.3em | Noto Sans JP | Gold |
| Section Lead | 1.5rem | 700 | 1.60 | normal | Noto Sans JP | White |
| Card Heading | 0.8rem | 700 | 1.20 | 0.15em | Noto Sans JP | Gold |
| Body | 0.95rem | 400 | 2.00 | normal | Noto Sans JP | #BBB |
| Body Small | 0.85rem | 400 | 1.80 | normal | Noto Sans JP | #AAA |
| Nav Logo | 1rem | 900 | normal | 0.05em | Noto Sans JP | Gold |
| Nav Link | 0.85rem | 400 | normal | 0.05em | Noto Sans JP | #888 → hover Gold |
| Info Label | 0.75rem | 400 | normal | 0.15em | Noto Sans JP | Gold |
| Info Value | 0.9rem | 400 | 1.60 | normal | Noto Sans JP | #CCC |
| Footer | 0.8rem | 400 | normal | normal | Noto Sans JP | #666 |
| Caption | 0.75rem | 400 | 1.50 | 0.05em | Noto Sans JP | #888 |

### Principles
- **Cinzelの制限理由**: タイトル以外に使うと「どこも特別」になり、格が薄れる。Noto Sans JPとの対比があるからCinzelが映える
- **Gold Shimmerの制限理由**: グラデーション効果をタイトルに限定することで、ページの最上位要素が一目で分かる。他のゴールド要素は単色 `#F9A825` で十分に目立つ
- **line-height 2.00**: 日本語本文は欧文より広い行間が必要。2.00は段落をゆったり読ませるための設定
- **letter-spacingの使い分け**: セクションラベル(0.3em)やタイトル(0.1em)の広いトラッキングは「見出しらしさ」を強調。本文はnormalで読みやすさ優先

## 4. Components

### Buttons

**Primary CTA (Gold)**:
- Default: bg `#F9A825`, text `#000`, fontSize 0.9rem, weight 700, letterSpacing 0.1em, padding 12px 28px, radius 8px
- Hover: bg `#C78D1E`

**Ghost CTA (Gold Border)**:
- Default: bg transparent, text `#F9A825`, border 1px solid `#F9A825`, radius 8px, padding 12px 28px
- Hover: bg `#F9A825`, text `#000`

**Subtle Button**:
- Default: bg `#151515`, text `#AAA`, border 1px solid `#333`, radius 8px, padding 10px 20px
- Hover: text `#FFF`, borderColor `#555`

**Text Link**:
- Default: `#888` (ナビ) / `#666` (フッター)
- Hover: `#F9A825`
- transition: color 0.2s

### Cards

**Content Card**:
- bg `#151515`, border 1px solid `#333`, radius 8px, padding 1.5rem
- Heading: 0.8rem / 700 / Gold / letter-spacing 0.15em
- Body: 0.85rem / 400 / #AAA / line-height 1.8

**Info Item**:
- border 1px solid `#222`, radius 8px, padding 1.5rem 1rem, text-align center
- Label: 0.75rem / Gold / letter-spacing 0.15em
- Value: 0.9rem / #CCC / line-height 1.6

### Hero Section
- 中央揃え、min-height calc(100vh - 140px)
- タイトル: Cinzel / Gold Shimmer
- サブタイトル: 1rem / #AAA
- "COMING SOON": 1.3rem / Gold / letter-spacing 0.3em

### Navigation
- bg `#111`, border-bottom 1px solid `#222`, padding 1rem 2rem
- flex / space-between / align-center
- ロゴ左: 1rem / 900 / Gold
- リンク右: 0.85rem / #888 / hover Gold
- `.active` → Gold

### Footer
- border-top 1px solid `#222`, padding 1.5rem 2rem, text-align center
- リンク: `#666` / hover Gold
- コピーライト: `#555` / 0.8rem

### Images
- Hero: フルワイド配置（キービジュアル導入時）
- カード内画像: コンテナ幅、16:9
- `loading="lazy"` を below-fold に適用

## 5. Layout

### Spacing
- Base unit: 8px
- Section gap: 4rem
- Card padding: 1.5rem
- Card gap: 1rem
- Nav padding: 1rem 2rem
- Footer padding: 1.5rem 2rem

### Grid
- Content max-width: 800px
- Card grid: `repeat(2, 1fr)` → mobile 1fr
- Info grid: `repeat(3, 1fr)` → mobile 1fr

### Border Radius
| Value | Use |
|-------|-----|
| 0px | フルブリード画像 |
| 8px | カード、ボタン、インプット |
| 50% | アイコン、バッジ |

## 6. Depth

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 | なし | ページ背景 |
| 1 | 1px solid `#222` | セクション区切り、info-item |
| 2 | 1px solid `#333` + bg `#151515` | カード、パネル |
| 3 | `hsla(0,0%,5%,0.85)` backdrop | モーダル |

box-shadow不使用。ダーク背景同士では影が見えにくいため、サーフェスの明度差とボーダーで階層を伝える方が確実。

## 7. Do's and Don'ts

### Do
- ゴールドはCTA・見出しラベル・ブランドマークに限定。出現を絞ることで視線誘導が機能する
- テキスト階層は色の濃淡で作る（白 → #CCC → #BBB → #AAA → #888 → #666）。ダーク背景ではサイズ差だけでは階層が読みにくい
- カードは `#151515` + `#333` border + 8px radius で統一。新ページ追加時もブレない
- Cinzelはページタイトルのみ。制限が特別感を生む
- `.active` でナビの現在ページを明示。ユーザーの現在地を常に伝える

### Don't
- ゴールドを画面中に散りばめる。複数箇所に使うと焦点が分散する
- 白背景・明色背景セクションを作る。ダーク統一がゴールドを際立たせている
- カードにbox-shadowを付ける。ダーク面上では影が見えにくく、ボーダーの方が確実
- CinzelとNoto Sans JPを同じテキストブロック内で混ぜる。書体の役割分担が���れる
- `#F9A825` と `#FFD54F` を並べて使う。Gold Shimmerはタイトル限定で特別感を保つ

## 8. Responsive

### Breakpoints
| Name | Width | Changes |
|------|-------|---------|
| Mobile | ≤600px | 1カラム、Hero 1.8rem、Page Title 1.5rem、padding縮小 |
| Desktop | 601px+ | 2–3カラム、Hero 2.5rem |

### Mobile (≤600px)
- `.hero-title`: 2.5rem → 1.8rem
- `.page-title`: 2rem → 1.5rem
- `.section-lead`: 1.5rem → 1.2rem
- `nav`: padding 0.8rem 1rem
- `.nav-links`: gap 1rem
- グリッド系: → 1カラム
- `.game-content`: padding 2rem 1.2rem

### Touch Targets
- ボタン: 最低44px高
- ナビリンク: gap 1rem+
- カード: padding 1.5rem

## 9. Technical Notes
- 静的HTML + CSS + vanilla JS（GitHub Pages）
- Google Fonts: Cinzel + Noto Sans JP（CDN）
- Google Analytics: G-K0TT1CMBVT（全ページ）
- OGP: theme-color `#F9A825`
- favicon: TODO
