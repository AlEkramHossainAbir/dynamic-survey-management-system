"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  Loader2,
  Users,
  Calendar,
  FileText,
  Download,
} from "lucide-react";

interface SubmissionAnswer {
  id: number;
  value: string;
  survey_fields: {
    id: number;
    label: string;
    field_type: string;
  };
}

interface Submission {
  id: number;
  submitted_at: string;
  users: {
    id: number;
    name: string;
    email: string;
  };
  submission_answers: SubmissionAnswer[];
}

interface Survey {
  id: number;
  title: string;
  description: string | null;
}

export default function SubmissionsPage() {
  const params = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [surveyRes, submissionsRes] = await Promise.all([
          api.get(`/admin/surveys/${params.id}`),
          api.get(`/admin/surveys/${params.id}/submissions?page=${page}&limit=10`),
        ]);
        setSurvey(surveyRes.data);
        setSubmissions(submissionsRes.data.data);
        setTotalPages(submissionsRes.data.meta.totalPages);
        setTotal(submissionsRes.data.meta.total);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, page]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <p className="text-red-500">{error || "Survey not found"}</p>
          <Link href="/admin/surveys">
            <Button variant="outline" className="cursor-pointer">Back to Surveys</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 w-full">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-6">
          <Link href="/admin/surveys">
            <Button variant="ghost" size="sm" className="gap-2 cursor-pointer hover:bg-accent">
              <ChevronLeft className="h-4 w-4" />
              Back to Surveys
            </Button>
          </Link>

          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-sm">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2 flex-1">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {survey.title}
                </h1>
                {survey.description && (
                  <p className="text-muted-foreground text-lg">{survey.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 space-y-3 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 text-primary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide">Total Responses</span>
              </div>
              <p className="text-4xl font-bold">{total}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20 rounded-xl p-6 space-y-3 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide">Latest Response</span>
              </div>
              <p className="text-xl font-semibold">
                {submissions.length > 0
                  ? new Date(submissions[0].submitted_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : "N/A"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 rounded-xl p-6 space-y-3 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 text-green-600">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide">Response Rate</span>
              </div>
              <p className="text-4xl font-bold">100%</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-sm border-2 border-dashed rounded-2xl">
            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
              <FileText className="h-16 w-16 text-primary" />
            </div>
            <div className="text-center space-y-3 max-w-md">
              <h3 className="text-2xl font-bold">No Submissions Yet</h3>
              <p className="text-muted-foreground leading-relaxed">
                This survey hasn&apos;t received any responses yet. Share it with officers
                to start collecting valuable data.
              </p>
            </div>
            <Link href="/admin/surveys">
              <Button size="lg" className="gap-2 mt-4">
                Back to Surveys
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-card/80 backdrop-blur-sm border rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4 pb-4 border-b">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-lg">{submission.users.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.users.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {submission.submission_answers.map((answer, idx) => (
                      <div
                        key={answer.id}
                        className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium text-sm text-muted-foreground">
                            {answer.survey_fields.label}
                          </p>
                          <p className="text-base font-medium">{answer.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-5 bg-card/50 backdrop-blur-sm border rounded-xl">
                <p className="text-sm text-muted-foreground font-medium">
                  Showing {(page - 1) * 10 + 1}-{Math.min(page * 10, total)} of {total} submissions
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="cursor-pointer"
                  >
                    Previous
                  </Button>
                  <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
