<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /** GET /api/admin/messages — list all messages, newest first. */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Message::latest()->get(),
            'meta' => [
                'total' => Message::count(),
                'unread' => Message::where('read', false)->count(),
            ],
        ]);
    }

    /** GET /api/admin/messages/{message} — a single message. */
    public function show(Message $message): JsonResponse
    {
        return response()->json(['data' => $message]);
    }

    /** PATCH /api/admin/messages/{message} — toggle/set read status. */
    public function update(Request $request, Message $message): JsonResponse
    {
        $data = $request->validate(['read' => ['required', 'boolean']]);
        $message->update($data);

        return response()->json(['data' => $message]);
    }

    /** DELETE /api/admin/messages/{message}. */
    public function destroy(Message $message): JsonResponse
    {
        $message->delete();

        return response()->json(['message' => 'Message deleted.']);
    }
}
