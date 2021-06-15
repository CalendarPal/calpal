package modeltests

import (
	"log"
	"testing"

	"github.com/CalendarPal/calpal-api/models"

	"gopkg.in/go-playground/assert.v1"
)

func TestFindAllEvents(t *testing.T) {

	err := refreshUserAndEventTable()
	if err != nil {
		log.Fatalf("Error refreshing user and event table %v\n", err)
	}
	_, _, err = seedUsersAndEvents()
	if err != nil {
		log.Fatalf("Error seeding user and event  table %v\n", err)
	}
	events, err := eventInstance.FindAllEvents(server.DB)
	if err != nil {
		t.Errorf("this is the error getting the events: %v\n", err)
		return
	}
	assert.Equal(t, len(*events), 2)
}

func TestSaveEvent(t *testing.T) {

	err := refreshUserAndEventTable()
	if err != nil {
		log.Fatalf("Error user and event refreshing table %v\n", err)
	}

	user, err := seedOneUser()
	if err != nil {
		log.Fatalf("Cannot seed user %v\n", err)
	}

	newEvent := models.Event{
		ID:          1,
		Title:       "This is the title",
		Description: "This is the content",
		OwnerID:     user.ID,
	}
	savedEvent, err := newEvent.SaveEvent(server.DB)
	if err != nil {
		t.Errorf("this is the error getting the event: %v\n", err)
		return
	}
	assert.Equal(t, newEvent.ID, savedEvent.ID)
	assert.Equal(t, newEvent.Title, savedEvent.Title)
	assert.Equal(t, newEvent.Description, savedEvent.Description)
	assert.Equal(t, newEvent.OwnerID, savedEvent.OwnerID)

}

func TestGetEventByID(t *testing.T) {

	err := refreshUserAndEventTable()
	if err != nil {
		log.Fatalf("Error refreshing user and event table: %v\n", err)
	}
	event, err := seedOneUserAndOneEvent()
	if err != nil {
		log.Fatalf("Error Seeding table")
	}
	foundEvent, err := eventInstance.FindEventByID(server.DB, event.ID)
	if err != nil {
		t.Errorf("this is the error getting one user: %v\n", err)
		return
	}
	assert.Equal(t, foundEvent.ID, event.ID)
	assert.Equal(t, foundEvent.Title, event.Title)
	assert.Equal(t, foundEvent.Description, event.Description)
}

func TestUpdateAEvent(t *testing.T) {

	err := refreshUserAndEventTable()
	if err != nil {
		log.Fatalf("Error refreshing user and event table: %v\n", err)
	}
	event, err := seedOneUserAndOneEvent()
	if err != nil {
		log.Fatalf("Error Seeding table")
	}
	eventUpdate := models.Event{
		ID:          1,
		Title:       "modiUpdate",
		Description: "modiupdate@gmail.com",
		OwnerID:     event.OwnerID,
	}
	updatedEvent, err := eventUpdate.UpdateAEvent(server.DB)
	if err != nil {
		t.Errorf("this is the error updating the user: %v\n", err)
		return
	}
	assert.Equal(t, updatedEvent.ID, eventUpdate.ID)
	assert.Equal(t, updatedEvent.Title, eventUpdate.Title)
	assert.Equal(t, updatedEvent.Description, eventUpdate.Description)
	assert.Equal(t, updatedEvent.OwnerID, eventUpdate.OwnerID)
}

func TestDeleteAEvent(t *testing.T) {

	err := refreshUserAndEventTable()
	if err != nil {
		log.Fatalf("Error refreshing user and event table: %v\n", err)
	}
	event, err := seedOneUserAndOneEvent()
	if err != nil {
		log.Fatalf("Error Seeding tables")
	}
	isDeleted, err := eventInstance.DeleteAEvent(server.DB, event.ID, event.OwnerID)
	if err != nil {
		t.Errorf("this is the error updating the user: %v\n", err)
		return
	}
	//one shows that the record has been deleted or:
	// assert.Equal(t, int(isDeleted), 1)

	//Can be done this way too
	assert.Equal(t, isDeleted, int64(1))
}
