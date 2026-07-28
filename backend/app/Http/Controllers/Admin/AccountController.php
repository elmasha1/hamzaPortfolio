<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * The signed-in admin's own name, email and password.
 *
 * The seeded account ships with a password that is published in this
 * repository, so there has to be a way to change it from the dashboard —
 * on a host without shell access there is no other way at all.
 */
class AccountController extends Controller
{
    /** PUT /api/admin/account */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', Rule::unique('users')->ignore($user->id)],
            // Only required when actually changing the password.
            'current_password' => ['nullable', 'string'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $changingPassword = filled($data['password'] ?? null);

        if ($changingPassword) {
            // Proving you know the current password is what stops a stolen or
            // borrowed session from locking the real owner out.
            if (! Hash::check($data['current_password'] ?? '', $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => 'That is not your current password.',
                ]);
            }

            $user->password = Hash::make($data['password']);
        }

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->save();

        // A password change invalidates every other session — anything else
        // holding a token from before keeps working otherwise, which defeats
        // the point of changing it. The token making this request survives.
        if ($changingPassword) {
            $current = $request->user()->currentAccessToken();
            $user->tokens()->where('id', '!=', $current?->id)->delete();
        }

        return response()->json([
            'message' => $changingPassword ? 'Account and password updated.' : 'Account updated.',
            'data' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
        ]);
    }
}
