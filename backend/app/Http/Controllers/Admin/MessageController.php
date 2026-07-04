<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /** GET /api/admin/messages?page=N — paginated list, newest first. */
    public function index(Request $request): JsonResponse
    {
        $paginator = Message::latest()->paginate(25);

        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'total' => $paginator->total(),
                'unread' => Message::where('read', false)->count(),
                'page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
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
