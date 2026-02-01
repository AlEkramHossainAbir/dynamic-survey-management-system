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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [surveyRes, submissionsRes] = await Promise.all([
          api.get(`/admin/surveys/${params.id}`),
          api.get(`/admin/surveys/${params.id}/submissions`),
        ]);
        setSurvey(surveyRes.data);
        setSubmissions(submissionsRes.data.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const exportToCSV = () => {
    if (submissions.length === 0) return;

    // Get all unique field labels
    const fieldLabels = new Set<string>();
    submissions.forEach((sub) => {
      sub.submission_answers.forEach((ans) => {
        fieldLabels.add(ans.survey_fields.label);
      });
    });

    const headers = ["User", "Email", "Submitted At", ...Array.from(fieldLabels)];
    const rows = submissions.map((sub) => {
      const answerMap: Record<string, string> = {};
      sub.submission_answers.forEach((ans) => {
        answerMap[ans.survey_fields.label] = ans.value;
      });

      return [
        sub.users.name,
        sub.users.email,
        new Date(sub.submitted_at).toLocaleString(),
        ...Array.from(fieldLabels).map((label) => answerMap[label] || ""),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${survey?.title || "survey"}-submissions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <Link href="/admin/dashboard/surveys">
            <Button variant="outline">Back to Surveys</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/admin/dashboard/surveys">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Surveys
          </Button>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{survey.title}</h1>
            {survey.description && (
              <p className="text-muted-foreground">{survey.description}</p>
            )}
          </div>
          {submissions.length > 0 && (
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-card border rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Total Responses</span>
            </div>
            <p className="text-2xl font-bold">{submissions.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Latest Response</span>
            </div>
            <p className="text-lg font-semibold">
              {submissions.length > 0
                ? new Date(submissions[0].submitted_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Response Rate</span>
            </div>
            <p className="text-2xl font-bold">100%</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-card border rounded-lg">
          <div className="p-4 bg-muted rounded-full">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">No Submissions Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              This survey hasn't received any responses yet. Share it with officers
              to start collecting data.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">User</TableHead>
                  <TableHead className="w-[180px]">Submitted At</TableHead>
                  <TableHead>Responses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium">{submission.users.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {submission.users.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(submission.submitted_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {submission.submission_answers.map((answer) => (
                          <div
                            key={answer.id}
                            className="text-sm border-l-2 border-primary/20 pl-3 py-1"
                          >
                            <span className="font-medium text-muted-foreground">
                              {answer.survey_fields.label}:
                            </span>{" "}
                            <span>{answer.value}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
