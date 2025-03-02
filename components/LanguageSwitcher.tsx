"use client"; // This is needed because the useEffect is client-side only
import { memo, useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Adjust the import as needed

const COOKIE_NAME = "language"; // Define your cookie name

const LanguageSwitcher = () => {
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [languages, setLanguages] = useState([
    { title: "English", name: "en" },
    { title: "Deutsch", name: "de" },
    { title: "Español", name: "es" },
    { title: "Français", name: "fr" },
    { title: "日本語", name: "ja" }, // Japanese
    { title: "中文", name: "zh-CN" }, // Chinese
    { title: "Português (Brasil)", name: "pt-BR" }, // Brazilian Portuguese
    { title: "Português", name: "pt" }, // Portuguese
    { title: "Русский", name: "ru" }, // Russian
  ]);

  const handleChangeLang = (lang: string) => {
    setSelectedLang(lang);
    setCookie(null, COOKIE_NAME, "/auto/" + lang, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // Cookie expires in 30 days
    });

    // Trigger translation after language selection
    if (window.google && window.google.translate) {
      const translateElement = new window.google.translate.TranslateElement(
        {
          pageLanguage: lang,
          includedLanguages: "en,de,es,fr,ja,zh-CN,pt-BR,pt,ru", // Add your supported languages here
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false, // Avoid automatic display of the Google Translate widget
        },
        "google_translate_element"
      );

      // Optionally reload the page after translation
      window.location.reload();
    }
  };

  // Load Google Translate API script when the component mounts
  useEffect(() => {
    const loadGoogleTranslate = () => {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    if (!window.google || !window.google.translate) {
      loadGoogleTranslate();
    }

    // Read the cookie to set the language if already selected
    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[COOKIE_NAME];
    let languageValue;
    if (existingLanguageCookieValue) {
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }

    if (global.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
      languageValue = global.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
    }

    if (languageValue) {
      setSelectedLang(languageValue);
    }
  }, []);

  // Don't display anything if current language information is unavailable
  if (!selectedLang) {
    return null;
  }

  return (
    <div>
      <Select value={selectedLang} onValueChange={handleChangeLang}>
        <SelectTrigger className="!text-primary w-[220px]" defaultValue={selectedLang}>
          <SelectValue className="!text-primary" placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang, key) => (
            <SelectItem className="!text-primary" key={key} value={lang.name}>
              {lang.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default memo(LanguageSwitcher);
