// EditorComponent_dynamicPageBreak_fixed2.jsx
import { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextAlign } from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";
import { Node } from "@tiptap/core";
import { IoCloudDoneOutline } from "react-icons/io5";
import { IoChevronBackSharp } from "react-icons/io5";
import { IoChevronForwardSharp } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";  // Instagram-like
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiMenu,
  FiEdit,
  FiAlignRight,
  FiInfo,
} from "react-icons/fi";
import { FaHighlighter } from "react-icons/fa";
import { TfiListOl } from "react-icons/tfi";

// Custom PageBreak extension
const PageBreak = Node.create({
  name: "pageBreak",
  group: "block",
  atom: true,
  selectable: false,
  draggable: false,
  parseHTML() {
    return [{ tag: "div[data-page-break]" }];
  },
  renderHTML() {
    return ["div", { "data-page-break": "", style: "page-break-after: always; height: 0;" }];
  },
  addCommands() {
    return {
      insertPageBreak:
        () =>
        ({ commands }) =>
          commands.insertContent("<div data-page-break></div>"),
    };
  },
});

// Font size extension
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
    };
  },
});

const commonExtensions = [
  StarterKit,
  Underline,
  Link,
  TextStyle,
  FontFamily.configure({ types: ["textStyle"] }),
  FontSize,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Color.configure({ types: ["textStyle"] }),
  Highlight.configure({ multicolor: true }),
  Superscript,
  Subscript,
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  Image,
  PageBreak,
];

const toPixels = (value, unit) => {
  if (unit === "px") return value;
  if (unit === "in") return value * 96;
  if (unit === "cm") return (value / 2.54) * 96;
  return value;
};

export default function EditorComponent() {
  const [activeTab, setActiveTab] = useState("Text");
  const [showHeaderFooter, setShowHeaderFooter] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [showMarginControls, setShowMarginControls] = useState(false);
  const [marginUnit, setMarginUnit] = useState("in");
  const [margins, setMargins] = useState({
    top: 1,
    right: 1,
    bottom: 1,
    left: 1,
  });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedHighlight, setSelectedHighlight] = useState("#ffff00");

  const [showWatermark, setShowWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkColor, setWatermarkColor] = useState("rgba(0,0,0,0.08)");
  const [watermarkSize, setWatermarkSize] = useState(5);
  const [watermarkRotation, setWatermarkRotation] = useState(-30);
  const [zoomFill, setZoomFill] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const pageRef = useRef(null);

  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [showCharModal, setShowCharModal] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [pages, setPages] = useState([]);
  const [sidebarTab, setSidebarTab] = useState("Thumbnail");

  // Split editor JSON into pages at pageBreak nodes
  function updatePages(editorInstance) {
    try {
      const json = editorInstance.getJSON();
      const newPages = [];
      let current = [];
      for (const node of (json.content || [])) {
        if (node.type === "pageBreak") {
          newPages.push(current);
          current = [];
        } else {
          current.push(node);
        }
      }
      newPages.push(current);
      setPages(newPages);
    } catch (err) {
      // fallback
      const json = editorInstance.getJSON();
      setPages([json.content || []]);
    }
  }

  useEffect(() => {
    if (zoomFill && pageRef.current) {
      const containerWidth = pageRef.current.parentElement.offsetWidth;
      const scale = (containerWidth / 800) * 100;
      setZoomLevel(Math.round(scale));
    }
  }, [zoomFill]);

  const headerEditor = useEditor({
    extensions: commonExtensions,
    content: `<p>Header content...</p>`,
  });

  const editor = useEditor({
    onUpdate({ editor }) { updatePages(editor); },
    extensions: [
      ...commonExtensions,
      Placeholder.configure({
        placeholder: "Start typing your document here...",
      }),
    ],
    content: `<p>${"Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(
      120
    )}</p>`,
  });

  const footerEditor = useEditor({
    extensions: commonExtensions,
    content: `<p>Footer content...</p>`,
  });

  // Initialize pages when editor instance is ready
  useEffect(() => {
    if (editor) {
      updatePages(editor);
    }
  }, [editor]);

  // Live counter updater
  useEffect(() => {
    if (!editor) return;
    const updateCounts = () => {
      const text = editor.state.doc.textBetween(
        0,
        editor.state.doc.content.size,
        " "
      );
      setCharCount(text.length);
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    };
    editor.on("update", updateCounts);
    updateCounts();
    return () => {
      editor.off("update", updateCounts);
    };
  }, [editor]);

  // Keyboard shortcut for modal
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyC") {
        e.preventDefault();
        setShowCharModal(true);
      }
      if (e.code === "Escape") {
        setShowCharModal(false);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);
  if (!editor) return null;

  return (
    <div className="editor-wrapper">
      {/* Document header */}
      <div className="doc-header">
        <div className="doc-title">
          Olga Tellis v. Bombay Municipal Corporation (1985).docx
          <div className="header-icon">
            <FiInfo />
            <IoCloudDoneOutline />
            <span>Saved</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="editor-tabs">
        <button
          className={activeTab === "Text" ? "active-tab" : ""}
          onClick={() => setActiveTab("Text")}
        >
          Text
        </button>
        <button
          className={activeTab === "Page" ? "active-tab" : ""}
          onClick={() => setActiveTab("Page")}
        >
          Page
        </button>
        
      </div>

      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          {activeTab === "Text" && (
            <>
              {/* Font Family */}
              <select
                onChange={(e) =>
                  editor.chain().focus().setFontFamily(e.target.value).run()
                }
              >
                <option>Avenir Next</option>
                <option>Arial</option>
                <option>Times New Roman</option>
              </select>

              {/* Font Size */}
              <select
                onChange={(e) =>
                  editor.chain().focus().setFontSize(e.target.value).run()
                }
              >
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px">16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
              </select>

              {/* Heading */}
              <select
                onChange={(e) => {
                  const level = parseInt(e.target.value);
                  if (level === 0) editor.chain().focus().setParagraph().run();
                  else editor.chain().focus().toggleHeading({ level }).run();
                }}
              >
                <option value="0">Normal</option>
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
              </select>

              <div className="toolbar-separator"></div>

              {/* Formatting */}
              <button onClick={() => editor.chain().focus().toggleBold().run()}>
                <FiBold />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <FiItalic />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <FiUnderline />
              </button>
              <button
                onClick={() => {
                  const url = window.prompt("Enter URL");
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
              >
                <FiLink />
              </button>

              <div className="toolbar-separator"></div>

              {/* Lists */}
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <FiList />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <TfiListOl />
              </button>

              <div className="toolbar-separator"></div>

              {/* Alignment */}
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
              >
                <FiAlignLeft />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
              >
                <FiAlignCenter />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              >
                <FiAlignRight />
              </button>

              <div className="toolbar-separator"></div>

              {/* Text Color */}
              <button
                title="Text Color"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <span style={{ color: selectedColor, fontWeight: "bold" }}>
                  A
                </span>
              </button>
              {showColorPicker && (
                <>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      editor.chain().focus().setColor(selectedColor).run();
                      setShowColorPicker(false);
                    }}
                  >
                    Save
                  </button>
                </>
              )}

              {/* Highlight */}
              <button
                title="Highlight"
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
              >
                <FaHighlighter style={{ color: selectedHighlight }} />
              </button>
              {showHighlightPicker && (
                <>
                  <input
                    type="color"
                    value={selectedHighlight}
                    onChange={(e) => setSelectedHighlight(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .toggleHighlight({ color: selectedHighlight })
                        .run();
                      setShowHighlightPicker(false);
                    }}
                  >
                    Save
                  </button>
                </>
              )}
            </>
          )}

          {activeTab === "Page" && (
            <>
              <button onClick={() => { editor.chain().focus().insertPageBreak().run(); updatePages(editor); }}>
                Insert Page Break
              </button>
              <button onClick={() => setShowHeaderFooter(!showHeaderFooter)}>
                Header/Footer
              </button>
              <div className="toolbar-separator"></div>
              <button
                onClick={() => setShowMarginControls(!showMarginControls)}
              >
                Margin
              </button>
              {showMarginControls && (
              <div className="margin-inputs">
                {["top", "right", "bottom", "left"].map((side) => (
                  <label key={side}>
                    {side}:{" "}
                    <input
                      type="number"
                      value={margins[side]}
                      step="0.1"
                      onChange={(e) =>
                        setMargins((prev) => ({
                          ...prev,
                          [side]: parseFloat(e.target.value),
                        }))
                      }
                    />
                  </label>
                ))}
                <select value={marginUnit} onChange={(e) => setMarginUnit(e.target.value)}>
                  <option value="in">in</option>
                  <option value="cm">cm</option>
                  <option value="px">px</option>
                </select>
              </div>
            )}
              <div className="toolbar-separator"></div>
              <button onClick={() => setShowRulers(!showRulers)}>Rulers</button>
              <div className="toolbar-separator"></div>
              <button
                onClick={() => {
                  const text = window.prompt(
                    "Enter watermark text:",
                    watermarkText
                  );
                  if (text) setWatermarkText(text);
                  setShowWatermark(!showWatermark);
                }}
              >
                Watermark
              </button>
              <div className="toolbar-separator"></div>
              <button onClick={() => setZoomFill(!zoomFill)}>
                {zoomFill ? "Zoom Reset" : "Zoom Fill"}
              </button>
              <select
                value={zoomLevel}
                onChange={(e) => {
                  setZoomLevel(parseInt(e.target.value));
                  setZoomFill(false);
                }}
              >
                {[50, 75, 100, 125, 150, 200].map((z) => (
                  <option key={z} value={z}>
                    {z}%
                  </option>
                ))}
              </select>
              <div className="toolbar-separator"></div>
              <button onClick={() => setShowCharModal(true)}>
                Document Stats
              </button>
            </>
          )}
        </div>
      </div>

      <div className="editor-body">
        {/* Main editor area */}
        <div className="main-editor">
          {showHeaderFooter && (
            <div className="header-area">
              <EditorContent editor={headerEditor} />
            </div>
          )}
          {pages.map((nodes, i) => (
  <div
    key={i}
    ref={pageRef}
    className={`page ${showWatermark ? "with-watermark" : ""}`}
    style={{
      "--wm-color": watermarkColor,
      "--wm-size": `${watermarkSize}rem`,
      "--wm-rotation": `${watermarkRotation}deg`,
      transform: `scale(${zoomLevel / 100})`,
      transformOrigin: "top left",
      transition: "transform 0.2s ease",
      paddingTop: toPixels(margins.top, marginUnit),
      paddingRight: toPixels(margins.right, marginUnit),
      paddingBottom: toPixels(margins.bottom, marginUnit),
      paddingLeft: toPixels(margins.left, marginUnit),
    }}
  >
    <EditorContent editor={editor} content={{ type: 'doc', content: nodes }} />
    <div className="page-number-footer">Page {i + 1}</div>
  </div>
))}
          {showHeaderFooter && (
            <div className="footer-area">
              <EditorContent editor={footerEditor} />
            </div>
          )}
        </div>

        
        {sidebarOpen && (
          <div className="right-sidebar">
            {/* Sidebar Tabs */}
            <div className="sidebar-tabs">
              {["Thumbnail", "Index", "Search"].map((tab) => (
                <button
                  key={tab}
                  className={sidebarTab === tab ? "active" : ""}
                  onClick={() => setSidebarTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sidebar Content */}
            <div className="sidebar-content">
              {sidebarTab === "Thumbnail" && (
                <div className="thumbnails">
                  {pages.map((nodes, idx) => (
                    <div
                      key={idx}
                      className={`thumbnail ${activePage === idx + 1 ? "active-thumbnail" : ""}`}
                      onClick={() => {
                        setActivePage(idx + 1);
                        const pageEl = document.querySelectorAll(".page")[idx];
                        if (pageEl) {
                          pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                    >
                      <div className="thumbnail-page">Page {idx + 1}</div>
                    </div>
                  ))}
                </div>
              )}

              {sidebarTab === "Index" && (
                <div className="index-list">
                  <p>1. Introduction</p>
                  <p>2. Case Details</p>
                  <p>3. Judgment</p>
                </div>
              )}

              {sidebarTab === "Search" && (
                <div className="search-section">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Chatbox */}
            <div className="ask-vettam-chatbox">
              <input type="text" placeholder="Ask Vettam" />
              <div className="chat-icon-box"><RiSendPlaneFill size={16} /></div>
            </div>
          </div>
        )}
      </div>

      {/* Character Count Modal */}
      {showCharModal && (
        <div className="modal-backdrop" onClick={() => setShowCharModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowCharModal(false)}
            >
              ×
            </button>
            <h2>Document Statistics</h2>
            <p>Characters (with spaces): {charCount}</p>
            <p>
              Characters (without spaces):{" "}
              {charCount - (editor.getText().split(" ").length - 1)}
            </p>
            <p>Words: {wordCount}</p>
            <p>
              Paragraphs: {editor.getText().split(/\n+/).filter(Boolean).length}
            </p>
            <p>Reading time: {Math.ceil(wordCount / 200)} min</p>
          </div>
        </div>
      )}

      {/* Footer with character count & pagination */}
      <div className="editor-footer">
  <div className="char-counter">{charCount} characters</div>
  <div className="pagination">
    {pages.map((nodes, i) => (
      <button
        key={i}
        className={activePage === i + 1 ? "active-page" : ""}
        onClick={() => {
          setActivePage(i + 1);
          const pageEl = document.querySelectorAll(".page")[i];
          if (pageEl) {
            pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
      >
        {i + 1}
      </button>
    ))}
  </div>
</div>
      <style>{`
        .editor-wrapper { flex: 1; display: flex; flex-direction: column;  font-family: sans-serif; height: 98vh; }
        .doc-header { display: flex; justify-content: space-between; padding: 0.8rem 1rem; ; font-weight: bold; font-size:26px;  margin-left: 20px;  margin-bottom: 10px; }
        .header-icon { display: flex; align-items: center; gap: 0.5rem; margin-left: 1rem; font-size: 14px; color: #555; }
        .editor-tabs {
  display: flex;
  padding: 0 1rem;
  border-bottom: 1px solid #ddd;
  gap: 15px;
}

.editor-tabs .active-tab {
  background: #f0e7f4ff;  /* keep same background */
  font-weight: bold;
  color: #520172ff; 
  border: none;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  border-bottom: 1px solid white; /* blends into editor body */
}

        .editor-body { display: flex; flex: 1; overflow: hidden;  background: #f5f3f6ff;margin-left: 35px;  margin-right: 20px;}
        .main-editor { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; align-items: center; }
        .page { background: white; width: 800px; min-height: 1122px; padding: 1rem; border-radius: 4px; box-shadow: 0 0 5px rgba(0,0,0,0.1); position: relative; margin-bottom: 1rem; }
        .with-watermark::before { content: attr(data-watermark); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(var(--wm-rotation, -30deg)); font-size: var(--wm-size, 5rem); font-weight: bold; color: var(--wm-color, rgba(0,0,0,0.08)); white-space: nowrap; pointer-events: none; }
        .right-sidebar { width: 250px; border-left: 1px solid #ddd; background: #fff; display: flex; flex-direction: column;margin-right: 20px; }
        .sidebar-tabs { display: flex; border-bottom: 1px solid #ddd; background: #f2ebf9; margin-bottom:10px; }
        .sidebar-tabs button { flex: 1; padding: 0.5rem; border: none; background: transparent; cursor: pointer;  font-weight: bold;font-size: 13px;color: #5e5e5eff;  }
        .sidebar-tabs button.active { border-bottom: 3px solid #7d3cff; font-weight: bold; color: #520172ff; }
        .sidebar-content { flex: 1; overflow-y: auto; }
       .thumbnails {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem; /* more space between pages */
  background: #fff;
}

.thumbnail {
  border: 2px solid transparent;
  padding: 8px;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: border-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.thumbnail:hover {
  border-color: #bbb;
  transform: scale(1.01);
}

.active-thumbnail {
  border-color: #7d3cff;
  background: #f3ecff;
}

.thumbnail-page {
  width: 140px; /* ✅ bigger preview width */
  height: 170px; /* ✅ A4 aspect ratio (120 * 1.414 = ~170) */
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #777;
  font-family: sans-serif;
}
.ask-vettam-chatbox {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 3px solid #a57ef7;
  border-radius: 10px;
  background-color: #fff;
  margin: 0px;
  padding: 0 10px 0 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.ask-vettam-chatbox input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
  background: transparent;
  padding: 6px 0;
}

.chat-icon-box {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: gray;
  cursor: pointer;
  margin-left: 8px;
  transition: background 0.2s ease;
}

    
 .editor-footer {
  position: absolute;
  bottom: 40px;
  left: 39%;
  transform: translateX(-50%);
  width: 800px; /* Same as editor page width */
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 5;
}

.char-counter,
.pagination {
  pointer-events: auto;
  background: #faf7fc;
  padding: 6px 10px;
  border: 2px solid #eed6ffff;
  border-radius: 6px;
  font-size: 1rem;
  color: #555;
}

/* 👇 Optional tweak: shift pagination a bit more to the left */
.pagination {
  margin-right: -486px;
}
   .margin-inputs {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .editor-scroll {
          padding: 2rem;
          background: #eee;
          height: calc(100vh - 60px);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
        }
        .editor-page {
          position: relative;
          width: 800px;
          height: 1122px;
          background: white;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        .ruler-top {
          display: flex;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 20px;
          font-size: 10px;
          background: repeating-linear-gradient(
            to right,
            #ccc 0,
            #ccc 1px,
            transparent 1px,
            transparent 20px
          );
          justify-content: space-between;
          padding-left: 30px;
        }
        .ruler-left {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 20px;
          background: repeating-linear-gradient(
            to bottom,
            #ccc 0,
            #ccc 1px,
            transparent 1px,
            transparent 20px
          );
        }
.page-number-footer {
  position: absolute;
  bottom: 12px;
  right: 20px;
  font-size: 0.85rem;
  color: #999;
  font-family: sans-serif;
}


.pagination button {
  margin: 0 4px;
  padding: 4px 10px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.pagination button.active-page {
  background: #7d3cff;
  color: white;
  border-color: #7d3cff;
}


      `}

</style>
    </div>
  );
}