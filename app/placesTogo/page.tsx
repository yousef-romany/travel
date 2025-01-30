import Head from "next/head";
import MainContentInpiration from "./components/MainContentInpiration";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZoeHoliday | Be Inspired",
  description: "ZoeHoliday | Let Place To Go",
  openGraph: {
    title: "ZoeHoliday | Be Inspired",
    description: "ZoeHoliday | Let Place To Go",
    type: "website",
  },
};

const InspirationPage = () => {
  return (
    <>
      <Head>
        <title>{"Place To Go"}</title>
        <meta name="description" content={"Let Place To Go"} />
        <meta property="og:title" content={"Place To Go"} />
        <meta property="og:description" content={"Let Place To Go"} />
      </Head>

      <MainContentInpiration />
    </>
  );
};
export default InspirationPage;
