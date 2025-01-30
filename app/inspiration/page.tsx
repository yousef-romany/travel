import Head from "next/head";
import MainContentInpiration from "./components/MainContentInpiration";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZoeHoliday | Be Inspired",
  description: "ZoeHoliday | Let Be Inspiration",
  openGraph: {
    title: "ZoeHoliday | Be Inspired",
    description: "ZoeHoliday | Let Be Inspiration",
    type: "website",
  },
};

const InspirationPage = () => {
  return (
    <>
      <Head>
        <title>{"Be Inspiration"}</title>
        <meta name="description" content={"Let Be Inspiration"} />
        <meta property="og:title" content={"Be Inspiration"} />
        <meta property="og:description" content={"Let Be Inspiration"} />
      </Head>

      <MainContentInpiration />
    </>
  );
};
export default InspirationPage;
