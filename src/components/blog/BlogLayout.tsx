import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { ReactNode } from "react";

interface BlogLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const BlogLayout = ({ title, subtitle, children }: BlogLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <PageHero title={title} subtitle={subtitle} />

      {/* Main Content */}
      <main className="flex-1">
        <section className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-0 py-16">
          {children}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogLayout;
