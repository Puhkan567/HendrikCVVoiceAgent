# Hendrik Puhkan AI Voice Assistant — Minimalist Professional Redesign

A complete aesthetic overhaul of the AI voice assistant representing Hendrik Puhkan into an editorial-grade, minimalist, and Scandinavian-inspired interface featuring a refined **Nordic Slate & Platinum** palette, dynamic theme switching (Dark / Light / System), a unified floating voice console, and a dedicated **Estonian voice & language option** alongside English.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The design direction incorporates all confirmed choices and your revision:
> - **Colorway**: Nordic Slate & Pure Platinum (`#0f172a`, `#1e293b`, `#f8fafc`, `#e2e8f0`) accented with subtle frosty ice-blue (`#38bdf8` / `#0284c7`).
> - **Theme Mode**: Dynamic theme switcher with seamless support for **Dark Mode** (deep matte slate, platinum typography), **Light Mode** (architectural Swiss paper, crisp slate ink), and **System Mode**.
> - **Layout Composition**: Unified modern executive dashboard with a sleek floating voice console, clean unboxed metadata, and hairline dividers.
> - **Bilingual Voice Support (Estonian + English)**:
>   - Seamless toggle between **English** (International recruiter mode) and **Eesti keel (Estonian)** (Native Estonian business mode).
>   - Localized opening lines for both languages:
>     - *English*: "Hi, I'm an AI assistant representing Hendrik Puhkan. I can tell you about my background, skills, and projects. What would you like to know?"
>     - *Estonian*: "Tere! Olen Hendrik Puhkanit esindav tehisintellekti häälassistent. Saan rääkida oma haridusest, töökogemusest ja oskustest. Mida sooviksite teada?"
>   - Fast-track recruiter prompts accessible in both English and Estonian.
>   - Speech synthesis configured to support native Estonian phonetic cadence and tone.

---

## 1. Overview & Core Concept

- **What It Delivers**: Transforms the voice assistant into a polished, high-end executive portfolio and real-time voice interview platform for recruiters, venture builders, and enterprise clients in Estonia, the Baltics, and worldwide.
- **Visual Identity**: Replaces candy-colored gradient badges and heavy border clutter with clean Swiss/Nordic typography, generous whitespace margins, hairline dividers, unboxed metadata with subtle typographic separators (`·`), and high-performance audio waveforms.
- **Preserved Core Capabilities**: All Gemini 3.8 Live API WebSocket capabilities, Gemini 3.8 Flash-Lite TTS speech synthesis, strict CV facts grounding, first-person Hendrik persona, and recruiter interview lead capture are 100% maintained and elevated.

---

## 2. User Experience & Visual Design

### Color Tokens & Palette (Nordic Slate & Platinum)
```
Canvas (Dark):        #0b0f19 (Nordic Midnight Slate)
Canvas (Light):       #f8fafc (Crisp Architectural Platinum Paper)
Surfaces (Dark):      #111827 / #1e293b (Subtle matte slate surfaces)
Surfaces (Light):     #ffffff (Pure matte white cards with hairline #e2e8f0 borders)
Typography Primary:   #f8fafc (Dark) / #0f172a (Light)
Typography Secondary: #94a3b8 (Dark) / #64748b (Light)
Accent Brand:         #0284c7 / #38bdf8 (Refined Nordic Ice Blue)
Live Voice State:     #10b981 (Pure Nordic Emerald for active voice)
```

### Visual Layout & Typography
- **Top Bar Contract**: Clean 3-zone header: Single-line brand mark (`Hendrik Puhkan`), unboxed status indicator (`EBS Impactful Entrepreneurship · Tallinn, EE`), language toggle (`EN | EE`), theme switcher toggle (Dark/Light/System), and primary action (`Connect / Interview`).
- **Floating Voice Console**: An elevated, distraction-free voice cockpit featuring:
  - High-res portrait representation with refined frosted halo.
  - Minimalist live waveform visualizer canvas with ice-blue harmonics.
  - Language switcher button group (`English` / `Eesti keel`) that adjusts opening line and voice synthesis settings.
  - Seamless "Start Live Voice" (Gemini 3.8 Live API) and "Tap to Speak" controls.
  - Quotation card of the opening line (in the selected language) with one-tap audio preview.
- **Recruiter Fast-Track Drawer & Tabs**:
  - Unboxed questions with clean typographic separators, toggleable between English and Estonian queries.
  - Interactive tabbed CV dossier (Experience, Education, Skills, Achievements) grounded strictly in Hendrik's CV facts.
  - In-app PDF viewer and direct download for Hendrik's verified CV document.

---

## 3. Key Product Decisions & Trade-Offs

- **Estonian Voice Integration**:
  - *Approach*: Pair Gemini 3.8 Live and Gemini 3.8 Flash-Lite TTS with explicit Estonian prompt directives and language metadata. Allow users to switch active language with a single click, instantly updating prompt chips and greeting text.
  - *Why*: Hendrik is a native Estonian from Tallinn; offering both English and native Estonian showcases his natural bilingual communication for local Baltic and international opportunities.
- **Theme Engine Implementation**:
  - *Approach*: CSS class-based theming (`dark` / `light`) driven by React state and localStorage persistence with automatic system preference detection.
  - *Why*: Provides instant switching without page reloads while maintaining WCAG AA contrast standards in both dark and light modes.
- **Zero-Pill Metadata Compliance**:
  - *Approach*: Eliminate bordered candy badges; replace them with natural typographic separators (`·`) and subtle tonal tags.
  - *Why*: Elevates the app from generic template look to bespoke executive software.

---

## 4. Technical Architecture & System Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Top Navigation & Controls                           │
│   [ Hendrik Puhkan ] ─── [ EN / EE ] ─── [ Theme: ☼ / ☾ ] ─── [ Connect ] │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Unified Floating Voice Console                       │
│  ┌───────────────────────┐   ┌──────────────────────────────────────┐  │
│  │   Portrait & Status   │   │     Dynamic Audio Waveform Canvas    │  │
│  └───────────────────────┘   └──────────────────────────────────────┘  │
│  [ Start Live Conversation (Gemini 3.8 Live) ]   [ Tap to Speak ]       │
│  [ Opening Line: English or Estonian native greeting preview ]         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     Recruiter Fast-Track        │   │    Verified CV Dossier Tabs     │
│  • 30s Pitch (EN & EE)          │   │  • Alter Marine (E-Commerce)    │
│  • Alter Marine Marketing       │   │  • Anda (Lead Gen & BizDev)     │
│  • AI Automation (n8n, Claude)  │   │  • EBS Impactful Entrepreneur   │
│  • Language Fluency (EE/EN/FR)  │   │  • Original PDF Document Modal  │
└─────────────────────────────────┘   └─────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Real-Time Conversation Stream Log                    │
│   Recruiter Queries ◄────────► Spoken Responses (Gemini 3.8 Flash/TTS) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Execution Steps

1. **Theme Provider & Styling Setup**: Configure light/dark theme context and CSS variables with the Nordic Slate and Platinum palette.
2. **Bilingual Voice & Text Support**: Add Estonian language definitions, translated opening lines, and localized recruiter questions in `hendrikCv.ts` and `geminiService.ts`.
3. **Refactor Header**: Implement clean 3-zone contract with language selector (`EN / EE`), theme switch toggle (Dark, Light, System), and sleek minimalist typography.
4. **Redesign Voice Console & Audio Visualizer**: Modernize waveform, apply elegant ice-blue accents, and integrate language-aware voice playback.
5. **Streamline CV Inspector & Recruiter Cards**: Apply unboxed typography, subtle dividers, and clean tabular metadata.
6. **Verify & Test**: Check light/dark modes, verify build with `lint_applet` and `compile_applet`.
