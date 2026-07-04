<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * PublicCacheHeaders — adds Cache-Control + ETag to public GET responses and
 * answers 304 Not Modified when the client's If-None-Match still matches, so
 * repeat visits skip the payload entirely.
 */
class PublicCacheHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($request->isMethod('GET') && $response->getStatusCode() === 200) {
            $etag = '"'.md5($response->getContent()).'"';
            $response->headers->set('ETag', $etag);
            $response->headers->set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');

            if (trim((string) $request->headers->get('If-None-Match')) === $etag) {
                $response->setNotModified();
            }
        }

        return $response;
    }
}
