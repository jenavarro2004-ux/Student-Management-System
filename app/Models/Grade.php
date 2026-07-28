<?php

namespace App\Models;

use Database\Factories\GradeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    /** @use HasFactory<GradeFactory> */
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_name',
        'score',
        'letter_grade',
        'remarks',
    ];

    /**
     * Get the student associated with the grade.
     *
     * @return BelongsTo<User, $this>
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
