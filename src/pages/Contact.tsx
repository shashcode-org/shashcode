import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import AnimatedElement from "@/components/AnimatedElement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  contact: z.string().trim().min(10).max(15),
  message: z.string().trim().min(1).max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "772df24e-a551-4ede-9740-df53322ceb10",
          name: data.name,
          email: data.email,
          phone: data.contact,
          message: data.message,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast({
          title: "Message sent!",
          description: "We’ll get back to you soon.",
        });
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24">
        <Section
          title="Get In Touch"
          subtitle="Have questions or want to collaborate? We'd love to hear from you."
          className="py-12 md:py-20"
        >
          {/* MOBILE-SAFE WRAPPER */}
          <div className="relative overflow-x-hidden">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
              
              {/* FORM */}
              <AnimatedElement animation="fadeIn" delay="100">
                <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-full mx-auto">
                  <div className="bg-card rounded-lg shadow-md md:shadow-lg p-5 sm:p-6 md:p-8 border border-border">
                    <h3 className="text-2xl font-bold mb-6">Query? Write to us!</h3>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Your name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Number</FormLabel>
                              <FormControl>
                                <Input {...field} type="tel" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="min-h-[120px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </AnimatedElement>

              {/* INFO */}
              <AnimatedElement animation="fadeIn" delay="200">
                <div className="space-y-8">
                  <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-full mx-auto">
                    <div className="bg-card rounded-lg shadow-md md:shadow-lg p-5 sm:p-6 md:p-8 border border-border">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            For Collaboration & Invitations
                          </h4>
                          <a
                            href="mailto:collaboratewithshashwat@gmail.com"
                            className="text-primary hover:underline font-medium text-sm sm:text-base tracking-tight sm:tracking-normal break-all sm:break-normal"
                          >
                            collaboratewithshashwat@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-full mx-auto">
                    <div className="bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 rounded-lg p-6 border border-border">
                      <h4 className="font-semibold mb-4">What to expect?</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Response within 24–48 hours</li>
                        <li>• Confidential handling</li>
                        <li>• Mention urgency if needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimatedElement>

            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
