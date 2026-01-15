import AnimatedElement from "@/components/AnimatedElement";

const PageHero = ({ title, subtitle }) => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-gradient">
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <AnimatedElement animation="fadeIn">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {title}
          </h1>
        </AnimatedElement>

        {subtitle && (
          <AnimatedElement animation="fadeIn" delay="100">
            <p className="text-lg sm:text-xl text-foreground max-w-3xl mx-auto">
              {subtitle}
            </p>
          </AnimatedElement>
        )}
      </div>
    </section>
  );
};

export default PageHero;
