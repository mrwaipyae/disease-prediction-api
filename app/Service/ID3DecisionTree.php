<?php

namespace App\Service;

use Phpml\Classification\DecisionTree;
use Phpml\ModelManager;

class ID3DecisionTree
{
    public function train($data, $attributes) //build decision tree
    {
        // If all records have the same disease, return that disease
        $diseases = array_unique(array_column($data, 'Disease'));
        if (count($diseases) === 1) {
            return $diseases[0];
        }

        // If no attributes left, return the most common disease
        if (empty($attributes)) {
            return $this->majorityDisease($data);
        }

        // Select the best attribute to split
        $bestAttribute = $this->chooseBestAttribute($data, $attributes);

        // Build the tree //Initializes the tree node with the best attribute.
        $tree = ['attribute' => $bestAttribute, 'branches' => []];

        //Recursively build branches for attribute values
        foreach ([1, 0] as $value) {
            $subset = array_filter($data, function ($item) use ($bestAttribute, $value) {
                return $item[$bestAttribute] == $value;
            });

            //If a branch has no data, assign the most common disease.
            //Otherwise, recurse using the remaining attributes.

            if (empty($subset)) {
                $tree['branches'][$value] = $this->majorityDisease($data);
            } else {
                $remainingAttributes = array_diff($attributes, [$bestAttribute]);
                $tree['branches'][$value] = $this->train($subset, $remainingAttributes);
            }
        }

        return $tree;
    }

    public function classify($tree, $sample)
    {
        while (is_array($tree)) {
            $attribute = $tree['attribute'];
            $value = isset($sample[$attribute]) ? $sample[$attribute] : 0;
            $tree = $tree['branches'][$value] ?? null;

            if ($tree === null) {
                return 'Unknown';
            }
        }

        return $tree;
    }

    //Counts how many times each disease appears.
    //Sorts by frequency, then returns the most common one.
    private function majorityDisease($data)
    {
        $counts = array_count_values(array_column($data, 'Disease'));
        arsort($counts);
        return array_key_first($counts);
    }

  

    private function chooseBestAttribute($data, $attributes)
    {
        //Loops through each attribute to find which gives the highest information gain.
        $baseEntropy = $this->entropy($data);
        $bestInfoGain = -INF;
        $bestAttribute = null;

        foreach ($attributes as $attribute) {
            $infoGain = $baseEntropy;
            foreach ([1, 0] as $value) {
                $subset = array_filter($data, function ($item) use ($attribute, $value) {
                    return $item[$attribute] == $value;
                });

                if (!empty($subset)) {
                    $prob = count($subset) / count($data);
                    $infoGain -= $prob * $this->entropy($subset);
                }
            }

            //Calculates expected entropy after splitting by this attribute.
            //Subtracts from base entropy to get information gain.

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
}
// Builds a decision tree using the ID3 algorithm.

// Splits on binary attributes (1/0).

// Uses entropy and information gain to select attributes.

// Classifies samples by walking the tree.

// Returns Unknown if the tree lacks a branch for the sample.