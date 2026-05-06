"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Coach = {
  id: string;
  name: string;
  imagePink: string;
  imageNormal: string;
  bio: string;
};

type CoachPhase =
  | "idle"
  | "opening_slide"
  | "opening_fade"
  | "opening_bio"
  | "closing_hide_bio"
  | "closing_fade_in"
  | "closing_slide_back";

const D_SLIDE_MS = 520;
const D_FADE_MS = 420;
const D_BIO_MS = 320;
const TIMEOUT_SLACK_MS = 90;

const COACHES: Coach[] = [
  {
    id: "ryan-b",
    name: "Ryan B",
    imagePink: "/coaches/ryan-b-pink.png",
    imageNormal: "/coaches/ryan-b.png",
    bio: `Ryan is a US Air Force veteran and long-time CrossFit enthusiast. He has been coaching for 5 years and enjoys all things outdoors. He is known to dabble in various endurance sports but always finds his way back to a barbell.`,
  },
  {
    id: "arturo",
    name: "Arturo",
    imagePink: "/coaches/arturo-pink.png",
    imageNormal: "/coaches/arturo.png",
    bio: `Born and raised in Des Moines, Iowa. I've been in Denver for a little over 5 years now! I absolutely love spending time with my loved ones and getting out to explore either here in the mountains or out in the world any chance I can get. I've been doing Crossfit for a little over 8 years now. I got introduced to it after I retired from College football. Forever grateful to have found this community!`,
  },
  {
    id: "dan",
    name: "Dan",
    imagePink: "/coaches/dan-pink.png",
    imageNormal: "/coaches/dan.png",
    bio: `I've been coaching CrossFit since 2013 and have received the L1 and L2 certifications, along with attending i99 Gymnastics, Olympic weightlifting and Rowing seminars. I've had the incredible opportunity to compete at the 2021 CrossFit Games as part of Team Omnia. I'm passionate about helping athletes move well, build confidence, and become the best version of themselves—inside and outside the gym. When I'm not coaching, you'll probably find me enjoying a hazy IPA or bourbon, watching sports, or hanging out with my pup. I'm always down to help, whether it's dialing in your mechanics or just getting to know your story.`,
  },
  {
    id: "jake",
    name: "Jake",
    imagePink: "/coaches/jake-pink.png",
    imageNormal: "/coaches/jake.png",
    bio: `Jake was exposed to strength and conditioning in junior high to improve his sports performance. From a young age he played football, soccer, baseball and wrestling (team captain). As an adult, he found a passion for lifting weights and endurance, competing in a few half-marathons. Jake found the CrossFit methodology in 2013 and it has been his foundation for fitness and nutrition ever since. He completed his CrossFit Level 1 certification in 2019 and began coaching in March of 2023 at Omnia. He completed his CrossFit Level 2 certification in 2023.`,
  },
  {
    id: "marykay",
    name: "MaryKay",
    imagePink: "/coaches/marykay-pink.png",
    imageNormal: "/coaches/marykay.png",
    bio: `MK started her crossfit journey back in 2015 with a Groupon to a crossfit gym in the suburbs of Chicago. As a former gymnast, she immediately fell in love with the competitive aspect of class, the environment, and the community.

Shortly after, MK took her L1 and started her coaching career, after already having done a few years of personal training. She eventually moved to Chicago where she coached at Crossfit312 and then South Loop Strength and Conditioning. It was at SLSC that she met her Crossfit coach and started competitively training in 2017.

MK competed at Regionals individually in 2018, moved to Denver to train at Omnia in 2020, then became part of a new Omnia team that went on to compete at the Crossfit Games in 2021, 2022, and 2023 where they had two top 10 finishes!

MK is the Director of Operations at Omnia and currently specializes in coaching gymnastics skills, and writing individual programming for members who want extra work towards a variety of goals.

Overall, MK has a deep love of coaching, being surrounded by like-minded individuals, and strives to help others become their best selves and live their most fulfilled lives, inside and out of the gym.`,
  },
  {
    id: "kat",
    name: "Kat",
    imagePink: "/coaches/kat-pink.png",
    imageNormal: "/coaches/kat.png",
    bio: `Coaching since 2018, Kathleen believes CrossFit is about far more than workouts — it's about helping people believe in themselves.
She fell in love with CrossFit because of what it builds from the inside out: confidence, resilience, and proof that you can do hard things. Nothing excites her more than watching an athlete hit a first pull-up, lift heavier than they thought possible, or simply show up on a hard day. She truly gets more excited about her athletes' wins than her own.
Kathleen coaches with the mindset that fitness should support you through every stage of life — whether you're brand new, rebuilding, pregnant, postpartum, career-focused, or chasing big goals. She's approachable, encouraging, and practical, meeting you where you are while helping you grow.
Outside the gym, she's a financial planner, a mom, and someone who's always chasing growth — in strength, career, and life. She loves traveling with her family, baking, reading, and cheering the loudest during workouts.
Her mission: help you see what you're capable of — and then go beyond it.`,
  },
  {
    id: "jess",
    name: "Jess",
    imagePink: "/coaches/jess-pink.png",
    imageNormal: "/coaches/jess.png",
    bio: `Jess started exercising for fun in 2011 and found CrossFit in 2013. That's when the fun really started. A model of persistence in the face of adversity, she once did 450 unbroken single unders but could not, at that time, figure out how to do a single double under. Now, many many (many, many, many) failures later, she loves double unders. Jess loves CrossFit because it rewards, above all else, hard work + consistency + hard work. When she's not at Omnia, she spends time with her wife and their dogs, has far too much fun being a corporate lawyer, and cheers wildly for the Denver Nuggets (and other Denver sports teams).`,
  },
];

function bioFontClass(bio: string) {
  const n = bio.length;
  if (n > 2000) {
    return "text-[0.68rem] leading-snug md:text-xs";
  }
  if (n > 1300) {
    return "text-xs leading-snug md:text-sm";
  }
  if (n > 700) {
    return "text-xs leading-relaxed md:text-sm";
  }
  return "text-sm leading-relaxed md:text-base";
}

export default function Coaches() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timersRef = useRef<number[]>([]);

  const [phase, setPhase] = useState<CoachPhase>("idle");
  const [bioCoachId, setBioCoachId] = useState<string | null>(null);
  const [trackTranslateX, setTrackTranslateX] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const schedule = useCallback(
    (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    },
    []
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    setScrollProgress(max > 0 ? scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    if (phase !== "idle") return;
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [phase, handleScroll]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const activeCoach = bioCoachId
    ? COACHES.find((c) => c.id === bioCoachId) ?? null
    : null;

  const othersHidden =
    phase === "opening_fade" ||
    phase === "opening_bio" ||
    phase === "closing_hide_bio";

  const bioVisible = phase === "opening_bio";

  const transformTransitionStyle =
    phase === "opening_slide" || phase === "closing_slide_back"
      ? `transform ${D_SLIDE_MS}ms ease-out`
      : "none";

  const openBio = (coachId: string) => {
    if (phase !== "idle") return;
    const idx = COACHES.findIndex((c) => c.id === coachId);
    const col = colRefs.current[idx];
    const scroll = scrollRef.current;
    if (!col || !scroll) return;

    const endT = scroll.scrollLeft - col.offsetLeft;

    clearTimers();
    setBioCoachId(coachId);
    setTrackTranslateX(0);
    setPhase("opening_slide");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTrackTranslateX(endT);
      });
    });

    schedule(() => {
      setPhase("opening_fade");
    }, D_SLIDE_MS + TIMEOUT_SLACK_MS);

    schedule(() => {
      setPhase("opening_bio");
    }, D_SLIDE_MS + D_FADE_MS + TIMEOUT_SLACK_MS * 2);
  };

  const closeBio = () => {
    if (phase !== "opening_bio") return;

    clearTimers();
    setPhase("closing_hide_bio");

    schedule(() => {
      setPhase("closing_fade_in");
    }, D_BIO_MS + TIMEOUT_SLACK_MS);

    schedule(() => {
      setPhase("closing_slide_back");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTrackTranslateX(0);
        });
      });
    }, D_BIO_MS + D_FADE_MS + TIMEOUT_SLACK_MS * 2);

    schedule(() => {
      setBioCoachId(null);
      setPhase("idle");
    }, D_BIO_MS + D_FADE_MS + D_SLIDE_MS + TIMEOUT_SLACK_MS * 3);
  };

  const busy = phase !== "idle";
  const showProgress = phase === "idle";
  const showClose = bioCoachId !== null;

  return (
    <section className="relative bg-white py-16 md:py-24">
      {showClose && (
        <button
          type="button"
          onClick={closeBio}
          disabled={!bioVisible || phase.startsWith("closing")}
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center font-mono text-2xl leading-none text-black transition-opacity hover:opacity-50 disabled:pointer-events-none disabled:opacity-30 md:right-6 md:top-6"
          aria-label="Close coach bio"
        >
          ×
        </button>
      )}

      <div
        aria-busy={busy}
        className="flex flex-col px-6 [--coach-card:280px] md:[--coach-card:320px]"
      >
        <div className="relative flex min-h-[520px] flex-1 flex-col md:min-h-[580px]">
          <div className="relative min-h-0 flex-1">
            <div
              ref={scrollRef}
              className={`h-full min-h-0 pb-2 [&::-webkit-scrollbar]:hidden ${
                phase === "idle"
                  ? "overflow-x-auto"
                  : "overflow-x-hidden"
              }`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                ref={trackRef}
                role="list"
                className="relative flex h-full w-max gap-6"
                style={{
                  transform: `translate3d(${trackTranslateX}px,0,0)`,
                  transition: transformTransitionStyle,
                }}
              >
                {COACHES.map((coach, index) => {
                  const selected = coach.id === bioCoachId;
                  const dimOthers = othersHidden && !selected;
                  const showNormal = selected && bioCoachId !== null;

                  return (
                    <div
                      key={coach.id}
                      ref={(el) => {
                        colRefs.current[index] = el;
                      }}
                      role="listitem"
                      className={`flex w-[var(--coach-card)] flex-shrink-0 flex-col transition-opacity duration-[420ms] ease-out ${
                        dimOthers ? "pointer-events-none opacity-0" : ""
                      } ${selected && busy ? "relative z-20" : ""}`}
                    >
                      <div className="group relative aspect-square w-full overflow-hidden border border-black">
                        {!showNormal ? (
                          <>
                            <Image
                              src={coach.imagePink}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 280px, 320px"
                              aria-hidden
                            />
                            <Image
                              src={coach.imageNormal}
                              alt={coach.name}
                              fill
                              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                              sizes="(max-width: 768px) 280px, 320px"
                            />
                          </>
                        ) : (
                          <Image
                            src={coach.imageNormal}
                            alt={coach.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 280px, 320px"
                            priority={selected}
                          />
                        )}
                      </div>
                      <div className="pt-3">
                        <h3 className="mb-3 font-mono text-base font-normal text-black md:text-lg">
                          {coach.name}
                        </h3>
                        <button
                          type="button"
                          disabled={phase !== "idle"}
                          onClick={() => openBio(coach.id)}
                          className="rounded-lg border-2 border-black bg-white px-4 py-2 font-mono text-xs uppercase tracking-widest text-black transition-all duration-300 hover:border-pink-primary hover:bg-pink-primary hover:text-black disabled:pointer-events-none disabled:opacity-40"
                        >
                          Read their Bio
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {activeCoach && (
              <div
                className={`absolute inset-0 z-10 flex pl-[calc(var(--coach-card)+1.5rem)] transition-opacity duration-[320ms] ease-out md:pl-[calc(var(--coach-card)+1.5rem)] ${
                  bioVisible
                    ? "pointer-events-none opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <div
                  className={`flex min-h-0 min-w-0 flex-1 flex-col pr-2 pt-1 ${
                    bioVisible ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                >
                  <h2 className="mb-3 shrink-0 font-mono text-lg font-normal text-black md:text-xl">
                    {activeCoach.name}
                  </h2>
                  <div
                    className={`min-h-0 flex-1 overflow-y-auto overscroll-contain pr-10 font-mono font-normal text-black ${bioFontClass(activeCoach.bio)}`}
                  >
                    <p className="whitespace-pre-line pb-4 pr-2">
                      {activeCoach.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {showProgress && (
            <div className="mt-6 shrink-0">
              <div className="h-1 bg-black/20">
                <div
                  className="h-1 bg-black transition-all duration-150"
                  style={{
                    width: `${Math.max(20, scrollProgress * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
