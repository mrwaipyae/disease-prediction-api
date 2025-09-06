import { useState, useEffect } from "react";
import { useGetAccuracyQuery } from "../apps/features/apiSlice";

export default function ModelEvaluation() {
    const [results, setResults] = useState([]);
    const [accuracy, setAccuracy] = useState(null);

    // Fetch data from your backend API
    const { data: getAccuracy, isLoading, error } = useGetAccuracyQuery();

    // Sync API response into local state
    useEffect(() => {
        if (getAccuracy) {
            setAccuracy(getAccuracy.accuracy ?? null);
            setResults(getAccuracy.results ?? []);
        }
    }, [getAccuracy]);

    if (isLoading) return <p>Loading evaluation...</p>;
    if (error) return <p className="text-red-500">Error loading results</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">ID3 Model Evaluation</h2>

            {accuracy !== null && (
                <p className="mb-4 font-semibold">Accuracy: {accuracy}%</p>
            )}

            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Case</th>
                        <th className="border p-2">Symptoms</th>
                        <th className="border p-2">Actual Disease</th>
                        <th className="border p-2">Predicted Disease</th>
                        <th className="border p-2">Correct</th>
                    </tr>
                </thead>
                <tbody>
                    {results.length > 0 ? (
                        results.map((row, index) => (
                            <tr key={index} className="text-center">
                                <td className="border p-2">{row.case}</td>
                                <td className="border p-2">
                                    {Array.isArray(row.symptoms)
                                        ? row.symptoms.join(", ")
                                        : row.symptoms}
                                </td>
                                <td className="border p-2">{row.actual}</td>
                                <td className="border p-2">{row.predicted}</td>
                                <td className="border p-2">
                                    {row.correct !== "❌" ? "✅ Yes" : "❌ No"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="5"
                                className="text-center p-4 text-gray-500"
                            >
                                No evaluation results available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
