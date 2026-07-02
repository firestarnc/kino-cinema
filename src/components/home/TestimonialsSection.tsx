import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/cinema-data";
import type { Testimonial } from "@/lib/cinema-data";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-cinema-gold text-cinema-gold"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <div
      className="group relative flex flex-col rounded-lg border border-border/30 bg-card/40 p-6 md:p-8 transition-all duration-500 hover:border-primary/20 hover:bg-card/60 opacity-0 animate-fade-up"
      style={{ animationDelay: `${0.2 + index * 0.15}s` }}
    >
      {/* Decorative quote mark */}
      <Quote className="h-8 w-8 text-primary/15 mb-4 -scale-x-100" />

      {/* Quote */}
      <blockquote className="font-playfair italic text-sm md:text-base text-foreground/90 leading-relaxed flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="font-outfit text-sm font-medium text-foreground">
            {testimonial.name}
          </p>
          <p className="font-outfit text-xs text-muted-foreground mt-0.5">
            {testimonial.role}
          </p>
        </div>
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 md:py-24 cinema-curtain">
      <div className="container">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-14">
          <h2
            className="font-playfair italic text-3xl md:text-4xl lg:text-5xl text-foreground opacity-0 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            What Our Guests Say
          </h2>
          <div
            className="mt-4 h-px w-16 bg-gradient-cinema-gold opacity-0 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          />
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-4xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
