<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    /**
     * Display a listing of doctors
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $doctors = Doctor::with('user')->get();
        return response()->json($doctors);
    }

    /**
     * Store a newly created doctor
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'specialization' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'working_hours' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create user first
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'doctor'
        ]);

        // Create doctor profile
        $doctor = Doctor::create([
            'user_id' => $user->id,
            'specialization' => $request->specialization,
            'phone' => $request->phone,
            'address' => $request->address,
            'working_hours' => $request->working_hours,
        ]);

        return response()->json($doctor->load('user'), 201);
    }

    /**
     * Display the specified doctor
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $doctor = Doctor::with('user')->findOrFail($id);
        return response()->json($doctor);
    }

    /**
     * Update the specified doctor
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $doctor = Doctor::with('user')->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $doctor->user_id,
            'password' => 'sometimes|string|min:8',
            'specialization' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'working_hours' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Update user if name or email is provided
        if ($request->has('name') || $request->has('email')) {
            $doctor->user->update([
                'name' => $request->name ?? $doctor->user->name,
                'email' => $request->email ?? $doctor->user->email,
            ]);
        }

        // Update password if provided
        if ($request->has('password')) {
            $doctor->user->update([
                'password' => Hash::make($request->password)
            ]);
        }

        // Update doctor profile
        $doctor->update($request->except(['name', 'email', 'password']));

        return response()->json($doctor->load('user'));
    }

    /**
     * Remove the specified doctor
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $doctor = Doctor::with('user')->findOrFail($id);
        $doctor->user->delete(); // This will cascade delete the doctor due to foreign key
        return response()->json(null, 204);
    }

    /**
     * Get doctors by specialization
     *
     * @param string $specialization
     * @return JsonResponse
     */
    public function getBySpecialization(string $specialization): JsonResponse
    {
        $doctors = Doctor::with('user')
            ->where('specialization', $specialization)
            ->get();
        return response()->json($doctors);
    }

    /**
     * Get available time slots for a doctor
     *
     * @param int $id
     * @return JsonResponse
     */
    public function getAvailableSlots(int $id): JsonResponse
    {
        $doctor = Doctor::findOrFail($id);
        // This is a placeholder - you'll need to implement the actual logic
        // to check against existing appointments
        $slots = [
            'morning' => ['09:00', '10:00', '11:00'],
            'afternoon' => ['14:00', '15:00', '16:00']
        ];
        return response()->json($slots);
    }
}
