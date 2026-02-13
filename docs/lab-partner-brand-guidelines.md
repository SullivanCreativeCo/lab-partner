# Lab Partner | Brand Guidelines

**Version:** 1.0  
**Date:** February 13, 2026  
**Owner:** Keegan (Keegareaux Labs)  
**Status:** Planning Phase

---

## Brand Overview

Lab Partner transforms followers into active collaborators. The brand balances scientific precision (lab) with human connection (partner), creating a platform where influencers build meaningful communities.

**Brand Personality:**
- Professional yet approachable
- Innovative but reliable
- Collaborative not hierarchical
- Modern without being trendy

---

## Logo System

### Primary Logo

The Lab Partner logo features a stylized "L" shaped as a laboratory beaker with bubbles rising, symbolizing:
- **Beaker shape:** Scientific experimentation and innovation
- **Rising bubbles:** Active community, growth, collaboration
- **Letter "L":** Lab Partner identity
- **Liquid gradient:** Flow of ideas and engagement

**Logo variations provided:**
1. **Light background version** (white/light gray backgrounds)
2. **Dark background version** (black/dark backgrounds)
3. **Logo only** (mark without wordmark)

### Logo Usage Rules

**Clear space:**
Maintain minimum clear space equal to the height of one bubble around the logo

**Minimum sizes:**
- Digital: 120px width minimum
- Print: 1.5 inches width minimum
- Social media avatar: 400x400px minimum

**Do's:**
✓ Use provided logo files
✓ Maintain aspect ratio
✓ Use on appropriate backgrounds (light logo on dark, dark logo on light)
✓ Scale proportionally

**Don'ts:**
✗ Modify colors or gradient
✗ Rotate or skew
✗ Add effects (drop shadows, outlines, glows)
✗ Recreate or redraw the logo
✗ Use on busy backgrounds that reduce legibility

### Logo Placement

**Powered by badge:**
For influencer communities, use compact version:
"Powered by [Lab Partner mark]"

**Footer placement:**
Bottom right or center, with link to labpartner.com

**Loading states:**
Animated version: bubbles rise sequentially (future enhancement)

---

## Color Palette

### Primary Colors

Extracted from the logo gradient:

**Sky Blue (Light)**
- HEX: `#56CCF2`
- RGB: `86, 204, 242`
- Usage: Highlights, interactive elements, top of gradients

**Ocean Blue (Mid)**
- HEX: `#2F80ED`
- RGB: `47, 128, 237`
- Usage: Primary buttons, links, middle of gradients

**Navy Blue (Deep)**
- HEX: `#2D5A9C`
- RGB: `45, 90, 156`
- Usage: Text headers, bottom of gradients, footer

**Royal Blue (Base)**
- HEX: `#4169B5`
- RGB: `65, 105, 181`
- Usage: Logo base, solid backgrounds

### Secondary Colors

**Bubble Accent (Cyan)**
- HEX: `#4FC3F7`
- RGB: `79, 195, 247`
- Usage: Bubble effects, notification badges, success states

### Neutral Colors

**Background Light**
- HEX: `#F8FAFB`
- RGB: `248, 250, 251`
- Usage: Page backgrounds, cards (light mode)

**Background Dark**
- HEX: `#0F1419`
- RGB: `15, 20, 25`
- Usage: Page backgrounds (dark mode)

**Surface Light**
- HEX: `#FFFFFF`
- RGB: `255, 255, 255`
- Usage: Card backgrounds, modals (light mode)

**Surface Dark**
- HEX: `#1A1F26`
- RGB: `26, 31, 38`
- Usage: Card backgrounds, modals (dark mode)

**Text Primary (Light mode)**
- HEX: `#1A202C`
- RGB: `26, 32, 44`
- Usage: Body text, headings

**Text Primary (Dark mode)**
- HEX: `#F7FAFC`
- RGB: `247, 250, 252`
- Usage: Body text, headings

**Text Secondary (Light mode)**
- HEX: `#718096`
- RGB: `113, 128, 150`
- Usage: Metadata, timestamps, captions

**Text Secondary (Dark mode)**
- HEX: `#A0AEC0`
- RGB: `160, 174, 192`
- Usage: Metadata, timestamps, captions

**Border Light**
- HEX: `#E2E8F0`
- RGB: `226, 232, 240`
- Usage: Dividers, card outlines (light mode)

**Border Dark**
- HEX: `#2D3748`
- RGB: `45, 55, 72`
- Usage: Dividers, card outlines (dark mode)

### Semantic Colors

**Success**
- HEX: `#48BB78`
- RGB: `72, 187, 120`
- Usage: Success messages, completed states

**Warning**
- HEX: `#F6AD55`
- RGB: `246, 173, 85`
- Usage: Warnings, pending states

**Error**
- HEX: `#F56565`
- RGB: `245, 101, 101`
- Usage: Errors, destructive actions

**Info**
- HEX: `#4299E1`
- RGB: `66, 153, 225`
- Usage: Informational messages, tips

### Gradient Usage

**Primary gradient (Logo style):**
```css
background: linear-gradient(180deg, #56CCF2 0%, #2F80ED 50%, #2D5A9C 100%);
```

**Subtle gradient (Backgrounds):**
```css
background: linear-gradient(135deg, #F8FAFB 0%, #E6F0F9 100%);
```

**Accent gradient (CTAs):**
```css
background: linear-gradient(90deg, #2F80ED 0%, #4169B5 100%);
```

### Color Accessibility

All color combinations meet WCAG 2.1 AA standards:
- Text Primary on Background Light: 12.6:1 (AAA)
- Ocean Blue on White: 5.2:1 (AA)
- Text Secondary on Background Light: 4.8:1 (AA)

---

## Typography

### Font Stack

**Primary typeface: Inter**
- Modern, highly legible
- Excellent at small sizes
- Collaborative feel with rounded characters
- Variable font for performance

**Fallback stack:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

**Monospace (for code):**
```css
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale

**Display (Hero headings)**
- Size: 48px / 3rem
- Weight: 700 (Bold)
- Line height: 1.2
- Letter spacing: -0.02em

**H1 (Page titles)**
- Size: 36px / 2.25rem
- Weight: 700 (Bold)
- Line height: 1.3
- Letter spacing: -0.01em

**H2 (Section headers)**
- Size: 30px / 1.875rem
- Weight: 600 (Semibold)
- Line height: 1.4
- Letter spacing: -0.01em

**H3 (Subsection headers)**
- Size: 24px / 1.5rem
- Weight: 600 (Semibold)
- Line height: 1.4
- Letter spacing: 0

**H4 (Card headers)**
- Size: 20px / 1.25rem
- Weight: 600 (Semibold)
- Line height: 1.5
- Letter spacing: 0

**Body Large**
- Size: 18px / 1.125rem
- Weight: 400 (Regular)
- Line height: 1.6
- Letter spacing: 0

**Body (Default)**
- Size: 16px / 1rem
- Weight: 400 (Regular)
- Line height: 1.6
- Letter spacing: 0

**Body Small**
- Size: 14px / 0.875rem
- Weight: 400 (Regular)
- Line height: 1.6
- Letter spacing: 0

**Caption**
- Size: 12px / 0.75rem
- Weight: 500 (Medium)
- Line height: 1.5
- Letter spacing: 0.02em
- Transform: uppercase (for labels)

### Typography Guidelines

**Emphasis:**
Use weight variation (600 or 700) for emphasis instead of color

**Links:**
Ocean Blue (#2F80ED) with underline on hover

**Lists:**
16px body size, 8px spacing between items

**Quotes:**
Italic, Navy Blue, 20px size, with left border accent

---

## UI Components

### Buttons

**Primary button (CTA):**
```css
background: linear-gradient(90deg, #2F80ED 0%, #4169B5 100%);
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
font-size: 16px;
transition: transform 0.2s;

/* Hover */
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(47, 128, 237, 0.3);
```

**Secondary button:**
```css
background: transparent;
color: #2F80ED;
border: 2px solid #2F80ED;
padding: 10px 24px;
border-radius: 8px;
font-weight: 600;
font-size: 16px;
```

**Ghost button:**
```css
background: transparent;
color: #718096;
padding: 12px 24px;
font-weight: 500;
font-size: 16px;
```

**Destructive button:**
```css
background: #F56565;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
```

### Cards

**Standard card:**
```css
background: #FFFFFF;
border: 1px solid #E2E8F0;
border-radius: 12px;
padding: 24px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
```

**Interactive card (hover):**
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
transform: translateY(-2px);
transition: all 0.2s;
```

**Post card:**
```css
background: #FFFFFF;
border-left: 4px solid #2F80ED;
border-radius: 8px;
padding: 20px;
margin-bottom: 16px;
```

### Form Elements

**Input field:**
```css
background: #FFFFFF;
border: 1px solid #E2E8F0;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;
transition: border-color 0.2s;

/* Focus */
border-color: #2F80ED;
outline: 2px solid rgba(47, 128, 237, 0.1);
```

**Textarea:**
Same as input field, min-height: 120px

**Select dropdown:**
Same as input field with chevron icon

**Checkbox/Radio:**
```css
accent-color: #2F80ED;
width: 20px;
height: 20px;
```

### Badges

**Member status badge:**
```css
background: rgba(47, 128, 237, 0.1);
color: #2F80ED;
padding: 4px 12px;
border-radius: 16px;
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;
```

**Notification badge:**
```css
background: #F56565;
color: #FFFFFF;
width: 20px;
height: 20px;
border-radius: 50%;
font-size: 11px;
font-weight: 700;
display: flex;
align-items: center;
justify-content: center;
```

### Navigation

**Top nav bar:**
```css
background: #FFFFFF;
border-bottom: 1px solid #E2E8F0;
height: 64px;
padding: 0 24px;
```

**Nav link:**
```css
color: #718096;
font-weight: 500;
padding: 8px 16px;
border-radius: 6px;

/* Active state */
color: #2F80ED;
background: rgba(47, 128, 237, 0.08);
```

**Sidebar:**
```css
background: #F8FAFB;
width: 240px;
border-right: 1px solid #E2E8F0;
padding: 24px 16px;
```

### Modals

**Modal overlay:**
```css
background: rgba(26, 32, 44, 0.6);
backdrop-filter: blur(4px);
```

**Modal content:**
```css
background: #FFFFFF;
border-radius: 16px;
padding: 32px;
max-width: 600px;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
```

### Notifications/Toasts

**Toast notification:**
```css
background: #FFFFFF;
border-left: 4px solid #2F80ED;
border-radius: 8px;
padding: 16px 20px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
min-width: 320px;
```

---

## Spacing System

**Base unit:** 4px

**Spacing scale:**
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)

**Component spacing:**
- Between elements: 16px
- Between sections: 48px
- Page margins: 24px (mobile), 48px (desktop)
- Card padding: 24px
- Button padding: 12px 24px

---

## Iconography

### Icon Style

**Source:** Lucide Icons (matches Inter's modern aesthetic)

**Specifications:**
- Stroke width: 2px
- Size: 20px (default), 24px (larger contexts)
- Color: Inherit from parent or #718096 for neutral
- Rounded corners to match brand feel

**Common icons:**
- Stream: `Radio` icon
- Discussion: `MessageCircle` icon
- Members: `Users` icon
- Settings: `Settings` icon
- Notifications: `Bell` icon
- Upvote: `ChevronUp` icon
- Moderator: `Shield` icon

---

## Photography & Imagery

### Style Guidelines

**For influencer communities:**
- Authentic, not overly polished
- Focus on people and connection
- Bright, well-lit environments
- Warm tones with blue accent overlay (subtle)

**For Lab Partner marketing:**
- Modern tech aesthetic
- Diversity in representation
- Collaborative moments (not solo)
- Clean, uncluttered compositions

**Image treatments:**
- Subtle blue overlay (opacity 5-10%) for brand consistency
- Rounded corners: 12px for large images, 8px for thumbnails
- Maintain 16:9 or 1:1 aspect ratios

---

## Animation & Motion

### Principles

**Speed:**
- Fast: 150ms (micro-interactions)
- Standard: 250ms (most transitions)
- Slow: 400ms (page transitions)

**Easing:**
- Default: `cubic-bezier(0.4, 0.0, 0.2, 1)` (ease-out)
- Bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (playful moments)

**Examples:**

**Button hover:**
```css
transition: transform 0.15s ease-out;
transform: translateY(-2px);
```

**Modal entrance:**
```css
animation: slideUp 0.25s ease-out;

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Loading bubbles (future):**
```css
/* Animate logo bubbles rising */
animation: rise 2s infinite;

@keyframes rise {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-40px);
    opacity: 0;
  }
}
```

**Notification toast:**
```css
animation: slideInRight 0.3s ease-out;

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

---

## Voice & Tone

### Brand Voice

**Core attributes:**
- Empowering (not prescriptive)
- Clear (not jargon-heavy)
- Warm (not corporate)
- Confident (not arrogant)

**Example phrases:**

**Don't say:**
"Leverage our white-label SaaS platform to optimize your follower engagement metrics."

**Do say:**
"Turn your followers into partners. Own your community."

---

**Don't say:**
"Maximize ROI through multi-channel audience monetization."

**Do say:**
"Make revenue from the community you built, not the platform."

---

### Messaging Framework

**For influencers:**
- Emphasize ownership and control
- Focus on revenue and relationships
- Speak to frustration with platforms
- Highlight simplicity and professionalism

**For Lab Partners (members):**
- Emphasize exclusivity and access
- Focus on direct connection to creator
- Speak to desire for community
- Highlight ease of use

### Content Guidelines

**Headlines:**
- Active voice
- Benefit-focused
- Short (5-8 words ideal)
- No jargon

**Body copy:**
- Short sentences
- One idea per paragraph
- Scannable (use headings, bullets)
- Conversational but professional

**CTAs:**
- Action-oriented verbs
- Create urgency (not false scarcity)
- Clear value proposition
- Short (2-4 words)

**Examples:**

**Good CTAs:**
- "Start Building"
- "Join the Lab"
- "Go Live Now"
- "Claim Your Community"

**Poor CTAs:**
- "Click Here"
- "Learn More"
- "Submit"
- "Enter"

---

## White-Label Customization

### What Influencers Can Customize

**Allowed:**
- Primary, secondary, accent colors
- Logo upload (maintains size/placement rules)
- Custom domain
- Welcome message
- Community name

**Not allowed to customize:**
- Font/typography
- Layout structure
- Component styles (buttons, cards)
- "Powered by Keegareaux Labs" badge

### Customization Boundaries

**Color constraints:**
- Must pass WCAG AA contrast ratios
- Cannot modify gradient style (only colors)
- Cannot use pure black (#000000) or pure white (#FFFFFF) as primary

**Logo constraints:**
- Max file size: 2MB
- Formats: PNG, SVG, JPG
- Recommended: Transparent PNG
- Aspect ratio: Between 1:1 and 3:1

**Domain constraints:**
- Must be owned by influencer
- HTTPS required
- No adult content or spam domains

---

## Keegareaux Labs Connection

### Visual Relationship

**Shared elements:**
- Modern, tech-forward aesthetic
- Blue color family (Lab Partner extends palette)
- Clean, minimal design
- Professional but approachable

**Differentiation:**
- Lab Partner: Community-focused, warmer tones
- Keegareaux Labs: Innovation-focused, cooler tones

### Co-Branding

**Primary branding:**
Lab Partner logo front and center

**Secondary branding:**
"Powered by Keegareaux Labs" in footer

**Footer badge style:**
```css
color: #718096;
font-size: 12px;
font-weight: 500;
display: flex;
align-items: center;
gap: 4px;

/* On hover */
color: #2F80ED;
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
--mobile: 0px;        /* 0-639px */
--tablet: 640px;      /* 640-1023px */
--desktop: 1024px;    /* 1024-1279px */
--wide: 1280px;       /* 1280px+ */
```

### Component Adaptations

**Navigation:**
- Mobile: Hamburger menu
- Desktop: Horizontal nav

**Cards:**
- Mobile: Single column, full width
- Tablet: Two columns
- Desktop: Three columns

**Typography:**
- Mobile: Reduce all sizes by 10-15%
- Desktop: Use full scale

**Spacing:**
- Mobile: Reduce by 25-50%
- Desktop: Full spacing scale

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

**Color contrast:**
- Text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Focus states:**
All interactive elements have visible focus indicators
```css
outline: 2px solid #2F80ED;
outline-offset: 2px;
```

**Keyboard navigation:**
All functionality accessible via keyboard

**Screen readers:**
Semantic HTML, ARIA labels where needed

**Motion:**
Respect `prefers-reduced-motion` setting
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation Reference

### CSS Variables

```css
:root {
  /* Colors - Primary */
  --color-sky-blue: #56CCF2;
  --color-ocean-blue: #2F80ED;
  --color-navy-blue: #2D5A9C;
  --color-royal-blue: #4169B5;
  --color-bubble-accent: #4FC3F7;
  
  /* Colors - Neutral Light */
  --color-bg-light: #F8FAFB;
  --color-surface-light: #FFFFFF;
  --color-text-primary-light: #1A202C;
  --color-text-secondary-light: #718096;
  --color-border-light: #E2E8F0;
  
  /* Colors - Neutral Dark */
  --color-bg-dark: #0F1419;
  --color-surface-dark: #1A1F26;
  --color-text-primary-dark: #F7FAFC;
  --color-text-secondary-dark: #A0AEC0;
  --color-border-dark: #2D3748;
  
  /* Colors - Semantic */
  --color-success: #48BB78;
  --color-warning: #F6AD55;
  --color-error: #F56565;
  --color-info: #4299E1;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Consolas', monospace;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-base: 250ms;
  --transition-slow: 400ms;
  --ease-out: cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

### Tailwind Config (for reference)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          sky: '#56CCF2',
          ocean: '#2F80ED',
          navy: '#2D5A9C',
          royal: '#4169B5',
        },
        accent: {
          bubble: '#4FC3F7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
};
```

---

## Brand Assets Checklist

### Required Files

- [ ] Logo (light background) - PNG, SVG
- [ ] Logo (dark background) - PNG, SVG
- [ ] Logo mark only - PNG, SVG
- [ ] Favicon - 32x32, 64x64, ICO
- [ ] Social media images (OG images)
- [ ] Email header template
- [ ] Presentation template
- [ ] Business card template (future)

### File Organization

```
/brand-assets
  /logos
    logo-light.svg
    logo-light.png
    logo-dark.svg
    logo-dark.png
    logo-mark.svg
    favicon.ico
  /colors
    palette-reference.pdf
  /typography
    Inter-fonts/
  /templates
    og-image-template.psd
    email-header.html
```

---

## Next Steps

1. **Finalize logo files** - Export SVG and PNG versions at multiple sizes
2. **Create favicon** - Generate from logo mark
3. **Build component library** - Implement UI components in code (Storybook)
4. **Create brand deck** - PDF presentation of brand guidelines
5. **Design marketing assets** - Landing page, social graphics, email templates

---

**Document Owner:** Keegan  
**Last Updated:** February 13, 2026  
**Next Review:** After initial implementation
