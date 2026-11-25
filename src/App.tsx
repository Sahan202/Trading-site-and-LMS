'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import TurnstileWidget from './components/TurnstileWidget';
import StudentRecognition from './components/StudentRecognition';
import MentorResults from './components/MentorResults';
import OfferCountdown from './components/OfferCountdown';
import { PixelField } from './components/PixelField';
import { ChevronDown, Play, Menu, X, Phone } from 'lucide-react';
import './home.css';
import './course-package.css';
import './navbar-brand.css';
import './skills-heading.css';
import './footer-contact.css';
import './mentor-copy.css';
import './process-responsive.css';
import './testimonial-touch.css';
import './student-mobile-grid.css';

const skills = [
  {
    title: 'Market Structure',
    description: 'Understand market trends, movements, and key levels.',
    icon: '/market.svg',
  },
  {
    title: 'Price Action',
    description:
      'Learn how to read price movements and identify potential setups.',
    icon: '/price.svg',
  },
  {
    title: 'Trade Analysis',
    description: 'Learn how to analyze charts and plan potential trades.',
    icon: '/trade.svg',
  },
  {
    title: 'Risk Management',
    description:
      'Understand how to manage risk and protect your trading capital.',
    icon: '/risk.svg',
  },
  {
    title: 'Trading Psychology',
    description:
      'Develop discipline and a better understanding of trading emotions.',
    icon: '/treding.svg',
  },
  {
    title: 'Trade Planning',
    description:
      'Build a clear process for preparing and reviewing your trades.',
    icon: '/planning.svg',
  },
];
const heroCandleBodies = [
  { left: 31, top: 143, width: 14, height: 64 },
  { left: 108, top: 93, width: 14, height: 62 },
  { left: 183, top: 149, width: 15, height: 50 },
  { left: 259, top: 206, width: 16, height: 37 },
  { left: 335, top: 142, width: 15, height: 66 },
  { left: 412, top: 92, width: 16, height: 65 },
  { left: 488, top: 149, width: 16, height: 51 },
];

const steps = [
  {
    title: 'MS',
    description: (
      <>
        Understanding the Behaviour and Direction of Price
        <br />
        <br />
        Market Structure is a fundamental concept in technical analysis that
        helps traders understand how price moves through different market phases
      </>
    ),
  },
  {
    title: 'TFC',
    description:
      'Timeframe Correlation, also known as Multi-Timeframe Analysis (MTFA), is an essential concept in Forex market analysis. It involves analysing the same currency pair across multiple timeframes to understand the overall market direction',
  },
  {
    title: 'CC',
    description:
      'Currency Correlation is an important concept in Forex trading that explains how different currency pairs move in relation to one another. Understanding these relationships helps traders identify market connections',
  },
  {
    title: 'Fundemntal',
    description:
      'Fundamental Analysis is a key component of Forex trading that focuses on understanding the economic, financial, and geopolitical factors influencing currency movements. By analysing economic data, central bank decisions, monetary policy, and global developments, traders can gain a deeper understanding of market sentiment and potential currency direction',
  },
];

const certificateImages = [
  '/certificates/roshan-ftmo-challenge.jpeg',
  '/certificates/kaviru-phase-two.jpeg',
  '/certificates/mohamed-habeeb-oanda.jpeg',
  '/certificates/akila-ftmo-challenge.jpeg',
  '/certificates/madhushan-phase-two.jpeg',
  '/certificates/ishan-phase-one.jpeg',
  '/certificates/kaviru-phase-one.jpeg',
  '/certificates/imanka-phase-two.jpeg',
  '/certificates/certificate-3.jpeg',
  '/certificates/certificate-2.jpeg',
  '/certificates/certificate-1.jpeg',
  '/certificates/certificate-4.jpeg',
  '/certificates/student-achievement-phase-two.jpeg',
];
const courseInclusions = [
  {
    title: 'Advance Market Framework (AMF)',
    description:
      'Learn our structured AMF approach to understanding market conditions, identifying opportunities, and developing a systematic trading process.',
  },
  {
    title: 'Higher Time Frame Market Analysis',
    description:
      'Understand higher time frame market structure, directional bias, and key market levels to improve your overall market analysis.',
  },
  {
    title: 'Comprehensive Trading Fundamentals',
    description:
      'Build a strong foundation in trading fundamentals, including market structure, price action, liquidity concepts, and essential trading principles.',
  },
  {
    title: 'Trading Discipline',
    description:
      'Develop the discipline to follow your trading plan, maintain consistency, and make decisions based on your strategy rather than emotions.',
  },
  {
    title: 'Trading Psychology',
    description:
      'Understand the psychological aspects of trading, emotional control, patience, and the mindset required for long-term development.',
  },
  {
    title: 'Trade Management',
    description:
      'Learn trade planning, risk management principles, position management, and structured trade execution.',
  },
  {
    title: 'LMS Access & Class Recordings',
    description:
      'Access our Learning Management System (LMS) and recorded classes to revisit lessons and continue learning at your own pace.',
  },
  {
    title: 'Biweekly Market Analysis Webinars',
    description:
      'Participate in live market analysis webinars held every two weeks to gain insights into current market conditions and analysis techniques.',
  },
  {
    title: 'Biweekly Q&A Sessions',
    description:
      'Join dedicated Q&A sessions every two weeks to clarify concepts, discuss trading-related questions, and strengthen your understanding.',
  },
  {
    title: 'Exclusive Trading Community',
    description:
      'Become part of an exclusive trading community where students can connect, share learning experiences, and grow together.',
  },
];
const studentTestimonials = [
  {
    name: 'Shanaka',
    initials: 'S',
    text: 'Krish, this gift may be small, but it carries a lot of gratitude. ❤️\n\nYour trading course was not just a course for me. It completely changed the way I look at the market and helped me become a profitable trader. 📈\n\nI’m truly grateful for all the knowledge, guidance, and support you’ve given me throughout this journey. There were times when I doubted myself, but your support helped me keep going and become a better trader.\n\nToday, I’m really happy to give you this small gift as a token of my appreciation. 🎁❤️',
  },
  {
    name: 'Dew',
    initials: 'D',
    text: '29% Winrate තිබිල මගේ.. ඔයාගේ Strategy එක Use කලම මේ වගේ තමයි මගේ winrate එක...\n\nJob එකක් කරන ගමන් වුනත් ගන්න හැම එකම වගේ හරි 😁❤️\n\nඉගෙන ගන්න අය බය වෙන්න එපා මේක මාස 2/3 ක් ඇතුලෙන් යද්දි 85% වැඩිය',
  },
  {
    name: 'Hisara',
    initials: 'H',
    text: 'මේක නම් ඇත්තම මන් තාම 4th batch එකේ videos 4 විතරයි බලන්න පුළුවන් උනා එකේ බලපු විදියෙන් මේ සතියේ trade 2 ක් ගැහුවා දෙකම ගියා tp q&a එකට සෙට් වෙන්න time නැ අයියා මට මන් සිකුරාදාට සෙට් වෙන්නම් class එකට 🙏❤️',
  },
  {
    name: 'Samudu',
    initials: 'S',
    text: 'Wena un apita setup hadaganna kiyanawane. Prove karapu setup ekak dena hambuna ekama thana ayye ❤️❤️❤️❤️',
  },
  {
    name: 'Shalinda',
    initials: 'S',
    image: '/student-review-shalinda.jpeg',
    text: 'Thank you Krish. Oyagen gatta knowledge ekai, strategy ekai, oya kiyalama mage hadawapu discipline ekai nisa ada mehema profit karanawa. Thank you for always supporting me and helping me achieve my success, even behind the scenes.. ❤️🫡💪',
  },

  {
    name: '4th Batch Student',
    initials: 'S',
    image: '/student-review-fourth-batch.jpeg',
    text: 'Me thiyenne me sathiye gaththa trade 07. Trade 07 win 💯✅ issr math market eke dwst trade 10/15 wage trade krpu kenek. Aththtama trading kiyanne mokakda kiyl therum gaththe @Krish oya nisa thmi. Market eka api dakin dakin thena entry ne thmnt puluwan wenna one market eke best ma point eka alla ganna. Thamn hriyt knowledge eka hadaththata passe consistency iwasimen weda krgena ynnwnm baya newthuwa market eke entry walata yanna puluwan. @Krish oya nisa thmi ada onama market eka me wage baya nethuwa play krnne patta thanks machan uba dipu knowledge ekatai dipu help ekatai machan. Trading walin goda ynna hithagena inna kenekta mama recommend ekana hodama thena thmi @krish fx swing lab eka ❤️👍',
  },
  {
    name: 'Ishan Piumal',
    initials: 'IP',
    image: '/student-review-ishan-piumal.jpeg',
    text: 'Additional widyata meka kiyanna ona Thiwa awrudu gank meh field eka atha arin nathuv meken gemak ghnn try krpu ayta hmbuna hodama answer eka thmai meka. Loss unth oneday Win krnawamai mindset eken htpu api hmotama hmbuna ptta chance ekak thmai. Uthshaya atha arinn ep kiyanne eka. Thiwa ahpu pool ekata harima answer eka hoyagththe nh api meka atha arin nthuv alln htpu nisa apita labichcha last game changing point eka kiyanna ona. Hatharawatema course krla ..loss wela ambaneta Ehema una hma kenektm aniwa ek therenawa athi definitely. @Krish Thank u bro ❤️',
  },
  {
    name: 'Kaviru',
    initials: 'K',
    image: '/student-review-kaviru.jpeg',
    text: 'Mama Krish FX mentorship ekata join une 4th batch eke mada hariyen, eth participate karapu podi kalen unath mage trading journey eke loku improvement ekak karaganna puluwan una ❤️🔥 Aththatama Krish Ayya kiyanne trading knowledge eka witharak nemei, trader kenek widiyata hariyata hithanna, discipline ekak hadaganna saha market eka hariya therunganna guide karana supiri mentor kenek ❤️🔥🚀.. Thank You very much @Krish Ayye 🙏💯💪',
  },
  {
    name: 'Roshan Dangamuwage',
    initials: 'RD',
    image: '/student-review-roshan.jpeg',
    text: '4th batch ekata join unata mata classes walata enna beri una digatama mage personal Issue ekak nisa 🥺 eth awa dawas tiken oluwa heduna patta widiyata 👌 Thank You very much Krish wetila idapu mawa me ganata genawata ❤️🫶 5th batch eke idan Gemata bahinawa Aniwa. 💪💪 You are my Hero 🦸 in Trading Journey. I have never seen a mentor as good as you @Krish 🙏 adareiii My Big Boss ❤️❤️',
  },
  {
    name: 'Samudu Aththanapola',
    initials: 'SA',
    image: '/student-review-samudu-aththanapola.jpeg',
    text: 'Godak kal idan hithagena idala mata join wenna puluwan une 4th batch ekata. Aurudu ganak dagalala anthimata mekata awata passe thamai meka simple kiyna eka danenna gaththe. Lankawe best mentorship eka. Wena kisima ekaka me tharan panna panna hoyala balanne na. Community support ekath superb 💯💯. Trading atharinna hadala anthima try ekata thama methenta awe. Trading athariye naththeth @Krish nisa. Hats off, respect ayye. Aththtama pattama sathutui. @Thiwa ayyatath thanks karanna ona. Wada asse niwadu thiyna hamalema QA dagena supiri support ekak dunne. Ekemma respect ayye. 🔥🔥',
  },
  {
    name: 'Mohamed',
    initials: 'M',
    image: '/student-review-mohamed.jpeg',
    text: 'malli me blpn. rewila hitpu mata uba hari path eka pennuwa mcn. ube setup ekata me gahapu gema. thawa dewal tikak igena ganna ona oyagen mcn. hadissiyik na. oya passen sup eka dena nisa mata baya nthuwa danne nethi deyak unth ahaganna plwn.\n\nme wenakan kiyl depu hama detma thanks a lot. ❤️❤️❤️',
  },
  {
    name: 'Shanaka',
    initials: 'S',
    image: '/student-review-amf-student.jpeg',
    text: '@krish oyage AMF concept eka nisa thmi ada me thrm hoda profit wala mata yanna puluwan une. Higher time frame use karana piluwan unata passe mage entry wala thibuna win rate eka hoda thenkta ganna puluwan una. Thanks machan dipu support ekata. 🥰💰💪',
  },
  {
    name: 'Ishan Piumal',
    initials: 'IP',
    image: '/student-review-ishan-forex-crypto.jpeg',
    text: 'Free dunna wge mtnm. Mhem consistently ethek methek kal kwdhwth mhem nh ghl brother. Forex, Crypto dekama. Cost ekk kynn brithram 🔥🙌',
  },
  {
    name: 'Shalinda',
    initials: 'S',
    image: '/student-review-shalinda-nas.jpeg',
    text: 'NAS Master @Krishfx gen market reading igena gattot meka thamai wenne... 🫡🎉🍻🥰',
  },
  {
    name: 'Roshan Dangamuwage',
    initials: 'RD',
    image: '/student-review-roshan-phase-one.jpeg',
    text: 'Ada ude 1phase eka achieve kara boss ❤️🫶\n\nA vena kawrut nisa nemei oya nisai Big boss',
  },
  {
    name: 'Roshan Dangamuwage',
    initials: 'RD',
    image: '/student-review-roshan-support.jpeg',
    text: 'Trading walin traca penala iddi oya dunna support eka superb krish ❤️❤️🫶 ekemma adareiiii.\n\nmata ettama busy life eke psychology hadagena gemak gahanna kiyala dunne oya big boss ❤️❤️❤️❤️',
  },
];
const faqs = [
  {
    question: 'Who is Krish FX Swing Lab for?',
    answer:
      "Krish FX Swing Lab is designed for individuals who want to learn swing trading through a structured approach. Whether you're starting your trading journey or looking to improve your existing knowledge, the program focuses on helping you understand the market, analyze trades, manage risk, and develop a clear trading process.",
  },
  {
    question: 'Do I need previous trading experience to join?',
    answer:
      'No. The learning path starts with the core foundations and gradually builds the knowledge you need to make structured trading decisions.',
  },
  {
    question: 'What will I learn in the program?',
    answer:
      'You will learn market structure, price action, trade analysis, risk management, trading psychology, and trade planning.',
  },
  {
    question: 'How does the mentorship and learning process work?',
    answer:
      'The program combines clear learning material, practical examples, and guidance that helps you build your own repeatable trading process.',
  },
  {
    question: 'How can I join the program?',
    answer:
      'Use the Join the Program button to get in touch and receive the next steps for joining Krish FX Swing Lab.',
  },
];
function useCarouselNavigation() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [directions, setDirections] = useState({
    previous: false,
    next: false,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const previous = track.scrollLeft > 1;
      const next = track.scrollLeft < track.scrollWidth - track.clientWidth - 1;
      setDirections((current) =>
        current.previous === previous && current.next === next
          ? current
          : { previous, next }
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(track);
    Array.from(track.children).forEach((child) => observer.observe(child));
    track.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      track.removeEventListener('scroll', update);
    };
  }, []);

  return { trackRef, ...directions };
}

function App() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [applicationBusy, setApplicationBusy] = useState(false);
  const [applicationSent, setApplicationSent] = useState(false);
  const [googleRegistration, setGoogleRegistration] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [applicationMessage, setApplicationMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [captchaVersion, setCaptchaVersion] = useState(0);
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState<number | null>(
    null
  );
  const testimonialTriggerRef = useRef<HTMLElement | null>(null);
  const testimonialTouchRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(
    null
  );
  const achievementNavigation = useCarouselNavigation();
  const testimonialNavigation = useCarouselNavigation();
  const achievementTrackRef = achievementNavigation.trackRef;
  useEffect(() => {
    const track = achievementTrackRef.current;
    if (!track || selectedCertificate !== null) return;

    const interval = window.setInterval(() => {
      const bounds = track.getBoundingClientRect();
      if (
        document.hidden ||
        bounds.bottom <= 0 ||
        bounds.top >= window.innerHeight ||
        track.matches(':hover') ||
        track.contains(document.activeElement)
      ) {
        return;
      }

      const cards = Array.from(track.children) as HTMLElement[];
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 1) return;

      const nextCard = cards.find(
        (card) =>
          card.getBoundingClientRect().left - bounds.left + track.scrollLeft >
          track.scrollLeft + 2
      );
      const nextLeft = nextCard
        ? nextCard.getBoundingClientRect().left - bounds.left + track.scrollLeft
        : 0;

      track.scrollTo({
        left: track.scrollLeft >= maxScroll - 2 ? 0 : nextLeft,
        behavior: 'smooth',
      });
    }, 2000);

    return () => window.clearInterval(interval);
  }, [achievementTrackRef, selectedCertificate]);
  const testimonialTrackRef = testimonialNavigation.trackRef;
  const videoTriggerRef = useRef<HTMLButtonElement>(null);
  const certificateTriggerRef = useRef<HTMLButtonElement>(null);
  const portalTriggerRef = useRef<HTMLButtonElement>(null);
  const registrationTriggerRef = useRef<HTMLButtonElement>(null);

  const closeVideo = useCallback(() => {
    setIsVideoOpen(false);
    videoTriggerRef.current?.focus();
  }, []);
  const closeCertificate = useCallback(() => {
    setSelectedCertificate(null);
    certificateTriggerRef.current?.focus();
  }, []);
  const closeTestimonial = useCallback(() => {
    setSelectedTestimonial(null);
    testimonialTriggerRef.current?.focus();
  }, []);
  const closeLogin = useCallback(() => {
    setIsLoginOpen(false);
    portalTriggerRef.current?.focus();
  }, []);
  const openLogin = useCallback(() => {
    setIsRegistrationOpen(false);
    setLoginError('');
    setLoginBusy(false);
    setIsLoginOpen(true);
  }, []);
  const closeRegistration = useCallback(() => {
    setIsRegistrationOpen(false);
    registrationTriggerRef.current?.focus();
  }, []);
  const openRegistration = useCallback(() => {
    setIsLoginOpen(false);
    setGoogleRegistration(false);
    setGoogleEmail('');
    setApplicationMessage('');
    setApplicationSent(false);
    setTurnstileToken('');
    setIsRegistrationOpen(true);
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const url = new URL(window.location.href);
      const [section, details = ''] = url.hash.split('?');
      if (section === '#register') {
        openRegistration();
        if (url.searchParams.get('auth_mode') === 'google') {
          setGoogleRegistration(true);
          setGoogleEmail(new URLSearchParams(details).get('email') || '');
          const result = url.searchParams.get('application_result');
          if (result === 'received') {
            setApplicationSent(true);
            setApplicationMessage(
              'Application submitted. Your details are now waiting for Super Admin approval.'
            );
          } else if (result) {
            const messages: Record<string, string> = {
              invalid: 'Please enter a valid name, WhatsApp number and batch.',
              rejected:
                'Your application was not approved. Please contact support.',
              unavailable:
                'Could not submit your application. Please try again.',
            };
            setApplicationMessage(messages[result] || 'Please try again.');
          }
        }
      }
      if (url.hash === '#login') {
        openLogin();
        const errors: Record<string, string> = {
          'google-cancelled': 'Google sign-in was cancelled. Please try again.',
          'google-callback':
            'Google sign-in did not return an authorization code. Please try again.',
          'google-session':
            'Your Google sign-in session could not be verified. Please try again in this browser.',
          credentials: 'Email or password is incorrect.',
          pending: 'Your application is pending Super Admin approval.',
          rejected:
            'Your application was not approved. Please contact support.',
          removed: 'This account is unavailable. Please contact support.',
          device:
            'Could not start a session on this device. Contact support if your device limit has been reached.',
          unavailable: 'Login is temporarily unavailable. Please try again.',
          origin: 'Login connection is not configured for this website.',
          'other-device':
            'Your account was signed in on another device. Please sign in again.',
          'password-changed': 'Password changed. Please sign in again.',
        };
        const code =
          url.searchParams.get('auth_error') || url.searchParams.get('reason');
        if (code)
          setLoginError(errors[code] || 'Please sign in again to continue.');
        if (url.searchParams.has('error'))
          setLoginError('Sign-in could not be completed. Please try again.');
      }
    };
    syncAuth();
    window.addEventListener('hashchange', syncAuth);
    const restore = () => {
      setLoginBusy(false);
      setApplicationBusy(false);
    };
    window.addEventListener('pageshow', restore);
    return () => {
      window.removeEventListener('hashchange', syncAuth);
      window.removeEventListener('pageshow', restore);
    };
  }, [openLogin, openRegistration]);

  useEffect(() => {
    if (!isLoginOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLogin();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isLoginOpen, closeLogin]);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    if (googleRegistration) {
      if (applicationBusy || applicationSent) {
        event.preventDefault();
      } else {
        setApplicationBusy(true);
        setApplicationMessage('');
      }
      return;
    }
    event.preventDefault();
    if (applicationBusy || applicationSent) return;
    if (!turnstileToken) {
      setApplicationMessage('Please complete the security check first.');
      return;
    }
    const form = new FormData(event.currentTarget);
    setApplicationBusy(true);
    setApplicationMessage('');
    try {
      const response = await fetch('/api/student-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.get('fullName'),
          email: form.get('email'),
          whatsappNumber: form.get('whatsapp'),
          badge: Number(form.get('batch')),
          turnstileToken,
        }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        emailWarning?: string;
      };
      if (response.ok && result.success) {
        setApplicationSent(true);
        setApplicationMessage(
          'Application submitted. Your details are now waiting for Super Admin approval.' +
            (result.emailWarning ? ' ' + result.emailWarning : '')
        );
      } else {
        setApplicationMessage(
          result.error || 'Could not submit your application. Please try again.'
        );
      }
    } catch {
      setApplicationMessage(
        'Could not submit your application. Please try again.'
      );
    } finally {
      setApplicationBusy(false);
      setTurnstileToken('');
      setCaptchaVersion((version) => version + 1);
    }
  }

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setIsHeaderHidden(
          currentScrollY > previousScrollY && currentScrollY > 80
        );
        previousScrollY = currentScrollY;
        frame = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const sections = [
      ['home', 'hero'],
      ['learn', 'learn'],
      ['process', 'process'],
      ['about', 'about'],
      ['stories', 'stories'],
      ['faq', 'faq'],
    ] as const;

    const updateActiveNav = () => {
      const scrollPosition = window.scrollY + 160;
      let currentSection = 'home';

      sections.forEach(([name, id]) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = name;
        }
      });

      setActiveNav(currentSection);
    };

    updateActiveNav();
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav);

    return () => {
      window.removeEventListener('scroll', updateActiveNav);
      window.removeEventListener('resize', updateActiveNav);
    };
  }, []);

  useEffect(() => {
    if (!isVideoOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeVideo();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isVideoOpen, closeVideo]);

  useEffect(() => {
    if (selectedCertificate === null && selectedTestimonial === null) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selectedTestimonial !== null) closeTestimonial();
        else closeCertificate();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [
    selectedCertificate,
    selectedTestimonial,
    closeCertificate,
    closeTestimonial,
  ]);

  useEffect(() => {
    if (!isRegistrationOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRegistration();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isRegistrationOpen, closeRegistration]);

  return (
    <main className="home" id="home">
      <a className="skip-link" href="#hero">
        Skip to content
      </a>
      <header
        className={
          isHeaderHidden && !isMobileMenuOpen
            ? 'site-header is-hidden'
            : 'site-header'
        }
      >
        <nav
          className={
            isMobileMenuOpen ? 'navigation is-menu-open' : 'navigation'
          }
          aria-label="Main navigation"
        >
          <a
            className="brand nav-lms-badge"
            href="#home"
            aria-label="KrishFX home"
          >
            <img src="/krish-fx-logo.jpeg" width={32} height={32} alt="" />
            <span>
              Krish FX <span className="nav-lms-badge-accent">Swing Lab</span>
            </span>
          </a>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={
              isMobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="nav-links" id="mobile-navigation-menu">
            {[
              ['Home', '#home', 'home'],
              ['Learn', '#learn', 'learn'],
              ['Process', '#process', 'process'],
              ['About', '#about', 'about'],
              ['Stories', '#stories', 'stories'],
              ['FAQ', '#faq', 'faq'],
            ].map(([label, href, section]) => (
              <a
                href={href}
                key={label}
                aria-current={activeNav === section ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="header-actions">
            <button
              className="glow-button portal-button"
              type="button"
              onClick={openLogin}
              ref={portalTriggerRef}
            >
              <PixelField />
              <span>Login to Portal</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 18 18 6M6 6h12v12"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>
            </button>
            <button
              className="glow-button join-button"
              type="button"
              onClick={openRegistration}
              ref={registrationTriggerRef}
            >
              <PixelField />
              <span>Join Now</span>
            </button>
          </div>
        </nav>
      </header>
      <div className="ambient-glow" aria-hidden="true" />
      <div className="hero-section">
        <section className="hero" id="hero" aria-labelledby="hero-title">
          <h1 className="hero-glass-heading" id="hero-title">
            Become a 6-Figure Funded Trader
            <br />
            with the <span className="hero-amf-highlight">AMF Strategy</span>
          </h1>
          <p className="hero-description">
            Learn swing trading through structured market analysis, practical
            guidance, and a clear approach to price action, risk management, and
            trading psychology.
          </p>
          <button
            className="glow-button learn-button"
            type="button"
            onClick={openRegistration}
          >
            <PixelField />
            <span>Start Learning</span>
          </button>
        </section>

        <div className="candles" aria-hidden="true">
          <div className="hero-left-candles">
            <img
              className="hero-candle-art"
              src="/hero-left-candles.png"
              width={535}
              height={349}
              alt=""
            />
            {heroCandleBodies.map((body, index) => (
              <span
                className="liquid-glass"
                key={`left-${index}`}
                style={{
                  left: body.left,
                  top: body.top,
                  width: body.width,
                  height: body.height,
                }}
              />
            ))}
          </div>
          <div className="hero-right-candles">
            <img
              className="hero-candle-art"
              src="/hero-left-candles.png"
              width={535}
              height={349}
              alt=""
            />
            {heroCandleBodies.map((body, index) => (
              <span
                className="liquid-glass"
                key={`right-${index}`}
                style={{
                  left: body.left,
                  top: body.top,
                  width: body.width,
                  height: body.height,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <section
        className="skills-section"
        id="learn"
        aria-labelledby="skills-title"
      >
        <div className="section-intro">
          <div>
            <h2 className="skills-message-heading" id="skills-title">
              <span className="skills-message-line">Forget the Shortcuts</span>
              <span className="skills-message-line">Forget the Signals.</span>
              <span className="skills-message-line">Forget the Bots.</span>
              <span className="skills-message-promise">
                Learn how to trade like a <strong>PRO</strong>
              </span>
            </h2>
          </div>
          <p className="section-description">
            Understand the key concepts you need to analyze the market, plan
            trades, manage risk, and develop a structured trading approach.
          </p>
        </div>
        <div className="skills-grid">
          {skills.map(({ title, description, icon }) => (
            <article className="skill-card" key={title}>
              <span className="skill-icon">
                <img src={icon} width={44} height={44} alt="" />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        className="course-package-section"
        aria-labelledby="amf-concept-title"
      >
        <h2 className="course-package-heading" id="amf-concept-title">
          AMF Concept
        </h2>
        <div className="course-package-layout">
          <div className="course-package-card">
            <h3 id="course-package-title">What You Will Learn &amp; Receive</h3>
            <ol className="course-package-list">
              {courseInclusions.map(({ title, description }, index) => (
                <li className="course-package-item" key={title}>
                  <span className="course-package-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="course-package-footer">
              <div className="course-package-price">
                <span>Mentorship price</span>
                <span className="course-package-offer-badge">
                  Black Friday Offer
                </span>
                <div className="course-package-offer-prices">
                  <del aria-label="Original price 170 dollars">$170</del>
                  <strong aria-label="Offer price 135 dollars">$135</strong>
                </div>
                <OfferCountdown />
              </div>
              <button
                className="glow-button course-package-join"
                type="button"
                onClick={openRegistration}
              >
                <PixelField />
                <span>Join Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section
        className="process-section"
        id="process"
        aria-labelledby="process-title"
      >
        <div className="section-intro">
          <div>
            <p className="eyebrow">HOW IT WORKS</p>
            <h2 id="process-title">
              A Simple Approach to
              <br />
              Learning Swing Trading
            </h2>
          </div>
          <p className="section-description">
            Follow a structured learning process that takes you from
            understanding the basics to analyzing the market and developing your
            own trading approach.
          </p>
        </div>

        <div className="process-stage">
          <div className="orbit-visual" aria-hidden="true">
            <div className="orbit-ring orbit-ring-outer" />
            <div className="orbit-ring orbit-ring-inner" />
            <div className="orbit-track orbit-track-outer">
              <span className="orbit-particle orbit-particle-forward" />
            </div>
            <div className="orbit-track orbit-track-inner">
              <span className="orbit-particle orbit-particle-forward" />
            </div>
            <div className="orbit-candles">
              {[
                [0, 61, 22, 34, 58],
                [22.5, 53, 60, 3, 97],
                [45, 46, 30, 13, 84],
                [67.5, 46, 47, 0, 93],
                [90, 60, 33, 24, 76],
              ].map(([left, top, height, wickTop, wickHeight], index) => (
                <span
                  className="orbit-candle"
                  key={index}
                  style={
                    {
                      '--left': `${left}%`,
                      '--top': `${top}%`,
                      '--height': `${height}%`,
                      '--wick-top': `${wickTop}%`,
                      '--wick-height': `${wickHeight}%`,
                    } as CSSProperties
                  }
                >
                  <img
                    className="orbit-candle-body orbit-candle-image"
                    src={`/circle-cadle-${index + 1}.png`}
                    alt=""
                    width={24}
                  />
                </span>
              ))}
            </div>
          </div>
          {steps.map(({ title, description }, index) => (
            <article
              className={`process-card process-card-${index + 1}`}
              key={title}
            >
              <span className="step-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="meet-section" id="about" aria-labelledby="meet-title">
        <div className="meet-layout">
          <div className="meet-copy">
            <h2 id="meet-title">Meet the Mentor Behind Krish FX Swing Lab</h2>
            <p className="mentor-role">
              Founder &amp; Mentor | 6-Figure Funded Trader
            </p>
            <div className="meet-description mentor-bio">
              <p>
                Krish is a 6-figure funded trader and the founder of Krish FX
                Swing Lab.
              </p>
              <p>
                Specializing in Swing Trading and the Advance Market Framework
                (AMF), he is dedicated to helping aspiring traders master
                high-timeframe market analysis, trading discipline, psychology,
                and trade management.
              </p>
              <p>
                His mission is to develop disciplined, knowledgeable, and
                independent traders through structured trading education.
              </p>
              <p className="mentor-motto">
                Trade with Knowledge. Grow with Discipline.
              </p>
            </div>
            <div className="meet-benefits">
              <article className="meet-benefit">
                <h3>Practical Market Analysis</h3>
                <p>Learn through real market situations and chart analysis.</p>
              </article>
              <article className="meet-benefit">
                <h3>Structured Learning</h3>
                <p>
                  Follow a clear approach instead of jumping between random
                  strategies.
                </p>
              </article>
              <article className="meet-benefit">
                <h3>Guided Mentorship</h3>
                <p>
                  Get support and direction as you develop your own trading
                  process.
                </p>
              </article>
            </div>
          </div>
          <div className="meet-image-wrap meet-cover">
            <img
              className="is-active"
              src="/mentor-page-cover.png"
              alt="Meet Krish, founder and mentor of Krish FX Swing Lab, and learn about his AMF trading mentorship"
              width={3048}
              height={1715}
              loading="lazy"
            />
          </div>
        </div>
        <MentorResults />
      </section>
      <section
        className="student-stories-section"
        id="stories"
        aria-labelledby="student-stories-title"
      >
        <div className="student-stories-hero">
          <div className="student-stories-copy">
            <p className="eyebrow">STUDENT STORIES</p>
            <h2 id="student-stories-title">
              Real Stories From
              <br />
              Our Students
            </h2>
            <p>
              Simple, trustworthy, and works for both videos and screenshots.
            </p>
          </div>
          <div className="student-video-card">
            <iframe
              src={
                isVideoOpen
                  ? 'about:blank'
                  : 'https://www.youtube-nocookie.com/embed/1jAHGgzj_tc?autoplay=1&mute=1&loop=1&playlist=1jAHGgzj_tc&controls=0&playsinline=1&rel=0&modestbranding=1'
              }
              title="KrishFX student result video preview"
              allow="autoplay; encrypted-media; picture-in-picture"
              tabIndex={-1}
              aria-hidden="true"
            />
            <span className="student-video-play" aria-hidden="true">
              <Play size={26} fill="currentColor" />
            </span>
            <button
              className="student-video-card-trigger"
              type="button"
              aria-label="Open the full student result video"
              onClick={() => setIsVideoOpen(true)}
              ref={videoTriggerRef}
            />
          </div>
        </div>

        <div className="story-carousel-block achievement-block">
          <div className="story-carousel-heading">
            <h3>Student Achievements</h3>
            <div className="story-carousel-controls">
              <button
                type="button"
                aria-label="Previous achievements"
                disabled={!achievementNavigation.previous}
                onClick={() =>
                  achievementTrackRef.current?.scrollBy({
                    left: -320,
                    behavior: 'smooth',
                  })
                }
              >
                <img
                  className="carousel-arrow-previous"
                  src="/rightside-arrow.svg"
                  alt=""
                />
              </button>
              <button
                type="button"
                aria-label="Next achievements"
                disabled={!achievementNavigation.next}
                onClick={() =>
                  achievementTrackRef.current?.scrollBy({
                    left: 320,
                    behavior: 'smooth',
                  })
                }
              >
                <img src="/rightside-arrow.svg" alt="" />
              </button>
            </div>
          </div>
          <div className="achievement-track" ref={achievementTrackRef}>
            {certificateImages.map((src, index) => (
              <button
                className="achievement-card"
                type="button"
                key={src}
                aria-label={
                  'View student trading achievement certificate ' +
                  (index + 1) +
                  ' in full size'
                }
                onClick={() => setSelectedCertificate(index)}
                onPointerDown={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty(
                    '--cursor-x',
                    event.clientX - bounds.left + 'px'
                  );
                  event.currentTarget.style.setProperty(
                    '--cursor-y',
                    event.clientY - bounds.top + 'px'
                  );
                }}
                onPointerMove={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty(
                    '--cursor-x',
                    event.clientX - bounds.left + 'px'
                  );
                  event.currentTarget.style.setProperty(
                    '--cursor-y',
                    event.clientY - bounds.top + 'px'
                  );
                }}
                ref={
                  index === selectedCertificate ? certificateTriggerRef : null
                }
              >
                <img
                  src={src}
                  alt={'Student trading achievement certificate ' + (index + 1)}
                  loading="lazy"
                />
                <span className="achievement-card-cursor" aria-hidden="true">
                  <img src="/student archive cursor.svg" alt="" />
                </span>
              </button>
            ))}
          </div>
        </div>

        <StudentRecognition />

        <div className="story-carousel-block testimonial-block">
          <div className="story-carousel-heading">
            <h3>What Our Students Are Saying</h3>
            <div className="story-carousel-controls">
              <button
                type="button"
                aria-label="Previous reviews"
                disabled={!testimonialNavigation.previous}
                onClick={() =>
                  testimonialTrackRef.current?.scrollBy({
                    left: -320,
                    behavior: 'smooth',
                  })
                }
              >
                <img
                  className="carousel-arrow-previous"
                  src="/rightside-arrow.svg"
                  alt=""
                />
              </button>
              <button
                type="button"
                aria-label="Next reviews"
                disabled={!testimonialNavigation.next}
                onClick={() =>
                  testimonialTrackRef.current?.scrollBy({
                    left: 320,
                    behavior: 'smooth',
                  })
                }
              >
                <img src="/rightside-arrow.svg" alt="" />
              </button>
            </div>
          </div>
          <div className="testimonial-track" ref={testimonialTrackRef}>
            {studentTestimonials.map(({ name, initials, text }, index) => {
              return (
                <article
                  className="testimonial-card"
                  key={`${name}-${index}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${name}'s student review`}
                  aria-haspopup="dialog"
                  onClick={(event) => {
                    testimonialTriggerRef.current = event.currentTarget;
                    setSelectedTestimonial(index);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      testimonialTriggerRef.current = event.currentTarget;
                      setSelectedTestimonial(index);
                    }
                  }}
                  onPointerUp={(event) => {
                    if (event.pointerType !== 'touch') return;
                    const touch = testimonialTouchRef.current;
                    testimonialTouchRef.current = null;
                    if (
                      !touch ||
                      touch.pointerId !== event.pointerId ||
                      touch.moved ||
                      Math.hypot(
                        event.clientX - touch.x,
                        event.clientY - touch.y
                      ) > 10
                    )
                      return;
                    event.preventDefault();
                    testimonialTriggerRef.current = event.currentTarget;
                    setSelectedTestimonial(index);
                  }}
                  onPointerCancel={() => {
                    testimonialTouchRef.current = null;
                  }}
                  onPointerDown={(event) => {
                    if (event.pointerType === 'touch') {
                      testimonialTouchRef.current = {
                        pointerId: event.pointerId,
                        x: event.clientX,
                        y: event.clientY,
                        moved: false,
                      };
                      return;
                    }
                    const bounds = event.currentTarget.getBoundingClientRect();
                    event.currentTarget.style.setProperty(
                      '--cursor-x',
                      event.clientX - bounds.left + 'px'
                    );
                    event.currentTarget.style.setProperty(
                      '--cursor-y',
                      event.clientY - bounds.top + 'px'
                    );
                  }}
                  onPointerMove={(event) => {
                    if (event.pointerType === 'touch') {
                      const touch = testimonialTouchRef.current;
                      if (
                        touch?.pointerId === event.pointerId &&
                        Math.hypot(
                          event.clientX - touch.x,
                          event.clientY - touch.y
                        ) > 10
                      ) {
                        touch.moved = true;
                      }
                      return;
                    }
                    const bounds = event.currentTarget.getBoundingClientRect();
                    event.currentTarget.style.setProperty(
                      '--cursor-x',
                      event.clientX - bounds.left + 'px'
                    );
                    event.currentTarget.style.setProperty(
                      '--cursor-y',
                      event.clientY - bounds.top + 'px'
                    );
                  }}
                >
                  <div className="testimonial-person">
                    <span>{initials}</span>
                    <h4>{name}</h4>
                  </div>
                  <p>{text}</p>
                  <span className="testimonial-expand">See more</span>
                  <span className="testimonial-card-cursor" aria-hidden="true">
                    <img src="/student said.svg" alt="" />
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {isVideoOpen && (
        <div
          className="video-modal"
          role="dialog"
          aria-modal="true"
          aria-label="KrishFX student result video"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeVideo();
          }}
        >
          <div className="video-modal-content">
            <button
              className="video-modal-close"
              type="button"
              aria-label="Close video"
              onClick={closeVideo}
              autoFocus
            >
              <img src="/arrow.svg" width={20} height={20} alt="" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/1jAHGgzj_tc?autoplay=1&controls=1&playsinline=1&rel=0"
              title="KrishFX student result video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
      {selectedCertificate !== null && (
        <div
          className="certificate-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Student trading achievement certificate preview"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCertificate();
          }}
        >
          <figure className="certificate-modal-content">
            <button
              className="video-modal-close"
              type="button"
              aria-label="Close certificate preview"
              onClick={closeCertificate}
              autoFocus
            >
              <img src="/arrow.svg" width={20} height={20} alt="" />
            </button>
            <img
              src={certificateImages[selectedCertificate]}
              alt={
                'Student trading achievement certificate ' +
                (selectedCertificate + 1)
              }
            />
          </figure>
        </div>
      )}
      {selectedTestimonial !== null && (
        <div
          className="certificate-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Student review preview"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeTestimonial();
          }}
        >
          <figure className="certificate-modal-content testimonial-modal-content">
            <button
              className="video-modal-close"
              type="button"
              aria-label="Close student review preview"
              onClick={closeTestimonial}
              onKeyDown={(event) => {
                if (event.key === 'Tab') event.preventDefault();
              }}
              autoFocus
            >
              <img src="/arrow.svg" width={20} height={20} alt="" />
            </button>
            <img
              src={
                studentTestimonials[selectedTestimonial].image ??
                `/student-review-${selectedTestimonial + 1}.png`
              }
              alt={`Student review from ${studentTestimonials[selectedTestimonial].name}`}
            />
          </figure>
        </div>
      )}
      {isLoginOpen && (
        <div
          className="login-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLogin();
          }}
        >
          <form
            className="login-modal-card sign-in-card"
            method="post"
            action="/api/auth/landing-login"
            onSubmit={(event) => {
              if (loginBusy) {
                event.preventDefault();
                return;
              }
              setLoginError('');
              setLoginBusy(true);
            }}
          >
            <button
              className="video-modal-close"
              type="button"
              aria-label="Close login"
              onClick={closeLogin}
              autoFocus
            >
              <img src="/arrow.svg" width={20} height={20} alt="" />
            </button>
            <h2 id="login-modal-title">Welcome Back</h2>
            <p className="login-modal-intro">
              Sign in to continue your journey.
            </p>
            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="username"
                required
                maxLength={254}
              />
            </label>
            <label className="login-field">
              <span>Password</span>
              <span className="login-password-wrap">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  maxLength={1024}
                />
                <button
                  type="button"
                  aria-label={
                    isPasswordVisible ? 'Hide password' : 'Show password'
                  }
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  aria-pressed={isPasswordVisible}
                >
                  <img src="/i-icon.svg" width={20} height={20} alt="" />
                </button>
              </span>
            </label>
            <button
              className="login-forgot"
              type="button"
              onClick={() =>
                setLoginError('Please contact support to reset your password.')
              }
            >
              Forget Password
            </button>
            {loginError && <p role="alert">{loginError}</p>}
            <button
              className="glow-button login-primary"
              type="submit"
              disabled={loginBusy}
            >
              <PixelField />
              <span>{loginBusy ? 'Signing in...' : 'Join Now'}</span>
            </button>
            <div className="login-divider" aria-hidden="true">
              <span />
              Or
              <span />
            </div>
            <button
              className="login-google"
              type="button"
              disabled={loginBusy}
              onClick={() => window.location.assign('/auth/google')}
            >
              Sign in with Google
            </button>
            <p className="login-signup">
              Are you new?{' '}
              <button type="button" onClick={openRegistration}>
                Create an Account
              </button>
            </p>
          </form>
        </div>
      )}
      {isRegistrationOpen && (
        <div
          className="login-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="registration-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeRegistration();
          }}
        >
          <form
            className="login-modal-card registration-modal-card"
            method="post"
            action={googleRegistration ? '/auth/google-register' : undefined}
            onSubmit={submitApplication}
          >
            <button
              className="video-modal-close"
              type="button"
              aria-label="Close registration"
              onClick={closeRegistration}
              autoFocus
            >
              <img src="/arrow.svg" width={20} height={20} alt="" />
            </button>
            <h2 id="registration-modal-title">Create your account</h2>
            <p className="login-modal-intro">
              Submit your details to apply for the next batch.
            </p>
            <div className="registration-modal-body">
              <label className="login-field">
                <span>Full name</span>
                <input
                  type="text"
                  name="fullName"
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Enter your full name"
                />
              </label>
              {!googleRegistration ? (
                <label className="login-field" key="registration-email">
                  <span>Email address</span>
                  <input
                    type="email"
                    name="email"
                    required
                    maxLength={254}
                    placeholder="Enter your email"
                  />
                </label>
              ) : (
                <label className="login-field" key="google-email">
                  <span>Email address</span>
                  <input
                    type="email"
                    value={googleEmail}
                    readOnly
                    autoComplete="email"
                    placeholder="Verified Google email"
                    aria-label="Google email address"
                  />
                </label>
              )}
              <label className="login-field">
                <span>WhatsApp number</span>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  minLength={7}
                  maxLength={25}
                  placeholder="Enter your WhatsApp number"
                />
              </label>
              <input type="hidden" name="batch" value="5" />
              {!googleRegistration && (
                <TurnstileWidget
                  key={captchaVersion}
                  onToken={setTurnstileToken}
                />
              )}
              {applicationMessage && (
                <p role="status" aria-live="polite">
                  {applicationMessage}
                </p>
              )}
            </div>
            <div className="registration-modal-actions">
              <button
                className="glow-button login-primary"
                type="submit"
                disabled={
                  applicationBusy ||
                  applicationSent ||
                  (!googleRegistration && !turnstileToken)
                }
              >
                <PixelField />
                <span>
                  {applicationBusy
                    ? 'Submitting...'
                    : applicationSent
                      ? 'Application submitted'
                      : 'Submit application'}
                </span>
              </button>
              <p className="login-signup">
                Already approved?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistrationOpen(false);
                    openLogin();
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      )}
      <section className="faq-section" id="faq" aria-labelledby="faq-title">
        <div className="faq-intro">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">
            Questions About the
            <br />
            Program?
          </h2>
          <p>
            Find answers to the most common questions about the program,
            learning process, and how to get started.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map(({ question, answer }, index) => {
            const isOpen = activeFaq === index;
            const answerId = 'faq-answer-' + index;

            return (
              <article
                className={isOpen ? 'faq-item is-open' : 'faq-item'}
                key={question}
              >
                <button
                  className="faq-trigger"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setActiveFaq(isOpen ? -1 : index)}
                >
                  <span>{'0' + (index + 1) + '. ' + question}</span>
                  <ChevronDown aria-hidden="true" size={20} strokeWidth={1.8} />
                </button>
                <div className="faq-answer" id={answerId} aria-hidden={!isOpen}>
                  <p>{answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <a
              className="brand nav-lms-badge"
              href="#home"
              aria-label="KrishFX home"
            >
              <img src="/krish-fx-logo.jpeg" width={32} height={32} alt="" />
              <span>
                Krish FX <span className="nav-lms-badge-accent">Swing Lab</span>
              </span>
            </a>
            <p>
              Learn swing trading through structured education, practical market
              analysis, and guided mentorship.
            </p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#learn">Learn</a>
            <a href="#stories">Stories</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="footer-contact-group" aria-label="WhatsApp numbers">
              <p className="footer-contact-label">
                <img src="/whatss-app-logo.svg" width={17} height={17} alt="" />
                WhatsApp
              </p>
              <div className="footer-contact-numbers">
                <a
                  href="https://wa.me/971568515770"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +971 56 851 5770
                </a>
                <a
                  href="https://wa.me/94711525225"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +94 71 152 5225
                </a>
              </div>
            </div>
            <div className="footer-contact-group" aria-label="Phone numbers">
              <p className="footer-contact-label">
                <Phone size={17} aria-hidden="true" />
                Call Us
              </p>
              <div className="footer-contact-numbers">
                <a href="tel:+94710582241">071 058 2241</a>
                <a href="tel:+94711525225">071 152 5225</a>
              </div>
            </div>
            <a
              href="https://t.me/KrishFX2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/telegrame-logo.svg" width={17} height={17} alt="" />
              KrishFX2
            </a>
            <a
              href="https://youtube.com/@krishfx1?si=wuz8styfkxr-FHy9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/youtube-logo.svg" width={17} height={17} alt="" />
              Krish FX Swing Lab
            </a>
            <a
              href="https://www.facebook.com/share/19gtbEBUrq/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/facebook-logo.svg" width={17} height={17} alt="" />
              Krish FX Swing Lab
            </a>
          </div>
          <div className="footer-cta">
            <h3>Ready to Start Learning?</h3>
            <button
              className="glow-button footer-button"
              type="button"
              onClick={openRegistration}
            >
              <PixelField />
              <span>Join the Program</span>
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 Krish FX Swing Lab. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;
