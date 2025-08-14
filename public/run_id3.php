<?php

require_once 'vendor/autoload.php'; // Composer autoload (adjust path if needed)

use App\Service\ID3DecisionTree;

/**
 * Load CSV into associative array.
 */
function loadCsv($filename)
{
    $rows = array_map('str_getcsv', file($filename));
    $header = array_map('trim', $rows[0]);
    unset($rows[0]);

    $data = [];
    foreach ($rows as $row) {
        $row = array_map('trim', $row);
        if (count($row) !== count($header)) {
            // Skip rows that don’t match the header column count
            continue;
        }
        $data[] = array_combine($header, $row);
    }

    return $data;
}

function normaliseData($data)
{
    foreach ($data as &$row) {
        foreach ($row as $key => &$value) {
            if ($key !== 'prognosis' && $key !== 'Disease') {
                $value = (int) $value;
            }
        }
    }
    return $data;
}

/**
 * Main execution logic.
 */
function runID3Model()
{
    $filename = $GLOBALS['argv'][1] ?? 'Training.csv';
    $filePath = __DIR__ . "/../storage/app/dataset/$filename";

    if (!file_exists($filePath)) {
        die("❌ File not found: $filePath\n");
    }

    $data = loadCsv($filePath);
    $data = normaliseData($data);

    // Rename 'prognosis' to 'Disease' if needed
    foreach ($data as &$row) {
        if (isset($row['prognosis'])) {
            $row['Disease'] = $row['prognosis'];
        }
    }

    if (count($data) < 2) {
        die("❌ Not enough valid rows to proceed.\n");
    }

    // Shuffle and split
    // srand(42);
    shuffle($data);
    $total = count($data);
    $trainSize = (int) ($total * 0.8);
    $trainingData = array_slice($data, 0, $trainSize);
    $testingData = array_slice($data, $trainSize);

    if (empty($trainingData)) {
        die("❌ Training data is empty.\n");
    }

    // Attributes
    $firstRow = $trainingData[0] ?? null;
    if (!$firstRow) {
        die("❌ Invalid training data format.\n");
    }

    $attributes = array_keys($firstRow);
    $attributes = array_filter($attributes, fn($attr) => $attr !== 'Disease' && $attr !== 'prognosis');

    // Train and evaluate
    $id3 = new \App\Service\ID3DecisionTree();
    $tree = $id3->train($trainingData, $attributes);

    $accuracy = $id3->evaluateAccuracy($tree, $testingData);

    echo "==== ID3 Decision Tree Evaluation ====\n";
    echo "Training samples: " . count($trainingData) . "\n";
    echo "Testing samples: " . count($testingData) . "\n";
    echo "Model Accuracy: $accuracy%\n\n";

    echo "==== Training Steps Log ====\n";
    foreach ($id3->getSteps() as $step) {
        echo "- $step\n";
    }
}

// Run it
runID3Model();
