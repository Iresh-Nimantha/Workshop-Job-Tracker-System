<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\JobStatus;

class JobStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return JobStatus::query()->orderBy('name')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:job_statuses,name',
            'description' => 'nullable|string',
        ]);
        $status = JobStatus::create($validated);
        return response()->json($status, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return JobStatus::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $status = JobStatus::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100|unique:job_statuses,name,' . $status->id,
            'description' => 'nullable|string',
        ]);
        $status->update($validated);
        return $status->fresh();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $status = JobStatus::findOrFail($id);
        $status->delete();
        return response()->noContent();
    }
}
