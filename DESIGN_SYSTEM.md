# OpenSplit Design System & UI Reference

**Project:** OpenSplit v2 - Complete UI Redesign  
**Stitch Project ID:** `projects/1695241361321249608`  
**Created:** March 10, 2026  
**Design Theme:**
- **Color Mode:** Dark
- **Primary Color:** Teal `#13ecda`
- **Secondary Color:** Purple `#7c3bed`
- **Font:** Inter
- **Border Radius:** 12px
- **Background:** `#0a0a0a`
- **Card Borders:** `#2a2a2a`

---

## 📐 Design Philosophy

Inspired by **Stripe Dashboard** (professional UX) and **Splitwise** (bill-splitting patterns), with modern **Glassmorphism** effects and clean **Card-based layouts**. Mobile-first with 48px minimum touch targets.

---

## 🎨 Complete Screen Inventory

### 1. Dashboard Screens

#### 1.1 Dashboard Overview (Variant 1)
**Frontend File:** `frontend/src/app/(dashboard)/dashboard/page.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidWKr63Uy953YSdyFcA51-RepeqvXPBqWuu_qasC3bbv7MX71tbqrQnAYez9JSRpeEDE1KHY3yRPlN8j6afdpujo4QkxgYppZUC7LlMl_HA0GBOw-AqI8E0YcZfCsVbd76wJb6F9EAE-GVnHc1KD_zDmzQ6b0myQfztLcXn1gm-wHuoS9FDOdBLgfKrzPa626TcxnXjZKG0rfgQavd2BMymAC6gAST9b6b2oNupxG0peMcvat3zD-0SOsFM)  
**Features:**
- Left sidebar navigation (256px)
- Overview cards: Total Balance (teal), Active Groups, Recent Expenses
- Recent activity list with expense items
- Floating action button (bottom right)

**Implementation Notes:**
```tsx
// Components needed:
- <DashboardLayout /> // Shared sidebar wrapper
- <StatCard /> // For balance/groups/expenses cards
- <RecentActivityList /> // Expense list component
- <FloatingActionButton /> // FAB for Add Expense
```

#### 1.2 Dashboard Data-Rich (Variant 2)
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidW29iOLPUSQS1JJ89KPv0kVZ5_geVfxME0juupODKec9i1OeCti94ZViBaMNyxS_0SMbcthJTby4sce3YDgQxX1kuw3AYnk-TH7Lu1n6KgR1RYJIA9ZhA9agji8QEBaUQs7mgq41L7xqYaH3SubqSJp6SV2gPn0ObnFiworP6DL_8YHQboNmY9NwxrNROcibLTlY89m5TjeGHwdyMzL9tyJs-1WwiARlKWnwi3c43cWCNY3UCcrmR1CJJs)  
**Features:**
- Same as Variant 1 but with trend sparkline in balance card
- Categorized expense icons in activity list
- Enhanced FAB with glow effect

**Implementation Notes:**
```tsx
// Additional components:
- <SparklineChart /> // Mini trend chart (use recharts)
- <CategoryIcon /> // Dynamic icon based on expense category
```

---

### 2. Landing Page

#### 2.1 Centered Hero (Variant 1)
**Frontend File:** `frontend/src/app/page.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidW7i63aHiHp41c8Kz9-F7Q7pTTs3mRI782VOANUVGblywCs7eIPlVEgt2tlEZ3XUdocPJLTLsnJQGotK-n7SzendD9nSwDnTN-c4auFVsFBf4-H4XOhXfJBds22ZEjMXOhbEC5ChUSwhrJ83spMP65GeeecTB4vRkkNtjUqK09Lvo-sRyuanJDRXOv6gEXpebA1mYn6SokwHMwXH0SHk3wDQTWCGxOwEvV48GnVIhkxXOyHfCfrIfMySw)  
**Features:**
- Animated gradient background (teal to purple)
- Large headline: "Split bills effortlessly with friends"
- Three CTAs: Create Account, Sign In, Continue as Guest
- Three feature cards: AI Receipt Scanning, Smart Settlements, Multi-Currency

**Implementation Notes:**
```tsx
// Components:
- <GradientHero /> // Animated background with CSS
- <FeatureCard /> // Reusable card with icon + title + description
- <Button variant="primary|outline|ghost" />
```

#### 2.2 Split-Screen with Mockup (Variant 2)
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidXNXMaY3nGueO_9A78HXrxNQ-Pavz2l5aWUYbclQLeD6AmomJ2rm-ZSAr1lYhGVTHPJWMrGp4PSgjTR_jgxY5xFfsDb0oEfpTnO5e36AEdVHqWTXuQhDXQXl7E8DTDdJNmvrnZAiRfTL1hXSoKZeC1Om0HshYcYR9HsjmntlFoKY7UfT2oOTjtF0HThVJmffP87MLsbCeGLpLY72xeI09VMJtiBuuhRKk1hRn8W6iC6Xtt8cKn9_rI8-w8)  
**Features:**
- Split layout: text left, mockup right
- Glassmorphism effect on feature cards
- Dashboard mockup floating over gradient glow

**Implementation Notes:**
```tsx
// Use backdrop-blur for glassmorphism:
className="backdrop-blur-md bg-white/10 border border-white/20"
```

---

### 3. Expenses Page

#### 3.1 Expense List View
**Frontend File:** `frontend/src/app/(dashboard)/expenses/page.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidVdCkRp6obytJaMWr-JjyVW-KJO_ojzCDGVWWYKUiY8Sk9Icm94JYJVOQPqIiooZ81h989yW2I0ZDtB-_sSgfUVabABMYQA-6gljSyDO8MXEmKdimwijZP79PYrmQdX4hOdpnexPFHugx3cNnBXDAqCxm29UPC3HjTy3ruF_du5cAMoe5wyYk-WXo163Kerp6N-fabnLys8CUweO4AtfnMlfqKh_blslFMdxecd3pPv9AlB8AjkK1_eZUg)  
**Features:**
- Filter bar: group selector, date range, category chips
- Expense cards with category icon, details, amount
- Color-coded amounts: green (owed), red (owe), gray (paid)
- Avatar circles for "paid by"
- Receipt thumbnail icons

**Implementation Notes:**
```tsx
// Card structure:
<ExpenseCard>
  <CategoryIcon category={expense.category} />
  <ExpenseDetails title={} group={} date={} />
  <Amount value={} color={getAmountColor()} />
  <AvatarStack users={expense.paidBy} />
  {expense.receiptUrl && <ReceiptIcon />}
</ExpenseCard>
```

#### 3.2 Empty State
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidX81tCAEV1r_WkP9iGIZ62nvxnqR1J0t5PKYg_aTT5Q_7PU3__xw2buomiwFWTsqKDaSF_N7ftuFJBAMkiJfF8L1qTQdWnrNMz00c8wTLkKrCY2apxRfXpb-PNgX6eRq1xhJeyrO0ISl3qmpuk3srzlVpOB46pdS17ZqHcZS4G-TsbZGN7wMIl9xsLNXS7yJlgColM78KYdfCr6CuCdD7F3CoTfnDeJHm7IqlGro8CqQYoTx6ZEaWcdQGU)  
**Features:**
- Illustration with "No expenses yet" message
- "Add your first expense" CTA button

---

### 4. Groups Page

#### 4.1 Groups Grid View
**Frontend File:** `frontend/src/app/(dashboard)/groups/page.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidV5lDwTA2shsBxTxUSGRpQ1GoI9lJB0UzsJe-1PUp_y1uCSMWLqVtpuASKCZbRW2_wXgBZMFR4zUkNW7SoYAJrnv7n7YDx8BhvB37yQqE24Q9MgmtVqbcVBvjTaBhPUYYsqCnZRF2giewLfwAXLuS0jol0yxzyaSGkYJgRhroOeSw0mFHzvVXgLMIu829Byca0LoNdqqdTleZqXVTFTt5sFdcCMI7I2Vf420UtrN1lzTXiaWwxVR2WGu_0)  
**Features:**
- Search bar + "New Group" button
- Grid layout (2 columns on desktop)
- Group cards: image/icon, name, member count, balance
- Overlapping avatar stack
- Hover effect: card lift with shadow

**Implementation Notes:**
```tsx
// Grid: grid-cols-1 md:grid-cols-2 gap-6
// Card hover: hover:scale-105 hover:shadow-2xl transition-transform
// Avatar stack: Use -ml-3 for overlap
```

#### 4.2 Empty State
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidXMm6Xuij2uTbC7sBPY68MHjII24h7Rtk11tmYQ4BtqAXLAbSs7lUgYGi9-sfO7seoo2uFkWCgqLD4N5QRLpqIPz3esVH4ZbGy4FRkU-0wX2OMkCpIAopGb1F07SFpo5AyaweGpbe7twFfkxB1ufWq9tqwmG0_XgqjlNJWzEfTFRtt1os08Dmcl3DRR0R54sJE5rasz8Z6aV6I8Nm604F3oeES3a580zNHy0Mn29AMOyBqaozJAmZKmMA)  
**Features:**
- "Create your first group" illustration
- "Get Started" CTA button

---

### 5. Settlements Page

#### 5.1 Debt Optimization View
**Frontend File:** `frontend/src/app/(dashboard)/settlements/page.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidVwdEtO3GjnfVWwW30JfNMB-24up7TybFGG13Wlv1bsa_uH9ItbToHU65CDeKdSRXtjaCry33fN9vyrJpcJTbf09GPEbH33mGrc6F2kFbildKKcvXiRji069vcOgw5JvR1ib-cRIIDoY1nnT19FsgtqZ5-3BEgmEp48JDiFXxO_F3Rsri1r3jZY701QeqAzqFihb2dLFlQSRs3UCjiituba4bGbtyc3vc4-1ASBme8H5m_DvK2VwMivW7g)  
**Features:**
- Group selector dropdown
- Visual debt graph with arrows between members
- Settlement cards: "Alice pays Bob $25.50"
- "Mark as Paid" button per card
- Past settlements section (grayed out with checkmarks)

**Implementation Notes:**
```tsx
// Visual graph: Consider react-force-graph or custom SVG
// Settlement card structure:
<SettlementCard>
  <Avatar user={fromUser} />
  <ArrowIcon className="text-teal-500" />
  <Avatar user={toUser} />
  <Amount value={amount} />
  <Button variant="primary">Mark as Paid</Button>
</SettlementCard>
```

#### 5.2 All Settled Up State
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidUegRjR_vSz9LylUdjfRgyfy-EFcYwbRA5pOoxqBtmSDnwqy6WW9AyzpbyoDUY_68W7TY16MxrktJVkR20UHGmZOCHrgEAhBDQYZrQcyF3BhkLoWsSz5kGMej746FrIVvAfkagPL8kOvApjQSGwIFRddOG1kYyn3ENn_D-aGaaatXYO_sKpdNqSxT56XluC7qv7mypwdUKEsMdqCk1RNwE-ZB4omR0En8N9AuoWzm3bz4hr8JJmn291kkg)  
**Features:**
- Celebration illustration (checkmark/party popper)
- "All settled up! No outstanding balances" message

---

### 6. Authentication Pages

#### 6.1 Login Screen
**Frontend File:** `frontend/src/app/(auth)/login/page.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidVC5lAhEQWHjvH29rkFCWxL5xYkiqzcinotnqAx58yUZk_fmiyaEltM4kfaimHXZJrMuEPxTe6l1PFCGoQlejCUP9K0PsmAMgNIzm349uDMuoutMmOutyYJdiVdibNJBkNndm6ZpJtc3d8j2eId-iQAxlN1AcK-2xkX34HDUaNvjSEilztTB6ZxBNRl5AeFf-KUlrJNfGXvf4D2l_JhPBoNU4owMZHJf5H_pL9ZD32CH3SFVx1qLeKOQw)  
**Features:**
- Split-screen: gradient left, form right
- Email + password inputs
- "Remember me" checkbox
- "Forgot password?" link
- Google/GitHub OAuth buttons
- "Don't have an account? Sign up" link

**Implementation Notes:**
```tsx
// Split layout: grid grid-cols-2
// Focus state: focus:ring-2 focus:ring-teal-500
// Validation: Show red error text below inputs
```

#### 6.2 Signup Screen
**Frontend File:** `frontend/src/app/(auth)/signup/page.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidU_-To1EQMJCm_AP0IH8bmpMG8ctxFjGMxy2PD-RZdwLBUmn9NybBjeL4ZOmNIiyJe5oq3_bMu2jP6b9m-_wIdxflopg89qdaQTqtl_1PwSzH-7HhqJtN0_JxlHIXqMd730M0Y5JL_s2hpf_sNiDj8AgLaN1X34cwPhRQJ7iZ30aNRPC0J7waLNmhRNqdJamNLgOpcNpbxo3jFuxp4NTcC9H7CODLnBRmFh_UNoQRt5YUYFiOUd-wfHTWI)  
**Features:**
- Same layout as login
- Additional fields: Display Name, Confirm Password
- "I agree to Terms" checkbox
- Validation error messages in red

---

### 7. Profile Settings

#### 7.1 Full Settings View
**Frontend File:** `frontend/src/app/(dashboard)/profile/page.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidVRumZ0qAnHZ8atp2bpB3uD5CfukXj8esMd8yk4ktVNuCZ4s-3MMLEQYiy68NpK7-x4IjMJvhtm9QTLpyvzX0WLmc_k5C3y6J_yJfcFf0D26Ml6-wgKaF0XU2CjJFkr9OUc8rMGCQM0599aFxFGypZn7dl_bSbBIRMwx6Zhms485lxJXvnowYWNXQVFhujUJdyMdaOebGg3AXxQnC-lveBHq_3XUGFo1tzaW8AMQ1f7CRyRWXX4P3JYbak)  
**Features:**
- Large avatar with "Change Photo" overlay
- Settings cards:
  - Personal Information (name, email, Save button)
  - Security (Change Password, 2FA toggle)
  - Preferences (Currency selector, notification toggles)
  - Account Management (Delete Account danger button)

**Implementation Notes:**
```tsx
// Card division: space-y-6
// Toggle switches: Use @headlessui/react Switch component
// Danger button: bg-red-600 hover:bg-red-700
```

#### 7.2 Security Detail View
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidUktaBLNLKe7ZbJxkSh96n3jLIZUHD-0YzfVJTopixyLh9ZbWge5B-PQpEfsgXeu-8qj8pZ32jeoGYBqWWacOimzigREoVNCh64Sytg4k1hF8-n1-hOI6hphYtt215YG7MtLlrGRp8xD_YMZOV916a1qy5aGUZpSnr0_dqmJiQnKwg_FESAErnYxgAVdYiVmgy91E5cboeOHEB77UCQnsFFLXlKG9AuucrQU9V_FaZAz-IphkA6BTWsmMA)  
**Features:**
- Expanded password change form
- Current Password, New Password, Confirm fields
- Purple accent for active toggle states

---

### 8. Modals

#### 8.1 Add Expense Modal
**Frontend File:** `frontend/src/components/modals/AddExpenseModal.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidU8UpOaWhIKEPwQEwpmJQtF_eNXj9f2WOd825eCXiMuE4fdt_ij2YqIfcn_iMIwW6IfPbdUdOrSKueYw3rcIXI9EUsZ7H8JmivNCTn619eSUEwSILMHNDV-s76lpfPOB80ZYjjuOm21aQJKEY-ieGX-e6yeQiTG_RgSr5MV_6IYdaVZjj-IYbDTFUe6CRZzu7dKPnbbq80tKB0t6VUOpZqjs88CN-UDIO3s_NDAAOVMt1li7itljteLmPg)  
**Features:**
- Dark overlay background
- Centered card (600px max width)
- Fields: Description, Amount, Group, Category, Date, Paid by
- Split between: member checkboxes with auto-equal amounts
- Receipt upload with "Scan receipt with AI"
- Cancel + Add Expense buttons

**Implementation Notes:**
```tsx
// Use @headlessui/react Dialog for modal
// Auto-calculate splits when members selected
// File upload: react-dropzone for drag-drop
```

#### 8.2 AI Receipt Scan Modal
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidVZXnwSXnKXoSPHrvssighM2pLXBlDcQa1gfL1gaGZJwoUzzGncpiNPMavDbYHpYUvSB3DnJvkQ-O8aKKXiUg4-1jNYWRowliaOUaY14GsLa3vldm2OXUSKSJb6CMMu1Mcssl9_55g_JBJl58ugcyefw0UlBBn4ijc4q2BbELmpEuUUueBO_gEG7pnevQWTqA1MxJY-bYy8s_A5kPWrzBgglv5lrUA-0BOzRRYkJ4fkHpmSe-_VbWDTFV8)  
**Features:**
- Receipt preview on right side
- "AI Extracting..." progress bar
- Teal gradient border on upload section
- Splits auto-updating based on detected total

**Implementation Notes:**
```tsx
// Poll receipt scan job: GET /api/expenses/jobs/{job_id}
// Show progress: <ProgressBar percent={jobStatus.progress} />
// Auto-fill form when scan complete
```

---

### 9. Error Pages

#### 9.1 404 Illustrated
**Frontend File:** `frontend/src/app/not-found.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidUTlzcyGVeM7A61AVFAn2b_ljkPkoEqGt05U9XxgaWYyy6RCMtkTH14nEH2Iw8VX9H52sYxrAXX4Udx7XCIBGdSwXawn6Cis_JQ9iBL_hk7FxFTZjh1gdQJV1bw0dR3WvmtXB0T_Ic43zrD6KDhxh8_r26IwgqHbMjtZryiE8simGsY8JDbruukf6FTLOMkV9J53ytCQuY9FekVEc-qyIpKlLxVdxp4Fm-agurXDF2nZIavGd8EjfbFBxI)  
**Features:**
- Large gradient "404" text
- Friendly illustration (confused person with empty wallet)
- "Page not found" heading
- Two buttons: "Go to Dashboard" + "Contact Support"
- OpenSplit logo in top left

#### 9.2 404 Minimalist
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidWOYQUnyQriNKfHI2F1dNA5in_xTXlG7ySNpt9EOvCQXSGsRsXRgn_V84VWvgGT9ne_dlBl_Q9urRNOIqo3kCY63nLUR23DvFrQnpvzuVTZgC0xoE-4CR3QvN_neRyM8x55Vn0PSi6qWRslmThLEI7PGR06g5Ko8ZH1UJOoPT9E-XDDltyGuQFKNjAfhDoU225trssxKkD4A4-wCKmdGNG26uv7fP3nDiME-DQ8pWwpFjp8C7cWy4jpGA)  
**Features:**
- Elegant thin "404" with teal glow
- Abstract geometric shapes (purple + teal)
- Single "Return Home" button
- Minimalist aesthetic

---

### 10. Loading States

#### 10.1 Expenses Skeleton
**Frontend File:** `frontend/src/components/skeletons/ExpensesSkeleton.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidXy3dMS3qCuHYUPPCbSOd417ooAsImDRqhGolkEqTspXES0Ac-YNRvT-LsCPE0tfIE9fCE2_qKj4kZ7YHeWLfvR7fVmQPUAHYnWSWAz72ii9k7p6-OyEtsSNgsiJbFwHWwYZ9fFxYDLyNHSoo_kX6MORy7ZD5y0cb_anvCEzYTEBhZV2P0gRvTlehnd6-jobR0xg2xU23YuWCpmfi0AMlWk4kjz0ykmRXi-7QYqGM9SMUVyPX2tu6OnPw)  
**Features:**
- Shimmer animation (#1f1f1f to #2a2a2a)
- Filter bar shimmers
- Expense cards: circular + horizontal shimmers
- Smooth pulse effect

**Implementation Notes:**
```tsx
// Shimmer CSS:
.shimmer {
  background: linear-gradient(90deg, #1f1f1f 0%, #2a2a2a 50%, #1f1f1f 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

#### 10.2 Dashboard Skeleton
**Frontend File:** `frontend/src/components/skeletons/DashboardSkeleton.tsx`  
**Screenshot:** [View Design](https://lh3.googleusercontent.com/aida/AOfcidVz9PEuFjHTNNq-8q1SvRN_-ZW3O-edIAR51sPzDoWvjRBcscKzG5VaiMdDVqxgsdspkBnLQ21AA15ZVBmJZYrxo-kGeAlpt4UzFMsjqOgLGMFaj_MpsW_-vbwCXTRoqpafKhC-OPyO_KHxcimPQvWXsb29nw_HqWRf57DgeZETVEL1YYxDJ8cI67-vZhHOJ05aut6524bci2v3T6OR2kTAOgyibaqw3A3yb7w1tIih6mqSTAyNagjsrw)  
**Features:**
- Three large card shimmers
- Recent activity: 4-5 skeleton rows
- Circular + horizontal shimmers per row

---

## 🎯 Frontend Implementation Checklist

### Phase 1: Core Layout (Week 1)
- [ ] Create `DashboardLayout` component with sidebar
- [ ] Create `Sidebar` navigation component
- [ ] Implement `(dashboard)/layout.tsx` wrapper
- [ ] Add Lucide React icons for navigation
- [ ] Implement responsive mobile drawer

### Phase 2: Reusable Components (Week 1-2)
- [ ] `Button` component (primary, outline, ghost, danger variants)
- [ ] `Card` component with hover effects
- [ ] `Input` with label, error states, focus glow
- [ ] `Avatar` and `AvatarStack` (overlapping)
- [ ] `StatCard` for dashboard metrics
- [ ] `FloatingActionButton` (FAB)
- [ ] `LoadingSkeleton` (shimmer animations)
- [ ] `EmptyState` with illustrations

### Phase 3: Page Implementation (Week 2-3)
- [ ] Landing page with gradient hero
- [ ] Login/Signup split-screen layouts
- [ ] Dashboard with stat cards + activity
- [ ] Expenses page with filters
- [ ] Groups page with grid cards
- [ ] Settlements page with debt graph
- [ ] Profile settings page
- [ ] 404 error page

### Phase 4: Modals & Advanced (Week 3-4)
- [ ] Add Expense modal with split calculator
- [ ] Receipt upload with drag-drop
- [ ] AI scan progress UI
- [ ] Delete confirmation modals
- [ ] Toast notification system (Sonner)
- [ ] Keyboard shortcuts menu

### Phase 5: Polish (Week 4)
- [ ] Framer Motion animations
- [ ] Hover/focus state refinements
- [ ] Loading state transitions
- [ ] Error boundary with retry
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Mobile responsive testing

---

## 🔧 Required Dependencies

Add these to `frontend/package.json`:

```json
{
  "dependencies": {
    "@headlessui/react": "^2.0.0",
    "framer-motion": "^11.0.0",
    "recharts": "^2.10.0",
    "react-dropzone": "^14.0.0"
  }
}
```

---

## 📚 Color Reference

```css
:root {
  /* Brand */
  --color-teal: #13ecda;
  --color-purple: #7c3bed;
  
  /* Semantic */
  --color-success: #10b981; /* Green - you're owed */
  --color-danger: #ef4444;  /* Red - you owe */
  --color-warning: #f59e0b; /* Yellow - pending */
  
  /* Dark Theme */
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --bg-tertiary: #1f1f1f;
  --border: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #a3a3a3;
}
```

---

## 🎨 Typography Scale

```css
/* Headings */
.text-display: 48px, bold, tracking-tight
.text-h1: 36px, bold, tracking-tight
.text-h2: 30px, bold
.text-h3: 24px, semibold
.text-h4: 20px, semibold

/* Body */
.text-body: 16px, regular
.text-small: 14px, regular
.text-tiny: 12px, regular

/* Font: Inter */
font-family: 'Inter', sans-serif;
```

---

## 📐 Spacing System

```css
/* Use Tailwind's spacing scale */
4px  = space-1
8px  = space-2
12px = space-3
16px = space-4
24px = space-6
32px = space-8
48px = space-12
64px = space-16
```

---

## 🎭 Animation Timings

```css
/* Use consistent durations */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

/* Easing functions */
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🔗 Quick Links

- **Stitch Project:** https://stitch.google.com/project/1695241361321249608
- **Figma Export:** Use Stitch's "Download HTML" to get implementation-ready code
- **Design Inspiration:** Stripe Dashboard, Splitwise, shadcn/ui

---

## 📝 Notes for Future Development

1. **Accessibility:** All interactive elements need proper ARIA labels
2. **Performance:** Lazy-load components with `React.lazy()` and `Suspense`
3. **SEO:** Add proper meta tags in `layout.tsx`
4. **Analytics:** Integrate event tracking for key user actions
5. **Testing:** Write component tests using React Testing Library
6. **Storybook:** Consider adding Storybook for component development

---

**Last Updated:** March 10, 2026  
**Maintained By:** OpenSplit Development Team
