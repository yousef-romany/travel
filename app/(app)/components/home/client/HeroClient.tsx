"use client";

import { BackgroundVideo } from "@/components/ui/background-video";

// Egypt travel videos from Cloudinary
const HERO_VIDEOS = [
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922614/Egypt_Unmatched_Diversity_fbtjmf.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922583/Let_s_Go_-_Egypt_A_Beautiful_Destinations_Original_1_ayt7re.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922572/This_is_Egypt_x6b0oo.mp4",
  "https://res.cloudinary.com/dir8ao2mt/video/upload/v1763922524/Escape_to_Egypt_Cinematic_Film_lfq32y.mp4",
];

interface HeroClientProps {
  children: React.ReactNode;
}

export default function HeroClient({ children }: HeroClientProps) {
  return (
    <BackgroundVideo
      videos={HERO_VIDEOS}
      priority
      autoRotate
      rotationInterval={30000}
    >
      {children}
    </BackgroundVideo>
  );
}
