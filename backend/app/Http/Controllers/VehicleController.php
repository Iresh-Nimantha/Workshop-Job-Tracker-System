<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Vehicle::with('customer')->latest()->paginate(15);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'registration' => 'required|string|max:100|unique:vehicles,registration',
            'year' => 'nullable|integer',
        ]);

        $vehicle = Vehicle::create($validated);
        return response()->json($vehicle->load('customer'), Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicle $vehicle)
    {
        return $vehicle->load(['customer', 'repairJobs']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehicle $vehicle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'customer_id' => 'sometimes|required|exists:customers,id',
            'make' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'registration' => 'sometimes|required|string|max:100|unique:vehicles,registration,' . $vehicle->id,
            'year' => 'nullable|integer',
        ]);

        $vehicle->update($validated);
        return $vehicle->fresh()->load('customer');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return response()->noContent();
    }
}
