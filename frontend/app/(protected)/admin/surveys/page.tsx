"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Survey {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
}

export default function SurveyListPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadSurveys = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/surveys?page=${page}&limit=9`);
      setSurveys(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/surveys/${deleteId}`);
      await loadSurveys();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Survey Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and view responses for your surveys
          </p>
        </div>
        <Link href="/admin/surveys/create">
          <Button size="lg" className="gap-2 cursor-pointer">
            <Plus className="h-5 w-5" />
            Create Survey
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {surveys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">No Surveys Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Get started by creating your first survey. You can add fields, collect
              responses, and analyze the results.
            </p>
          </div>
          <Link href="/admin/surveys/create">
            <Button size="lg" className="gap-2 mt-4 cursor-pointer">
              <Plus className="h-5 w-5" />
              Create Your First Survey
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Survey Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="group relative bg-card border rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
                      {survey.title}
                    </h3>
                    {survey.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {survey.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(survey.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6 flex gap-2">
                  <Link href={`/admin/surveys/${survey.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2 cursor-pointer">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/surveys/${survey.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/admin/surveys/${survey.id}/submissions`}>
                    <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                      <BarChart3 className="h-4 w-4" />
                      Submissions
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(survey.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

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
        </>
      )}
      

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the survey
              and all its responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
