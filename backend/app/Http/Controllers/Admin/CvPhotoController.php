<?php

namespace App\Http\Controllers\Admin;

/**
 * CvPhotoController — same upload/optimize/cleanup pipeline as the profile
 * photo, but saved to the `cv_photo` setting. The CV uses cv_photo when set
 * and falls back to profile_photo otherwise (see CvController::payload).
 */
class CvPhotoController extends ProfilePhotoController
{
    protected const SETTING_KEY = 'cv_photo';
    protected const NAME_PREFIX = 'cv';
}
