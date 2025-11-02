"use client";

import { useState, useEffect } from "react";
import { setCookie, parseCookies } from "nookies";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const COOKIE_NAME = "googtrans";

const languages = [
  { title: "English", name: "en" },
  { title: "Deutsch", name: "de" },
  { title: "Français", name: "fr" },
  { title: "Español", name: "es" },
  { title: "Русский", name: "ru" },
];

export default function LanguageSwitcher() {
  const cookies = parseCookies();
  const current = cookies[COOKIE_NAME]?.split("/")?.[2] || "en";
  const [selectedLang, setSelectedLang] = useState(current);

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

  useEffect(() => {
    // Load Google Translate script once
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Silent initialization (widget hidden)
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <>
      {/* Hidden element to attach Google Translate to */}
      <div id="google_translate_element" style={{ display: "none" }} className="!hidden"></div>

      <Select value={selectedLang} onValueChange={changeLang}>
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
