"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp, Send, Search, Filter } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Question {
  id: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredByRole?: "guide" | "admin" | "traveler";
  likes: number;
  hasLiked: boolean;
  createdAt: string;
  answeredAt?: string;
  category: "itinerary" | "booking" | "requirements" | "general";
}

interface ProgramQAProps {
  programId: string;
  programTitle: string;
}

export function ProgramQA({ programId, programTitle }: ProgramQAProps) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      userId: 1,
      userName: "Sarah Johnson",
      userAvatar: undefined,
      question: "Is this tour suitable for elderly travelers? My parents are in their 70s.",
      answer: "Absolutely! This tour is designed to be accessible for all ages. We maintain a comfortable pace and provide plenty of rest stops. Our guides are experienced with elderly travelers and we can arrange wheelchair assistance if needed.",
      answeredBy: "Ahmed Hassan",
      answeredByRole: "guide",
      likes: 15,
      hasLiked: false,
      createdAt: "2024-11-20T10:30:00Z",
      answeredAt: "2024-11-20T14:15:00Z",
      category: "requirements",
    },
    {
      id: "2",
      userId: 2,
      userName: "Michael Chen",
      userAvatar: undefined,
      question: "What's included in the hotel accommodation? Is breakfast provided?",
      answer: "Yes! All our hotels include daily breakfast buffet with Egyptian and international options. The hotels are 4-star rated with private bathrooms, AC, and WiFi. You'll also get complimentary bottled water daily.",
      answeredBy: "ZoeHoliday Team",
      answeredByRole: "admin",
      likes: 8,
      hasLiked: false,
      createdAt: "2024-11-18T15:45:00Z",
      answeredAt: "2024-11-18T16:20:00Z",
      category: "itinerary",
    },
    {
      id: "3",
      userId: 3,
      userName: "Emma Wilson",
      userAvatar: undefined,
      question: "Can I book this tour for just one person, or is there a minimum group size?",
      answer: "You can absolutely book as a solo traveler! We welcome individual bookings and will match you with a group. Solo travelers often enjoy meeting new people this way. If you prefer a private tour, that's also available at an additional cost.",
      answeredBy: "Former Traveler",
      answeredByRole: "traveler",
      likes: 12,
      hasLiked: true,
      createdAt: "2024-11-15T09:00:00Z",
      answeredAt: "2024-11-15T11:30:00Z",
      category: "booking",
    },
    {
      id: "4",
      userId: 4,
      userName: "David Martinez",
      userAvatar: undefined,
      question: "What's the cancellation policy if something comes up?",
      likes: 5,
      hasLiked: false,
      createdAt: "2024-12-01T08:20:00Z",
      category: "booking",
    },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleSubmitQuestion = () => {
    if (!user) {
      toast.error("Please log in to ask a question");
      return;
    }

    if (!newQuestion.trim()) {
      toast.error("Please enter your question");
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.username,
      userAvatar: user.profile?.avatar,
      question: newQuestion,
      likes: 0,
      hasLiked: false,
      createdAt: new Date().toISOString(),
      category: "general",
    };

    setQuestions([question, ...questions]);
    setNewQuestion("");
    toast.success("Your question has been posted! We'll answer it soon.");
  };

  const handleLike = (questionId: string) => {
    if (!user) {
      toast.error("Please log in to like questions");
      return;
    }

    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              likes: q.hasLiked ? q.likes - 1 : q.likes + 1,
              hasLiked: !q.hasLiked,
            }
          : q
      )
    );
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      searchQuery === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || q.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const answeredQuestions = filteredQuestions.filter((q) => q.answer);
  const unansweredQuestions = filteredQuestions.filter((q) => !q.answer);

  const getCategoryColor = (category: string) => {
    const colors = {
      itinerary: "bg-blue-100 text-blue-800",
      booking: "bg-green-100 text-green-800",
      requirements: "bg-purple-100 text-purple-800",
      general: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getRoleBadgeColor = (role?: string) => {
    const colors = {
      guide: "bg-orange-100 text-orange-800",
      admin: "bg-blue-100 text-blue-800",
      traveler: "bg-green-100 text-green-800",
    };
    return colors[role as keyof typeof colors] || colors.traveler;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Questions & Answers
        </CardTitle>
        <CardDescription>
          Ask questions about {programTitle} and get answers from guides and fellow travelers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ask Question Section */}
        <div className="space-y-3">
          <h4 className="font-semibold">Have a question?</h4>
          <Textarea
            placeholder="Ask anything about this tour..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            rows={3}
          />
          <Button onClick={handleSubmitQuestion} className="w-full sm:w-auto">
            <Send className="h-4 w-4 mr-2" />
            Post Question
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "itinerary", "booking", "requirements", "general"].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {/* Unanswered Questions */}
          {unansweredQuestions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
                Awaiting Answer ({unansweredQuestions.length})
              </h4>
              <div className="space-y-4">
                {unansweredQuestions.map((q) => (
                  <Card key={q.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={q.userAvatar} />
                          <AvatarFallback>{q.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{q.userName}</span>
                            <Badge variant="outline" className={getCategoryColor(q.category)}>
                              {q.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(q.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{q.question}</p>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(q.id)}
                              className={q.hasLiked ? "text-primary" : ""}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {q.likes}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Answered Questions */}
          {answeredQuestions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
                Answered ({answeredQuestions.length})
              </h4>
              <div className="space-y-4">
                {answeredQuestions.map((q) => (
                  <Card key={q.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4 space-y-3">
                      {/* Question */}
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={q.userAvatar} />
                          <AvatarFallback>{q.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{q.userName}</span>
                            <Badge variant="outline" className={getCategoryColor(q.category)}>
                              {q.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(q.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium">{q.question}</p>
                        </div>
                      </div>

                      {/* Answer */}
                      {q.answer && (
                        <div className="ml-11 pl-4 border-l-2 border-muted space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold">{q.answeredBy}</span>
                            {q.answeredByRole && (
                              <Badge variant="secondary" className={getRoleBadgeColor(q.answeredByRole)}>
                                {q.answeredByRole}
                              </Badge>
                            )}
                            {q.answeredAt && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(q.answeredAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{q.answer}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(q.id)}
                          className={q.hasLiked ? "text-primary" : ""}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {q.likes}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No questions yet. Be the first to ask!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
