"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ChevronRight, Loader2 } from "lucide-react";

interface Survey {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  survey_fields: any[];
}

export default function OfficerSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSurveys = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/officer/surveys?page=${page}&limit=9`);
      setSurveys(res.data.data);
      setTotalPages(res.data.meta?.totalPages || 1);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to load surveys. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading surveys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchSurveys} variant="outline" className="cursor-pointer">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Available Surveys</h1>
        <p className="text-muted-foreground">
          Select a survey to view and submit your response
        </p>
      </div>

      {surveys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <FileText className="h-16 w-16 text-muted-foreground/50" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No Surveys Available</h3>
            <p className="text-sm text-muted-foreground">
              There are no surveys to complete at this time.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey) => (
            <Link
              key={survey.id}
              href={`/officer/surveys/${survey.id}`}
              className="group"
            >
              <div className="h-full p-6 border rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {survey.title}
                    </h3>
                    {survey.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {survey.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(survey.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{survey.survey_fields?.length || 0} fields</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
