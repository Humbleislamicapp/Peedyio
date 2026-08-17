import React from 'react';
import { ArrowLeft, ArrowRight, Copy, Layers, Scissors, Minimize2, CheckCircle, ShieldCheck, PenTool } from 'lucide-react';
import { ViewMode } from '../types/pdf';

interface HubItem {
  id: ViewMode;
  title: string;
  desc: string;
  icon: any;
  color: string;
}

interface ToolHubProps {
  title: string;
  description: string;
  items: HubItem[];
  onSelectTool: (toolId: ViewMode) => void;
  onBack: () => void;
}

export const ToolHub: React.FC<ToolHubProps> = ({ title, description, items, onSelectTool, onBack }) => {
  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col bg-slate-50">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            {description}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group relative bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${tool.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                  <span>{tool.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
