import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  CalendarRange,
  Check,
  Clock3,
  Leaf,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBasket,
  Sun,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import produceHero from "@/assets/produce-hero.jpg";
import boxOneImage from "@/assets/box-one.jpg";
import boxTwoImage from "@/assets/box-two.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Order Nutri Boxes · Thanjai Healthy Plate" },
      {
        name: "description",
        content: "Order fresh fruit and vegetable breakfast boxes in Thanjavur: single days, a full week, or a full month.",
      },
      { property: "og:title", content: "Order Nutri Boxes · Thanjai Healthy Plate" },
      {
        property: "og:description",
        content: "Simple ordering for fresh breakfast boxes: pick days, a week, or a month.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

type View = "customer" | "admin";
type PlanType = "days" | "week" | "month";
type BoxQuantities = { boxOne: number; boxTwo: number };
type DayOption = {
  key: string;
  day: string;
  date: string;
  month: string;
  fullLabel: string;
  isPast: boolean;
};

const EMPTY: BoxQuantities = { boxOne: 0, boxTwo: 0 };
const dateKey = (date: Date) => date.toISOString().slice(0, 10);

function getIndiaToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(Date.UTC(Number(values["year"]), Number(values["month"]) - 1, Number(values["day"]), 12));
}

function describe(value: Date, isPast = false): DayOption {
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
    isPast,
  };
}

function getCurrentWeek(): DayOption[] {
  const today = getIndiaToday();
  const mondayOffset = (today.getUTCDay() + 6) % 7;
  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const value = new Date(monday);
    value.setUTCDate(monday.getUTCDate() + index);
    return describe(value, value < today);
  });
}

function getMondays(count: number): DayOption[] {
  const today = getIndiaToday();
  const daysUntilMonday = (8 - today.getUTCDay()) % 7 || 7;
  const firstMonday = new Date(today);
  firstMonday.setUTCDate(today.getUTCDate() + daysUntilMonday);

  return Array.from({ length: count }, (_, index) => {
    const value = new Date(firstMonday);
    value.setUTCDate(firstMonday.getUTCDate() + index * 7);
    return describe(value);
  });
}

function getMonths(count: number): DayOption[] {
  const today = getIndiaToday();
  const firstOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1, 12));

  return Array.from({ length: count }, (_, index) => {
    const monthStart = new Date(Date.UTC(firstOfMonth.getUTCFullYear(), firstOfMonth.getUTCMonth() + index, 1, 12));
    const firstMondayOffset = (8 - monthStart.getUTCDay()) % 7;
    const value = new Date(monthStart);
    value.setUTCDate(monthStart.getUTCDate() + firstMondayOffset);
    return describe(value);
  });
}

function addDays(key: string, amount: number) {
  const value = new Date(`${key}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + amount);
  return describe(value);
}

function HomePage() {
  const [view, setView] = useState<View>("customer");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-6 sm:py-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line-soft pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-leaf text-primary-foreground">
              <Leaf className="size-5" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg font-semibold text-ink">Thanjai Healthy Plate</p>
              <p className="flex items-center gap-1 text-xs text-ink-soft">
                <MapPin className="size-3 shrink-0" /> Thanjavur
              </p>
            </div>
          </div>
          <span className="hidden text-xs font-medium text-ink-soft sm:block">Delivery 6–8 AM</span>
        </header>

        <nav className="mt-4 flex gap-1 border-b border-line-soft" aria-label="Preview views">
          <Button
            onClick={() => setView("customer")}
            variant="ghost"
            className={`rounded-none border-b-2 px-3 ${view === "customer" ? "border-leaf text-leaf" : "border-transparent text-ink-soft"}`}
          >
            <ShoppingBasket className="size-4" /> Order
          </Button>
          <Button
            onClick={() => setView("admin")}
            variant="ghost"
            className={`rounded-none border-b-2 px-3 ${view === "admin" ? "border-leaf text-leaf" : "border-transparent text-ink-soft"}`}
          >
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
  const mondays = useMemo(() => getMondays(4), []);
  const months = useMemo(() => getMonths(4), []);

  const [plan, setPlan] = useState<PlanType>("days");
  const [pickedDays, setPickedDays] = useState<string[]>([]);
  const [startMonday, setStartMonday] = useState<string | null>(null);
  const [dayBoxes, setDayBoxes] = useState<Record<string, BoxQuantities>>({});
  const [planBoxes, setPlanBoxes] = useState<BoxQuantities>(EMPTY);
  const [notice, setNotice] = useState(false);

  const reset = () => {
    setNotice(false);
  };

  const choosePlan = (next: PlanType) => {
    reset();
    setPlan(next);
  };

  const toggleDay = (key: string) => {
    reset();
    setPickedDays((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  };

  const changeDayBox = (key: string, box: keyof BoxQuantities, amount: number) => {
    reset();
    setDayBoxes((current) => {
      const quantities = current[key] ?? EMPTY;
      return { ...current, [key]: { ...quantities, [box]: Math.max(0, quantities[box] + amount) } };
    });
  };

  const changePlanBox = (box: keyof BoxQuantities, amount: number) => {
    reset();
    setPlanBoxes((current) => ({ ...current, [box]: Math.max(0, current[box] + amount) }));
  };

  const selectedDays = week.filter((item) => pickedDays.includes(item.key));
  const dayTotal = selectedDays.reduce((total, item) => {
    const quantities = dayBoxes[item.key] ?? EMPTY;
    return total + quantities.boxOne + quantities.boxTwo;
  }, 0);

  const planDayCount = plan === "week" ? 7 : 30;
  const planBoxesPerDay = planBoxes.boxOne + planBoxes.boxTwo;
  const planTotal = planBoxesPerDay * planDayCount;

  const readyToReview = plan === "days" ? dayTotal > 0 : Boolean(startMonday) && planBoxesPerDay > 0;

  const startLabel = startMonday
    ? `${describe(new Date(`${startMonday}T12:00:00Z`)).fullLabel} to ${addDays(startMonday, planDayCount - 1).fullLabel}`
    : null;

  return (
    <section className="animate-float-in py-6 sm:py-8">
      <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line-soft">
        <img
          src={produceHero}
          alt="Fresh fruits and vegetables"
          width={1536}
          height={912}
          className="h-40 w-full object-cover sm:h-56"
        />
        <div className="p-5 sm:p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-leaf">
            <Sun className="size-4" /> Fresh fruits &amp; vegetables, delivered 6–8 AM
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">Order your nutri boxes</h1>
          <p className="mt-2 text-base text-ink-soft">Three easy steps. Big buttons. No hurry.</p>
        </div>
      </div>

      <div className="mt-8">
        <StepTitle number="1" title="How often do you want boxes?" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <PlanCard
            icon={<CalendarDays />}
            title="Only some days"
            note="Choose days in this week"
            selected={plan === "days"}
            onClick={() => choosePlan("days")}
          />
          <PlanCard
            icon={<CalendarRange />}
            title="Full week"
            note="7 days, starts on a Monday"
            selected={plan === "week"}
            onClick={() => choosePlan("week")}
          />
          <PlanCard
            icon={<CalendarRange />}
            title="Full month"
            note="30 days, starts on a Monday"
            selected={plan === "month"}
            onClick={() => choosePlan("month")}
          />
        </div>
      </div>

      <div className="mt-8">
        <StepTitle
          number="2"
          title={plan === "days" ? "Pick your delivery days" : "Pick the starting Monday"}
        />

        {plan === "days" ? (
          <>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
              {week.map((item) => {
                const selected = pickedDays.includes(item.key);
                return (
                  <Button
                    key={item.key}
                    type="button"
                    disabled={item.isPast}
                    onClick={() => toggleDay(item.key)}
                    variant={selected ? "default" : "outline"}
                    aria-pressed={selected}
                    aria-label={`${selected ? "Remove" : "Choose"} ${item.fullLabel}`}
                    className={`relative h-[86px] min-w-0 flex-col gap-0 rounded-xl px-1 ${selected ? "bg-leaf text-primary-foreground hover:bg-leaf-deep" : "border-line-soft bg-surface text-ink hover:bg-leaf-soft"}`}
                  >
                    {selected && <Check className="absolute right-1.5 top-1.5 size-4" />}
                    <span className="text-[11px] font-medium opacity-70">{item.day}</span>
                    <span className="font-serif text-xl font-semibold">{item.date}</span>
                    <span className="text-[10px] opacity-70">{item.isPast ? "Over" : item.month}</span>
                  </Button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-ink-soft">Only this week's days can be chosen.</p>
          </>
        ) : (
          <>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {mondays.map((item) => {
                const selected = startMonday === item.key;
                const end = addDays(item.key, planDayCount - 1);
                return (
                  <Button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      reset();
                      setStartMonday(item.key);
                    }}
                    variant={selected ? "default" : "outline"}
                    aria-pressed={selected}
                    className={`h-auto justify-start gap-3 rounded-xl px-4 py-4 text-left ${selected ? "bg-leaf text-primary-foreground hover:bg-leaf-deep" : "border-line-soft bg-surface text-ink hover:bg-leaf-soft"}`}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface font-serif text-lg font-semibold text-leaf">
                      {item.date}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">Monday {item.fullLabel.replace("Mon, ", "")}</span>
                      <span className="block text-xs opacity-80">
                        {planDayCount} days · until {end.fullLabel}
                      </span>
                    </span>
                    {selected && <Check className="ml-auto size-5 shrink-0" />}
                  </Button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              {plan === "week" ? "Weekly plans" : "Monthly plans"} always begin on a Monday.
            </p>
          </>
        )}
      </div>

      <div className="mt-8">
        <StepTitle number="3" title={plan === "days" ? "Choose boxes for each day" : "Choose boxes for each day of the plan"} />

        {plan === "days" ? (
          selectedDays.length === 0 ? (
            <EmptyHint text="Pick at least one day above." />
          ) : (
            <div className="mt-4 space-y-4">
              {selectedDays.map((item) => (
                <div key={item.key} className="rounded-2xl bg-surface p-4 ring-1 ring-line-soft">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <p className="min-w-0 text-base font-semibold text-ink">{item.fullLabel}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDay(item.key)}
                      className="shrink-0 text-sm text-ink-soft"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <BoxRow
                      image={boxOneImage}
                      label="Box 1"
                      note="Idli, sprouts, fresh fruits"
                      quantity={(dayBoxes[item.key] ?? EMPTY).boxOne}
                      onChange={(amount) => changeDayBox(item.key, "boxOne", amount)}
                    />
                    <BoxRow
                      image={boxTwoImage}
                      label="Box 2"
                      note="Pongal, egg, fruit bowl"
                      quantity={(dayBoxes[item.key] ?? EMPTY).boxTwo}
                      onChange={(amount) => changeDayBox(item.key, "boxTwo", amount)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : !startMonday ? (
          <EmptyHint text="Pick a starting Monday above." />
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <BoxRow
              image={boxOneImage}
              label="Box 1"
              note="Idli, sprouts, fresh fruits"
              quantity={planBoxes.boxOne}
              onChange={(amount) => changePlanBox("boxOne", amount)}
            />
            <BoxRow
              image={boxTwoImage}
              label="Box 2"
              note="Pongal, egg, fruit bowl"
              quantity={planBoxes.boxTwo}
              onChange={(amount) => changePlanBox("boxTwo", amount)}
            />
          </div>
        )}
      </div>

      <div className="mt-8 rounded-2xl bg-leaf-soft p-5">
        <h2 className="text-lg font-semibold text-leaf-deep">Your order</h2>
        <p className="mt-2 text-base text-ink">
          {plan === "days"
            ? `${selectedDays.length} ${selectedDays.length === 1 ? "day" : "days"} · ${dayTotal} ${dayTotal === 1 ? "box" : "boxes"} in total`
            : `${plan === "week" ? "Weekly" : "Monthly"} plan · ${planBoxesPerDay} ${planBoxesPerDay === 1 ? "box" : "boxes"} each day · ${planTotal} boxes in total`}
        </p>
        {startLabel && plan !== "days" && <p className="mt-1 text-sm text-ink-soft">{startLabel}</p>}
        <p className="mt-1 text-sm text-ink-soft">Prices and payment will appear after setup.</p>
        <Button
          type="button"
          size="lg"
          disabled={!readyToReview}
          onClick={() => setNotice(true)}
          className="mt-4 h-14 w-full rounded-xl bg-leaf text-base text-primary-foreground hover:bg-leaf-deep sm:w-auto sm:px-8"
        >
          Continue <ArrowRight className="size-5" />
        </Button>
        {notice && (
          <p role="status" className="mt-4 rounded-xl bg-surface p-3 text-sm font-medium text-leaf-deep">
            Your choices are ready. Order submission will be enabled after the secure backend is connected.
          </p>
        )}
      </div>
    </section>
  );
}

function StepTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-leaf text-sm font-bold text-primary-foreground">
        {number}
      </span>
      <h2 className="text-lg font-semibold text-ink sm:text-xl">{title}</h2>
    </div>
  );
}

function PlanCard({ icon, title, note, selected, onClick }: {
  icon: React.ReactNode;
  title: string;
  note: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant={selected ? "default" : "outline"}
      aria-pressed={selected}
      className={`h-auto flex-col items-start gap-1 rounded-2xl px-4 py-4 text-left ${selected ? "bg-leaf text-primary-foreground hover:bg-leaf-deep" : "border-line-soft bg-surface text-ink hover:bg-leaf-soft"}`}
    >
      <span className="flex w-full items-center gap-2">
        <span className="[&_svg]:size-5">{icon}</span>
        {selected && <Check className="ml-auto size-5" />}
      </span>
      <span className="mt-1 text-base font-semibold">{title}</span>
      <span className="whitespace-normal text-xs opacity-80">{note}</span>
    </Button>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-line-soft bg-surface-muted p-4 text-base text-ink-soft">
      <CalendarDays className="size-5 shrink-0 text-leaf" /> {text}
    </div>
  );
}

function BoxRow({ image, label, note, quantity, onChange }: {
  image: string;
  label: string;
  note: string;
  quantity: number;
  onChange: (amount: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-surface-strong p-3 ring-1 ring-line-soft">
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={label}
          loading="lazy"
          width={816}
          height={816}
          className="size-16 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="text-base font-semibold text-ink">{label}</p>
          <p className="text-sm text-ink-soft">{note}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={quantity === 0}
          onClick={() => onChange(-1)}
          className="size-12 rounded-xl border-line-soft"
          aria-label={`Remove one ${label}`}
        >
          <Minus className="size-5" />
        </Button>
        <span className="font-serif text-2xl font-semibold text-ink" aria-live="polite">
          {quantity}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onChange(1)}
          className="size-12 rounded-xl border-line-soft"
          aria-label={`Add one ${label}`}
        >
          <Plus className="size-5" />
        </Button>
      </div>
    </div>
  );
}

function AdminView() {
  return (
    <section className="animate-float-in py-6 sm:py-8">
      <p className="text-sm font-semibold text-leaf">Admin preview</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">Daily operations</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        A simple view for menus, service dates, plans, and manual payment checks.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <AdminItem icon={<CalendarDays />} title="Service dates" note="Choose open and closed days" />
        <AdminItem icon={<ShoppingBasket />} title="Boxes & menu" note="Update contents and prices" />
        <AdminItem icon={<ShieldCheck />} title="Payment checks" note="Approve UPI references manually" />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-surface-muted p-4 text-sm text-ink-soft">
        <Clock3 className="mt-0.5 size-4 shrink-0 text-leaf" />
        <p>Admin controls and saved data are not connected in this Stage 1 preview.</p>
      </div>
    </section>
  );
}

function AdminItem({ icon, title, note }: { icon: React.ReactNode; title: string; note: string }) {
  return (
    <div className="rounded-2xl bg-surface p-4 ring-1 ring-line-soft">
      <span className="text-leaf [&_svg]:size-5">{icon}</span>
      <p className="mt-4 font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
