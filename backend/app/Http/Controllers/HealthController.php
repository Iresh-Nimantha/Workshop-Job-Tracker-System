<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class HealthController extends Controller
{
	/**
	 * @OA\Get(
	 *   path="/api/health",
	 *   summary="Health check",
	 *   tags={"System"},
	 *   @OA\Response(response=200, description="OK")
	 * )
	 */
	public function __invoke()
	{
		return response()->json(['status' => 'ok'], Response::HTTP_OK);
	}
}
