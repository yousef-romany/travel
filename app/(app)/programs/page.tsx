import Head from "next/head";
import type { Metadata } from "next";
import PageContent from "./components/PageContent";
export const metadata: Metadata = {
  title: "Programs | ZoeHoliday",
  description: "Let Programs | ZoeHoliday",
  openGraph: {
    title: "Programs | ZoeHoliday",
    description: "Let Programs | ZoeHoliday",
    type: "website",
  },
};

const Programs = () => {
  return (
    <>
      <Head>
        <title>{"Programs"}</title>
        <meta name="description" content={"Let Programs"} />
        <meta property="og:title" content={"Programs"} />
        <meta property="og:description" content={"Let Programs"} />
      </Head>
      <PageContent />
    </>
  );
};
export default Programs;
