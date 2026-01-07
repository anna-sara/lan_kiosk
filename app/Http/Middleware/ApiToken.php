<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
         if ($request->header('X-API-KEY') === config('app.apikey_deposit')) {

            return $next($request);

        }  else {
           return response()->json(['code' => 401, 'message' => 'Unauthorized']);
        }
        
    }
}
