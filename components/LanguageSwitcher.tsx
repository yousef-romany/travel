"use client";

import { useState, useRef } from "react";
import { setCookie, parseCookies } from "nookies";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const COOKIE_NAME = "googtrans";

interface GoogleTranslateWindow extends Window {
  googleTranslateElementInit?: () => void;
  google?: { translate?: unknown };
}

const languages = [
  { title: "English", name: "en" },
  { title: "Deutsch", name: "de" },
  { title: "Français", name: "fr" },
  { title: "Español", name: "es" },
  { title: "Русский", name: "ru" },
];

// Loads the Google Translate widget only when the user first opens the
// language selector. Keeps ~10s of initialization work off the initial load.
function loadGoogleTranslate() {
  const gWindow = window as GoogleTranslateWindow;
  if (typeof window === "undefined" || gWindow.google?.translate) return;

  const script = document.createElement("script");
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);

  gWindow.googleTranslateElementInit = () => {
    const google = gWindow.google as {
      translate: new (opts: { autoDisplay: boolean }, el: string) => void;
    };
    new google.translate(
      {
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };
}

export default function LanguageSwitcher() {
  const cookies = parseCookies();
  const current = cookies[COOKIE_NAME]?.split("/")?.[2] || "en";
  const [selectedLang, setSelectedLang] = useState(current);
  const loadedRef = useRef(false);

  const onOpenChange = (open: boolean) => {
    if (open && !loadedRef.current) {
      loadedRef.current = true;
      loadGoogleTranslate();
    }
  };

  const changeLang = (lang: string) => {
    setSelectedLang(lang);

    // Set Google Translate language cookie
    setCookie(null, COOKIE_NAME, `/auto/${lang}`, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });

    // Reload to apply translation instantly
    window.location.reload();
  };

  return (
    <>
      {/* Hidden element to attach Google Translate to */}
      <div id="google_translate_element" style={{ display: "none" }} className="!hidden"></div>

      <Select value={selectedLang} onValueChange={changeLang} onOpenChange={onOpenChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.name} value={lang.name}>
              {lang.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
