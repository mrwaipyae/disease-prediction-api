<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class DiseaseInformationController extends Controller
{
    /**
     * Get information about a specific disease
     *
     * @param string $disease Disease name
     * @return JsonResponse
     */
    public function getInfo(string $disease): JsonResponse
    {
        try {
            // Use National Library of Medicine's Clinical Tables API
            $response = Http::withoutVerifying()->get('https://clinicaltables.nlm.nih.gov/api/conditions/v3/search', [
                'terms' => $disease,
                'ef' => 'DESCRIPTION,TREATMENT'
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // The API returns data in this format:
                // [count, terms, descriptions, treatments]
                if (isset($data[0]) && $data[0] > 0) {
                    $description = $data[2][0] ?? "No description available";
                    $treatments = $data[3][0] ?? ["No treatment information available"];
                    
                    // If treatments is an array, join them with newlines
                    $treatmentText = is_array($treatments) ? implode("\n", $treatments) : $treatments;

                    return response()->json([
                        'description' => $description,
                        'treatment' => $treatmentText
                    ]);
                }
            }

            // If Clinical Tables API fails, try alternative source
            return $this->getAlternativeDiseaseInfo($disease);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch disease information',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get disease information from alternative source
     */
    private function getAlternativeDiseaseInfo(string $disease): JsonResponse
    {
        try {
            // Try National Library of Medicine's MeSH API
            $response = Http::withoutVerifying()->get('https://id.nlm.nih.gov/mesh/lookup/descriptor', [
                'label' => $disease,
                'match' => 'exact'
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data[0]['resource'])) {
                    $meshId = $data[0]['resource'];
                    
                    // Get detailed information using the MeSH ID
                    $detailResponse = Http::withoutVerifying()->get("https://id.nlm.nih.gov/mesh/lookup/details", [
                        'descriptor' => $meshId
                    ]);

                    if ($detailResponse->successful()) {
                        $detailData = $detailResponse->json();
                        $description = $detailData['scopeNote'] ?? "No description available";
                        $treatment = $detailData['pharmacologicalAction'] ?? "No treatment information available";

                        return response()->json([
                            'description' => $description,
                            'treatment' => $treatment
                        ]);
                    }
                }
            }

            // If all APIs fail, return a generic response
            return response()->json([
                'description' => "Information about {$disease} is not available in our medical databases.",
                'treatment' => "Please consult a healthcare professional for treatment options."
            ]);

        } catch (\Exception $e) {
            \Log::error("Alternative API error: " . $e->getMessage());
            return response()->json([
                'description' => "Information about {$disease} is not available in our medical databases.",
                'treatment' => "Please consult a healthcare professional for treatment options."
            ]);
        }
    }
}
