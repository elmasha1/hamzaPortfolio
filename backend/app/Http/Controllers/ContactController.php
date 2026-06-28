<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\Message;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    /**
     * POST /api/contact
     * Validate and store a contact message in MySQL.
     *
     * Validation is handled by StoreContactRequest, which returns a
     * 422 JSON response with an `errors` object on failure — the React
     * form reads that to show inline field errors.
     */
    public function store(StoreContactRequest $request): JsonResponse
    {
        $message = Message::create($request->validated());

        return response()->json([
            'message' => 'Thanks! Your message has been received.',
            'data'    => $message,
        ], 201);
    }
}
