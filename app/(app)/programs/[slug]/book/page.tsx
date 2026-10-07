"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchProgramOne } from "@/fetch/programs";
import { programPath } from "@/lib/links";
import { dataTypeCardTravel } from "@/type/programs";
import { meta } from "@/type/placesToGo";
import Loading from "@/components/Loading";
import BookingPageContent from "./BookingPageContent";

export default function ProgramBookingPage() {
  const params = useParams();
  const router = useRouter();
  const identifier = decodeURIComponent(params.slug as string);

  const { data, error, isLoading } = useQuery<
    { data: dataTypeCardTravel[]; meta: meta },
    Error
  >({
    queryKey: ["fetchProgramOne", identifier],
    queryFn: async () => await fetchProgramOne(identifier),
  });

  if (isLoading) return <Loading />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const program = data?.data?.at(0);

  if (!program) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const canonicalPath = programPath(program);
  if (canonicalPath !== `/programs/${identifier}`) {
    router.replace(`${canonicalPath}/book`);
    return <Loading />;
  }

  return (
    <BookingPageContent
      program={{
        documentId: program.documentId || "",
        slug: program.slug,
        title: program.title || "",
        price: Number(program.price) || 0,
        duration: Number(program.duration) || 1,
        tripType: program.tripType,
        startTime: program.startTime,
        endTime: program.endTime,
        meetingPoint: program.meetingPoint,
        departureLocation: program.departureLocation,
        returnLocation: program.returnLocation,
        Location: program.Location,
        images: program.images,
        group_tiers: program.group_tiers,
      }}
    />
  );
}
