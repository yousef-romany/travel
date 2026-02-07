"use client";

import CardTravels from "../../components/CardTravels";
import { ProgramType } from "@/fetch/programs";

interface RelatedProgramsProps {
    programs: ProgramType[];
}

export function RelatedPrograms({ programs }: RelatedProgramsProps) {

    if (!programs || programs.length === 0) return null;

    return (
        <section className="mb-12 animate-slide-up animate-delay-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                        You Might Also Like
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Discover more amazing experiences in Egypt
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {programs.map((program) => (
                    <CardTravels
                        key={program.id}
                        id={program.id}
                        documentId={program.documentId}
                        images={program.images as any}
                        title={program.title}
                        descraption={program.descraption}
                        Location={program.Location}
                        duration={program.duration}
                        price={program.price}
                        rating={program.rating}
                        overView={program.overView}
                    />
                ))}
            </div>
        </section>
    );
}
