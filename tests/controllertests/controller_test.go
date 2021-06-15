package controllertests

import (
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/CalendarPal/calpal-api/config"
	"github.com/CalendarPal/calpal-api/controllers"
	"github.com/CalendarPal/calpal-api/models"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var server = controllers.Server{}
var userInstance = models.User{}
var eventInstance = models.Event{}

func TestMain(m *testing.M) {
	config.InitConfig()
	Database()

	os.Exit(m.Run())

}

func Database() {

	var err error

	Dbdriver := "postgres"
	dbConnect := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Dublin",
		viper.GetString("db.host"), viper.GetString("db.user"),
		viper.GetString("db.pass"), viper.GetString("db.name"),
		viper.GetString("db.port"),
	)
	server.DB, err = gorm.Open(postgres.Open(dbConnect), &gorm.Config{DisableForeignKeyConstraintWhenMigrating: true})
	if err != nil {
		fmt.Printf("Cannot connect to %s database", Dbdriver)
		log.Fatal("This is the error:", err)
	} else {
		fmt.Printf("We are connected to the %s database", Dbdriver)
	}
}

func refreshUserTable() error {
	err := server.DB.Debug().Migrator().DropTable(&models.User{})
	if err != nil {
		return err
	}
	err = server.DB.Debug().AutoMigrate(&models.User{})
	if err != nil {
		return err
	}
	log.Printf("Successfully refreshed table")
	return nil
}

func seedOneUser() (models.User, error) {

	err := refreshUserTable()
	if err != nil {
		log.Fatal(err)
	}

	user := models.User{
		Username: "Pet",
		Email:    "pet@gmail.com",
		Password: "password",
	}
	user.BeforeSave()
	err = server.DB.Debug().Model(&models.User{}).Create(&user).Error
	if err != nil {
		return models.User{}, err
	}
	return user, nil
}

func seedUsers() ([]models.User, error) {

	var err error
	if err != nil {
		return nil, err
	}
	users := []models.User{
		models.User{
			Username: "Steven victor",
			Email:    "steven@gmail.com",
			Password: "password",
		},
		models.User{
			Username: "Kenny Morris",
			Email:    "kenny@gmail.com",
			Password: "password",
		},
	}
	for i, _ := range users {
		users[i].BeforeSave()

		err := server.DB.Debug().Model(&models.User{}).Create(&users[i]).Error
		if err != nil {
			return []models.User{}, err
		}
	}
	return users, nil
}

func refreshUserAndEventTable() error {

	err := server.DB.Debug().Migrator().DropTable(&models.User{}, &models.Event{})
	if err != nil {
		return err
	}
	err = server.DB.Debug().AutoMigrate(&models.User{}, &models.Event{})
	if err != nil {
		return err
	}
	log.Printf("Successfully refreshed tables")
	return nil
}

func seedOneUserAndOneEvent() (models.Event, error) {

	err := refreshUserAndEventTable()
	if err != nil {
		return models.Event{}, err
	}
	user := models.User{
		Username: "Sam Phil",
		Email:    "sam@gmail.com",
		Password: "password",
	}
	user.BeforeSave()

	err = server.DB.Debug().Model(&models.User{}).Create(&user).Error
	if err != nil {
		return models.Event{}, err
	}
	event := models.Event{
		Title:       "This is the title sam",
		Description: "This is the content sam",
		OwnerID:     user.ID,
	}
	err = server.DB.Debug().Model(&models.Event{}).Create(&event).Error
	if err != nil {
		return models.Event{}, err
	}
	return event, nil
}

func seedUsersAndEvents() ([]models.User, []models.Event, error) {

	var err error

	if err != nil {
		return []models.User{}, []models.Event{}, err
	}
	var users = []models.User{
		models.User{
			Username: "Steven victor",
			Email:    "steven@gmail.com",
			Password: "password",
		},
		models.User{
			Username: "Magu Frank",
			Email:    "magu@gmail.com",
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

	for i, _ := range users {
		users[i].BeforeSave()

		err = server.DB.Debug().Model(&models.User{}).Create(&users[i]).Error
		if err != nil {
			log.Fatalf("cannot seed users table: %v", err)
		}
		events[i].OwnerID = users[i].ID

		err = server.DB.Debug().Model(&models.Event{}).Create(&events[i]).Error
		if err != nil {
			log.Fatalf("cannot seed events table: %v", err)
		}
	}
	return users, events, nil
}
