package models

import (
	"log"
	"time"

	"github.com/CalendarPal/calpal-api/database"
	"gorm.io/gorm"
)

var db *gorm.DB

func InitModels() {
	var user User
	db = database.InitDB()
	db.AutoMigrate(&User{})
	db.First(&user, "uid = ?", "1")
	log.Println(user)
}

type User struct {
	UID       string    `gorm:"primaryKey" json:"uid,omitempty"`
	Username  string    `json:"username,omitempty"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at,omitempty"`
}
