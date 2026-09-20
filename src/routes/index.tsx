import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Leaf, MapPin, Package, Plus, ShieldCheck, ShoppingBasket, Sparkles, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thanjai Healthy Plate · Fresh Morning Nutri Boxes" },
      { name: "description", content: "Plan fresh morning nutri boxes for delivery in Thanjavur." },
      { property: "og:title", content: "Thanjai Healthy Plate · Fresh Morning Nutri Boxes" },
      { property: "og:description", content: "A simple, warm ordering experience for balanced breakfast boxes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

type View = "customer" | "admin";

const dates = [
  { day: "Mon", date: "22", label: "Jun" },
  { day: "Tue", date: "23", label: "Jun" },
  { day: "Wed", date: "24", label: "Jun" },
  { day: "Thu", date: "25", label: "Jun", unavailable: true },
  { day: "Fri", date: "26", label: "Jun" },
];

const orders = [
  { name: "Customer A", details: "Box 1 · 2 boxes · UTR pending", status: "Verification", tone: "turmeric" },
  { name: "Customer B", details: "Box 2 · 1 box · 6:45 AM", status: "Paid", tone: "leaf" },
  { name: "Customer C", details: "Box 1 + Box 2 · 3 boxes", status: "Pending", tone: "muted" },
];

function HomePage() {
  const [view, setView] = useState<View>("customer");
  const [selectedDate, setSelectedDate] = useState("23");
  const [boxOne, setBoxOne] = useState(1);
  const [boxTwo, setBoxTwo] = useState(0);
  const [notice, setNotice] = useState(false);

  const changeQuantity = (box: "one" | "two", amount: number) => {
    if (box === "one") setBoxOne((value) => Math.max(0, value + amount));
    if (box === "two") setBoxTwo((value) => Math.max(0, value + amount));
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,var(--color-leaf-soft),transparent_32%),radial-gradient(circle_at_90%_10%,var(--color-turmeric-soft),transparent_26%)] opacity-70" />
      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="flex items-center justify-between border-b border-line-soft pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-leaf text-primary-foreground shadow-lg shadow-leaf/20">
              <Leaf className="size-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-serif text-lg font-semibold leading-none tracking-tight text-ink">Thanjai Healthy Plate</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft"><MapPin className="size-3" /> Thanjavur, Tamil Nadu</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-line-soft">6–8 AM delivery</span>
            <span className="rounded-full bg-turmeric-soft px-3 py-1.5 text-xs font-semibold text-ink ring-1 ring-turmeric/30">Stage 1 preview</span>
          </div>
          <Button variant="outline" size="sm" className="hidden border-line-soft bg-surface text-ink sm:inline-flex">Sign in</Button>
        </header>

        <div className="mx-auto mt-5 flex w-full max-w-md rounded-full bg-surface p-1 shadow-sm ring-1 ring-line-soft">
          <Button onClick={() => setView("customer")} variant={view === "customer" ? "default" : "ghost"} className="h-9 flex-1 rounded-full text-xs sm:text-sm">
            <ShoppingBasket className="size-4" /> Order a box
          </Button>
          <Button onClick={() => setView("admin")} variant={view === "admin" ? "default" : "ghost"} className="h-9 flex-1 rounded-full text-xs sm:text-sm">
            <ShieldCheck className="size-4" /> Admin preview
          </Button>
        </div>

        {view === "customer" ? (
          <CustomerView
            boxOne={boxOne}
            boxTwo={boxTwo}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            changeQuantity={changeQuantity}
            onReview={() => setNotice(true)}
          />
        ) : <AdminView />}

        <footer className="mt-10 flex flex-col gap-2 border-t border-line-soft py-5 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <span>© Thanjai Healthy Plate · Thanjavur</span>
          <span className="flex items-center gap-1.5"><Clock3 className="size-3.5" /> Cutoff 10 PM previous day · demo only</span>
        </footer>
      </div>

      {notice && (
        <div className="fixed inset-x-4 bottom-4 z-20 mx-auto max-w-lg rounded-2xl bg-ink p-4 text-primary-foreground shadow-2xl animate-float-in">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-turmeric" />
            <div className="flex-1">
              <p className="font-semibold">Stage 1 preview</p>
              <p className="mt-1 text-sm text-primary-foreground/70">The review flow is ready for the real backend. Nothing is submitted or saved yet.</p>
            </div>
            <Button onClick={() => setNotice(false)} variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" aria-label="Close preview notice">×</Button>
          </div>
        </div>
      )}
    </main>
  );
}

function CustomerView({ boxOne, boxTwo, selectedDate, setSelectedDate, changeQuantity, onReview }: {
  boxOne: number;
  boxTwo: number;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  changeQuantity: (box: "one" | "two", amount: number) => void;
  onReview: () => void;
}) {
  return (
    <section className="animate-float-in pt-8 lg:pt-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.86fr] lg:items-end">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-leaf-soft px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-leaf-deep"><UtensilsCrossed className="size-3.5" /> Freshly planned mornings</span>
          <h1 className="mt-5 max-w-[12ch] font-serif text-5xl font-semibold leading-[0.98] tracking-tight text-ink sm:text-7xl">A better box for your <em className="text-leaf">morning.</em></h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">Balanced breakfast boxes, packed fresh and delivered across Thanjavur before your day gets busy.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-ink-soft">
            <span className="flex items-center gap-2"><Check className="size-4 text-leaf" /> Two fixed box choices</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-leaf" /> Manual UPI verification</span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-leaf p-6 text-primary-foreground shadow-plate sm:p-8">
          <div className="absolute -right-10 -top-10 size-40 rounded-full border border-primary-foreground/15" />
          <div className="absolute -right-2 top-4 size-24 rounded-full border border-primary-foreground/10" />
          <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/65">The morning promise</p>
          <p className="relative mt-8 max-w-[13ch] font-serif text-3xl leading-tight sm:text-4xl">Good food should feel easy.</p>
          <p className="relative mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/70">Choose once, know what is coming, and start the day nourished.</p>
          <div className="relative mt-7 flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-turmeric" /> Delivery window 6 AM–8 AM</div>
        </div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[1.5rem] bg-surface p-5 shadow-plate ring-1 ring-line-soft sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf">Build your order</p><h2 className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">Plan your next delivery</h2></div>
            <span className="hidden rounded-full bg-turmeric-soft px-3 py-1 text-xs font-semibold text-ink sm:inline-flex">₹ INR</span>
          </div>

          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-ink">Delivery date</p><button className="flex items-center gap-1 text-xs font-semibold text-leaf" type="button"><CalendarDays className="size-3.5" /> View calendar <ChevronDown className="size-3.5" /></button></div>
            <div className="grid grid-cols-5 gap-2">
              {dates.map((item) => <Button key={item.date} disabled={item.unavailable} onClick={() => setSelectedDate(item.date)} variant={selectedDate === item.date ? "default" : "outline"} className={`h-auto min-w-0 flex-col gap-0 rounded-xl px-1 py-3 ${item.unavailable ? "border-transparent bg-surface-muted text-ink-soft" : "border-line-soft bg-surface-strong text-ink"}`}><span className="text-[10px] uppercase tracking-wider opacity-70">{item.day}</span><span className="font-serif text-xl">{item.date}</span><span className="text-[10px] opacity-70">{item.unavailable ? "Off" : item.label}</span></Button>)}
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <BoxCard title="Box 1" note="Your everyday balanced plate" quantity={boxOne} onChange={(amount) => changeQuantity("one", amount)} selected />
            <BoxCard title="Box 2" note="A fuller plate for active days" quantity={boxTwo} onChange={(amount) => changeQuantity("two", amount)} />
          </div>

          <div className="mt-7 rounded-xl bg-surface-muted p-4">
            <div className="flex items-center justify-between"><p className="text-sm font-semibold text-ink">Optional add-ons</p><span className="text-xs text-ink-soft">Prices set by admin</span></div>
            <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft ring-1 ring-line-soft">Extra idli <Plus className="ml-1 inline size-3" /></span><span className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft ring-1 ring-line-soft">Seasonal poriyal <Plus className="ml-1 inline size-3" /></span><span className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft ring-1 ring-line-soft">Buttermilk <Plus className="ml-1 inline size-3" /></span></div>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-line-soft pt-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs uppercase tracking-[0.14em] text-ink-soft">Order total</p><p className="mt-1 font-serif text-3xl font-semibold text-ink">₹ —</p><p className="mt-1 text-xs text-ink-soft">Calculated after real menu and offer rules are connected.</p></div><Button onClick={onReview} size="lg" className="h-12 rounded-xl bg-leaf px-5 text-primary-foreground hover:bg-leaf-deep">Review order <ArrowRight className="size-4" /></Button></div>
        </div>

        <aside className="space-y-5"><div className="rounded-[1.5rem] bg-terracotta-soft p-5 ring-1 ring-terracotta/20"><div className="flex items-center gap-2 text-terracotta"><Sparkles className="size-4" /><p className="text-xs font-bold uppercase tracking-[0.16em]">What you can expect</p></div><ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink"><li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-terracotta" />Fresh menu details for each delivery date</li><li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-terracotta" />Clear order total before payment</li><li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-terracotta" />Order history and payment status</li></ul></div><div className="rounded-[1.5rem] bg-surface p-5 ring-1 ring-line-soft"><div className="flex items-center gap-2"><Package className="size-4 text-leaf" /><p className="text-sm font-semibold text-ink">Temporary Stage 1 content</p></div><p className="mt-3 text-sm leading-relaxed text-ink-soft">Boxes, prices, menus, offers, payments and accounts are placeholders until your backend is connected.</p><div className="mt-4 rounded-lg bg-surface-muted px-3 py-2 text-xs font-semibold text-ink-soft">No data is saved yet.</div></div></aside>
      </div>
    </section>
  );
}

function BoxCard({ title, note, quantity, onChange, selected = false }: { title: string; note: string; quantity: number; onChange: (amount: number) => void; selected?: boolean }) {
  return <div className={`rounded-2xl p-4 ring-1 ${selected ? "bg-leaf-soft ring-leaf/30" : "bg-surface-strong ring-line-soft"}`}><div className="flex items-start justify-between"><div><p className="font-serif text-xl font-semibold text-ink">{title}</p><p className="mt-1 text-xs leading-relaxed text-ink-soft">{note}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${selected ? "bg-leaf text-primary-foreground" : "bg-surface-muted text-ink-soft"}`}>{selected ? "Selected" : "Optional"}</span></div><div className="mt-5 flex items-center justify-between"><div className="flex items-center gap-2"><Button onClick={() => onChange(-1)} variant="outline" size="icon" className="size-8 rounded-full border-line-soft bg-surface text-ink" aria-label={`Remove one ${title}`}><span className="text-lg leading-none">−</span></Button><span className="w-5 text-center font-semibold text-ink">{quantity}</span><Button onClick={() => onChange(1)} variant="outline" size="icon" className="size-8 rounded-full border-line-soft bg-surface text-ink" aria-label={`Add one ${title}`}><Plus className="size-4" /></Button></div><span className="text-sm font-semibold text-ink-soft">₹ — / box</span></div></div>;
}

function AdminView() {
  return <section className="animate-float-in pt-8 lg:pt-12"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="inline-flex items-center gap-2 rounded-full bg-terracotta-soft px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-terracotta"><ShieldCheck className="size-3.5" /> Private operations preview</span><h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-ink sm:text-6xl">Keep every box <em className="text-leaf">in rhythm.</em></h1><p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">A calm command view for menus, cutoffs, service dates and manual payment checks.</p></div><Button variant="outline" className="border-line-soft bg-surface text-ink"><CalendarDays className="size-4" /> Tue, 23 Jun <ChevronDown className="size-4" /></Button></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Orders today" value="—" note="Real count after connection" icon={<ShoppingBasket />} /><Metric label="Verification" value="—" note="UPI checks waiting" icon={<ShieldCheck />} /><Metric label="Cutoff" value="10 PM" note="Previous day · editable" icon={<Clock3 />} /><Metric label="Service area" value="5 km" note="Approximate radius" icon={<MapPin />} /></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]"><div className="rounded-[1.5rem] bg-surface p-5 shadow-plate ring-1 ring-line-soft sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">Order desk</p><h2 className="mt-2 font-serif text-2xl font-semibold text-ink">Payment verification</h2></div><Button variant="outline" size="sm" className="border-line-soft bg-surface-strong text-ink">Export CSV</Button></div><div className="mt-5 space-y-3">{orders.map((order) => <div key={order.name} className="flex flex-col gap-3 rounded-xl bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-ink">{order.name}</p><p className="mt-1 text-xs text-ink-soft">{order.details}</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${order.tone === "leaf" ? "bg-leaf-soft text-leaf-deep" : order.tone === "turmeric" ? "bg-turmeric-soft text-ink" : "bg-surface text-ink-soft"}`}>{order.status}</span></div>)}</div><p className="mt-5 flex items-center gap-2 text-xs text-ink-soft"><Sparkles className="size-3.5 text-turmeric" /> Approve or reject payments only after checking the UTR in your banking app.</p></div><div className="space-y-5"><AdminPanel title="Menu & boxes" icon={<UtensilsCrossed />} rows={["Box 1 contents and price", "Box 2 contents and price", "Date-specific menu"]} /><AdminPanel title="Availability" icon={<CalendarDays />} rows={["Service dates", "No-service days", "Order cutoff"]} /><AdminPanel title="Settings" icon={<Package />} rows={["Business details", "UPI ID and QR", "Delivery timing"]} /></div></div><div className="mt-5 rounded-2xl bg-ink p-5 text-primary-foreground sm:flex sm:items-center sm:justify-between"><div><p className="font-semibold">Backend not connected</p><p className="mt-1 max-w-2xl text-sm text-primary-foreground/65">This dashboard is a Stage 1 interface preview. Admin access, data, audit logs and real order controls begin after you connect your own backend.</p></div><span className="mt-4 inline-flex rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold text-turmeric sm:mt-0">Awaiting configuration</span></div></section>;
}

function Metric({ label, value, note, icon }: { label: string; value: string; note: string; icon: React.ReactNode }) { return <div className="rounded-2xl bg-surface p-4 ring-1 ring-line-soft"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">{label}</p><span className="text-leaf [&_svg]:size-4">{icon}</span></div><p className="mt-4 font-serif text-3xl font-semibold text-ink">{value}</p><p className="mt-1 text-xs text-ink-soft">{note}</p></div>; }

function AdminPanel({ title, icon, rows }: { title: string; icon: React.ReactNode; rows: string[] }) { return <div className="rounded-2xl bg-surface p-5 ring-1 ring-line-soft"><div className="flex items-center gap-2 text-leaf"><span className="[&_svg]:size-4">{icon}</span><p className="text-sm font-semibold text-ink">{title}</p></div><div className="mt-4 space-y-2">{rows.map((row) => <Button key={row} variant="ghost" className="h-auto w-full justify-between rounded-lg bg-surface-muted px-3 py-2.5 text-left text-xs font-medium text-ink hover:bg-leaf-soft hover:text-leaf-deep">{row}<ArrowRight className="size-3.5" /></Button>)}</div></div>; }