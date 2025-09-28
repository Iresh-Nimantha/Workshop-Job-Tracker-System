<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\RepairJob;
use Illuminate\Support\Facades\Auth;

class RepairJobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = RepairJob::with(['vehicle','customer','status','mechanic'])->latest();

        // If mechanic, filter to assigned jobs
        $user = Auth::user();
        if ($user && $user->role && strcasecmp($user->role->name, 'Mechanic') === 0) {
            $query->where('assigned_mechanic_id', $user->id);
        }

        return $query->paginate(15);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'customer_id' => 'required|exists:customers,id',
            'assigned_mechanic_id' => 'required|exists:users,id', // changed from nullable to required
            'status_id' => 'required|exists:job_statuses,id',
            'description' => 'required|string',
            'estimated_duration_hours' => 'nullable|integer',
            'priority' => 'nullable|in:low,medium,high',
            'received_at' => 'nullable|date',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
        ]);

        $job = RepairJob::create($validated);
        return response()->json($job->load(['vehicle','customer','status','mechanic']), Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return RepairJob::with(['vehicle','customer','status','mechanic'])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $job = RepairJob::findOrFail($id);

        $validated = $request->validate([
            'vehicle_id' => 'sometimes|required|exists:vehicles,id',
            'customer_id' => 'sometimes|required|exists:customers,id',
            'assigned_mechanic_id' => 'nullable|exists:users,id',
            'status_id' => 'sometimes|required|exists:job_statuses,id',
            'description' => 'sometimes|required|string',
            'estimated_duration_hours' => 'nullable|integer',
            'priority' => 'nullable|in:low,medium,high',
            'received_at' => 'nullable|date',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
        ]);
        // Enforce: only mechanics may change status via dedicated endpoint.
        // If an admin tries to change status here, ignore the status_id field.
        $user = Auth::user();
        if ($user && $user->role && strcasecmp($user->role->name, 'Admin') === 0) {
            unset($validated['status_id']);
        }

        $job->update($validated);
        return $job->fresh()->load(['vehicle','customer','status','mechanic']);
    }

    /**
     * Update job status (for mechanics)
     */
    public function updateStatus(Request $request, string $id)
    {
        $job = RepairJob::findOrFail($id);
        
        // Check if user is assigned to this job or is admin
        $user = Auth::user();
        if ($user && $user->role && strcasecmp($user->role->name, 'Mechanic') === 0) {
            if ($job->assigned_mechanic_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
        }

        $validated = $request->validate([
            'status_id' => 'required|exists:job_statuses,id',
        ]);

        $job->update($validated);
        return $job->fresh()->load(['vehicle','customer','status','mechanic']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $job = RepairJob::findOrFail($id);
        $job->delete();
        return response()->noContent();
    }
}
