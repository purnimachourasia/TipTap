// src/components/LeftSidebar.jsx
import React, { useState } from "react";
import {
  FiHome,
  FiBookOpen,
  FiEdit2,
  FiGlobe,
  FiTool,
  FiBookmark,
  FiMoreVertical,
  FiClock,
  FiBell,
  FiUser,
  FiMessageSquare,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";
import { FiColumns } from "react-icons/fi";
import { IoIosArrowUp } from "react-icons/io";
import "../styles/Sidebar.css";

const LeftSidebar = () => {
  const [activeItem, setActiveItem] = useState("Editor");

  return (
    <div className="vettam-sidebar">
      <div className="sidebar-header">
        <h2 className="brand">
          Vettam.AI <FiColumns className="col-icon" />
        </h2>

        <button className="new-chat-btn">
          <FiMessageSquare /> New Chat
        </button>
      </div>

      <div className="card-section">
        <p className="section-title">Features</p>
        <ul className="sidebar-list">
          <li
            className={activeItem === "Workspace" ? "active" : ""}
            onClick={() => setActiveItem("Workspace")}
          >
            <FiHome className="icon" /> Workspace
          </li>
          <li
            className={activeItem === "Research" ? "active" : ""}
            onClick={() => setActiveItem("Research")}
          >
            <FiBookOpen className="icon" /> Research
          </li>
          <li
            className={activeItem === "Translate" ? "active" : ""}
            onClick={() => setActiveItem("Translate")}
          >
            <FiGlobe className="icon" /> Translate
          </li>
          <li
            className={activeItem === "Write" ? "active" : ""}
            onClick={() => setActiveItem("Write")}
          >
            <FiEdit2 className="icon" /> Write
          </li>
        </ul>
      </div>

      <div className="card-section">
        <p className="section-title">Tools</p>
        <ul className="sidebar-list">
          <li
            className={activeItem === "Editor" ? "active" : ""}
            onClick={() => setActiveItem("Editor")}
          >
            <FiTool className="icon" /> Editor
          </li>
          <li
            className={activeItem === "Bookmarks" ? "active" : ""}
            onClick={() => setActiveItem("Bookmarks")}
          >
            <FiBookmark className="icon" /> Bookmarks
          </li>
        </ul>
      </div>

      <div className="chat-history-card">
        <div className="chat-history-header">
          <FiClock className="icon-clock" />
          <span className="chat-history">Chat History</span>
        </div>
        <div className="today">
          <span>Today</span>
          <IoIosArrowUp className="today-icon" />
        </div>
        <div className="chat-history-list">
          <div className="chat-item">
            <span>Lorem ipsum dolor sit amet consectetur.</span>
            <FiMoreVertical className="icon-chat" />
          </div>
          <div className="chat-item">
            <span>Lorem ipsum dolor sit amet consectetur.</span>
            <FiMoreVertical />
          </div>
          <div className="chat-item">
            <span>Lorem ipsum dolor sit amet consectetur.</span>
            <FiMoreVertical />
          </div>
          <a className="view-more" href="#">
            View more
          </a>
        </div>
      </div>

      <div className="sidebar-footer">
        {/* Top row: avatars + notification */}
        <div className="footer-top">
          <div className="avatars">
            <img src="https://i.pravatar.cc/24?img=1" alt="avatar" />
            <img src="https://i.pravatar.cc/24?img=1" alt="avatar" />
            <img src="https://i.pravatar.cc/24?img=1" alt="avatar" />
          </div>
          <div className="notifications">
            <FiBell />
            <span className="badge">12</span>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom row: user avatar, name, settings/help */}
        <div className="footer-bottom">
          <div className="user-info">
            <FiUser className="user-avatar" />
            <span>Michael Smith</span>
          </div>
          <div className="footer-actions">
            <FiSettings />
            <FiHelpCircle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
