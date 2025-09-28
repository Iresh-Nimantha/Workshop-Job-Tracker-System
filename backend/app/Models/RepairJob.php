<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RepairJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id', 'customer_id', 'assigned_mechanic_id', 'status_id', 'description', 'estimated_duration_hours', 'priority', 'received_at', 'started_at', 'completed_at',
    ];

    protected $casts = [
        'received_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(JobStatus::class, 'status_id');
    }

    public function mechanic(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_mechanic_id');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(JobNote::class, 'repair_job_id');
    }
}
