import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Leaf,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBasket,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Order Nutri Boxes · Thanjai Healthy Plate" },
      { name: "description", content: "Choose breakfast nutri boxes for delivery this week in Thanjavur." },
      { property: "og:title", content: "Order Nutri Boxes · Thanjai Healthy Plate" },
      { property: "og:description", content: "A simple weekly ordering experience for fresh breakfast boxes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

type View = "customer" | "admin";
type BoxQuantities = { boxOne: number; boxTwo: number };
type WeeklyDate = {
  key: string;
  day: string;
  date: string;
  month: string;
  fullLabel: string;
  isPast: boolean;
};

const dateKey = (date: Date) => date.toISOString().slice(0, 10);

function getIndiaToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), 12));
}

function getCurrentWeek(): WeeklyDate[] {
  const today = getIndiaToday();
  const mondayOffset = (today.getUTCDay() + 6) % 7;
  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const value = new Date(monday);
    value.setUTCDate(monday.getUTCDate() + index);
    return {
      key: dateKey(value),
      day: new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: "UTC" }).format(value),
      date: new Intl.DateTimeFormat("en-IN", { day: "numeric", timeZone: "UTC" }).format(value),
      month: new Intl.DateTimeFormat("en-IN", { month: "short", timeZone: "UTC" }).format(value),
      fullLabel: new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(value),
      isPast: value < today,
    };
  });
}

function HomePage() {
  const [view, setView] = useState<View>("customer");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-6 sm:py-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line-soft pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-leaf text-primary-foreground">
              <Leaf className="size-5" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg font-semibold text-ink">Thanjai Healthy Plate</p>
              <p className="flex items-center gap-1 text-xs text-ink-soft"><MapPin className="size-3 shrink-0" /> Thanjavur</p>
            </div>
          </div>
          <span className="hidden text-xs font-medium text-ink-soft sm:block">Delivery 6–8 AM</span>
        </header>

        <nav className="mt-4 flex gap-1 border-b border-line-soft" aria-label="Preview views">
          <Button onClick={() => setView("customer")} variant="ghost" className={`rounded-none border-b-2 px-3 ${view === "customer" ? "border-leaf text-leaf" : "border-transparent text-ink-soft"}`}>
            <ShoppingBasket className="size-4" /> Order
          </Button>
          <Button onClick={() => setView("admin")} variant="ghost" className={`rounded-none border-b-2 px-3 ${view === "admin" ? "border-leaf text-leaf" : "border-transparent text-ink-soft"}`}>
            <ShieldCheck className="size-4" /> Admin preview
          </Button>
        </nav>

        {view === "customer" ? <CustomerView /> : <AdminView />}

        <footer className="mt-8 border-t border-line-soft py-5 text-xs text-ink-soft">
          Stage 1 preview · Orders are not saved yet.
        </footer>
      </div>
    </main>
  );
}

function CustomerView() {
  const week = useMemo(getCurrentWeek, []);
  const [ordersByDate, setOrdersByDate] = useState<Record<string, BoxQuantities>>({});
  const [notice, setNotice] = useState(false);

  const selectedDates = week.filter((item) => ordersByDate[item.key]);
  const totalBoxes = Object.values(ordersByDate).reduce(
    (total, quantities) => total + quantities.boxOne + quantities.boxTwo,
    0,
  );

  const toggleDate = (key: string) => {
    setNotice(false);
    setOrdersByDate((current) => {
      if (current[key]) {
        const next = { ...current };
        delete next[key];
        return next;
      }
      return { ...current, [key]: { boxOne: 0, boxTwo: 0 } };
    });
  };

  const changeQuantity = (key: string, box: keyof BoxQuantities, amount: number) => {
    setNotice(false);
    setOrdersByDate((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [box]: Math.max(0, (current[key]?.[box] ?? 0) + amount),
      },
    }));
  };

  const weekLabel = `${week[0]?.date} ${week[0]?.month} – ${week[6]?.date} ${week[6]?.month}`;

  return (
    <section className="animate-float-in py-6 sm:py-8">
      <div>
        <p className="text-sm font-semibold text-leaf">Fresh breakfast, delivered 6–8 AM</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">Order your nutri boxes</h1>
        <p className="mt-2 text-sm text-ink-soft">Choose one or more dates from this week.</p>
      </div>

      <div className="mt-7 border-t border-line-soft pt-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-leaf">Step 1</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">Select delivery dates</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-soft">{weekLabel}</span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {week.map((item) => {
            const selected = Boolean(ordersByDate[item.key]);
            return (
              <Button
                key={item.key}
                type="button"
                disabled={item.isPast}
                onClick={() => toggleDate(item.key)}
                variant={selected ? "default" : "outline"}
                aria-pressed={selected}
                aria-label={`${selected ? "Remove" : "Select"} ${item.fullLabel}`}
                className={`relative h-[82px] min-w-0 flex-col gap-0 rounded-lg px-1 ${selected ? "bg-leaf text-primary-foreground hover:bg-leaf-deep" : "border-line-soft bg-surface text-ink hover:bg-leaf-soft"}`}
              >
                {selected && <Check className="absolute right-1.5 top-1.5 size-3.5" />}
                <span className="text-[11px] font-medium opacity-70">{item.day}</span>
                <span className="font-serif text-xl font-semibold">{item.date}</span>
                <span className="text-[10px] opacity-70">{item.isPast ? "Past" : item.month}</span>
              </Button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-soft">Only dates in the current week can be selected.</p>
      </div>

      <div className="mt-7 border-t border-line-soft pt-6">
        <p className="text-xs font-bold uppercase text-leaf">Step 2</p>
        <h2 className="mt-1 text-lg font-semibold text-ink">Choose boxes for each date</h2>

        {selectedDates.length === 0 ? (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-dashed border-line-soft bg-surface-muted p-4 text-sm text-ink-soft">
            <CalendarDays className="size-5 shrink-0 text-leaf" /> Select at least one date above.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-line-soft border-y border-line-soft">
            {selectedDates.map((item) => (
              <div key={item.key} className="py-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <p className="min-w-0 font-semibold text-ink">{item.fullLabel}</p>
                  <Button type="button" variant="ghost" size="sm" onClick={() => toggleDate(item.key)} className="shrink-0 text-xs text-ink-soft">Remove</Button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <QuantityRow
                    label="Box 1"
                    note="Balanced breakfast box"
                    quantity={ordersByDate[item.key]?.boxOne ?? 0}
                    onChange={(amount) => changeQuantity(item.key, "boxOne", amount)}
                  />
                  <QuantityRow
                    label="Box 2"
                    note="Fuller breakfast box"
                    quantity={ordersByDate[item.key]?.boxTwo ?? 0}
                    onChange={(amount) => changeQuantity(item.key, "boxTwo", amount)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-7 border-t border-line-soft pt-6">
        <p className="text-xs font-bold uppercase text-leaf">Step 3</p>
        <div className="mt-2 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-ink">Review your order</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {selectedDates.length} {selectedDates.length === 1 ? "date" : "dates"} · {totalBoxes} {totalBoxes === 1 ? "box" : "boxes"}
            </p>
            <p className="mt-1 text-xs text-ink-soft">Prices and payment will appear after setup.</p>
          </div>
          <Button
            type="button"
            size="lg"
            disabled={selectedDates.length === 0 || totalBoxes === 0}
            onClick={() => setNotice(true)}
            className="h-12 rounded-lg bg-leaf px-5 text-primary-foreground hover:bg-leaf-deep"
          >
            Review order <ArrowRight className="size-4" />
          </Button>
        </div>
        {notice && (
          <p role="status" className="mt-4 rounded-lg bg-leaf-soft p-3 text-sm font-medium text-leaf-deep">
            Your selections are ready. Order submission will be enabled after the secure backend is connected.
          </p>
        )}
      </div>
    </section>
  );
}

function QuantityRow({ label, note, quantity, onChange }: {
  label: string;
  note: string;
  quantity: number;
  onChange: (amount: number) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg bg-surface p-3 ring-1 ring-line-soft">
      <div className="min-w-0">
        <p className="font-semibold text-ink">{label}</p>
        <p className="truncate text-xs text-ink-soft">{note}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button type="button" variant="outline" size="icon" disabled={quantity === 0} onClick={() => onChange(-1)} className="size-9 rounded-lg border-line-soft" aria-label={`Remove one ${label}`}><Minus className="size-4" /></Button>
        <span className="w-5 text-center font-semibold text-ink" aria-live="polite">{quantity}</span>
        <Button type="button" variant="outline" size="icon" onClick={() => onChange(1)} className="size-9 rounded-lg border-line-soft" aria-label={`Add one ${label}`}><Plus className="size-4" /></Button>
      </div>
    </div>
  );
}

function AdminView() {
  return (
    <section className="animate-float-in py-6 sm:py-8">
      <p className="text-sm font-semibold text-leaf">Admin preview</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">Daily operations</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">A simple view for menus, service dates, and manual payment checks.</p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <AdminItem icon={<CalendarDays />} title="Service dates" note="Choose open and closed days" />
        <AdminItem icon={<ShoppingBasket />} title="Boxes & menu" note="Update contents and prices" />
        <AdminItem icon={<ShieldCheck />} title="Payment checks" note="Approve UPI references manually" />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg bg-surface-muted p-4 text-sm text-ink-soft">
        <Clock3 className="mt-0.5 size-4 shrink-0 text-leaf" />
        <p>Admin controls and saved data are not connected in this Stage 1 preview.</p>
      </div>
    </section>
  );
}

function AdminItem({ icon, title, note }: { icon: React.ReactNode; title: string; note: string }) {
  return (
    <div className="rounded-lg bg-surface p-4 ring-1 ring-line-soft">
      <span className="text-leaf [&_svg]:size-5">{icon}</span>
      <p className="mt-4 font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
