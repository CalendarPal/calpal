package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	UID       uuid.UUID `db:"uid" json:"uid"`
	Email     string    `db:"email" json:"email"`
	Password  string    `db:"password" json:"-"`
	Name      string    `db:"name" json:"name"`
	ImageURL  string    `db:"image_url" json:"imageUrl"`
	Website   string    `db:"website" json:"website"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}
