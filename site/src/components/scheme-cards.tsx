// The scheme cards (Figma 115:1132), shared by Home and the schemes index.
import Link from "next/link";
import { CARD_ORDER, cardFacts, cardMark } from "@/lib/home";
import { schemes } from "@/lib/schemes";

export function Squares({ lit, size }: { lit: boolean[]; size: 12 | 14 }) {
  return (
    <span aria-hidden className="flex gap-[4px]">
      {lit.map((l, i) => (
        <span
          key={i}
          className={`${l ? "bg-accent" : "bg-tag"} ${size === 12 ? "size-[12px]" : "size-[14px]"}`}
        />
      ))}
    </span>
  );
}

export function SchemeCards() {
  const all = schemes().sort((a, b) => CARD_ORDER.indexOf(a.id) - CARD_ORDER.indexOf(b.id));
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {all.map((s) => (
        <li key={s.id}>
          <Link
            href={`/schemes/${s.id}/`}
            className="flex h-full flex-col gap-[14px] rounded-[8px] border border-line bg-white p-6 hover:border-ink"
          >
            <span className="flex flex-col gap-[4px]">
              {cardMark(s).map((row, r) => (
                <Squares key={r} lit={row} size={14} />
              ))}
            </span>
            <span className="text-[26px] font-extrabold">{s.name}</span>
            <span className="text-[16px] text-[#3e3a31]">{s.summary}</span>
            <span className="flex flex-wrap gap-[6px]">
              {cardFacts(s).map((f) => (
                <span
                  key={f}
                  className="rounded-[3px] border border-line bg-paper px-2 py-1 font-mono text-[12px]"
                >
                  {f}
                </span>
              ))}
            </span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/compare/"
          className="flex h-full flex-col gap-[14px] rounded-[8px] border border-line bg-white p-6 hover:border-ink"
        >
          <span className="flex flex-col gap-[4px]">
            <Squares lit={[false, true, false, false, true, false]} size={14} />
            <Squares lit={[true, false, false, true, false, false]} size={14} />
          </span>
          <span className="text-[26px] font-extrabold">Compare schemes</span>
          <span className="text-[16px] text-[#3e3a31]">
            The same questions, side by side, with what differs lit.
          </span>
          <span className="flex flex-wrap gap-[6px]">
            {[`${all.length} schemes`, "same questions", "lit cells"].map((f) => (
              <span
                key={f}
                className="rounded-[3px] border border-line bg-paper px-2 py-1 font-mono text-[12px]"
              >
                {f}
              </span>
            ))}
          </span>
        </Link>
      </li>
    </ul>
  );
}
