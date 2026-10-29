'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield, Users } from 'lucide-react';

export default function AboutPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  const team = [
    {
      name: 'Tanishq Soni',
      role: 'Co-founder & CEO',
      bio: 'Championing campus culinary convenience and vendor partnerships.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Akash Singh',
      role: 'CTO & Head of Operations',
      bio: 'Leading real-time kitchen dispatch architecture and software engineering.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Daksh Sharma',
      role: 'Lead Architect & Community',
      bio: 'Designing user-first dining interfaces and AI food discovery algorithms.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black pb-20">
      {/* Hero Header */}
      <section className="bg-black text-white py-16 px-4 text-center border-b border-neutral-800">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-teal-400 font-extrabold uppercase text-xs tracking-wider">
            About Cd: Zaika
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Our Mission & The Zaika Story
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            We place quality and customer satisfaction at the forefront of everything we do,
            delivering seamless experiences with responsive technology and verified kitchen preparation.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Core Narrative matching final about us.html */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
            <h2 className="text-2xl font-black text-black tracking-tight">
              Crafted by Students, for Students
            </h2>
            <p>
              Campus life moves at lightning speed. Between back-to-back lectures, library study marathons,
              and project deadlines, nobody should have to stand in 30-minute chaotic canteen lines just to
              find out their favorite sandwich is sold out.
            </p>
            <p>
              Cd: Zaika was founded to bridge the gap between hungry students and campus kitchens through
              live order queues, transparent dish prep times, and integrated student billing.
            </p>
          </div>

          <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
            <h3 className="font-bold text-base text-black flex items-center space-x-2">
              <Shield className="w-5 h-5 text-teal-600" />
              <span>Our Guiding Principles</span>
            </h3>
            <ul className="space-y-3 text-xs text-neutral-600">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-black">•</span>
                <span><strong>No Fake Timers:</strong> Dynamic preparation estimates scale realistically as orders grow.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-black">•</span>
                <span><strong>Affordable Dining:</strong> Student-first fair pricing with zero hidden commissions.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-black">•</span>
                <span><strong>AI Culinary Assistant:</strong> Instantly find meals that fit your schedule and budget.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Leadership Team matching final about us.html */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-black text-black tracking-tight">Our Leadership Team</h2>
            <p className="text-xs text-neutral-500 mt-1">
              The builders behind the campus food ordering platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden mb-4 border-2 border-black">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                    unoptimized
                  />
                </div>
                <h3 className="font-bold text-base text-neutral-900">{member.name}</h3>
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                  {member.role}
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form matching final about us.html */}
        <section className="bg-neutral-50 rounded-2xl border border-neutral-200 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-black">Contact Us</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Have feedback about a canteen dish, kitchen bug, or catering request? Reach out to us.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-lg text-center space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p className="font-bold text-sm">Message Sent Successfully!</p>
                <p>Our student operations team will respond to your campus email within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanishq Soni"
                    className="w-full border border-neutral-300 rounded-md px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="w-full border border-neutral-300 rounded-md px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Message / Feedback
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you'd love to see improved..."
                    className="w-full border border-neutral-300 rounded-md px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-black hover:bg-neutral-800 text-white font-bold py-3 rounded-md transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

