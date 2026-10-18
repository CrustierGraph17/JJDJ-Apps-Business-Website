import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { Age } from "@/components/team/age";
import { Icon } from "@/components/brand/icon";
import { team } from "@/data/team";
import { icons } from "@/lib/icons";

/**
 * The two people who run JJDJ.
 *
 * No stock photography and no invented bios: a tile avatar, the role, the
 * age worked out from the birthday, and a fun fact. The fact is always shown —
 * hover-only content is content touch visitors never get.
 */
export function TeamGrid() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {team.map((member, index) => (
        <Reveal key={member.name} delay={index * 0.07} as="li">
          <TiltCard className="h-full">
            <article className="group/member surface-card relative flex h-full flex-col overflow-hidden p-7">
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-14 place-items-center rounded-[16px] bg-tile font-mono text-[1rem] font-bold text-accent"
                >
                  {member.initials}
                </span>
                <span className="grid size-11 place-items-center rounded-[13px] border border-border bg-card text-accent">
                  <Icon name={member.focus} className="size-[1.15rem]" />
                </span>
              </div>

              <h3 className="mt-6 font-display text-[1.375rem] font-black tracking-[-0.025em] text-foreground">
                {member.name}
              </h3>
              <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.08em] text-accent-text uppercase">
                {member.role} · Age <Age birthday={member.birthday} />
              </p>

              <p className="mt-4 flex items-center gap-2 font-mono text-[0.6875rem] text-subtle-foreground">
                <icons.mapPin className="size-3" aria-hidden="true" />
                {member.location}
              </p>

              {/* Fun fact, always visible. */}
              {member.funFact ? (
                <p className="mt-5 border-t border-border pt-5 text-[0.875rem] leading-relaxed text-foreground">
                  <span className="mr-1.5 font-mono text-[0.625rem] tracking-[0.1em] text-accent uppercase">
                    Fun fact
                  </span>
                  {member.funFact}
                </p>
              ) : null}
            </article>
          </TiltCard>
        </Reveal>
      ))}
    </ul>
  );
}
