# Implementation Plan - Add Trainer Section

This plan outlines the design, assets, and component changes needed to add the Trainer section (featuring Dr. Sarah Chen and her previous lectures/workshops) directly under the Programs section on the Mobiweb landing page.

## Proposed Changes

We will create a new component `Trainer.jsx` and integrate it into `App.jsx` right below the existing `Programs` component.

---

### Mobiweb Web App

#### [NEW] [Trainer.jsx](file:///d:/Mobiweb/src/components/Trainer.jsx)
We will create a new, responsive component `Trainer.jsx` to render the Trainer profile and the "Previous Lectures & Workshops" section.

**Trainer Profile (Upper Part)**:
- **Left Column**: Image of Dr. Sarah Chen (desaturated black & white / professional style) with overlapping capability badges (`Robotics`, `Machine Learning`, `Embedded Systems`) styled with modern glassmorphism details.
- **Right Column**:
  - Name: **Dr. Sarah Chen** (gradient style using `gradient-text-cyan-indigo`).
  - Title: **Senior Robotics Lead & AI Educator** with a Lucide badge/icon.
  - Bio text matching the design.
  - Interactive buttons: "View Curriculum" (gradient primary button with a right arrow icon) and "Connect on LinkedIn" (outline button with an external link icon).
  - Status alert: A sleek notice card indicating "Currently leading the new cohort for Advanced Industrial Automation Lab".

**Previous Lectures & Workshops (Lower Part)**:
- Heading and subtitle.
- Navigation buttons (prev/next circles) for slider control.
- A sliding/scrollable grid of workshop cards:
  - **Card 1**: "Advanced Robotics & AI: Synergies for Autonomous Systems" (Webinar).
  - **Card 2**: "Future of Industry 4.0: Modern Manufacturing Lab" (In-Person Lab).
  - **Card 3**: "Hands-on Microcontrollers & IoT Workshop" (Hands-on Lab).
- Each card will display a custom-generated preview image, descriptive badges, title, description, and subtle hover scale/glow effects.

#### [MODIFY] [App.jsx](file:///d:/Mobiweb/src/App.jsx)
- Import `Trainer` from `./components/Trainer`.
- Insert `<Trainer />` right after the `<Programs />` component, separated by `<div className="section-divider" />`.

#### [MODIFY] [Navbar.jsx](file:///d:/Mobiweb/src/components/Navbar.jsx)
- Ensure the navigation includes an anchor link to `#trainer` or similar if needed, or link "Mentors" / "Trainer" section. We will inspect if a navigation link is required.

---

## Assets Generation

To avoid generic placeholders and deliver a premium experience, we will use the image generation tool to create the following assets:
1. `dr_sarah_chen.png` - A desaturated portrait of Dr. Sarah Chen.
2. `workshop_robotics.png` - Simulation interface slide view.
3. `workshop_industry4.png` - Automation lab digital twin interface.
4. `workshop_hardware.png` - Hands-on IoT setup table.

These will be saved directly in the application's public assets folder or copied there.

## Verification Plan

### Automated/Build Verification
- Verify that `npm run build` succeeds without compilation/linting errors.
- Ensure the page renders correctly in both Dark and Light modes.

### Manual Verification
- Verify that clicking the Prev/Next workshop buttons scrolls or transitions between cards.
- Check layout responsiveness on mobile, tablet, and desktop viewports.
- Confirm alignment, colors, hover transitions, and glassmorphic cards reflect the premium design system.
