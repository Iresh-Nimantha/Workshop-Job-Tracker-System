<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ApiAuthController extends Controller
{
	public function login(Request $request)
	{
		$validated = $request->validate([
			'login' => ['required','string'],
			'password' => ['required','string'],
		]);

		$loginField = filter_var($validated['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

		if (!Auth::attempt([$loginField => $validated['login'], 'password' => $validated['password']])) {
			throw ValidationException::withMessages([
				'login' => ['The provided credentials are incorrect.'],
			]);
		}

		$user = $request->user()->load('role');
		$token = $user->createToken('spa')->plainTextToken;

		return response()->json([
			'token' => $token,
			'user' => $user,
		]);
	}

	public function logout(Request $request)
	{
		$request->user()?->currentAccessToken()?->delete();
		return response()->noContent();
	}
}
