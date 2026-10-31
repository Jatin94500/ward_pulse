import React from 'react';
import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand & Title using requested fonts */}
        <div className="flex items-center gap-3">
          <div>
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
          </div>
        </div>

        {/* Right Header Space (Actions / User / Status) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
