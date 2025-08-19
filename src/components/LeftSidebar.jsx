// src/components/LeftSidebar.jsx
import React, { useState } from "react";
import {
  LuLayoutDashboard,
  LuLanguages,
  LuPencilLine,
  LuPenTool,
  LuBookmark,
  LuClock3,
  LuBell,
  LuUser,
  LuMessageSquare,
  LuSettings,
} from "react-icons/lu";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { VscGlobe } from "react-icons/vsc";
import { HiDotsVertical } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import "../styles/Sidebar.css";

const LeftSidebar = () => {
  const [activeItem, setActiveItem] = useState("Editor");

  return (
    <div className="vettam-sidebar">
      {/* Brand */}
      <div className="sidebar-header">
        <h2 className="brand">Vettam.AI</h2>
        <button className="new-chat-btn">
          <LuMessageSquare /> New Chat
        </button>
      </div>

      {/* Features */}
      <div className="card-section">
        <p className="section-title">Features</p>
        <ul className="sidebar-list">
          <li
            className={activeItem === "Workspace" ? "active" : ""}
            onClick={() => setActiveItem("Workspace")}
          >
            <LuLayoutDashboard className="icon" /> Workspace
          </li>
          <li
            className={activeItem === "Research" ? "active" : ""}
            onClick={() => setActiveItem("Research")}
          >
            <VscGlobe className="icon" /> Research
          </li>
          <li
            className={activeItem === "Translate" ? "active" : ""}
            onClick={() => setActiveItem("Translate")}
          >
            <LuLanguages className="icon" /> Translate
          </li>
          <li
            className={activeItem === "Write" ? "active" : ""}
            onClick={() => setActiveItem("Write")}
          >
            <LuPencilLine className="icon" /> Write
          </li>
        </ul>
      </div>

      {/* Tools */}
      <div className="card-section">
        <p className="section-title">Tools</p>
        <ul className="sidebar-list">
          <li
            className={activeItem === "Editor" ? "active" : ""}
            onClick={() => setActiveItem("Editor")}
          >
            <LuPenTool className="icon" /> Editor
          </li>
          <li
            className={activeItem === "Bookmarks" ? "active" : ""}
            onClick={() => setActiveItem("Bookmarks")}
          >
            <LuBookmark className="icon" /> Bookmarks
          </li>
        </ul>
      </div>

      {/* Chat History */}
      <div className="chat-history-card">
        <div className="chat-history-header">
          <LuClock3 className="icon-clock" />
          <span className="chat-history">Chat History</span>
        </div>
        <div className="today">
          <span>Today</span>
          <IoIosArrowUp className="today-icon" />
        </div>
        <div className="chat-history-list">
          <div className="chat-item">
            <span>Lorem ipsum dolor sit amet consectetur.</span>
            <HiDotsVertical className="icon-chat" />
          </div>
          <div className="chat-item">
            <span>Lorem ipsum dolor sit amet consectetur.</span>
            <HiDotsVertical />
          </div>
          <div className="chat-item">
            <span>Lorem ipsum dolor sit amet consectetur.</span>
            <HiDotsVertical />
          </div>
          <a className="view-more" href="#">
            View more
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="footer-top">
          <div className="avatars">
            <img src="https://i.pravatar.cc/24?img=11" alt="avatar" />
            <img src="https://i.pravatar.cc/24?img=12" alt="avatar" />
            <img src="https://i.pravatar.cc/24?img=13" alt="avatar" />
          </div>
          <div className="notifications">
            <LuBell />
            <span className="badge">12</span>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="user-info">
            <LuUser className="user-avatar" />
            <span>Michael Smith</span>
          </div>
          <div className="footer-actions">
            <LuSettings />
            <IoIosHelpCircleOutline />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
