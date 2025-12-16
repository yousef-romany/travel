import { Users, Award, Calendar, Globe, Briefcase, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";

export default function BusinessEventsContent() {
    return (
        <div className="min-h-screen bg-background py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 animate-slide-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Business Events in Egypt</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Elevate your corporate gatherings with our comprehensive MICE (Meetings, Incentives, Conferences & Exhibitions) services
                    </p>
                </div>

                <div className="mb-12 animate-slide-up animate-delay-200">
                    <div className="aspect-video w-full bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-8">
                        <Briefcase className="w-32 h-32 text-primary/40" />
                    </div>
                    <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto">
                        From intimate executive meetings to large-scale international conferences, we provide end-to-end event management
                        services in Egypt's most prestigious venues and destinations.
                    </p>
                </div>

                <AnimatedSection className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-primary">Our MICE Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-border hover:border-primary/50 transition-all hover-lift">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Corporate Meetings</CardTitle>
                                <CardDescription>
                                    Professional meeting spaces and coordination
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Executive boardrooms</li>
                                    <li>• Audio-visual equipment</li>
                                    <li>• Catering services</li>
                                    <li>• On-site support staff</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-border hover:border-primary/50 transition-all hover-lift">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Award className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Incentive Travel</CardTitle>
                                <CardDescription>
                                    Reward your top performers
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Exclusive experiences</li>
                                    <li>• Luxury accommodations</li>
                                    <li>• Team building activities</li>
                                    <li>• Gala dinners</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-border hover:border-primary/50 transition-all hover-lift">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Calendar className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Conferences</CardTitle>
                                <CardDescription>
                                    Large-scale event management
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Venue selection</li>
                                    <li>• Registration management</li>
                                    <li>• Speaker coordination</li>
                                    <li>• Technical support</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-border hover:border-primary/50 transition-all hover-lift">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Exhibitions</CardTitle>
                                <CardDescription>
                                    Trade shows and product launches
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Booth design & setup</li>
                                    <li>• Marketing materials</li>
                                    <li>• Attendee coordination</li>
                                    <li>• Logistics management</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-border hover:border-primary/50 transition-all hover-lift">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Team Building</CardTitle>
                                <CardDescription>
                                    Strengthen your team dynamics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Desert adventures</li>
                                    <li>• Nile cruises</li>
                                    <li>• Cultural experiences</li>
                                    <li>• Group challenges</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-border hover:border-primary/50 transition-all hover-lift">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Corporate Travel</CardTitle>
                                <CardDescription>
                                    Business trip management
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Flight arrangements</li>
                                    <li>• Hotel bookings</li>
                                    <li>• Ground transportation</li>
                                    <li>• 24/7 support</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </AnimatedSection>

                <AnimatedSection className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-primary">Premium Event Venues</h2>
                    <div className="bg-card border border-border rounded-lg p-8">
                        <p className="text-lg mb-6">
                            We partner with Egypt's finest hotels, conference centers, and unique venues to host your business events
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-xl">Cairo</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• Five-star hotel conference centers</li>
                                    <li>• Historic venues with Nile views</li>
                                    <li>• Modern convention centers</li>
                                    <li>• Outdoor spaces near pyramids</li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-xl">Red Sea Resorts</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• Beachfront resort facilities</li>
                                    <li>• Marina event spaces</li>
                                    <li>• Outdoor terraces</li>
                                    <li>• Luxury retreat centers</li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-xl">Luxor</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• Nile-side venues</li>
                                    <li>• Temple-adjacent spaces</li>
                                    <li>• Boutique hotel meeting rooms</li>
                                    <li>• Cruise ship conferences</li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-xl">Alexandria</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• Mediterranean-view venues</li>
                                    <li>• Historic Alexandria Library</li>
                                    <li>• Seafront hotels</li>
                                    <li>• Business district centers</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-primary">Why Choose ZoeHoliday for Business Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary">10+</span>
                            </div>
                            <h3 className="font-semibold mb-2">Years Experience</h3>
                            <p className="text-sm text-muted-foreground">Organizing corporate events in Egypt</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary">500+</span>
                            </div>
                            <h3 className="font-semibold mb-2">Events Managed</h3>
                            <p className="text-sm text-muted-foreground">Successful corporate gatherings</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary">24/7</span>
                            </div>
                            <h3 className="font-semibold mb-2">Support Available</h3>
                            <p className="text-sm text-muted-foreground">Dedicated event coordinators</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary">98%</span>
                            </div>
                            <h3 className="font-semibold mb-2">Client Satisfaction</h3>
                            <p className="text-sm text-muted-foreground">Consistently high ratings</p>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection>
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 md:p-12 text-center hover-scale transition-smooth">
                        <h2 className="text-3xl font-bold mb-4 text-primary">Ready to Plan Your Business Event?</h2>
                        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Let our experienced team create a memorable and successful corporate event tailored to your objectives and budget
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg">Request Proposal</Button>
                            <Button size="lg" variant="outline">Contact Event Team</Button>
                        </div>
                        <p className="mt-6 text-sm text-muted-foreground">
                            Email: <a href="mailto:events@zoeholiday.com" className="text-primary hover:underline">events@zoeholiday.com</a> |
                            Phone: <a href="tel:+201555100961" className="text-primary hover:underline">+20 155 510 0961</a>
                        </p>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
