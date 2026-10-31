import React, { useState } from 'react';
import { Key, Copy, Check, FileCode, Download, ShieldCheck } from 'lucide-react';
import { API_BASE_URL, API_DOCS_URL } from '../config';

export default function Header() {
  const [copied, setCopied] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText('wardpulse-key-2026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand & Title using requested fonts */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <h1 
              className="playfair-display-title playfair-display text-2xl md:text-3xl font-bold tracking-tight text-gray-900 m-0"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Ward{' '}
              <span 
                className="zeyada-regular text-3xl md:text-4xl text-orange-600 font-normal ml-1 inline-block"
                style={{ fontFamily: '"Zeyada", cursive' }}
              >
                Pulse
              </span>
            </h1>
          </div>

          {/* Live Production Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API Online · 198 BBMP Wards</span>
          </div>
        </div>

        {/* Right Header Space (Actions / User / Status) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Copyable API Key Pill */}
          <button
            type="button"
            onClick={copyApiKey}
            title="Click to copy evaluation API Key"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
          >
            <Key className="h-3 w-3 text-orange-600" />
            <span>wardpulse-key-2026</span>
            {copied ? (
              <Check className="h-3 w-3 text-emerald-600" />
            ) : (
              <Copy className="h-3 w-3 text-slate-400" />
            )}
          </button>

          {/* Export Evaluation Submission CSV */}
          <a
            href={`${API_BASE_URL}/api/export/submission`}
            download="ward_pulse_evaluation_submission.csv"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm transition-colors cursor-pointer"
            title="Download official evaluation submission CSV for the 40 zero-history target wards"
          >
            <Download className="h-3.5 w-3.5 text-gray-500" />
            <span>Export Submission CSV</span>
          </a>

          {/* Interactive Swagger Docs Link */}
          <a
            href={API_DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-colors cursor-pointer"
            title="Open interactive OpenAPI / Swagger API evaluation docs on Render"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Live API Docs (Swagger)</span>
          </a>
        </div>
      </div>
    </header>
  );
}
