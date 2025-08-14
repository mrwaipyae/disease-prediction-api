<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Service\ID3DecisionTree;
use App\Models\Disease;
use App\Models\PredictionHistory; // Assuming you have a model for storing prediction history


class DiseasePredictionController extends Controller
{
    protected $id3;

    public function __construct(ID3DecisionTree $id3)
    {
        $this->id3 = $id3;
    }

    public function diagnose(Request $request)
    {
        $data = [];
        $symptoms = [];

        // Read CSV file
        if (($handle = fopen(storage_path('app/dataset/Training.csv'), 'r')) !== false) {
            $header = fgetcsv($handle); // Read header row

            while (($row = fgetcsv($handle)) !== false) {
                $rowData = array_combine($header, $row);

                $patientSymptoms = [];
                foreach ($rowData as $key => $value) {
                    if (!empty($value) && $key !== 'prognosis') {
                        $patientSymptoms[] = trim($key);
                        $symptoms[] = trim($key);
                    }
                }

                $data[] = [
                    'symptoms' => $patientSymptoms,
                    'Disease' => $rowData['prognosis'] ?? 'Unknown'
                ];
            }

            fclose($handle);
        }

        // Get unique symptoms
        $symptoms = array_unique($symptoms);
        $attributes = array_values($symptoms);

        // Format data for training
        $formattedData = [];
        foreach ($data as $entry) {
            $record = [];
            foreach ($symptoms as $symptom) {
                $record[$symptom] = in_array($symptom, $entry['symptoms']) ? 1 : 0;
            }
            $record['Disease'] = $entry['Disease'];
            $formattedData[] = $record;
        }

        // Train the decision tree
        $tree = $this->id3->train($formattedData, $attributes);

        // Classify user input
        $inputSymptoms = $request->input('symptoms', []);
        $sample = [];
        foreach ($symptoms as $symptom) {
            $sample[$symptom] = in_array($symptom, $inputSymptoms) ? 1 : 0;
        }

        $selectedSymptoms = array_filter($sample, fn($v) => $v == 1);
        $selectedSymptomNames = array_keys($selectedSymptoms);

        $predictedDisease = $this->id3->classify($tree, $sample);

        $matchCount = 0;
        $diseaseCount = 0;

        foreach ($formattedData as $entry) {
            $entrySymptoms = array_filter($entry, function ($val, $key) {
                return $key !== 'Disease' && $val == 1;
            }, ARRAY_FILTER_USE_BOTH);

            // Compare with user-selected symptoms
            $userSymptoms = array_filter($sample, fn($v) => $v == 1);
            $matchingSymptoms = array_intersect_key($entrySymptoms, $userSymptoms);

            // Consider as a match if all user symptoms exist in this entry
            if (count($matchingSymptoms) === count($userSymptoms)) {
                $matchCount++;
                if ($entry['Disease'] === $predictedDisease) {
                    $diseaseCount++;
                }
            }
            
        }

        $confidence = $matchCount > 0 ? round(($diseaseCount / $matchCount) * 100, 2) : null;
        $steps = $this->id3->getDecisionPathSteps();

        // Convert full tree for frontend (optional)
        $treeForFrontend = $this->formatTreeForFrontend($tree);

        // Convert decision path only
        $predictionPathTree = $this->buildPredictionPathTree($steps);

        $response = [
            // 'predicted_disease' => $predictedDisease,
            'confidence' => $confidence,
            'steps' => $steps,
            'tree' => $treeForFrontend,
            'prediction_path_tree' => $predictionPathTree,
            'selected_symptoms' => $selectedSymptomNames,
        ];
        if (!is_null($confidence) && $confidence > 0) {
            if (!$request->user()) {
            return response()->json(['error' => 'Unauthorized. Please log in first.'], 401);
            }
            $response['predicted_disease'] = $predictedDisease;
            $response['confidence'] = $confidence;

            $alreadyExists = PredictionHistory::where('user_id', $request->user()->id)
                ->where('predicted_disease', $predictedDisease)
                ->where('confidence', $confidence)
                // ->whereJsonContains('symptoms', $selectedSymptomNames[0]) // simplified check
                ->where('symptoms', json_encode($selectedSymptomNames))
                ->exists();

             if (!$alreadyExists) {
                PredictionHistory::create([
                    'user_id' => $request->user()->id,
                    'symptoms' => $selectedSymptomNames,
                    'predicted_disease' => $predictedDisease,
                    'confidence' => $confidence,
                    'predicted_at' => now(),
                ]);
            }
        } else {
            $response['message'] = 'No matching records found for the selected symptoms. Unable to predict disease.';
        }

        return response()->json($response);
    }

    public function getSymptoms()
    {
        $symptoms = [];

        if (($handle = fopen(storage_path('app/dataset/Training.csv'), 'r')) !== false) {
            $header = fgetcsv($handle);
            foreach ($header as $colName) {
                if (strtolower($colName) !== 'prognosis') {
                    $symptoms[] = trim($colName);
                }
            }
            fclose($handle);
        }

        return response()->json($symptoms);
    }

    // Convert internal decision tree format to frontend-friendly format
    private function formatTreeForFrontend($node)
    {
        if (!is_array($node)) {
            return ['name' => $node]; // Leaf node
        }

        $children = [];
        if (isset($node['branches'])) {
            foreach ($node['branches'] as $value => $child) {
                $children[] = [
                    'name' => "{$node['attribute']} = $value",
                    'children' => [$this->formatTreeForFrontend($child)]
                ];
            }
        }

        return [
            'name' => $node['attribute'],
            'children' => $children
        ];
    }

    // Build simplified tree from decision steps (e.g., "Fever = 1", "Cough = 0", "→ Flu")
    private function buildPredictionPathTree(array $steps)
    {
    $tree = null;
    $current = &$tree;

    foreach ($steps as $step) {
        // If it's a leaf
        if (str_starts_with($step, '→')) {
            $current['children'][] = ['name' => trim($step)];
            continue;
        }

        // Split into attribute and value
        if (strpos($step, ' = ') !== false) {
            [$attrValue, $val] = explode(' = ', $step);
            $branchLabel = "$attrValue = $val";

            // Add attribute node if this is root
            if ($tree === null) {
                $tree = [
                    'name' => $attrValue,
                    'children' => [
                        ['name' => $branchLabel, 'children' => []]
                    ]
                ];
                $current = &$tree['children'][0];
            } else {
                $current['children'][] = [
                    'name' => $branchLabel,
                    'children' => []
                ];
                $current = &$current['children'][count($current['children']) - 1];
            }
        }
    }

    return $tree ?? ['name' => 'No path'];
    }

private function getSymptomAttributesFromCSV(): array
{
    $symptoms = [];

    if (($handle = fopen(storage_path('app/dataset/Training.csv'), 'r')) !== false) {
        $header = fgetcsv($handle);
        foreach ($header as $colName) {
            if (strtolower($colName) !== 'prognosis') {
                $symptoms[] = trim($colName);
            }
        }
        fclose($handle);
    }

    return $symptoms;
  
}


// public function calculateAccuracy()
// {
//     $csvPath = storage_path('app/dataset/disease_symptoms1.csv');
//     $allData = [];

//     if (($handle = fopen($csvPath, 'r')) !== false) {
//         $header = fgetcsv($handle);
//         while (($row = fgetcsv($handle)) !== false) {
//             $record = array_combine($header, $row);
//             $allData[] = $record;
//         }
//         fclose($handle);
//     }
    

//     if (empty($allData)) {
//         return response()->json(['error' => 'No data found'], 404);
//     }

//     $attributes = $this->getSymptomAttributesFromCSV();

//     $trainingData = array_slice($allData, 0, intval(count($allData) * 0.7));
//     $testData = array_slice($allData, intval(count($allData) * 0.7));

//     $tree = (new ID3DecisionTree())->train($trainingData, $attributes);
//     $id3 = new ID3DecisionTree();
//     $accuracy = $id3->evaluateAccuracy($tree, $testData);

//     return response()->json([
//         'accuracy' => $accuracy,
//         'used_attributes' => $attributes
//     ]);
// }

public function getPredictionHistory(Request $request)
{
    $user = $request->user();

    $history = PredictionHistory::where('user_id', $user->id)
                ->orderBy('predicted_at', 'desc')
                ->get();

    return response()->json($history);
}



}