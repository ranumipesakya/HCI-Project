# KONTUR - Furniture Room Visualizer & Designer
## University Coursework Project Plan (Updated)

---

## 1. Project Overview

### Project Name
**KONTUR** - Furniture Room Visualizer & Designer

### Project Type
Web-based 3D Room Visualization and Design Tool (Single-Page Application)

### Core Summary
A designer-led room visualization tool enabling furniture store designers to create immersive room visualizations. Designers can enter room specifications, design 2D layouts, place and scale furniture, customize colors/materials, and convert designs to realistic 3D views with full CRUD operations on saved designs.

### Target Users
- **Primary**: Furniture store designers conducting customer consultations
- **Secondary**: Store customers viewing/designing their own rooms (extension feature)

### Current Project Status
- **Implementation State**: Core functionality complete
- **Architecture**: Frontend-only SPA (no backend)
- **Data Storage**: Session storage (client-side)

---

## 2. Project Objectives

### Primary Objectives
1. Enable designers to create accurate 2D room layouts with precise dimensions
2. Provide intuitive furniture placement with drag-and-drop
3. Support color and material customization with real-time preview
4. Generate realistic 3D visualizations from 2D layouts
5. Implement complete design management (save, edit, delete)

### Secondary Objectives (Extension Features)
1. Product catalog with detailed specifications
2. 3D product preview in isolated view
3. User authentication (UI complete, mock backend)

### Learning Objectives
- Apply HCI/UX principles in a real-world application
- Implement 3D graphics using WebGL/Three.js
- Build frontend web application skills
- Demonstrate system design and architecture capabilities

---

## 3. Requirements Analysis

### CORE COURSEWORK REQUIREMENTS (Implemented)
| ID | Requirement | Status |
|----|-------------|--------|
| C1 | Add furniture products from a furniture store catalog | ✅ COMPLETE |
| C2 | Arrange furniture in a 2D room layout | ✅ COMPLETE |
| C3 | Convert the design into a 3D room view | ✅ COMPLETE |
| C4 | Scale furniture to fit room dimensions | ✅ COMPLETE |
| C5 | Change colours and shading for the whole design or selected furniture | ✅ COMPLETE |
| C6 | Save, edit, and delete designs | ✅ COMPLETE |
| C7 | Interface must follow good HCI/UX practice | ✅ COMPLETE |

### Core Features (Room Visualization)
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| F1 | User authentication (Sign In, Sign Up, Google, Apple) | High | ✅ UI Complete (Mock) |
| F2 | Room specification input (width, length) | High | ✅ COMPLETE |
| F3 | 2D room layout editor with grid | High | ✅ COMPLETE |
| F4 | Furniture placement with drag-and-drop | High | ✅ COMPLETE |
| F5 | Furniture scaling to fit room dimensions | High | ✅ COMPLETE |
| F6 | Color customization for furniture items | High | ✅ COMPLETE |
| F7 | Material/shading selection | High | ✅ COMPLETE |
| F8 | 2D to 3D conversion with realistic rendering | High | ✅ COMPLETE |
| F9 | Save designs to session storage | High | ✅ COMPLETE |
| F10 | Edit existing designs | High | ✅ COMPLETE |
| F11 | Delete designs | High | ✅ COMPLETE |
| F12 | Dark mode support | Medium | ✅ COMPLETE |

### Extension Features (E-commerce)
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| E1 | Product catalog with search/filter | Low | ✅ COMPLETE |
| E2 | Product detail pages | Low | ✅ COMPLETE |
| E3 | 3D product preview (isolated) | Low | ✅ COMPLETE |
| E4 | Add to cart functionality | Low | 🔲 NOT IMPLEMENTED |
| E5 | Shopping cart management | Low | 🔲 NOT IMPLEMENTED |
| E6 | Checkout process (mock) | Low | 🔲 NOT IMPLEMENTED |

### Non-Functional Requirements
| ID | Requirement | Target | Status |
|----|-------------|--------|--------|
| NF1 | Page load time | < 3 seconds | ✅ MEETS |
| NF2 | 3D render performance | 30+ FPS | ✅ MEETS |
| NF3 | Browser compatibility | Chrome, Firefox, Safari, Edge | ✅ MEETS |
| NF4 | Mobile responsiveness | Tablet+ (768px+) | ✅ MEETS |
| NF5 | Accessibility | Basic keyboard nav | 🔲 PARTIAL |
| NF6 | Data persistence | Session storage | ✅ COMPLETE |
| NF7 | Dark/Light mode | Toggle support | ✅ COMPLETE |

---

## 4. Implemented Technical Specifications

### Actual Tech Stack
| Technology | Justification | Status |
|------------|---------------|--------|
| React 18 | Component-based, ecosystem, hooks | ✅ |
| TypeScript | Type safety, better DX | ✅ |
| Vite | Fast dev server, optimized builds | ✅ |
| Tailwind CSS | Rapid styling, consistency | ✅ |
| Framer Motion | Smooth animations | ✅ |
| Three.js | 3D rendering | ✅ |
| Lucide React | Icon library | ✅ |

### Architecture (Actual)
```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
├─────────────────────────────────────────────────────────┤
│  Pages: Landing → Login → Dashboard → Designer/3D     │
│                                                          │
│  Components:                                            │
│  ├── Header, Logo, Hero                                 │
│  ├── Login (Auth UI)                                    │
│  ├── Dashboard (Design Management)                      │
│  ├── RoomDesigner (2D Canvas Editor)                   │
│  ├── RoomViewer3D (3D Visualization)                   │
│  ├── DesignStudio3D (3D Furniture Studio)              │
│  ├── ProductCatalog, ProductCard, ProductDetail        │
│  └── ProductViewer3D (Isolated 3D Product)             │
├─────────────────────────────────────────────────────────┤
│  State: React useState + SessionStorage               │
│  (No Redux, Zustand, or Context API used)              │
└─────────────────────────────────────────────────────────┘
```

### Data Model (Session Storage)
```typescript
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
```

### Folder Structure (Actual)
```
src/
├── App.tsx                    # Main app with routing
├── index.tsx                  # Entry point
├── index.css                  # Global styles
├── components/
│   ├── Dashboard.tsx          # Design management
│   ├── DesignStudio3D.tsx    # 3D furniture studio
│   ├── Header.tsx             # App header
│   ├── Hero.tsx               # Landing hero
│   ├── Login.tsx              # Authentication UI
│   ├── Logo.tsx               # Brand logo
│   ├── ProductCard.tsx        # Product grid card
│   ├── ProductCatalog.tsx    # Product listing
│   ├── ProductDetail.tsx     # Product details
│   ├── ProductViewer3D.tsx   # 3D product view
│   ├── RoomDesigner.tsx       # 2D room editor
│   ├── RoomViewer3D.tsx       # 3D room view
│   └── ViewerControls.tsx     # 3D controls
├── data/
│   └── products.ts            # Product catalog data
└── utils/
    ├── furnitureModels.ts     # 3D furniture models
    ├── materials.ts           # Material definitions
    └── threeCleanup.ts        # Three.js cleanup utilities
```

---

## 5. Implemented Screens

### Screen 1: Landing Page ✅
- Hero section with app branding
- Feature highlights
- CTA buttons: "Start Designing", "Explore Catalog"
- Dark mode toggle

### Screen 2: Authentication ✅
- Logo and branding (KONTUR)
- Email/password form
- Social login buttons (Google, Apple) - mock implementation
- Toggle between Sign In/Sign Up
- Form validation

### Screen 3: Dashboard ✅
- Welcome header with user name
- "New Design" prominent button
- "3D Studio" button for quick 3D design
- Grid/List view toggle for designs
- Search functionality
- Design cards with: Name, room size, item count, date
- Quick actions: Open, Edit, Duplicate, Delete

### Screen 4: Room Designer (2D) ✅
- Left sidebar: Furniture catalog with categories
- Center: 2D canvas with grid, room walls, furniture
- Right panel: Selected item properties (dimensions, color)
- Toolbar: Zoom, undo/redo, grid toggle, rotate, delete
- View 3D button to switch perspective
- Room customization (wall color, floor color)
- Dimension annotations

### Screen 5: Room Designer (3D) ✅
- Full-screen 3D room visualization
- Orbit controls (rotate, zoom, pan)
- Lighting controls
- Toggle back to 2D view

### Screen 6: Product Catalog ✅
- Search bar
- Category filters (All, Sofas, Chairs, Tables, Beds, Storage)
- Sort options (Name, Price)
- Product grid with cards
- Product card: Image, name, price, category

### Screen 7: Product Detail ✅
- Product images
- Name, description, dimensions
- Color variants selection
- Price display
- 3D product viewer with rotation

### Screen 8: 3D Design Studio ✅
- Quick-start 3D furniture placement
- Pre-configured furniture items
- Direct 3D visualization

---

## 6. Key Inconsistencies Identified

### Original Plan vs. Implementation

| Aspect | Project Plan | Actual Implementation | Correction |
|--------|-------------|---------------------|-------------|
| Project Name | FurnishVR | KONTUR | ✅ Updated |
| State Management | Zustand | React useState | ✅ Updated |
| Backend | Express + PostgreSQL | None (Session Storage) | ✅ Updated |
| Auth | Firebase Auth | Mock Authentication | ✅ Updated |
| Data Persistence | Database | SessionStorage | ✅ Updated |
| Folder Structure | Complex with backend/ | Simplified | ✅ Updated |
| Tech Stack | React Three Fiber | Three.js direct | ✅ Updated |
| E-commerce | Full cart/checkout | Product catalog only | ✅ Updated |

---

## 7. Development Phases (Completed)

### Phase 1: Foundation ✅ (COMPLETE)
- Initialize Vite + React + TypeScript project
- Set up Tailwind CSS
- Implement auth UI (sign in/up forms) - mock
- Create dashboard layout

### Phase 2: 2D Room Editor ✅ (COMPLETE)
- Create room specification input
- Build 2D canvas with grid
- Implement furniture catalog
- Add drag-and-drop placement
- Implement scaling functionality
- Add color customization
- Add material selection
- Implement save/edit/delete

### Phase 3: 3D Visualization ✅ (COMPLETE)
- Set up Three.js scene
- Create room walls/floor
- Convert 2D items to 3D models
- Implement camera controls
- Add lighting and materials
- Implement 2D↔3D toggle

### Phase 4: Product Catalog ✅ (COMPLETE)
- Create product catalog
- Build product detail pages
- Add product 3D preview

---

## 8. Remaining Work

### Not Yet Implemented (Low Priority)
- [ ] Full shopping cart functionality
- [ ] Checkout process
- [ ] Backend integration (database)
- [ ] Real authentication (Firebase)
- [ ] Design history/versioning
- [ ] Progressive Web App (PWA)
- [ ] AR Preview

### Optional Enhancements
- [ ] AI-Powered Layout Suggestions
- [ ] Real-time Collaboration
- [ ] Voice Commands

---

## 9. HCI/UX Principles Applied

### Usability
| Principle | Implementation |
|-----------|---------------|
| Learnability | Consistent UI patterns, tooltips |
| Efficiency | Drag-and-drop, quick actions |
| Memorability | Familiar icons, consistent layouts |
| Error tolerance | Undo/redo, confirmation dialogs |

### Accessibility
- Keyboard navigation for basic actions
- Color contrast ratios (WCAG compliant)
- Focus indicators on interactive elements

### Feedback
| Action | Feedback |
|--------|----------|
| Button click | Visual press state |
| Save design | Alert notification |
| Drag furniture | Position updates |
| 3D render | Canvas display |

---

## 10. Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| 3D performance issues | Medium | Low | Use optimized Three.js rendering |
| Browser compatibility | Low | Low | Standard WebGL support |
| Data persistence | Medium | Low | Session storage working |
| Scope creep | High | Medium | Feature freeze on core |

---

## 11. Summary

This updated project plan reflects the actual implementation of the **KONTUR** furniture room visualizer project. The core coursework requirements (C1-C7) are fully implemented. The application is a frontend-only SPA using React, TypeScript, Three.js, and Tailwind CSS.

### Key Achievements
1. ✅ Complete 2D room designer with drag-and-drop
2. ✅ 3D room visualization with Three.js
3. ✅ Product catalog with 3D product preview
4. ✅ Design save/edit/delete functionality
5. ✅ Dark mode support
6. ✅ Responsive design
7. ✅ HCI/UX compliant interface

### Project Name
**KONTUR** - Furniture Room Visualizer & Designer

### Technology Stack
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Three.js (3D rendering)
- Session Storage (data persistence)

---

*Document Version: 2.0*
*Updated: March 2026*
*Project: KONTUR - Furniture Room Visualizer & Designer*
