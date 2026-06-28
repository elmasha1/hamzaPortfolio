<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

/**
 * Base controller. All app controllers extend this. The traits provide the
 * $this->authorize() and $this->validate() helpers used across Laravel apps.
 */
abstract class Controller
{
    use AuthorizesRequests, ValidatesRequests;
}
