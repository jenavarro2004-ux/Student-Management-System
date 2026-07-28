<?php

namespace App\Models;

use Database\Factories\CourseClassFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseClass extends Model
{
    /** @use HasFactory<CourseClassFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'teacher_id',
    ];

    /**
     * Get the teacher assigned to the class.
     *
     * @return BelongsTo<User, $this>
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
