import { writable } from 'svelte/store';

export const STATE = {
  Contact:    "contact",    // If the contact grid is shown
  About:      "about",      // If the about page is shown
  Projects:   "projects",   // If the projects grid is shown
  Project:    "project",    // If a project is shown
  Loading:    "loading",    // If the page is loading
  MobileMenu: "mobileMenu", // If the hamburger menu is shown (mobile)
};

export const state = writable(STATE.Loading);