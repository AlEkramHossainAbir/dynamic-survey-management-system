"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SurveyListPage() {
  const [surveys, setSurveys] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 

  const loadSurveys = async () => {
    const res = await api.get(`/surveys?page=${page}&limit=10`);
    setSurveys(res.data.data);
    setTotalPages(res.data.meta.totalPages);
  };
  
   useEffect(() => {
    loadSurveys();
  }, [page]);

  const deleteSurvey = async (id: number) => {
    await api.delete(`/surveys/${id}`);
    loadSurveys();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Surveys</h1>
        <Link href="/dashboard/surveys/create">
          <Button>Create Survey</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {surveys.map((survey: any) => {
            console.log("Survey Item:", survey);
            return (
            <TableRow key={survey.id}>
              <TableCell>{survey.title}</TableCell>
              <TableCell>
                {new Date(survey.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="space-x-2">
                <Link href={`/dashboard/surveys/${survey.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => deleteSurvey(survey.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          )
          })}
        </TableBody>
      </Table>

      <div className="flex gap-2">
        <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </Button>
        <Button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
