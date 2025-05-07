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
        if (($handle = fopen(storage_path('app/dataset/disease_symptoms.csv'), 'r')) !== false) {
            $header = fgetcsv($handle); // Read the header row
            logger()->info('Header: ' . json_encode($header)); // Log the header

            while (($row = fgetcsv($handle)) !== false) {
                // logger()->info('Row data: ' . json_encode($row)); // Log the row data
                $rowData = array_combine($header, $row);

                // Collect symptoms where value is not empty (and key is not 'prognosis')
                $patientSymptoms = [];
                foreach ($rowData as $key => $value) {
                    if (!empty($value) && $key !== 'prognosis') {
                        $patientSymptoms[] = trim($key);
                        $symptoms[] = trim($key);
                    }
                }

                logger()->info('Patient Symptoms: ' . json_encode($patientSymptoms)); // Log the symptoms

                $data[] = [
                    'symptoms' => $patientSymptoms,
                    'Disease' => $rowData['prognosis'] ?? 'Unknown'
                ];
            }

            fclose($handle);
        }

        // Unique symptoms list
        $symptoms = array_unique($symptoms);
        $attributes = array_values($symptoms); // Attributes for the tree

        // Reformat data: symptoms => 1/0 format
        $formattedData = [];
        foreach ($data as $entry) {
            $record = [];
            foreach ($symptoms as $symptom) {
                $record[$symptom] = in_array($symptom, $entry['symptoms']) ? 1 : 0;
            }
            $record['Disease'] = $entry['Disease'];
            $formattedData[] = $record;
        }

        // Train the tree
        $tree = $this->id3->train($formattedData, $attributes);

        // Get input symptoms from request
        $inputSymptoms = $request->input('symptoms', []); // Should be an array of symptom names

        // Prepare sample
        $sample = [];
        foreach ($symptoms as $symptom) {
            $sample[$symptom] = in_array($symptom, $inputSymptoms) ? 1 : 0;
        }

        // Classify
        $predictedDisease = $this->id3->classify($tree, $sample);

        return response()->json([
            'predicted_disease' => $predictedDisease
        ]);
    }

    public function getSymptoms()
    {
        $symptoms = [];
    
        if (($handle = fopen(storage_path('app/dataset/disease_symptoms.csv'), 'r')) !== false) {
            $header = fgetcsv($handle); // Get header first
        
            // All columns except 'prognosis' are symptoms
            foreach ($header as $colName) {
                if (strtolower($colName) !== 'prognosis') {
                    $symptoms[] = trim($colName);
                }
            }
            fclose($handle);
        }
    
        return response()->json($symptoms);
    }

}
