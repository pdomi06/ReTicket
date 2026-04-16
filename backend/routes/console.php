<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\ReleaseExpiredReservations;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

app(ConsoleKernel::class)->addCommands([
    ReleaseExpiredReservations::class,
]);

Schedule::command('tickets:release-expired')->everyTenMinutes();
