<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Service\ID3DecisionTree;

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
        if (($handle = fopen(storage_path('app/dataset/Testing1.csv'), 'r')) !== false) {
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

        $predictedDisease = $this->id3->classify($tree, $sample);
        $steps = $this->id3->getDecisionPathSteps();

        // Convert full tree for frontend (optional)
        $treeForFrontend = $this->formatTreeForFrontend($tree);

        // Convert decision path only
        $predictionPathTree = $this->buildPredictionPathTree($steps);

        return response()->json([
            'predicted_disease' => $predictedDisease,
            'steps' => $steps,
            'tree' => $treeForFrontend,
            'prediction_path_tree' => $predictionPathTree
        ]);
    }

    public function getSymptoms()
    {
        $symptoms = [];

        if (($handle = fopen(storage_path('app/dataset/Testing1.csv'), 'r')) !== false) {
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

}
