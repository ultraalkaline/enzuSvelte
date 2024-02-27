import { writable } from 'svelte/store';

export const STATE = {
  Contact:    "contact",
  About:      "about",
  Projects:   "projects",
  Loading:    "loading",
  None:       "none"
};

export const state = writable(STATE.Loading);