<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\JobNote;
use App\Models\RepairJob;
use Illuminate\Support\Facades\Auth;

class JobNoteController extends Controller
{
	public function index(RepairJob $repair_job)
	{
		return $repair_job->load(['notes.author'])->notes()->latest()->paginate(20);
	}

	public function store(Request $request, RepairJob $repair_job)
	{
		$validated = $request->validate([
			'note' => 'required|string',
		]);

		$note = JobNote::create([
			'repair_job_id' => $repair_job->id,
			'user_id' => Auth::id(),
			'note' => $validated['note'],
		]);

		return response()->json($note->load('author'), Response::HTTP_CREATED);
	}

	public function destroy(RepairJob $repair_job, JobNote $note)
	{
		// Allow admin or author to delete
		$user = Auth::user();
		if (!$user || (!$user->role || strcasecmp($user->role->name, 'Admin') !== 0) && $note->user_id !== $user->id) {
			abort(Response::HTTP_FORBIDDEN, 'Insufficient permissions');
		}
		$note->delete();
		return response()->noContent();
	}
}
