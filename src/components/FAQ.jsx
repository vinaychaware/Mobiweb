import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'Who can enroll in Mobiweb programs?',
    answer: 'Our programs are open to engineering students from any branch (CSE, IT, ECE, Mechanical, etc.), final-year students seeking placement support, faculty coordinators looking to organize campus programs, and fresh graduates wanting to upskill for the job market. We welcome participants from all technical backgrounds.'
  },
  {
    question: 'Are the programs conducted online or offline?',
    answer: 'We offer both modes. Workshop bootcamps and webinars are available online via live Zoom sessions. Our College Training Programs and Industrial Internships are primarily conducted in hybrid mode — combining campus visits from our expert trainers with hands-on online lab work.'
  },
  {
    question: 'Will I receive a certificate after completion?',
    answer: 'Yes! Every participant receives a digitally verified Certificate of Completion upon successfully finishing the program and submitting the final project. For internship participants, we also provide a formal Letter of Recommendation based on performance evaluation.'
  },
  {
    question: 'How much do the programs cost?',
    answer: 'Webinars and Guest Lectures are completely free to attend. Workshops, Training Programs, and Internships have nominal fees that vary by program duration and technology stack. After enrollment, our coordinator will share the detailed fee structure. We also offer group discounts for college batch enrollments.'
  },
  {
    question: 'Can our college partner with Mobiweb for bulk training?',
    answer: 'Absolutely! We actively partner with engineering colleges across India for our Academic Tie-up Programs. Your institution can schedule our expert instructors to deliver semester-long training or intensive bootcamps directly on campus. The curriculum can be customized to match your department requirements and NAAC/NBA documentation needs. Contact us at contact@mobiwebglobal.com or through the contact form below.'
  },
  {
    question: 'What technologies and stacks do you cover?',
    answer: 'Our current curriculum covers: Full-Stack Web Development (MERN Stack — MongoDB, Express, React, Node.js), Python for AI/ML with hands-on data science projects, Cloud Infrastructure with AWS & Terraform, DevOps with Docker, Kubernetes & CI/CD pipelines, and UI/UX Design fundamentals with Figma and React. New tracks are added every quarter based on industry demand.'
  },
  {
    question: 'Is placement assistance guaranteed?',
    answer: 'We provide comprehensive placement support including resume review, LinkedIn profile optimization, mock technical interviews, and direct referrals to our network of 80+ hiring partner companies. While we cannot guarantee a job offer (no one ethically can), our 95% placement rate among program graduates speaks to our track record.'
  },
];

export default function FAQ({ onOpenEnroll }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-slate-950/30 to-primary-950" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1 text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Got Questions?{' '}
            <span className="gradient-text-cyan-indigo font-extrabold">We've Got Answers.</span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 font-light">
            Everything you need to know before taking the next step.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'border-cyan-500/20' : 'border-slate-800/50 hover:border-slate-700'
              }`}
            >
              <button
                id={`faq-item-${i}`}
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
                aria-expanded={openIndex === i}
              >
                <span className={`font-semibold text-base pr-4 transition-colors duration-200 ${
                  openIndex === i ? 'text-cyan-400' : 'text-white group-hover:text-gray-200'
                }`}>
                  {faq.question}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  openIndex === i
                    ? 'bg-cyan-500/15 text-cyan-400 rotate-180'
                    : 'bg-slate-800/80 text-gray-400 group-hover:bg-slate-700'
                }`}>
                  {openIndex === i
                    ? <Minus className="w-4 h-4" />
                    : <Plus className="w-4 h-4" />
                  }
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="h-px bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-transparent mb-4" />
                      <p className="text-gray-300 text-sm leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 text-center glass-card rounded-2xl p-8 border-slate-800/50">
          <p className="text-gray-300 font-medium mb-2">Still have questions?</p>
          <p className="text-gray-400 text-sm font-light mb-6">
            Reach out to our enrollment coordinators directly — we respond within 2 hours on working days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="faq-enroll-btn"
              onClick={onOpenEnroll}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95"
            >
              Enroll Now
            </button>
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl font-bold text-sm text-gray-300 glass-card border-slate-700 hover:text-white transition-all cursor-pointer hover:border-slate-500"
            >
              Contact Us →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
