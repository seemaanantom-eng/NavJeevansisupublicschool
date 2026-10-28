/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  School,
  Youtube,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  MessageSquare,
  Send,
  Bus,
  Trophy,
  Palette,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Info,
  Clock,
  Filter,
  Menu,
  Home,
  Languages,
  Volume2,
  VolumeX,
  FileText,
  GraduationCap,
  PhoneCall,
  Check,
  Copy,
  Utensils,
  MapPin,
  HelpCircle,
  FileQuestion,
  Globe,
  RefreshCw,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  Sliders,
  Sparkle
} from 'lucide-react';

export interface SchoolNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'holiday' | 'exam' | 'event' | 'general';
  createdAt: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  category?: string;
}

export interface InquiryTicket {
  ticketId: string;
  parentName: string;
  studentName: string;
  targetGrade: string;
  contact: string;
  topic: string;
  message: string;
  timestamp: string;
  status: 'Received' | 'Under Review';
}

const DEFAULT_NOTICES: SchoolNotice[] = [];

export default function App() {
  // Notices state initialized from localStorage (cleared to empty list)
  const [notices, setNotices] = useState<SchoolNotice[]>(() => {
    try {
      // Clear previous cached sample notices
      localStorage.removeItem('njs_school_notices_v2');
      localStorage.removeItem('njs_school_notices_v1');
      const saved = localStorage.getItem('njs_school_notices_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_NOTICES;
  });

  // Category filter
  const [activeFilter, setActiveFilter] = useState<'all' | 'holiday' | 'exam' | 'event' | 'general'>('all');

  // Modal State for Adding Notice
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategory, setModalCategory] = useState<'holiday' | 'exam' | 'event' | 'general'>('holiday');
  const [modalDate, setModalDate] = useState('Tomorrow / कल');
  const [modalContent, setModalContent] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active View Mode: 'official-site' (seemaanantom-eng.github.io) | 'portal' | 'live-frame'
  const [activeViewMode, setActiveViewMode] = useState<'portal' | 'official-site' | 'live-frame'>('official-site');
  const [liveFrameDevice, setLiveFrameDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeRefreshKey, setIframeRefreshKey] = useState(0);

  // Mega Slider 1: Life at NJS Public School (from seemaanantom-eng.github.io)
  const [megaIndex1, setMegaIndex1] = useState(0);
  const megaSlides1 = [
    {
      img: 'https://seemaanantom-eng.github.io/NJSpublicSchool/havan.jpg',
      alt: 'Event 1 - Traditional Havan Ceremony',
      title: 'Havan & Moral Values',
      caption: 'Inaugural Vedic ceremonies fostering ancient wisdom, ethics, and mindful dedication.'
    },
    {
      img: 'https://seemaanantom-eng.github.io/NJSpublicSchool/master.jpg',
      alt: 'Event 2 - Faculty Mentorship',
      title: 'Academic Mentorship',
      caption: 'Experienced educators guiding students in interactive and inspiring classroom environments.'
    },
    {
      img: 'https://seemaanantom-eng.github.io/NJSpublicSchool/race.jpg',
      alt: 'Event 3 - 400m Track Athletic Race',
      title: '400m Olympic Track Sprint',
      caption: 'Annual athletics championships with sprint heats, relay races, and field events.'
    },
    {
      img: 'https://seemaanantom-eng.github.io/NJSpublicSchool/cricket.jpg',
      alt: 'Event 4 - Cricket Championship',
      title: 'Cricket Academy & Matches',
      caption: 'Turf pitch cricket tournaments teaching sportsmanship, leadership, and athletic vigor.'
    },
    {
      img: 'https://seemaanantom-eng.github.io/NJSpublicSchool/football.jpg',
      alt: 'Event 5 - Football Tournament',
      title: 'Football League & Training',
      caption: 'Floodlit football turf hosting inter-school leagues and tactical physical endurance sessions.'
    },
  ];

  // Mega Slider 2: Our Achievements (from seemaanantom-eng.github.io)
  const [megaIndex2, setMegaIndex2] = useState(0);
  const megaSlides2 = [
    {
      img: 'https://seemaanantom-eng.github.io/NJSpublicSchool/clay.jpg',
      alt: 'Award 1 - Terracotta & Clay Sculpting',
      title: 'Terracotta & Clay Sculpting',
      caption: 'Fine arts accolades and student pottery exhibitions.'
    },
    {
      img: 'https://seemaanantom-eng.github.io/NJSpublicSchool/rakhi.jpg',
      alt: 'Award 2 - Cultural Rakhi Celebrations',
      title: 'Cultural Festivals & Rakhi',
      caption: 'Traditional Indian festivals celebrated with artistic craftsmanship.'
    },
    {
      img: 'https://seemaanantom-eng.github.io/NJSpublicSchool/diwali.jpg',
      alt: 'Award 3 - Diwali Illuminations',
      title: 'Diwali Festivities & Arts',
      caption: 'Eco-friendly celebrations, rangoli competitions, and community service.'
    },
    {
      img: 'https://seemaanantom-eng.github.io/NJSpublicSchool/arth.jpg',
      alt: 'Award 4 - Artistic Exhibitions',
      title: 'Artistic Excellence & Earth Day',
      caption: 'Environmental conservation projects and student art galleries.'
    },
  ];

  const moveMega1 = (dir: number) => {
    setMegaIndex1((prev) => {
      let next = prev + dir;
      if (next < 0) next = megaSlides1.length - 1;
      if (next >= megaSlides1.length) next = 0;
      return next;
    });
  };

  const moveMega2 = (dir: number) => {
    setMegaIndex2((prev) => {
      let next = prev + dir;
      if (next < 0) next = megaSlides2.length - 1;
      if (next >= megaSlides2.length) next = 0;
      return next;
    });
  };

  // 24/7 Ask AI Program State (Inspired by International School Virtual Assistant framework)
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Hinglish' | 'Deutsch' | 'Français' | 'Español'>('English');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Parent Inquiry Ticket State
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [showInquiryHistory, setShowInquiryHistory] = useState(false);
  const [inquiryParentName, setInquiryParentName] = useState('');
  const [inquiryStudentName, setInquiryStudentName] = useState('');
  const [inquiryGrade, setInquiryGrade] = useState('Grade 1');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('Admissions & Enrollment');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittedTickets, setSubmittedTickets] = useState<InquiryTicket[]>(() => {
    try {
      const saved = localStorage.getItem('njs_askai_inquiries');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Floating AI Assistant Drawer State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'bot',
      text: `Hello & नमस्ते! Welcome to **NJS Public School Ask AI • 24/7 Virtual Assistant**.\n\n📌 **24/7 School AI Services:**\n• **Latest Admin Circular:** Ask *"क्या कोई नया नोटिस आया है?"* or *"New message?"* to receive the most recent announcement posted by the administration.\n• **Holiday & Open Status:** Ask *"Is school open tomorrow?"* or *"Kal holiday hai kya?"* (Confirms holiday if declared, otherwise confirms **School is OPEN**!)\n• **Admissions & Campus Tour:** Inquire about enrollment, age criteria, documentation, or book a visit.\n• **Parent Inquiry Desk:** Click *"Submit Inquiry Ticket"* to generate a registered reference number directly for our admissions office.\n• **Multilingual:** Use the language switcher above for English, Hindi, Hinglish, German (Deutsch), French, and Spanish!`,
      timestamp: 'Just now',
    },
  ]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Embedded AI Banner Query State
  const [quickQuery, setQuickQuery] = useState('');
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [isQuickThinking, setIsQuickThinking] = useState(false);

  // Save notices to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('njs_school_notices_v4', JSON.stringify(notices));
    } catch {
      // ignore
    }
  }, [notices]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAiDrawerOpen]);

  // Helper: Determine if holiday notice is currently active
  const activeHolidayNotice = notices.find((n) => {
    const text = (n.title + ' ' + n.content).toLowerCase();
    return (
      n.category === 'holiday' ||
      text.includes('holiday') ||
      text.includes('chutti') ||
      text.includes('chhutti') ||
      text.includes('closed') ||
      text.includes('अवकाश')
    );
  });

  // Text-to-speech audio function
  const speakText = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~[\]]/g, '').replace(/https?:\/\/\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (selectedLanguage === 'Deutsch') utterance.lang = 'de-DE';
    else if (selectedLanguage === 'Français') utterance.lang = 'fr-FR';
    else if (selectedLanguage === 'Español') utterance.lang = 'es-ES';
    else if (selectedLanguage === 'Hindi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Submit Parent Inquiry / Callback Request
  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryParentName.trim() || !inquiryContact.trim() || !inquiryMessage.trim()) {
      return;
    }

    const ticketNumber = `NJS-AI-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: InquiryTicket = {
      ticketId: ticketNumber,
      parentName: inquiryParentName.trim(),
      studentName: inquiryStudentName.trim() || 'Prospective Student',
      targetGrade: inquiryGrade,
      contact: inquiryContact.trim(),
      topic: inquiryTopic,
      message: inquiryMessage.trim(),
      timestamp: new Date().toLocaleString(),
      status: 'Received',
    };

    const updated = [newTicket, ...submittedTickets];
    setSubmittedTickets(updated);
    try {
      localStorage.setItem('njs_askai_inquiries', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setSuccessToast(`Inquiry Ticket Created: ${ticketNumber}`);
    setTimeout(() => setSuccessToast(''), 6000);

    // Push confirmation in AI chat
    setChatMessages((prev) => [
      ...prev,
      {
        id: 'ticket-' + Date.now(),
        sender: 'bot',
        text: `🎫 **Ask AI Inquiry Ticket Registered!**\n\n• **Ticket Reference:** \`${ticketNumber}\`\n• **Applicant / Student:** ${newTicket.studentName} (${newTicket.targetGrade})\n• **Topic:** ${newTicket.topic}\n• **Contact:** ${newTicket.contact}\n• **Status:** Received & Forwarded to Admissions Desk.\n\n*Our staff will review your inquiry and follow up shortly. Thank you for your interest in NJS Public School!*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setInquiryParentName('');
    setInquiryStudentName('');
    setInquiryContact('');
    setInquiryMessage('');
    setIsInquiryModalOpen(false);
  };

  // AI Response Generator adhering strictly to holiday rules, notices, & school context
  const getAiAnswer = (prompt: string, lang = selectedLanguage): string => {
    const lower = prompt.trim().toLowerCase();

    // 1. DEDICATED HANDLER: "new message" / "क्या कोई नया नोटिस आया है?" / Latest notification added by admin
    const isNewNoticeOrMessageQuestion =
      lower.includes('new message') ||
      lower.includes('naya message') ||
      lower.includes('naye message') ||
      lower.includes('नया मैसेज') ||
      lower.includes('नया संदेश') ||
      lower.includes('मैसेज') ||
      lower.includes('message') ||
      lower.includes('क्या कोई नया नोटिस') ||
      lower.includes('kya koi naya notice') ||
      lower.includes('koi naya notice') ||
      lower.includes('naya notice') ||
      lower.includes('naye notice') ||
      lower.includes('नया नोटिस') ||
      lower.includes('नया नोटिफिकेशन') ||
      lower.includes('naya notification') ||
      lower.includes('koi naya') ||
      lower.includes('कोई नया') ||
      lower.includes('latest notice') ||
      lower.includes('latest notification') ||
      lower.includes('latest message') ||
      lower.includes('latest circular') ||
      lower.includes('recent notice') ||
      lower.includes('recent notification') ||
      lower.includes('recent message') ||
      lower.includes('neue mitteilung') ||
      lower.includes('neue nachricht') ||
      lower.includes('any new notice') ||
      lower.includes('any new message') ||
      lower.includes('notice') ||
      lower.includes('circular') ||
      lower.includes('notification') ||
      lower.includes('suchna') ||
      lower.includes('सूचना');

    if (isNewNoticeOrMessageQuestion) {
      if (notices.length === 0) {
        if (lang === 'Deutsch') {
          return `📢 **Mitteilungen der Schulleitung (Notifications):**\n\nZurzeit liegt keine neue Benachrichtigung der Schulleitung vor. Es wurde kein Feiertag ausgerufen und **die Schule ist geöffnet (School is OPEN)**!`;
        }
        return `📢 **सूचना / Notifications Status:**\n\n• **Hindi:** वर्तमान में एडमिन द्वारा कोई नया नोटिस या मैसेज जारी नहीं किया गया है। विद्यालय में कोई अवकाश नहीं है और **स्कूल खुला है (School is OPEN)**!\n\n• **English:** Currently, no new message or notice has been posted by the admin. **The school is OPEN!**`;
      }

      // The latest notification added by admin is at index 0
      const latestNotice = notices[0];
      const isHoliday = latestNotice.category === 'holiday';
      const isExam = latestNotice.category === 'exam';
      const isEvent = latestNotice.category === 'event';
      const categoryBadge = isHoliday
        ? '🚨 अवकाश / छुट्टी (Holiday Notice)'
        : isExam
        ? '📝 परीक्षा सूचना (Exam Notice)'
        : isEvent
        ? '🏆 खेलकूद व शैक्षिक टूर (Event & Sports)'
        : '📢 सामान्य सूचना (General Notice)';

      if (lang === 'Deutsch') {
        return `📢 **Neueste Benachrichtigung der Schulleitung (Latest Notice by Admin):**\n\n` +
          `📌 **Titel:** ${latestNotice.title}\n` +
          `🏷️ **Kategorie:** ${latestNotice.category.toUpperCase()}\n` +
          `📅 **Datum:** ${latestNotice.date}\n` +
          `📝 **Details:**\n${latestNotice.content}\n\n` +
          (isHoliday ? `⚠️ **Status:** Die Schule ist an diesem Tag geschlossen (Holiday declared).` : `🏫 **Status:** Die Schule ist regulär geöffnet (School is OPEN).`);
      }

      return `📢 **एडमिन द्वारा जारी नवीनतम नोटिफिकेशन (Latest Notification Added by Admin):**\n\n` +
        `📌 **शीर्षक (Title):** ${latestNotice.title}\n` +
        `🏷️ **प्रकार (Category):** ${categoryBadge}\n` +
        `📅 **लागू दिनांक (Effective Date):** ${latestNotice.date}\n` +
        `📝 **मुख्य विवरण (Details):**\n${latestNotice.content}\n\n` +
        (isHoliday
          ? `⚠️ **School Status:** इस आधिकारिक नोटिस के अनुसार स्कूल में **अवकाश (Holiday / Leave)** रहेगा।\n\n`
          : `🏫 **School Status:** स्कूल खुला है (School is OPEN)। सभी कक्षाएं नियमित समय अनुसार संचालित होंगी।\n\n`) +
        (notices.length > 1
          ? `*(कुल ${notices.length} सक्रिय नोटिस उपलब्ध हैं। सभी नोटिस देखने के लिए Circulars & Notifications बोर्ड देखें।)*`
          : `*(यह वर्तमान में एडमिन द्वारा प्रकाशित सबसे नया आधिकारिक नोटिस है।)*`);
    }

    // 2. Holiday / Open Question
    const isHolidayQuestion =
      lower.includes('holiday') ||
      lower.includes('chutti') ||
      lower.includes('chhutti') ||
      lower.includes('leave') ||
      lower.includes('open') ||
      lower.includes('khula') ||
      lower.includes('khulega') ||
      lower.includes('band') ||
      lower.includes('off') ||
      lower.includes('feiertag') ||
      lower.includes('ferien') ||
      lower.includes('geöffnet') ||
      lower.includes('geschlossen') ||
      lower.includes('kal');

    if (isHolidayQuestion) {
      if (activeHolidayNotice) {
        if (lang === 'Deutsch') {
          return `📌 **Schulfrei / Feiertag (Holiday Declared):**\n\nGemäß der offiziellen Mitteilung der NJS Public School ist die Schule geschlossen.\n**Titel:** ${activeHolidayNotice.title}\n**Details:** ${activeHolidayNotice.content}`;
        }
        return `📌 **Holiday Declared / छुट्टी घोषित:**\n\n• **Hindi / Hinglish:** हाँ, NJS Public School के आधिकारिक नोटिस के अनुसार स्कूल में **छुट्टी (Holiday / Leave)** रहेगी।\n  **शीर्षक:** ${activeHolidayNotice.title}\n  **विवरण:** ${activeHolidayNotice.content}\n\n• **English:** Yes! According to the active school notice, NJS Public School is **CLOSED / on Holiday** (${activeHolidayNotice.date}).\n  **Notice:** ${activeHolidayNotice.content}`;
      } else {
        if (lang === 'Deutsch') {
          return `🏫 **Die Schule ist geöffnet (School is OPEN):**\n\nEs liegt kein offizieller Feiertagsbescheid vor. Alle Klassen und der reguläre Stundenplan finden wie gewohnt statt.`;
        }
        return `🏫 **School is OPEN / स्कूल खुला है:**\n\n• **Hindi / Hinglish:** **स्कूल खुला है (School is OPEN)!** वर्तमान में विद्यालय प्रबंधन द्वारा किसी भी प्रकार के अवकाश (Holiday) की घोषणा नहीं की गई है। सभी कक्षाएं नियमित समय सारिणी अनुसार संचालित होंगी।\n\n• **English:** **The school is OPEN!** No holiday notice is currently in effect. All classes and academic schedules will function normally.`;
      }
    }

    // 3. Admissions & Enrollment Question (Ask AI core capability)
    const isAdmissionsQuestion =
      lower.includes('admission') ||
      lower.includes('enroll') ||
      lower.includes('enrolment') ||
      lower.includes('admissions') ||
      lower.includes('apply') ||
      lower.includes('entry') ||
      lower.includes('fee') ||
      lower.includes('fees') ||
      lower.includes('scholarship') ||
      lower.includes('daakhila') ||
      lower.includes('dakhila') ||
      lower.includes('प्रवेश') ||
      lower.includes('दाखिला') ||
      lower.includes('anmeldung');

    if (isAdmissionsQuestion) {
      if (lang === 'Deutsch') {
        return `🎓 **Aufnahme & Anmeldung an der NJS Public School (Admissions):**\n\n• **Klassenstufen:** Aufnahme für Pre-K bis Klasse 12 geöffnet.\n• **Voraussetzungen:** Geburtsurkunde, bisherige Zeugnisse, Übertragungsbescheinigung (TC) und 4 Passfotos.\n• **Stipendien:** Leistungsstipendien für Sportler (insb. 400m-Laufbahn) und akademische Spitzenleistungen.\n• **Ticket einreichen:** Klicken Sie auf **"Submit Parent Inquiry Ticket"**, um direkt eine Anfrage an unser Schulbüro zu senden!`;
      }
      return `🎓 **NJS Public School Admissions & Enrollment (24/7 Virtual Desk):**\n\n• **Available Grades:** Admissions are open from **Pre-Kindergarten to Grade 12** on a rolling basis.\n• **Eligibility:** Pre-K (Age 3+), Grade 1 (Age 6+).\n• **Documentation Required:**\n  1. Original Birth Certificate\n  2. Transfer Certificate (TC) & Previous Year Report Cards\n  3. 4 Passport-sized photographs of student & parents\n  4. Proof of Residence & ID Proof\n• **Scholarships:** Merit scholarships up to 50% tuition reduction for athletic achievers (400m track) and academic rankers.\n• **Next Step:** Click the **"📝 Submit Parent Inquiry"** button to register a priority inquiry ticket or request a campus tour!`;
    }

    // 4. Timings & Daily Routine
    const isTimingsQuestion =
      lower.includes('timing') ||
      lower.includes('time') ||
      lower.includes('hours') ||
      lower.includes('schedule') ||
      lower.includes('samay') ||
      lower.includes('समय') ||
      lower.includes('öffnungszeiten');

    if (isTimingsQuestion) {
      return `⏰ **NJS Public School Campus Timings & Daily Schedule:**\n\n• **Summer Timings:** 7:45 AM – 1:45 PM\n• **Winter Timings:** 8:30 AM – 2:30 PM\n• **Working Days:** Monday to Saturday (2nd & 4th Saturdays are co-curricular development days)\n• **Office & Admissions Desk:** 8:00 AM – 4:00 PM (Monday to Saturday)`;
    }

    // 5. Transportation & Bus Routes
    const isTransportQuestion =
      lower.includes('bus') ||
      lower.includes('transport') ||
      lower.includes('pickup') ||
      lower.includes('van') ||
      lower.includes('route') ||
      lower.includes('vahan');

    if (isTransportQuestion) {
      return `🚌 **Safe Transportation & GPS Bus Fleet:**\n\n• **Coverage:** Dedicated bus routes covering all major city sectors and surrounding regions.\n• **Safety Standards:** All buses equipped with GPS live tracking, speed governors (<40 km/h), emergency first-aid, and trained female attendants onboard.\n• **Inquiries:** Submit an inquiry ticket with your pickup location for exact route timing.`;
    }

    // 6. Cafeteria & Nutrition
    const isLunchQuestion =
      lower.includes('lunch') ||
      lower.includes('food') ||
      lower.includes('cafeteria') ||
      lower.includes('canteen') ||
      lower.includes('khana') ||
      lower.includes('diet') ||
      lower.includes('mittagessen');

    if (isLunchQuestion) {
      return `🍽️ **NJS School Nutrition & Cafeteria:**\n\n• 100% fresh, hygienic vegetarian meals cooked daily in our modern automated kitchen.\n• Dietitian-planned menu with balanced proteins, grains, seasonal fruits, and RO drinking water.\n• Strict food safety and allergy-safe preparation protocols.`;
    }

    // 7. Password question
    if (lower.includes('password') || lower.includes('passcode') || lower.includes('admin key')) {
      return `🔒 **Admin Notification Security:**\n\nएडमिन नोटिफिकेशन पासवर्ड निजी और सुरक्षित (Private & Confidential) है। केवल विद्यालय प्रबंधन द्वारा ही आधिकारिक नोटिफिकेशन प्रकाशित किए जा सकते हैं।`;
    }

    // 8. Hastinapur trip
    if (lower.includes('hastinapur') || lower.includes('tour') || lower.includes('trip') || lower.includes('excursion') || lower.includes('ausflug')) {
      return `🚌 **हस्तिनापुर शैक्षिक भ्रमण (Hastinapur Educational Excursion):**\n\nNJS Public School द्वारा विद्यार्थियों के लिए ऐतिहासिक हस्तिनापुर (कुरु साम्राज्य के अवशेष व प्रसिद्ध जैन दिगंबर/श्वेतांबर तीर्थ) का शैक्षिक भ्रमण आयोजित किया जा रहा है।\n• 24/7 समर्पित शिक्षकों का मार्गदर्शन\n• सुरक्षित प्रमाणित लक्जरी बसें\n• पौष्टिक बुफे भोजन व प्राथमिक चिकित्सा व्यवस्था।`;
    }

    // 9. Sports / 400m track
    if (lower.includes('track') || lower.includes('sports') || lower.includes('race') || lower.includes('khel') || lower.includes('athletic')) {
      return `🏃 **400m Olympic-Grade Athletic Track & Sports:**\n\nNJS Public School परिसर में अंतर्राष्ट्रीय मानकों का 400-मीटर ऑल-वेदर एथलेटिक्स ट्रैक, बास्केटबॉल कोर्ट, व फुटबॉल टर्फ मैदान उपलब्ध है जहाँ छात्रों को विशेष खेल प्रशिक्षण दिया जाता है।`;
    }

    // 10. YouTube Channel
    if (lower.includes('youtube') || lower.includes('channel') || lower.includes('video') || lower.includes('anant')) {
      return `▶️ **NJS Official YouTube Channel: @anantgahlaut**\n\nस्कूल के सभी वार्षिक उत्सव (Annual Functions), 400m स्पोर्ट्स रेस, सांस्कृतिक कार्यक्रम और छात्र प्रस्तुतियां आधिकारिक यूट्यूब चैनल पर उपलब्ध हैं:\n👉 https://www.youtube.com/@anantgahlaut`;
    }

    // 11. General greeting / Default
    if (lang === 'Deutsch') {
      return `Willkommen bei **Ask AI** der NJS Public School! Wir beantworten Ihre Fragen 24/7.\n\n• **Neueste Mitteilung:** Fragen Sie *"Gibt es neue Mitteilungen?"*\n• **Schulbetrieb / Feiertag:** Fragen Sie *"Ist die Schule geöffnet?"*\n• **Anmeldung:** Fragen Sie *"Admissions"* oder reichen Sie ein Ticket ein.\n• **YouTube:** @anantgahlaut`;
    }

    return `नमस्ते! मैं NJS Public School का 24/7 **Ask AI** वर्चुअल सहायक हूँ।\n\n• **नया नोटिस / मैसेज:** पूछें *"क्या कोई नया नोटिस आया है?"* या *"New message?"* (एडमिन द्वारा जोड़ा गया नवीनतम नोटिफिकेशन प्राप्त होगा)\n• **छुट्टी जांचें:** पूछें *"Kal holiday hai kya?"* (यदि छुट्टी का नोटिस है तो छुट्टी बताएगा, अन्यथा कहेगा "School is OPEN!")\n• **प्रवेश व दाखिला:** पूछें *"Admissions process"* या 'Submit Inquiry Ticket' से दाखिला टिकट बनाएं।\n• **यूट्यूब चैनल:** @anantgahlaut`;
  };

  // Handle Embedded Quick Query
  const handleRunQuickQuery = async (customText?: string) => {
    const textToRun = (customText ?? quickQuery).trim();
    if (!textToRun) return;

    setIsQuickThinking(true);
    setQuickAnswer(null);

    // If it's the deterministic holiday or notice question, answer directly
    const lower = textToRun.toLowerCase();
    const isDeterministic =
      lower.includes('holiday') ||
      lower.includes('chutti') ||
      lower.includes('chhutti') ||
      lower.includes('open') ||
      lower.includes('khula') ||
      lower.includes('notice') ||
      lower.includes('मैसेज') ||
      lower.includes('message') ||
      lower.includes('नोटिस') ||
      lower.includes('password');

    if (isDeterministic) {
      setTimeout(() => {
        const answer = getAiAnswer(textToRun, selectedLanguage);
        setQuickAnswer(answer);
        setIsQuickThinking(false);
      }, 300);
      return;
    }

    // Try server API first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToRun,
          language: selectedLanguage,
          activeNotices: notices,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply && !data.useFallback) {
          setQuickAnswer(data.reply);
          setIsQuickThinking(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    const answer = getAiAnswer(textToRun, selectedLanguage);
    setQuickAnswer(answer);
    setIsQuickThinking(false);
  };

  // Handle Chat message submit
  const handleSendChatMessage = async (textToSend?: string) => {
    const text = (textToSend ?? chatInput).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsAiThinking(true);

    const lower = text.toLowerCase();
    const isDeterministic =
      lower.includes('holiday') ||
      lower.includes('chutti') ||
      lower.includes('chhutti') ||
      lower.includes('open') ||
      lower.includes('khula') ||
      lower.includes('notice') ||
      lower.includes('मैसेज') ||
      lower.includes('message') ||
      lower.includes('नोटिस') ||
      lower.includes('password');

    let replyText = '';

    if (!isDeterministic) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            language: selectedLanguage,
            activeNotices: notices,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply && !data.useFallback) {
            replyText = data.reply;
          }
        }
      } catch {
        // Fallback
      }
    }

    if (!replyText) {
      replyText = getAiAnswer(text, selectedLanguage);
    }

    setIsAiThinking(false);
    const botMsg: ChatMessage = {
      id: 'bot-' + Date.now(),
      sender: 'bot',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, botMsg]);
  };

  // Admin Password validator for "gahlaut"
  const isValidAdminPassword = (pwd: string) => {
    return pwd.trim().toLowerCase() === 'gahlaut';
  };

  // Handle Save Notice / Notification with Admin Password Verification "gahlaut"
  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    const trimmedTitle = modalTitle.trim();
    const trimmedContent = modalContent.trim();

    if (!trimmedTitle || !trimmedContent) {
      setPasswordError('कृपया नोटिफिकेशन का शीर्षक और विवरण दोनों भरें। (Title & details are required)');
      return;
    }

    // ADMIN PASSWORD CHECK: Must match private admin password
    if (!isValidAdminPassword(modalPassword)) {
      setPasswordError('❌ गलत पासवर्ड! कृपया सही एडमिन पासवर्ड दर्ज करें। (Incorrect password! Please enter the private admin password)');
      return;
    }

    // Success! Create new notice
    const newNotice: SchoolNotice = {
      id: 'notice-' + Date.now(),
      title: trimmedTitle,
      content: trimmedContent,
      category: modalCategory,
      date: modalDate.trim() || 'Today',
      createdAt: Date.now(),
    };

    setNotices((prev) => [newNotice, ...prev]);

    // Reset fields
    setModalTitle('');
    setModalContent('');
    setModalPassword('');
    setPasswordError('');
    setIsModalOpen(false);

    // Show toast
    setSuccessToast(`नोटिफिकेशन सफलतापूर्वक प्रकाशित हुआ (एडमिन पासवर्ड सत्यापित): "${trimmedTitle}"`);
    setTimeout(() => setSuccessToast(''), 6000);

    // Also inject notification message in chat
    setChatMessages((prev) => [
      ...prev,
      {
        id: 'sys-' + Date.now(),
        sender: 'bot',
        text: `✅ **नया नोटिफिकेशन / नोटिस सफलतापूर्वक जारी हुआ (एडमिन पासवर्ड सत्यापित):**\n**${trimmedTitle}** (${newNotice.date})\n*अब AI सहायक इस नोटिफिकेशन के आधार पर उत्तर देगा। ${modalCategory === 'holiday' ? '⚠️ छुट्टी की पुष्टि सक्रिय हो गई है।' : ''}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Handle Delete Notice (with password confirmation)
  const handleDeleteNotice = (id: string, title: string) => {
    const inputPwd = window.prompt(`नोटिफिकेशन "${title}" हटाने के लिए एडमिन पासवर्ड दर्ज करें:\n(Enter admin password to delete):`);
    if (inputPwd === null) return;
    if (!isValidAdminPassword(inputPwd)) {
      window.alert('❌ गलत पासवर्ड! केवल मान्य एडमिन पासवर्ड के साथ ही नोटिफिकेशन हटाया जा सकता है।');
      return;
    }

    setNotices((prev) => prev.filter((n) => n.id !== id));
    setSuccessToast(`नोटिफिकेशन हटाया गया: "${title}"`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Handle Clear All Notices (with password confirmation)
  const handleClearAllNotices = () => {
    const inputPwd = window.prompt('सभी स्कूल नोटिफिकेशन व सर्कुलर हटाने के लिए एडमिन पासवर्ड दर्ज करें:\n(Enter admin password to clear all notices):');
    if (inputPwd === null) return;
    if (!isValidAdminPassword(inputPwd)) {
      window.alert('❌ गलत पासवर्ड! केवल मान्य एडमिन पासवर्ड के साथ ही सभी नोटिफिकेशन हटाए जा सकते हैं।');
      return;
    }

    setNotices([]);
    try {
      localStorage.setItem('njs_school_notices_v4', JSON.stringify([]));
    } catch {
      // ignore
    }
    setSuccessToast('सभी स्कूल नोटिफिकेशन व सर्कुलर सफलतापूर्वक हटा दिए गए हैं (स्कूल खुला है)।');
    setTimeout(() => setSuccessToast(''), 5000);
  };

  const filteredNotices = notices.filter((n) => (activeFilter === 'all' ? true : n.category === activeFilter));

  return (
    <div className="min-h-screen bg-slate-900/5 text-slate-800 flex flex-col font-['Poppins',sans-serif]">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-5 right-5 z-[9999] bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast('')} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#090d16] text-slate-300 text-xs px-4 py-2 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
              <School className="w-3.5 h-3.5" /> NJS Public School
            </span>
            <span className="text-slate-600">•</span>
            <span>Creator of Knowledge</span>
            <span className="text-slate-600">•</span>
            <a href="mailto:seemaanantom@gmail.com" className="text-sky-400 hover:underline">
              seemaanantom@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 text-[11px] bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Admin Protected</span>
            </div>

            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full hover:bg-emerald-500/30 transition border border-emerald-500/40 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI सहायता (Holo Mode)</span>
            </button>

            <a
              href="https://www.youtube.com/@anantgahlaut"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded-full transition border border-red-500/30 font-medium"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>@anantgahlaut</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION HEADER */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          {/* Logo Area */}
          <a href="#" className="flex items-center gap-3 group">
            <img
              src="https://seemaanantom-eng.github.io/NJSpublicSchool/apple.jpg"
              alt="NJS Public School Logo"
              className="w-11 h-11 rounded-xl object-cover shadow-md group-hover:scale-105 transition"
            />
            <div>
              <div className="font-['Playfair_Display',serif] text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                NJS PUBLIC SCHOOL
              </div>
              <div className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase mt-1">
                Creator of Knowledge
              </div>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-700">
            <a href="#about" className="hover:text-emerald-600 transition">About</a>
            <a href="#notices" className="hover:text-emerald-600 transition flex items-center gap-1">
              <span>Notifications & Notices</span>
              {notices.length > 0 && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {notices.length}
                </span>
              )}
            </a>
            <a href="#sports" className="hover:text-emerald-600 transition">Sports Track</a>
            <a href="#hastinapur" className="hover:text-emerald-600 transition">Excursion</a>
            <a
              href="https://www.youtube.com/@anantgahlaut"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 transition flex items-center gap-1"
            >
              <Youtube className="w-4 h-4" /> YouTube
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* ADD NOTIFICATION / NOTICE PROTECTED BUTTON */}
            <button
              onClick={() => {
                setPasswordError('');
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-sm hover:shadow transition flex items-center gap-1.5"
              title="Add Notification (Admin Only)"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Notification</span>
              <span className="sm:hidden text-xs">Add</span>
            </button>

            {/* ASK AI ASSISTANT BUTTON */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5 sm:gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden xs:inline">Ask AI</span>
            </button>

            {/* MOBILE HAMBURGER TOGGLE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition active:scale-95"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-150">
            {/* School Status pill in Mobile Menu */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Status:</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                School is OPEN (स्कूल खुला है)
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium px-1 flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-600">
                <Lock className="w-3.5 h-3.5 text-indigo-600" /> Admin Protected
              </span>
              <span className="text-emerald-600 font-semibold">AI Assistant Ready</span>
            </div>

            <nav className="flex flex-col space-y-1 text-sm font-semibold text-slate-700 pt-1">
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 transition"
              >
                <Home className="w-4 h-4 text-emerald-600" />
                <span>About NJS School</span>
              </a>

              <a
                href="#notices"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  <span>Circulars & Notifications</span>
                </div>
                {notices.length > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {notices.length}
                  </span>
                )}
              </a>

              <a
                href="#sports"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 transition"
              >
                <Trophy className="w-4 h-4 text-indigo-500" />
                <span>400m Olympic Sports Track</span>
              </a>

              <a
                href="#hastinapur"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 transition"
              >
                <Bus className="w-4 h-4 text-emerald-500" />
                <span>Hastinapur Educational Tour</span>
              </a>

              <a
                href="https://www.youtube.com/@anantgahlaut"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-red-600 hover:bg-red-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Youtube className="w-4 h-4" />
                  <span>YouTube @anantgahlaut</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAiDrawerOpen(true);
                }}
                className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition font-bold"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open School AI Assistant (पूछें)</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setPasswordError('');
                  setIsModalOpen(true);
                }}
                className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition font-bold"
              >
                <KeyRound className="w-4 h-4" />
                <span>Add Notification (Admin Only)</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="about" className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white py-16 sm:py-24 px-4 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Excellence in Education • AI Powered Campus</span>
          </div>

          <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            NJS Public School
          </h1>

          <p className="text-slate-300 text-base sm:text-xl font-light max-w-2xl mx-auto mb-8 leading-relaxed">
            Nurturing young minds through holistic academics, 400m Olympic-standard athletics, historical excursions to Hastinapur, and real-time AI school assistance.
          </p>

          {/* Quick status pill */}
          <div className="mb-8 inline-flex items-center gap-3 bg-slate-800/80 backdrop-blur border border-slate-700 px-5 py-2.5 rounded-2xl shadow-inner text-sm">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeHolidayNotice ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${activeHolidayNotice ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            </span>
            <span className="text-slate-200">
              Current School Status: <strong className={activeHolidayNotice ? 'text-amber-300' : 'text-emerald-400'}>
                {activeHolidayNotice ? 'Holiday / Leave Declared' : 'School is OPEN (स्कूल खुला है)'}
              </strong>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-3.5">
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Open AI Assistant (पूछें)</span>
            </button>

            <button
              onClick={() => {
                setPasswordError('');
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg shadow-indigo-600/20 flex items-center gap-2 border border-indigo-400/30"
            >
              <KeyRound className="w-5 h-5" />
              <span>Add Notification (Admin Only)</span>
            </button>

            <a
              href="#notices"
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-full transition border border-white/20 flex items-center gap-2"
            >
              <Bell className="w-5 h-5" />
              <span>Active Notices ({notices.length})</span>
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 pt-6 pb-28 sm:py-12 flex-1 w-full space-y-8 sm:space-y-12">
        {/* 1. EMBEDDED AI QUICK ASSISTANT BOX */}
        <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> Real-time Bilingual Assistant
              </div>
              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-white">
                School AI Hub (हिंदी / Hinglish / English)
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                छुट्टी, परीक्षा, या नोटिस की तुरंत पुष्टि करें। कोई छुट्टी न होने पर AI कहेगा: School is OPEN!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/40 font-medium">
                ⚡ Gemini 3.8 Flash Engine
              </span>
              <button
                onClick={() => {
                  setPasswordError('');
                  setIsModalOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Notification Manager ("gahlaut")</span>
              </button>
            </div>
          </div>

          {/* Quick Input Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunQuickQuery()}
                placeholder="उदा. 'Kal holiday hai kya?', 'Is school open tomorrow?', 'Notice details'..."
                className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition pr-10"
              />
              {quickQuery && (
                <button
                  onClick={() => {
                    setQuickQuery('');
                    setQuickAnswer(null);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleRunQuickQuery()}
              disabled={isQuickThinking || !quickQuery.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold px-6 py-3.5 rounded-2xl transition flex items-center justify-center gap-2 flex-shrink-0"
            >
              {isQuickThinking ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI (उत्तर पाएं)</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Query Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => {
                setQuickQuery('Kal holiday hai kya?');
                handleRunQuickQuery('Kal holiday hai kya?');
              }}
              className="bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/50 text-slate-200 px-3.5 py-1.5 rounded-xl border border-white/10 transition"
            >
              📅 "Kal holiday hai kya?"
            </button>
            <button
              onClick={() => {
                setQuickQuery('Is school open tomorrow?');
                handleRunQuickQuery('Is school open tomorrow?');
              }}
              className="bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/50 text-slate-200 px-3.5 py-1.5 rounded-xl border border-white/10 transition"
            >
              🏫 "Is school open tomorrow?"
            </button>
            <button
              onClick={() => {
                setPasswordError('');
                setIsModalOpen(true);
              }}
              className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3.5 py-1.5 rounded-xl border border-indigo-500/40 transition font-medium flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>➕ "Add Notification (Admin)"</span>
            </button>
            <button
              onClick={() => {
                setQuickQuery('क्या कोई नया नोटिस आया है?');
                handleRunQuickQuery('क्या कोई नया नोटिस आया है?');
              }}
              className="bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/50 text-slate-200 px-3.5 py-1.5 rounded-xl border border-white/10 transition"
            >
              📢 "क्या कोई नया नोटिस आया है?"
            </button>
            <button
              onClick={() => {
                setQuickQuery('New message?');
                handleRunQuickQuery('New message?');
              }}
              className="bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/50 text-slate-200 px-3.5 py-1.5 rounded-xl border border-white/10 transition"
            >
              💬 "New message?"
            </button>
            <button
              onClick={() => {
                setQuickQuery('Hastinapur excursion trip details');
                handleRunQuickQuery('Hastinapur excursion trip details');
              }}
              className="bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/50 text-slate-200 px-3.5 py-1.5 rounded-xl border border-white/10 transition"
            >
              🚌 "Hastinapur trip details"
            </button>
          </div>

          {/* Quick AI Response Display */}
          {quickAnswer && (
            <div className="mt-5 p-5 bg-slate-950/90 rounded-2xl border border-emerald-500/40 text-slate-200 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Verified Response
                </span>
                <span className="text-slate-500 text-xs">Based on active notices</span>
              </div>
              <div className="whitespace-pre-line">{quickAnswer}</div>
            </div>
          )}
        </section>

        {/* 2. YOUTUBE CHANNEL SPOTLIGHT BANNER */}
        <section className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 rounded-3xl p-6 sm:p-8 text-white border border-red-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 flex-shrink-0">
              <Youtube className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
                Official YouTube Broadcasts
              </div>
              <h3 className="font-['Playfair_Display',serif] text-2xl font-bold">
                Channel @anantgahlaut
              </h3>
              <p className="text-slate-300 text-sm mt-1">
                वार्षिक उत्सव, 400m स्पोर्ट्स रेस, सांस्कृतिक कार्यक्रम व छात्र व्याख्यान देखें।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.youtube.com/@anantgahlaut"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition shadow-lg shadow-red-600/30 flex items-center gap-2 text-sm"
            >
              <Youtube className="w-5 h-5" />
              <span>Subscribe @anantgahlaut</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* 3. ACTIVE NOTICES BOARD (WITH PASSWORD PROTECTED ADD FEATURE) */}
        <section id="notices" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Bell className="w-4 h-4" /> Official Notice Board
              </div>
              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-extrabold text-slate-900">
                School Circulars & Notifications
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Verified notices issued by NJS Public School Administration
              </p>
            </div>

            {/* Notice Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* PRIMARY PROMPT REQUIREMENT: Add Notification with admin password "gahlaut" */}
              <button
                onClick={() => {
                  setPasswordError('');
                  setIsModalOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Notification by Admin</span>
                <span className="bg-indigo-800 text-xs px-2 py-0.5 rounded-full font-mono text-indigo-200">
                  "gahlaut"
                </span>
              </button>

              <button
                onClick={handleClearAllNotices}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold px-3 py-2.5 rounded-xl transition text-sm flex items-center gap-1.5"
                title="Clear all circulars and notifications (Password: gahlaut)"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All (सभी हटाएं)</span>
              </button>

              <button
                onClick={() => {
                  setIsAiDrawerOpen(true);
                  handleSendChatMessage('Kal holiday hai kya?');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm flex items-center gap-2"
              >
                <School className="w-4 h-4 text-emerald-400" />
                <span>Holiday Status</span>
              </button>
            </div>
          </div>

          {/* Filter Pills & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {(['all', 'holiday', 'exam', 'event', 'general'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition capitalize ${
                    activeFilter === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all'
                    ? `All (${notices.length})`
                    : cat === 'holiday'
                    ? 'Holiday / छुट्टी'
                    : cat === 'exam'
                    ? 'Exams'
                    : cat === 'event'
                    ? 'Events & Sports'
                    : 'General'}
                </button>
              ))}
            </div>

            {/* Current admin protected badge */}
            <div className="text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Protected</span>
            </div>
          </div>

          {/* Notices Grid / List */}
          <div className="space-y-3.5 mt-2">
            {filteredNotices.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600 font-medium text-sm">No notices or notifications active at this time.</p>
                <p className="text-emerald-600 text-xs mt-1 font-semibold">School is OPEN! (स्कूल खुला है!)</p>
                <button
                  onClick={() => {
                    setPasswordError('');
                    setIsModalOpen(true);
                  }}
                  className="mt-4 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition inline-flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Notification (Admin Only)</span>
                </button>
              </div>
            ) : (
              filteredNotices.map((notice) => {
                const isHoliday = notice.category === 'holiday';
                const isExam = notice.category === 'exam';
                const isEvent = notice.category === 'event';

                return (
                  <div
                    key={notice.id}
                    className={`p-5 rounded-2xl border transition hover:shadow-sm ${
                      isHoliday
                        ? 'bg-red-50/50 border-red-200 border-l-4 border-l-red-500'
                        : isExam
                        ? 'bg-amber-50/50 border-amber-200 border-l-4 border-l-amber-500'
                        : isEvent
                        ? 'bg-emerald-50/50 border-emerald-200 border-l-4 border-l-emerald-500'
                        : 'bg-slate-50 border-slate-200 border-l-4 border-l-indigo-500'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              isHoliday
                                ? 'bg-red-100 text-red-800'
                                : isExam
                                ? 'bg-amber-100 text-amber-800'
                                : isEvent
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {isHoliday
                              ? 'Holiday / छुट्टी'
                              : isExam
                              ? 'Exam Notice'
                              : isEvent
                              ? 'Event & Sports'
                              : 'General Notice'}
                          </span>

                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{notice.date}</span>
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {notice.title}
                        </h4>
                      </div>

                      {/* Delete button (protected by password prompt) */}
                      <button
                        onClick={() => handleDeleteNotice(notice.id, notice.title)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition self-start flex-shrink-0"
                        title="Delete Notice (Admin password required)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-slate-700 text-sm mt-2 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 4. PILLARS OF NJS EDUCATION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div id="hastinapur" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:-translate-y-1 transition duration-200 border-t-4 border-t-emerald-500">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Bus className="w-6 h-6" />
            </div>
            <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-slate-900 mb-2">
              Hastinapur Excursion
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Curated educational trips to historic Hastinapur antiquities (Kuru Empire remnants & sacred Jain temples) with 24/7 faculty supervision and buffet meals.
            </p>
          </div>

          <div id="sports" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:-translate-y-1 transition duration-200 border-t-4 border-t-indigo-500">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-slate-900 mb-2">
              400m Olympic Track
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Full-sized athletics facilities including 400-meter all-weather track, basketball courts, and FIFA-standard turf for athletics trials and championships.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:-translate-y-1 transition duration-200 border-t-4 border-t-amber-500">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Palette className="w-6 h-6" />
            </div>
            <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-slate-900 mb-2">
              Clay Sculpting & Pottery
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tactile ceramic and pottery workshops using terracotta and stoneware clay for creative fine arts expression and cultural heritage connection.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 pt-10 pb-28 sm:pb-12 px-4 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <div className="font-['Playfair_Display',serif] text-lg font-bold text-white">
              NJS PUBLIC SCHOOL
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Official Portal & AI Assistant • Creator of Knowledge
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
            <a
              href="https://seemaanantom-eng.github.io/NJSpublicSchool/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>seemaanantom-eng.github.io/NJSpublicSchool</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://www.youtube.com/@anantgahlaut"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:underline flex items-center gap-1"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>@anantgahlaut</span>
            </a>
            <span>•</span>
            <a
              href="/assets/aistudio/NJS_Public_School_AI__2__330979ae.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              Classic HTML View
            </a>
          </div>

          <div className="text-xs text-slate-400">
            &copy; 2026 NJS Public School. All rights reserved.
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR (Sticky for quick access on mobile phones) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex justify-around items-center shadow-lg safe-area-pb"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-emerald-600 text-[10px] font-semibold py-1 px-2 transition"
        >
          <Home className="w-5 h-5 text-slate-600" />
          <span>Home</span>
        </a>

        <a
          href="#notices"
          className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-indigo-600 text-[10px] font-semibold py-1 px-2 relative transition"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          <span>Notices</span>
          {notices.length > 0 && (
            <span className="absolute top-0.5 right-1 bg-emerald-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {notices.length}
            </span>
          )}
        </a>

        {/* Center Prominent Ask AI Button */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="-mt-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3 rounded-full shadow-lg shadow-emerald-500/30 border-2 border-white flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition"
          title="Open AI School Assistant"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
        </button>

        <button
          onClick={() => {
            setPasswordError('');
            setIsModalOpen(true);
          }}
          className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-indigo-600 text-[10px] font-semibold py-1 px-2 transition"
        >
          <KeyRound className="w-5 h-5 text-indigo-600" />
          <span>Add Notice</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-emerald-600 text-[10px] font-semibold py-1 px-2 transition"
        >
          <Menu className="w-5 h-5 text-slate-600" />
          <span>Menu</span>
        </button>
      </nav>

      {/* FLOATING ACTION BUTTON (AI FAB) */}
      <button
        onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition z-40 border-2 border-white/80"
        title="NJS School AI Assistant"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
          AI
        </span>
      </button>

      {/* FLOATING AI CHAT DRAWER (Inspired by 24/7 International School AI Program) */}
      {isAiDrawerOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-24 sm:right-6 w-full sm:w-[440px] h-[88vh] sm:h-[600px] max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
          {/* Mobile Sheet Pull Bar */}
          <div className="sm:hidden pt-2.5 pb-1 bg-slate-900 flex justify-center">
            <div className="w-12 h-1 bg-slate-600 rounded-full" />
          </div>

          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-emerald-300">
                    Ask AI
                  </h4>
                  <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    24/7 Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Virtual School Assistant • NJS Public School
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Multilingual Switcher Dropdown */}
              <div className="relative inline-flex items-center bg-slate-800/90 border border-slate-700 rounded-xl px-2 py-1 text-xs text-slate-200">
                <Languages className="w-3.5 h-3.5 text-emerald-400 mr-1.5 flex-shrink-0" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="bg-transparent text-[11px] font-semibold text-slate-200 focus:outline-none cursor-pointer"
                  title="Switch Language (Ask AI Multilingual Program)"
                >
                  <option value="English" className="text-slate-900 bg-white">English</option>
                  <option value="Hindi" className="text-slate-900 bg-white">हिन्दी (Hindi)</option>
                  <option value="Hinglish" className="text-slate-900 bg-white">Hinglish</option>
                  <option value="Deutsch" className="text-slate-900 bg-white">Deutsch (German)</option>
                  <option value="Français" className="text-slate-900 bg-white">Français (French)</option>
                  <option value="Español" className="text-slate-900 bg-white">Español (Spanish)</option>
                </select>
              </div>

              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                title="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Context & Ticket Quick Launch Bar */}
          <div className="bg-slate-100 px-3.5 py-1.5 text-[11px] text-slate-600 flex items-center justify-between border-b border-slate-200">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeHolidayNotice ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <strong>{activeHolidayNotice ? 'Holiday Declared' : 'School is OPEN'}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                title="Submit Parent Inquiry / Request Callback"
              >
                <FileText className="w-3 h-3" />
                <span>Inquiry Ticket</span>
              </button>

              <button
                onClick={() => {
                  setPasswordError('');
                  setIsModalOpen(true);
                }}
                className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                title="Add Official Notice (Admin Only)"
              >
                <KeyRound className="w-3 h-3" />
                <span>Notice</span>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div ref={chatScrollRef} className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-slate-50 text-sm">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line relative group ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-sm'
                  }`}
                >
                  {msg.text}

                  {/* Read aloud TTS button for bot messages */}
                  {msg.sender === 'bot' && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                          speakingId === msg.id
                            ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                        title="Listen to response (Text-to-Speech)"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3 h-3 text-emerald-600" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>

                      <span className="text-[10px] text-slate-400">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <span className="text-[10px] text-slate-400 mt-0.5 px-1">
                    {msg.timestamp}
                  </span>
                )}
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center gap-2 text-slate-500 text-xs bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                <span className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>Ask AI is checking school records...</span>
              </div>
            )}
          </div>

          {/* Ask AI Topic Action Cards (FIS Ask AI Framework) */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Quick Topics & Inquiries</span>
              <span className="text-emerald-700 font-semibold">{selectedLanguage}</span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <button
                onClick={() => handleSendChatMessage('क्या कोई नया नोटिस आया है?')}
                className="whitespace-nowrap bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-2.5 py-1 rounded-full border border-emerald-300 transition flex items-center gap-1"
              >
                <span>📢 क्या कोई नया नोटिस आया है?</span>
              </button>

              <button
                onClick={() => handleSendChatMessage('New message?')}
                className="whitespace-nowrap bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-2.5 py-1 rounded-full border border-emerald-300 transition"
              >
                💬 New message?
              </button>

              <button
                onClick={() => handleSendChatMessage('How do I apply for admissions at NJS Public School?')}
                className="whitespace-nowrap bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition font-medium flex items-center gap-1"
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admissions FAQ</span>
              </button>

              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="whitespace-nowrap bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200 transition flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Submit Inquiry Ticket</span>
              </button>

              <button
                onClick={() => handleSendChatMessage('Is school open tomorrow?')}
                className="whitespace-nowrap bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition"
              >
                Is school open?
              </button>

              <button
                onClick={() => handleSendChatMessage('Tell me about the 400m Olympic Sports Track and athletics facilities')}
                className="whitespace-nowrap bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition"
              >
                🏃 400m Track
              </button>

              <button
                onClick={() => handleSendChatMessage('Tell me about the Hastinapur educational tour')}
                className="whitespace-nowrap bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition"
              >
                🚌 Hastinapur Tour
              </button>

              <button
                onClick={() => handleSendChatMessage('What are the school timings and daily schedule?')}
                className="whitespace-nowrap bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition"
              >
                ⏰ Timings
              </button>
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 p-2 rounded-xl transition flex-shrink-0"
              title="Open Parent Inquiry & Callback Desk"
            >
              <FileText className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder={`Ask AI anything in ${selectedLanguage} (e.g. 'Admissions', 'Kal holiday hai?')...`}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={() => handleSendChatMessage()}
              disabled={!chatInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white w-9 h-9 rounded-xl flex items-center justify-center transition flex-shrink-0 shadow-md shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PARENT INQUIRY & CALLBACK TICKET MODAL (24/7 Ask AI Program Capability)   */}
      {/* ========================================================================= */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-[9995] bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col overflow-y-auto">
            {/* Mobile Drag Indicator */}
            <div className="sm:hidden flex justify-center pb-2">
              <div className="w-12 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-slate-900">
                    Ask AI • Parent Inquiry Desk
                  </h3>
                  <p className="text-xs text-slate-500">
                    24/7 Virtual Admissions & Parent Inquiry Ticket System
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle Active Tickets View */}
            <div className="mt-3 flex items-center justify-between bg-slate-50 p-2 rounded-xl text-xs border border-slate-200">
              <span className="text-slate-600 font-medium">
                Registered Inquiries: <strong>{submittedTickets.length}</strong>
              </span>
              {submittedTickets.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowInquiryHistory(!showInquiryHistory)}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  {showInquiryHistory ? 'Back to Form' : 'View My Tickets'}
                </button>
              )}
            </div>

            {showInquiryHistory && submittedTickets.length > 0 ? (
              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {submittedTickets.map((t) => (
                  <div key={t.ticketId} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span className="font-mono text-emerald-700">{t.ticketId}</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-slate-700">
                      <strong>Student:</strong> {t.studentName} ({t.targetGrade}) • <strong>Topic:</strong> {t.topic}
                    </div>
                    <div className="text-slate-500 text-[11px] leading-relaxed">
                      "{t.message}"
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Submitted: {t.timestamp} • Contact: {t.contact}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setShowInquiryHistory(false)}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 rounded-xl transition text-xs"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryParentName}
                    onChange={(e) => setInquiryParentName(e.target.value)}
                    placeholder="e.g. Ramesh Gahlaut / Mr. Sharma"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Student Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={inquiryStudentName}
                      onChange={(e) => setInquiryStudentName(e.target.value)}
                      placeholder="e.g. Aarav"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Target Grade / Class
                    </label>
                    <select
                      value={inquiryGrade}
                      onChange={(e) => setInquiryGrade(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="Pre-Kindergarten">Pre-Kindergarten (Age 3+)</option>
                      <option value="Kindergarten">Kindergarten (Age 4-5)</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2 to 5">Primary (Grades 2 to 5)</option>
                      <option value="Grade 6 to 8">Middle School (Grades 6 to 8)</option>
                      <option value="Grade 9 to 10">Secondary (Grades 9 & 10)</option>
                      <option value="Grade 11 to 12">Senior Secondary (11 & 12)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Phone / Email *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryContact}
                      onChange={(e) => setInquiryContact(e.target.value)}
                      placeholder="Phone or email address"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={inquiryTopic}
                      onChange={(e) => setInquiryTopic(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="Admissions & Enrollment">Admissions & Enrollment</option>
                      <option value="Campus Tour Request">Campus Tour Request</option>
                      <option value="Athletics & 400m Track">Athletics & 400m Track</option>
                      <option value="Transportation & Bus Routes">Transportation & Bus Routes</option>
                      <option value="Hastinapur Excursion">Hastinapur Excursion</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Question / Inquiry Details *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Describe your inquiry, questions about fee structure, or preferred tour date..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInquiryModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Generate Ticket & Submit</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD NOTIFICATION / NOTICE MODAL - STRICTLY VERIFIES ADMIN PASSWORD "gahlaut" */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9990] bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col overflow-y-auto">
            {/* Mobile Drag Indicator */}
            <div className="sm:hidden flex justify-center pb-2">
              <div className="w-12 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-slate-900">
                    Admin Notification Manager
                  </h3>
                  <p className="text-xs text-slate-500">
                    Admin verification required to post notifications & circulars
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Rule Notice */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>📌 AI Holiday Rule:</strong> यदि आप छुट्टी का नोटिफिकेशन जोड़ेंगे तो AI छुट्टी (Holiday) की पुष्टि करेगा। यदि कोई छुट्टी का नोटिफिकेशन नहीं होगा तो AI स्पष्ट कहेगा कि <b>School is OPEN (स्कूल खुला है)</b>!
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePublishNotice} className="mt-4 space-y-4">
              {/* Notice Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notification Title (शीर्षक) *
                </label>
                <input
                  type="text"
                  required
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="उदा. Urgent Notice: Heavy Rain Alert / Tomorrow School Closed"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category (प्रकार)
                  </label>
                  <select
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                  >
                    <option value="holiday">Holiday / छुट्टी (Leave)</option>
                    <option value="exam">Exam / परीक्षा</option>
                    <option value="event">Event / खेलकूद / टूर</option>
                    <option value="general">General / सामान्य</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Effective Day / Date
                  </label>
                  <input
                    type="text"
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    placeholder="उदा. Tomorrow / कल"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Notice Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notification Details (विवरण) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={modalContent}
                  onChange={(e) => setModalContent(e.target.value)}
                  placeholder="उदा. भारी बारिश के कारण कल स्कूल में अवकाश घोषित किया गया है..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition resize-none"
                />
              </div>

              {/* Admin Password Authentication */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-600" />
                  <span>Admin Password (एडमिन सुरक्षा पासवर्ड) *</span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={modalPassword}
                    onChange={(e) => {
                      setModalPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="Enter private admin password..."
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 pr-10 focus:outline-none transition ${
                      passwordError
                        ? 'border-red-500 bg-red-50/30'
                        : isValidAdminPassword(modalPassword)
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Error Message */}
                {passwordError && (
                  <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}

                {/* Password Success Match Hint */}
                {isValidAdminPassword(modalPassword) && !passwordError && (
                  <p className="text-emerald-600 text-xs mt-1.5 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>पासवर्ड सत्यापित (Admin Password Verified)</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition"
                >
                  Cancel (रद्द करें)
                </button>

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Publish Notification (नोटिफिकेशन जारी करें)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
