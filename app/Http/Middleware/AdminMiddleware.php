<?php
// namespace App\Http\Middleware;

// use Closure;
// use Illuminate\Support\Facades\Auth;

// class AdminMiddleware
// {
//     public function handle($request, Closure $next)
//     {
//         if (Auth::check() && Auth::user()->role === 'admin') {
//             return $next($request);
//         }

//         abort(403, 'Unauthorized');
//     }
// }
// app/Http/Middleware/AdminMiddleware.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle($request, Closure $next)
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden. Admins only.'], 403);
    }
}

?>
