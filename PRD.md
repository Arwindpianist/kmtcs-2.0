# KM Training & Consulting Services (KMTCS)

## Website Refresh — PRD

## PART 1 — PRODUCT REQUIREMENTS DOCUMENT (PRD)

### 1. Project Overview

**Project Name:** KMTCS Website Refresh (2026)

**Website:** [https://kmtcs.com.my/](https://kmtcs.com.my/)

**Background:**
The current KMTCS website was built approximately one year ago using Cursor. The core architecture, routing, and business logic are stable and should remain largely untouched. However, several issues have emerged:

* Outdated dependencies/modules pose potential security risks
* UI/UX feels dated, flat, and lacks visual hierarchy
* Excessive exposed `console.log` statements across the app
* Zoho Calendar embeds show demo/sample entries when empty
* `/admin` route is functional but inefficient for managing large datasets

This refresh focuses on **modernization without destabilization**.

---

### 2. Goals & Objectives

#### Primary Goals

1. **Security & Stability**

   * Update all modules to latest stable, non-breaking versions
   * Avoid architectural rewrites
   * Preserve existing APIs, database schema, and flows

2. **UI & UX Revamp**

   * Improve visual hierarchy, spacing, typography, and colour usage
   * Introduce modern UI patterns (cards, sections, motion)
   * Make the site feel professional, trustworthy, and training-focused

3. **Admin Experience Upgrade**

   * Improve `/admin` usability for large data sets
   * Enable faster scanning, filtering, and management
   * Reduce cognitive load for operators

4. **Operational Cleanliness**

   * Remove or gate all debug logging
   * Ensure production logs are intentional and minimal

---

### 3. Non-Goals (Explicitly Out of Scope)

* No redesign of business logic
* No CMS migration
* No database schema changes unless strictly required
* No SEO/content rewrite beyond layout improvements
* No rebranding (logo, name, core colour identity stays consistent)

---

### 4. Target Users

* **Primary:** Corporate clients looking for IT training & consulting
* **Secondary:** Internal admins managing courses, enquiries, and schedules

---

### 5. Functional Requirements

#### 5.1 Dependency & Module Updates

* Audit all dependencies
* Update to latest stable versions only
* Avoid experimental or breaking-major updates unless necessary
* Ensure:

  * Build passes
  * Runtime errors eliminated
  * No console warnings in production

---

#### 5.2 UI & UX Revamp (Public Site)

**Principles:**

* Keep existing structure
* Improve presentation, not logic

**Required Improvements:**

* Better spacing and section separation
* Clear typographic scale (headings vs body)
* Introduce colour accents for hierarchy
* Replace flat sections with cards where appropriate
* Improve CTA visibility
* Add subtle motion (hover, enter animations)

**Do NOT:**

* Change navigation logic
* Remove pages
* Introduce new content sections unless necessary

---

#### 5.3 Zoho Calendar Integration Fix

**Current Issue:**

* Demo/sample entries appear when the calendar is empty

**Required Behaviour:**

* If calendar has no real events:

  * Show a clean empty state
  * Display a message such as:

    > "No upcoming public training sessions. Please contact us for private or on-demand training."

**Implementation Notes:**

* Detect empty or demo-only data
* Never display placeholder/demo events in production

---

#### 5.4 Logging Cleanup

* Remove all stray `console.log`, `console.debug`, `console.warn`
* Introduce a controlled logger if necessary
* Logging rules:

  * Development: verbose allowed
  * Production: errors only

---

#### 5.5 /admin Route — Major Improvements

**This is the primary functional change area.**

##### Problems Today:

* Hard to view large datasets
* Excessive scrolling
* Limited filtering/search
* Poor information density

##### Required Improvements:

* Dashboard-style layout
* Data tables with:

  * Pagination
  * Search
  * Sorting
  * Filters
* Clear status indicators (badges, colours)
* Summary metrics at the top (counts, quick stats)
* Faster navigation between admin sections

##### UX Principles for Admin:

* High information density
* Minimal animation
* Keyboard-friendly where possible

---

### 6. Technical Requirements

* Preserve routing structure
* Preserve API contracts
* No breaking changes to forms
* Ensure production build is clean (no warnings, no logs)

---

### 7. Quality Bar / Acceptance Criteria

* Website builds and runs without console errors
* No demo data visible to public users
* Admin can view large datasets efficiently
* Visual improvement is immediately noticeable
* Core flows remain unchanged

---

### 8. Risks & Mitigation

| Risk                     | Mitigation                            |
| ------------------------ | ------------------------------------- |
| Dependency breakage      | Update incrementally, test per module |
| Scope creep              | Enforce non-goals strictly            |
| Admin UX overengineering | Focus on data density, not visuals    |

---