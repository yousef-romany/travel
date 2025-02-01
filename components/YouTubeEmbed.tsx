import React from "react";

const YouTubeEmbed = ({ videoUrl }: {videoUrl:string}) => {

  return (
    <iframe
      src={videoUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      className="rounded-lg lg:max-w-[550px] md:max-w-full sm:max-w-w-full w-full lg:h-[415px] md:h-[415px] sm:h-[315px]"
    ></iframe>
  );
};

export default YouTubeEmbed;
