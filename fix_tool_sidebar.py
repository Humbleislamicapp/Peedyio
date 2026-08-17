import re

with open('src/components/editor/EditorToolsSidebar.tsx', 'r') as f:
    code = f.read()

props_old = """interface EditorSidebarProps {
  pages: PDFPageModel[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  onRotatePage: (index: number) => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onMovePage: (fromIndex: number, toIndex: number) => void;
  onAddBlankPage: () => void;
  selectedPagesForExtraction?: number[];
  onTogglePageSelection?: (index: number) => void;
  activeTool: AnnotationTool;
  onSelectTool: (tool: AnnotationTool) => void;
  toolSettings: any;
  onUpdateToolSettings: (settings: any) => void;
  onOpenSignModal: () => void;
  onInsertImage: () => void;
  isPagesCollapsed: boolean;
  sidebarMode: 'pages' | 'review' | 'sign';
  onSetSidebarMode: (mode: 'pages' | 'review' | 'sign') => void;
}"""

props_new = """interface EditorSidebarProps {
  pages: PDFPageModel[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  onRotatePage: (index: number) => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onMovePage: (fromIndex: number, toIndex: number) => void;
  onAddBlankPage: () => void;
  selectedPagesForExtraction?: number[];
  onTogglePageSelection?: (index: number) => void;
  activeTool: AnnotationTool;
  onSelectTool: (tool: AnnotationTool) => void;
  toolSettings: any;
  onUpdateToolSettings: (settings: any) => void;
  onOpenSignModal: () => void;
  onInsertImage: () => void;
  isPagesCollapsed: boolean;
  sidebarMode: 'pages' | 'review' | 'sign';
  onSetSidebarMode: (mode: 'pages' | 'review' | 'sign') => void;
  activePanel?: string;
  onSetActivePanel?: (panel: string) => void;
}"""

code = code.replace(props_old, props_new)

sig_old = """export const EditorToolsSidebar: React.FC<EditorSidebarProps> = ({
  activeTool,
  onSelectTool,
  toolSettings,
  onUpdateToolSettings,
  onOpenSignModal,
  onInsertImage,
  sidebarMode,
  onSetSidebarMode,
}) => {"""

sig_new = """export const EditorToolsSidebar: React.FC<EditorSidebarProps> = ({
  activeTool,
  onSelectTool,
  toolSettings,
  onUpdateToolSettings,
  onOpenSignModal,
  onInsertImage,
  sidebarMode,
  onSetSidebarMode,
  activePanel = 'edit',
  onSetActivePanel,
}) => {"""

code = code.replace(sig_old, sig_new)

groups_old = """  const toolGroups = [
    {
      title: 'Basic Tools',
      items: [
        { id: 'select', icon: MousePointer, label: 'Select' },
        { id: 'text', icon: Type, label: 'Add Text' },
        { id: 'image', icon: ImageIcon, label: 'Insert Image' },
      ],
    },
    {
      title: 'Annotations',
      items: [
        { id: 'highlight', icon: Highlighter, label: 'Highlight' },
        { id: 'pen', icon: PenTool, label: 'Freehand Pen' },
        { id: 'comment', icon: MessageSquare, label: 'Sticky Note' },
        { id: 'stamp', icon: Stamp, label: 'Stamps' },
      ],
    },
    {
      title: 'Shapes & Drawing',
      items: [
        { id: 'shape', icon: Square, label: 'Shapes' },
      ],
    },
    {
      title: 'Security',
      items: [
        { id: 'sign', icon: PenTool, label: 'Sign Document', isAction: true },
        { id: 'redact', icon: EyeOff, label: 'Permanent Redaction', color: 'text-rose-600' },
      ],
    },
  ];"""

groups_new = """  const panels = [
    { id: 'edit', label: 'Edit' },
    { id: 'review', label: 'Review' },
    { id: 'fill', label: 'Fill' },
    { id: 'sign', label: 'Sign' }
  ];

  const toolGroups = {
    'edit': [
      {
        title: 'Editing Tools',
        items: [
          { id: 'select', icon: MousePointer, label: 'Select & Move' },
          { id: 'text', icon: Type, label: 'Add Text' },
          { id: 'image', icon: ImageIcon, label: 'Insert Image', isAction: true },
          { id: 'shape', icon: Square, label: 'Add Shapes' },
        ],
      }
    ],
    'review': [
      {
        title: 'Markup & Review',
        items: [
          { id: 'select', icon: MousePointer, label: 'Select & Move' },
          { id: 'highlight', icon: Highlighter, label: 'Highlight' },
          { id: 'pen', icon: PenTool, label: 'Freehand Pen' },
          { id: 'comment', icon: MessageSquare, label: 'Sticky Note' },
          { id: 'stamp', icon: Stamp, label: 'Stamps' },
        ]
      }
    ],
    'fill': [
      {
        title: 'Form Fields',
        items: [
          { id: 'select', icon: MousePointer, label: 'Select & Move' },
          { id: 'text', icon: Type, label: 'Text Field' },
          { id: 'check', icon: CheckCircle2, label: 'Checkbox' },
          { id: 'date', icon: Type, label: 'Date Field' },
        ]
      }
    ],
    'sign': [
      {
        title: 'Signatures',
        items: [
          { id: 'select', icon: MousePointer, label: 'Select & Move' },
          { id: 'sign', icon: PenTool, label: 'Sign Document', isAction: true },
          { id: 'initials', icon: PenTool, label: 'Add Initials', isAction: true },
        ]
      }
    ]
  };
"""
code = code.replace(groups_old, groups_new)

# Add top tabs
render_old = """      {/* Top Header */}
      <div className="h-14 border-b border-zinc-200 flex items-center px-4 shrink-0 bg-white shadow-2xs z-10 relative">
        <h2 className="text-sm font-bold text-zinc-800">Toolbar</h2>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">"""

render_new = """      {/* Top Tabs */}
      <div className="flex border-b border-zinc-200 bg-white shrink-0 shadow-2xs z-10 relative">
        {panels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => onSetActivePanel && onSetActivePanel(panel.id)}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
              activePanel === panel.id
                ? 'border-zinc-900 text-zinc-900 bg-zinc-50/50'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {panel.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2">"""

code = code.replace(render_old, render_new)

# Map groups
map_old = """        <div className="p-4 space-y-6">
          {toolGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5 px-1">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((tool) => {"""

map_new = """        <div className="p-4 space-y-6">
          {(toolGroups[activePanel as keyof typeof toolGroups] || []).map((group, gIdx) => (
            <div key={gIdx}>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5 px-1">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((tool) => {"""

code = code.replace(map_old, map_new)

with open('src/components/editor/EditorToolsSidebar.tsx', 'w') as f:
    f.write(code)

