<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description',
    ];

    public function repairJobs(): HasMany
    {
        return $this->hasMany(RepairJob::class, 'status_id');
    }
}
