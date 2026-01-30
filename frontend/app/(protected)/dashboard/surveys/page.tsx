"use client";

import { useState, useEffect } from "react";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<any[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/surveys", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSurveys(data);
    };

    fetchSurveys();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Surveys</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Create New Survey
      </button>

      <div className="grid gap-4">
        {surveys.map((survey) => (
          <div key={survey.id} className="p-4 bg-white rounded shadow">
            <h2 className="font-bold">{survey.title}</h2>
            <p>{survey.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
