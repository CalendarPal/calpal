package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	UID       uuid.UUID `gorm:"primary_key;auto_increment" json:"uid"`
	Name      string    `gorm:"size:255;not null;unique" json:"name"`
	Email     string    `gorm:"size:100;not null;unique" json:"email"`
	Password  string    `gorm:"size:100;not null;" json:"password"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	ImageURL  string    `json:"imageUrl"`
}
