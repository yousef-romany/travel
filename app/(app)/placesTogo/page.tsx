import Head from "next/head";
import MainContentInpiration from "./components/MainContentInpiration";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Places To Go | ZoeHoliday",
  description: "Let Place To Go | ZoeHoliday",
  openGraph: {
    title: "Places To Go | ZoeHoliday",
    description: "Let Place To Go | ZoeHoliday",
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
