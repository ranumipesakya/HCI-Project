# KONTUR

**Furniture Room Visualizer & Designer**  
A designer-led **web-based 2D/3D room visualization tool** built for furniture store consultations and interior space planning.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/Status-Core_Features_Complete-success)

---

## 📌 Overview

**KONTUR** is a single-page application that allows designers to create immersive furniture room layouts by:

- entering room dimensions
- designing a room in **2D**
- placing and scaling furniture
- customizing colors and materials
- converting the design into a realistic **3D visualization**
- saving, editing, duplicating, and deleting designs

The project was developed as a **university coursework project** with a strong focus on **HCI/UX principles**, interactive visualization, and frontend architecture.

---

## ✨ Key Features

### Core Room Design Features
- 📐 **Room Specification Input**  
  Create rooms using custom width and length values.

- 🧩 **2D Room Layout Editor**  
  Design rooms on a grid-based editor with clear layout controls.

- 🛋️ **Furniture Placement**  
  Drag and drop furniture into the room layout.

- 📏 **Furniture Scaling**  
  Resize items to better fit available room space.

- 🎨 **Color Customization**  
  Apply colors to individual furniture items.

- 🪵 **Material / Shading Selection**  
  Customize the look and feel of furniture and room surfaces.

- 🌐 **2D to 3D Conversion**  
  Instantly transform a 2D layout into a realistic 3D room view.

- 💾 **Design Management**  
  Save, edit, duplicate, and delete room designs.

- 🌙 **Dark Mode Support**  
  Toggle between light and dark themes.

### Extension Features
- 🛍️ **Product Catalog**
- 🔎 **Search and Filter Products**
- 📄 **Product Detail Pages**
- 🧱 **Isolated 3D Product Preview**
- 🔐 **Authentication UI (Mock)**

---

## 🎯 Project Objectives

### Primary Objectives
- Enable designers to create accurate room layouts with precise dimensions
- Provide intuitive drag-and-drop furniture placement
- Support real-time visual customization of furniture and materials
- Generate immersive 3D visualizations from 2D designs
- Implement complete CRUD operations for saved designs

### Learning Objectives
- Apply **HCI/UX principles** in a practical system
- Build an interactive frontend using **React + TypeScript**
- Implement 3D graphics using **Three.js**
- Demonstrate planning, architecture, and component-based design

---

## 🧱 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | Component-based frontend development |
| **TypeScript** | Type safety and maintainable code |
| **Vite** | Fast development server and optimized builds |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth UI animations |
| **Three.js** | 3D rendering and visualization |
| **Lucide React** | Icon system |
| **Session Storage** | Client-side data persistence |

---

## 🏗️ Architecture

KONTUR is implemented as a **frontend-only single-page application**.

```text
┌─────────────────────────────────────────────────────────┐
│                    React Application                    │
├─────────────────────────────────────────────────────────┤
│  Pages: Landing → Login → Dashboard → Designer / 3D   │
│                                                         │
│  Components:                                            │
│  ├── Header, Logo, Hero                                 │
│  ├── Login (Auth UI)                                    │
│  ├── Dashboard (Design Management)                      │
│  ├── RoomDesigner (2D Canvas Editor)                    │
│  ├── RoomViewer3D (3D Visualization)                    │
│  ├── DesignStudio3D (3D Furniture Studio)               │
│  ├── ProductCatalog, ProductCard, ProductDetail         │
│  └── ProductViewer3D (Isolated 3D Product View)         │
├─────────────────────────────────────────────────────────┤
│  State: React useState + SessionStorage                 │
│  No backend / No global state library                   │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```text
src/
├── App.tsx                    # Main app with routing
├── index.tsx                  # Entry point
├── index.css                  # Global styles
├── components/
│   ├── Dashboard.tsx
│   ├── DesignStudio3D.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Login.tsx
│   ├── Logo.tsx
│   ├── ProductCard.tsx
│   ├── ProductCatalog.tsx
│   ├── ProductDetail.tsx
│   ├── ProductViewer3D.tsx
│   ├── RoomDesigner.tsx
│   ├── RoomViewer3D.tsx
│   └── ViewerControls.tsx
├── data/
│   └── products.ts
└── utils/
    ├── furnitureModels.ts
    ├── materials.ts
    └── threeCleanup.ts
```

---

## 🖥️ Screens

- Landing Page
- Authentication (Mock)
- Dashboard
- 2D Room Designer
- 3D Room Viewer
- Product Catalog
- Product Detail
- 3D Design Studio

---

## ✅ Coursework Requirements

| ID | Requirement | Status |
|----|------------|--------|
| C1 | Add furniture from catalog | ✅ |
| C2 | Arrange in 2D layout | ✅ |
| C3 | Convert to 3D view | ✅ |
| C4 | Scale furniture | ✅ |
| C5 | Change colors & shading | ✅ |
| C6 | Save/edit/delete designs | ✅ |
| C7 | Good HCI/UX | ✅ |

---

## 📦 Data Model

```ts
interface SavedDesign {
  id: string;
  name: string;
  room: {
    width: number;
    length: number;
    wallColor: string;
    floorColor: string;
  };
  furniture: {
    id: string;
    productId: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    depth: number;
    rotation: number;
    color: string;
  }[];
  createdAt: string;
  updatedAt: string;
  roomSize: string;
  itemCount: number;
}

