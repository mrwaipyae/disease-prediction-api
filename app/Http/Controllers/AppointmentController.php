<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    /**
     * Display a listing of appointments
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $appointments = Appointment::with(['doctor.user', 'user'])->get();
        return response()->json($appointments);
    }

    /**
     * Store a newly created appointment
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'user_id' => 'required|exists:users,id',
            'appointment_date' => 'required|date|after:today',
            'appointment_time' => 'required|date_format:H:i',
            'reason' => 'required|string',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Verify that the user is a patient
        $user = User::findOrFail($request->user_id);
        if ($user->role !== 'patient') {
            return response()->json([
                'message' => 'Only patients can book appointments'
            ], 403);
        }

        // Check if the time slot is available
        $isSlotAvailable = $this->isTimeSlotAvailable(
            $request->doctor_id,
            $request->appointment_date,
            $request->appointment_time
        );

        if (!$isSlotAvailable) {
            return response()->json([
                'message' => 'This time slot is already booked'
            ], 409);
        }

        $appointment = Appointment::create($request->all());
        return response()->json($appointment->load(['doctor.user', 'user']), 201);
    }

    /**
     * Display the specified appointment
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $appointment = Appointment::with(['doctor.user', 'user'])->findOrFail($id);
        return response()->json($appointment);
    }

    /**
     * Update the specified appointment
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::with(['doctor.user', 'user'])->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'doctor_id' => 'sometimes|exists:doctors,id',
            'user_id' => 'sometimes|exists:users,id',
            'appointment_date' => 'sometimes|date|after:today',
            'appointment_time' => 'sometimes|date_format:H:i',
            'reason' => 'sometimes|string',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // If user_id is being updated, verify it's a patient
        if ($request->has('user_id')) {
            $user = User::findOrFail($request->user_id);
            if ($user->role !== 'patient') {
                return response()->json([
                    'message' => 'Only patients can be assigned to appointments'
                ], 403);
            }
        }

        // If date or time is being updated, check slot availability
        if ($request->has('appointment_date') || $request->has('appointment_time')) {
            $date = $request->appointment_date ?? $appointment->appointment_date;
            $time = $request->appointment_time ?? $appointment->appointment_time;
            $doctorId = $request->doctor_id ?? $appointment->doctor_id;

            $isSlotAvailable = $this->isTimeSlotAvailable($doctorId, $date, $time, $id);

            if (!$isSlotAvailable) {
                return response()->json([
                    'message' => 'This time slot is already booked'
                ], 409);
            }
        }

        $appointment->update($request->all());
        return response()->json($appointment->load(['doctor.user', 'user']));
    }

    /**
     * Remove the specified appointment
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();
        return response()->json(null, 204);
    }

    /**
     * Get appointments by doctor
     *
     * @param int $doctorId
     * @return JsonResponse
     */
    public function getByDoctor(int $doctorId): JsonResponse
    {
        $appointments = Appointment::with('user')
            ->where('doctor_id', $doctorId)
            ->get();
        return response()->json($appointments);
    }

    /**
     * Get appointments by user (patient)
     *
     * @param int $userId
     * @return JsonResponse
     */
    public function getByUser(int $userId): JsonResponse
    {
        $user = User::findOrFail($userId);
        if ($user->role !== 'patient') {
            return response()->json([
                'message' => 'Only patients can have appointments'
            ], 403);
        }

        $appointments = Appointment::with('doctor.user')
            ->where('user_id', $userId)
            ->get();
        return response()->json($appointments);
    }

    /**
     * Check if a time slot is available
     *
     * @param int $doctorId
     * @param string $date
     * @param string $time
     * @param int|null $excludeAppointmentId
     * @return bool
     */
    private function isTimeSlotAvailable(
        int $doctorId,
        string $date,
        string $time,
        ?int $excludeAppointmentId = null
    ): bool {
        $query = Appointment::where('doctor_id', $doctorId)
            ->where('appointment_date', $date)
            ->where('appointment_time', $time)
            ->where('status', '!=', 'cancelled');

        if ($excludeAppointmentId) {
            $query->where('id', '!=', $excludeAppointmentId);
        }

        return $query->count() === 0;
    }
}
