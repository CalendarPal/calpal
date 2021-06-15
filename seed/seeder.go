package seed

import (
	"log"

	"github.com/CalendarPal/calpal-api/models"
	"gorm.io/gorm"
)

var users = []models.User{
	models.User{
		Username: "Steven victor",
		Email:    "steven@gmail.com",
		Password: "password",
	},
	models.User{
		Username: "Martin Luther",
		Email:    "luther@gmail.com",
		Password: "password",
	},
}

var events = []models.Event{
	models.Event{
		Title:       "Title 1",
		Description: "Hello world 1",
	},
	models.Event{
		Title:       "Title 2",
		Description: "Hello world 2",
	},
}

func Load(db *gorm.DB) {

	err := db.Debug().Migrator().DropTable(&models.Event{}, &models.User{})
	if err != nil {
		log.Fatalf("cannot drop table: %v", err)
	}

	err = db.Debug().AutoMigrate(&models.User{}, &models.Event{})
	if err != nil {
		log.Fatalf("cannot migrate table: %v", err)
	}

	// err = db.Debug().Migrator().CreateConstraint(&models.Event{}, "author_id", "users(id)", "cascade", "cascade").Error
	// if err != nil {
	// 	log.Fatalf("attaching foreign key error: %v", err)
	// }

	for i, _ := range users {
		users[i].BeforeSave()

		err = db.Debug().Model(&models.User{}).Create(&users[i]).Error
		if err != nil {
			log.Fatalf("cannot seed users table: %v", err)
		}
		events[i].OwnerID = users[i].ID

		err = db.Debug().Model(&models.Event{}).Create(&events[i]).Error
		if err != nil {
			log.Fatalf("cannot seed events table: %v", err)
		}
	}

}
