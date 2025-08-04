import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";

export default function HomePage() {
  const [animateHero, setAnimateHero] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateHero(true), 100); // slight delay
    return () => clearTimeout(timer);
  }, []);
  return (
    <Layout>
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 pb-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <h2
          className={`text-4xl md:text-5xl font-extrabold mb-4 text-white transition duration-300
            ${
              animateHero
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }
          `}
        >
          Effortless Visitor Management
        </h2>
        <p
          className={`text-lg text-white max-w-2xl mb-8 transition-all duration-1000 ease-out delay-200
            ${
              animateHero
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }
          `}
        >
          Scan badges, business cards, and QR codes. Use AI to enrich details
          and send follow-up emails — all in one clean workflow.
        </p>

        <div
          className={`flex gap-4 flex-wrap justify-center transition-opacity duration-1000 delay-500
            ${animateHero ? "opacity-100" : "opacity-0"}
          `}
        >
          <Link
            to="/scan"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition"
          >
            🔍 Start Scanning
          </Link>
          <Link
            to="/visitors"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition text-base"
          >
            👥 View Visitors
          </Link>
        </div>
      </div>

      <section className=" py-4 px-4" id="features">
        <div className="max-w-6xl mx-auto text-center">
          <div className="">
            <FeatureCard
              icon="🔍"
              title="OCR-Powered Scanning"
              desc="Quickly scan physical business cards, badges, or event passes using your device's camera or uploaded images. Our OCR engine extracts vital information like name, email, phone number, and company. No more manual entry — just point, scan, and store cleanly structured visitor data instantly."
              bgColor="bg-gray-50"
            />

            <FeatureCard
              icon="📸"
              title="Flexible QR Code Scanning"
              desc="Support for live camera scans and image uploads allows you to capture leads from QR-enabled badges or digital business cards. Even low-resolution codes are accurately decoded, making your booth or event check-in smooth and lightning fast."
              bgColor="bg-white"
              reverse
            />

            <FeatureCard
              icon="🤖"
              title="AI-Powered Enrichment & Insights"
              desc="Each scan is enriched using AI to generate context-aware visitor summaries — helping you understand who they are and why they matter. It even generates a professional, personalized email follow-up with smart subject lines and content tailored to each lead."
              bgColor="bg-gray-50"
            />

            <FeatureCard
              icon="📧"
              title="Automated Follow-Up Email System"
              desc="Send beautifully formatted follow-up emails within seconds after a scan. Built-in templates are personalized with AI and include structured visitor data, AI summaries, and links to your offerings. Set it and forget it — your leads won’t slip through the cracks."
              bgColor="bg-white"
              reverse
            />

            <FeatureCard
              icon="📊"
              title="Smart Visitor Management"
              desc="Easily access, search, and manage your entire visitor history. Filter by company, time, or source — and see AI insights for each contact. Export data or integrate with your CRM to keep your pipeline full and organized."
              bgColor="bg-gray-50"
            />
          </div>
        </div>
      </section>

      <section
        id="cta"
        className=" w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-36 text-white text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to turn scans into connections?
        </h2>
        <p className="text-lg mb-8">
          Start capturing, enriching, and following up with your leads — all in
          one place.
        </p>
        <Link
          to="/scan"
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          🚀 Get Started Now
        </Link>
      </section>
    </Layout>
  );
}
