"use client";

import { useEffect } from 'react';

export default function MerchMagicWebsite() {
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://widget.tagembed.com/embed.min.js"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://widget.tagembed.com/embed.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const products = [
    {
      title: 'Custom Apparel',
      description:
        'Premium hoodies, t-shirts, uniforms, and workwear manufactured and branded in-house for businesses across the UK.',
    },
    {
      title: 'Corporate Merchandise',
      description:
        'From tote bags to bottles, notebooks, tech accessories, and event giveaways — we source and personalise almost anything.',
    },
    {
      title: 'Printing & Packaging',
      description:
        'High-quality printing solutions with luxury finishes, packaging, labels, and branded promotional materials.',
    },
  ];

  const testimonials = [
    {
      name: 'Aisha Khan',
      company: 'Glow Cosmetics',
      quote:
        'Merch Magic handled our branded packaging and apparel flawlessly. Fast turnaround and amazing quality.',
    },
    {
      name: 'Daniel Carter',
      company: 'Pulse Fitness',
      quote:
        'The hoodies and gym merchandise looked premium. Our members absolutely loved them.',
    },
    {
      name: 'Sarah Williams',
      company: 'North Studio',
      quote:
        'Reliable, creative, and professional. They sourced products we couldn’t find anywhere else.',
    },
  ];

  const heroCards = [
    {
      title: 'Apparel & Clothing',
      description: 'Premium custom clothing for brands and businesses.',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Printing Solutions',
      description: 'High-quality printing with luxury finishes.',
      image:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Promotional Products',
      description: 'Branded products that leave a lasting impression.',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Branding & Packaging',
      description: 'Luxury packaging and branded presentation.',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  const processCards = [
    {
      title: 'Design & Concept',
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Manufacturing',
      image:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Printing & Finishing',
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Packaging & Delivery',
      image:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  const faqs = [
    {
      question: 'Do you have minimum order quantities?',
      answer:
        'We offer flexible order quantities depending on the product and customisation requirements.',
    },
    {
      question: 'Can you source custom products?',
      answer:
        'Yes — we can source and personalise almost any product businesses can use for branding and marketing.',
    },
    {
      question: 'Do you offer UK-wide delivery?',
      answer:
        'Absolutely. We deliver merchandise and apparel projects across the UK.',
    },
    {
      question: 'Can you help with designs?',
      answer:
        'Yes — our team can assist with branding, mockups, artwork preparation, and product concepts.',
    },
  ];

  const clientLogos = [
    {
      name: 'Nova',
      icon: '◈',
    },
    {
      name: 'Pulse',
      icon: '⬢',
    },
    {
      name: 'Elevate',
      icon: '✦',
    },
    {
      name: 'Urban',
      icon: '◆',
    },
    {
      name: 'Vertex',
      icon: '⬡',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.22),transparent_40%)]" />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Merch Magic Logo"
              className="w-12 h-12 object-contain"
            />

            <div>
              <h1 className="font-semibold text-xl tracking-wide">
                Merch Magic
              </h1>
              <p className="text-xs text-white/60">
                Personalised Merchandise UK
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/447892734800"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex bg-purple-600 hover:bg-purple-500 transition px-5 py-3 rounded-full text-sm font-medium shadow-lg shadow-purple-600/30"
          >
            Get a Quote
          </a>
        </div>
      </header>

      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-28 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 border border-purple-500/30 bg-purple-500/10 rounded-full px-4 py-2 text-sm text-purple-300">
            UK Personalised Merchandise Experts
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
              Luxury Branded
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">
                Merchandise
              </span>
              For Modern Businesses
            </h2>

            <p className="text-lg text-white/70 max-w-xl leading-relaxed">
              We help brands stand out with premium custom merchandise,
              apparel manufacturing, packaging, and high-quality printing
              solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/447892734800"
              target="_blank"
              rel="noreferrer"
              className="bg-purple-600 hover:bg-purple-500 transition px-7 py-4 rounded-2xl font-semibold shadow-2xl shadow-purple-600/30 text-center"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />

          <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl shadow-purple-500/10">
            <div className="grid grid-cols-2 gap-5">
              {heroCards.map((card, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-3xl h-56 group border border-white/10"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-4 gap-6">
          {processCards.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-[28px] aspect-[4/5] group border border-white/10"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 py-5 overflow-hidden bg-white/[0.02]">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-10 text-white/70 font-semibold tracking-[0.25em] text-sm uppercase">
          <span>APPAREL</span>
          <span>PRINTING</span>
          <span>PACKAGING</span>
          <span>CORPORATE GIFTS</span>
          <span>PVC KEYCHAINS</span>
          <span>EMBROIDERY</span>
          <span>WORKWEAR</span>
          <span>TOTE BAGS</span>
          <span>BOTTLES</span>
          <span>EVENT MERCH</span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-[36px] h-[500px] group border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"
              alt="Before branding"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />

            <div className="absolute top-5 left-5 bg-black/70 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-medium border border-white/10">
              Before
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[36px] h-[500px] group border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop"
              alt="After branding"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />

            <div className="absolute top-5 left-5 bg-purple-600/90 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-medium border border-purple-400/20">
              After Branding
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl mb-14">
          <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-4">
            What We Do
          </p>

          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Premium Merchandise & Production Solutions
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((item, index) => (
            <div
              key={index}
              className="group bg-white/5 hover:bg-white/8 transition border border-white/10 rounded-[30px] p-8 backdrop-blur-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/20 flex items-center justify-center mb-6 text-2xl">
                ✦
              </div>

              <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-300 transition">
                {item.title}
              </h3>

              <p className="text-white/65 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-4">
            Testimonials
          </p>

          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Trusted By Businesses Across The UK
          </h2>

          <p className="text-white/70 text-lg leading-relaxed">
            We work with brands, startups, creators, gyms, restaurants, and corporate businesses to deliver premium merchandise and printing solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl hover:border-purple-500/30 transition duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-1 text-purple-400 text-lg mb-6">
                  ★★★★★
                </div>

                <p className="text-white/75 leading-relaxed text-lg mb-8 italic">
                  “{testimonial.quote}”
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-white flex items-center justify-center text-black font-black text-lg">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-white/50 text-sm">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-black rounded-[36px] border border-purple-400/20 p-10 md:p-16 shadow-2xl shadow-purple-600/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_30%)]" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-5 py-2 text-sm text-purple-200 mb-6 backdrop-blur-xl">
              WhatsApp Support
            </div>

            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Message Us On WhatsApp
            </h2>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              Need help with custom merchandise, apparel manufacturing, printing, or sourcing products for your business? Our team is always here to help and guide you through every step.
            </p>

            <a
              href="https://wa.me/447892734800"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black hover:scale-105 transition duration-300 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl"
            >
              <span className="text-2xl">✦</span>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section id="instagram" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-4">
              Instagram
            </p>

            <h2 className="text-4xl md:text-5xl font-black">
              Recent Projects & Content
            </h2>
          </div>

          <a
            href="https://instagram.com/merchmagicuk"
            target="_blank"
            rel="noreferrer"
            className="text-white/70 hover:text-purple-300 transition"
          >
            @merchmagicuk →
          </a>
        </div>

        <div className="rounded-[32px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl p-4 min-h-[750px]">
          <div
            className="tagembed-widget"
            style={{ width: '100%', height: '700px', overflow: 'auto' }}
            data-widget-id="325484"
            data-website="1"
          ></div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-4">
            FAQs
          </p>

          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Quick Answers
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="contents">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[24px] p-5 backdrop-blur-xl"
              >
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-white/5 to-purple-600/10 border border-white/10 rounded-[40px] p-10 md:p-16 backdrop-blur-xl">
          <div className="text-center mb-10">
            <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-4">
              Contact Us
            </p>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Let’s Build Your Next Merch Project
            </h2>
          </div>

          <form
            action="https://formspree.io/f/mjglzney"
            method="POST"
            className="grid md:grid-cols-2 gap-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-purple-500"
            />

            <input
              type="text"
              name="business"
              placeholder="Business Name"
              className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-purple-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 md:col-span-2"
            />

            <textarea
              name="message"
              placeholder="Tell us about your project"
              rows="5"
              className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 md:col-span-2"
            ></textarea>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 transition rounded-2xl px-8 py-4 font-bold md:col-span-2"
            >
              Send Enquiry
            </button>
          </form>
        </div>
      </section>

      <a
        href="https://wa.me/447892734800"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-500 transition shadow-2xl shadow-purple-600/40 rounded-full px-6 py-4 font-semibold flex items-center gap-3"
      >
        <span className="text-xl">✦</span>
        WhatsApp Us
      </a>
    </div>
  );
}
