<?php

namespace App\Service;

class ID3DecisionTree
{
    protected $steps = [];
    protected $decisionPathSteps = []; // NEW

    public function getSteps()
    {
        return $this->steps;
    }

    protected function log($message)
    {
        $this->steps[] = $message;
    }

    public function train($data, $attributes)
    {
        $this->log("Training on " . count($data) . " records");

        $diseases = array_unique(array_column($data, 'Disease'));
        if (count($diseases) === 1) {
            $this->log("All records have same disease: " . $diseases[0]);
            return $diseases[0];
        }

        if (empty($attributes)) {
            $majority = $this->majorityDisease($data);
            $this->log("No attributes left. Returning majority disease: $majority");
            return $majority;
        }

        $bestAttribute = $this->chooseBestAttribute($data, $attributes);
        $this->log("Chosen attribute to split: $bestAttribute");

        $tree = ['attribute' => $bestAttribute, 'branches' => []];

        foreach ([1, 0] as $value) {
            $subset = array_filter($data, fn($item) => $item[$bestAttribute] == $value);

            if (empty($subset)) {
                $majority = $this->majorityDisease($data);
                $this->log("Branch $bestAttribute = $value is empty. Using majority: $majority");
                $tree['branches'][$value] = $majority;
            } else {
                $this->log("Branch $bestAttribute = $value has " . count($subset) . " records");
                $remainingAttributes = array_diff($attributes, [$bestAttribute]);
                $tree['branches'][$value] = $this->train($subset, $remainingAttributes);
            }
        }

        return $tree;
    }

    public function classify($tree, $sample)
    {
        $this->decisionPathSteps = []; // reset for this prediction

        while (is_array($tree)) {
            $attribute = $tree['attribute'];
            $value = $sample[$attribute] ?? 0;

            $this->log("Checking $attribute = $value");
            $this->decisionPathSteps[] = "$attribute = $value";

            if (!isset($tree['branches'][$value])) {
                $this->log("No branch for $value. Returning 'Unknown'");
                $this->decisionPathSteps[] = "→ Unknown";
                return 'Unknown';
            }

            $tree = $tree['branches'][$value];
        }

        $this->log("Final prediction: $tree");
        $this->decisionPathSteps[] = "→ $tree";
        return $tree;
    }

    public function getDecisionPathSteps() // NEW
    {
        return $this->decisionPathSteps;
    }

    private function majorityDisease($data)
    {
        $counts = array_count_values(array_column($data, 'Disease'));
        arsort($counts);
        return array_key_first($counts);
    }

    private function chooseBestAttribute($data, $attributes)
    {
        $baseEntropy = $this->entropy($data);
        $this->log("Base entropy: " . round($baseEntropy, 3));

        $bestInfoGain = -INF;
        $bestAttribute = null;

        foreach ($attributes as $attribute) {
            $infoGain = $baseEntropy;

            foreach ([1, 0] as $value) {
                $subset = array_filter($data, fn($item) => $item[$attribute] == $value);
                if (!empty($subset)) {
                    $prob = count($subset) / count($data);
                    $subsetEntropy = $this->entropy($subset);
                    $infoGain -= $prob * $subsetEntropy;
                }
            }

            $this->log("Info Gain for $attribute: " . round($infoGain, 3));

            if ($infoGain > $bestInfoGain) {
                $bestInfoGain = $infoGain;
                $bestAttribute = $attribute;
            }
        }

        return $bestAttribute;
    }

    private function entropy($data)
    {
        $counts = array_count_values(array_column($data, 'Disease'));
        $entropy = 0.0;
        $total = count($data);

        foreach ($counts as $count) {
            $prob = $count / $total;
            $entropy -= $prob * log($prob, 2);
        }

        return $entropy;
    }

    // Keep if you want debug/training steps (not needed for UI)
    // public function getBriefSteps()
    // {
    //     return array_values(array_filter($this->steps, function ($step) {
    //         return str_starts_with($step, 'Chosen attribute') ||
    //                (str_starts_with($step, 'Branch') && strpos($step, 'has') !== false) ||
    //                str_starts_with($step, 'All records have same disease') ||
    //                str_starts_with($step, 'Final prediction') ||
    //                str_starts_with($step, 'No attributes left');
    //     }));
    // }

    public function evaluateAccuracy($tree, $testData)
{
    $correct = 0;
    $total = count($testData);

    foreach ($testData as $sample) {
        $actual = $sample['prognosis'];
        $predicted = $this->classify($tree, $sample);

        if ($actual === $predicted) {
            $correct++;
        }
    }

    $accuracy = $total > 0 ? ($correct / $total) * 100 : 0;
    $this->log("Accuracy: " . round($accuracy, 2) . "% ($correct / $total correct)");

    return round($accuracy, 2); 
}

}
