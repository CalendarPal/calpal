package controllertests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/CalendarPal/calpal-api/models"
	"github.com/gorilla/mux"

	"gopkg.in/go-playground/assert.v1"
)

func TestCreateEvent(t *testing.T) {

	err := refreshUserAndEventTable()
	if err != nil {
		log.Fatal(err)
	}
	user, err := seedOneUser()
	if err != nil {
		log.Fatalf("Cannot seed user %v\n", err)
	}
	token, err := server.SignIn(user.Email, "password") //Note the password in the database is already hashed, we want unhashed
	if err != nil {
		log.Fatalf("cannot login: %v\n", err)
	}
	tokenString := fmt.Sprintf("Bearer %v", token)

	samples := []struct {
		inputJSON    string
		statusCode   int
		title        string
		description  string
		owner_id     uint32
		tokenGiven   string
		errorMessage string
	}{
		{
			inputJSON:    `{"title":"The title", "description": "the description", "owner_id": 1}`,
			statusCode:   201,
			tokenGiven:   tokenString,
			title:        "The title",
			description:  "the description",
			owner_id:     user.ID,
			errorMessage: "",
		},
		{
			inputJSON:    `{"title":"The title", "description": "the description", "owner_id": 1}`,
			statusCode:   500,
			tokenGiven:   tokenString,
			errorMessage: "Title Already Taken",
		},
		{
			// When no token is passed
			inputJSON:    `{"title":"When no token is passed", "description": "the description", "owner_id": 1}`,
			statusCode:   401,
			tokenGiven:   "",
			errorMessage: "Unauthorized",
		},
		{
			// When incorrect token is passed
			inputJSON:    `{"title":"When incorrect token is passed", "description": "the description", "owner_id": 1}`,
			statusCode:   401,
			tokenGiven:   "This is an incorrect token",
			errorMessage: "Unauthorized",
		},
		{
			inputJSON:    `{"title": "", "description": "The description", "owner_id": 1}`,
			statusCode:   422,
			tokenGiven:   tokenString,
			errorMessage: "Required Title",
		},
		{
			inputJSON:    `{"title": "This is a title", "description": "", "owner_id": 1}`,
			statusCode:   422,
			tokenGiven:   tokenString,
			errorMessage: "Required Description",
		},
		{
			inputJSON:    `{"title": "This is an awesome title", "description": "the description"}`,
			statusCode:   422,
			tokenGiven:   tokenString,
			errorMessage: "Required Owner",
		},
		{
			// When user 2 uses user 1 token
			inputJSON:    `{"title": "This is an awesome title", "description": "the description", "owner_id": 2}`,
			statusCode:   401,
			tokenGiven:   tokenString,
			errorMessage: "Unauthorized",
		},
	}
	for _, v := range samples {

		req, err := http.NewRequest("POST", "/events", bytes.NewBufferString(v.inputJSON))
		if err != nil {
			t.Errorf("this is the error: %v\n", err)
		}
		rr := httptest.NewRecorder()
		handler := http.HandlerFunc(server.CreateEvent)

		req.Header.Set("Authorization", v.tokenGiven)
		handler.ServeHTTP(rr, req)

		responseMap := make(map[string]interface{})
		err = json.Unmarshal([]byte(rr.Body.String()), &responseMap)
		if err != nil {
			fmt.Printf("Cannot convert to json: %v", err)
		}
		assert.Equal(t, rr.Code, v.statusCode)
		if v.statusCode == 201 {
			assert.Equal(t, responseMap["title"], v.title)
			assert.Equal(t, responseMap["description"], v.description)
			assert.Equal(t, responseMap["owner_id"], float64(v.owner_id)) //just for both ids to have the same type
		}
		if v.statusCode == 401 || v.statusCode == 422 || v.statusCode == 500 && v.errorMessage != "" {
			assert.Equal(t, responseMap["error"], v.errorMessage)
		}
	}
}

func TestGetEvents(t *testing.T) {

	err := refreshUserAndEventTable()
	if err != nil {
		log.Fatal(err)
	}
	_, _, err = seedUsersAndEvents()
	if err != nil {
		log.Fatal(err)
	}

	req, err := http.NewRequest("GET", "/events", nil)
	if err != nil {
		t.Errorf("this is the error: %v\n", err)
	}
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(server.GetEvents)
	handler.ServeHTTP(rr, req)

	var events []models.Event
	err = json.Unmarshal([]byte(rr.Body.String()), &events)

	assert.Equal(t, rr.Code, http.StatusOK)
	assert.Equal(t, len(events), 2)
}
func TestGetEventByID(t *testing.T) {

	err := refreshUserAndEventTable()
	if err != nil {
		log.Fatal(err)
	}
	event, err := seedOneUserAndOneEvent()
	if err != nil {
		log.Fatal(err)
	}
	eventSample := []struct {
		id           string
		statusCode   int
		title        string
		description  string
		owner_id     uint32
		errorMessage string
	}{
		{
			id:          strconv.Itoa(int(event.ID)),
			statusCode:  200,
			title:       event.Title,
			description: event.Description,
			owner_id:    event.OwnerID,
		},
		{
			id:         "unknown",
			statusCode: 400,
		},
	}
	for _, v := range eventSample {

		req, err := http.NewRequest("GET", "/events", nil)
		if err != nil {
			t.Errorf("this is the error: %v\n", err)
		}
		req = mux.SetURLVars(req, map[string]string{"id": v.id})
		// req = req.WithContext(context.WithValue(req.Context(), "id", v.id))

		rr := httptest.NewRecorder()
		handler := http.HandlerFunc(server.GetEvent)
		handler.ServeHTTP(rr, req)

		responseMap := make(map[string]interface{})
		err = json.Unmarshal([]byte(rr.Body.String()), &responseMap)
		if err != nil {
			log.Fatalf("Cannot convert to json: %v", err)
		}
		assert.Equal(t, rr.Code, v.statusCode)

		if v.statusCode == 200 {
			assert.Equal(t, event.Title, responseMap["title"])
			assert.Equal(t, event.Description, responseMap["description"])
			assert.Equal(t, float64(event.OwnerID), responseMap["owner_id"]) //the response owner id is float64
		}
	}
}

func TestUpdateEvent(t *testing.T) {

	var EventUserEmail, EventUserPassword string
	var AuthEventOwnerID uint32
	var AuthEventID uint64

	err := refreshUserAndEventTable()
	if err != nil {
		log.Fatal(err)
	}
	users, events, err := seedUsersAndEvents()
	if err != nil {
		log.Fatal(err)
	}
	// Get only the first user
	for _, user := range users {
		if user.ID == 2 {
			continue
		}
		EventUserEmail = user.Email
		EventUserPassword = "password" //Note the password in the database is already hashed, we want unhashed
	}
	//Login the user and get the authentication token
	token, err := server.SignIn(EventUserEmail, EventUserPassword)
	if err != nil {
		log.Fatalf("cannot login: %v\n", err)
	}
	tokenString := fmt.Sprintf("Bearer %v", token)

	// Get only the first event
	for _, event := range events {
		if event.ID == 2 {
			continue
		}
		AuthEventID = event.ID
		AuthEventOwnerID = event.OwnerID
	}
	// fmt.Printf("this is the auth event: %v\n", AuthEventID)

	samples := []struct {
		id           string
		updateJSON   string
		statusCode   int
		title        string
		description  string
		owner_id     uint32
		tokenGiven   string
		errorMessage string
	}{
		{
			// Convert int64 to int first before converting to string
			id:           strconv.Itoa(int(AuthEventID)),
			updateJSON:   `{"title":"The updated event", "description": "This is the updated description", "owner_id": 1}`,
			statusCode:   200,
			title:        "The updated event",
			description:  "This is the updated description",
			owner_id:     AuthEventOwnerID,
			tokenGiven:   tokenString,
			errorMessage: "",
		},
		{
			// When no token is provided
			id:           strconv.Itoa(int(AuthEventID)),
			updateJSON:   `{"title":"This is still another title", "description": "This is the updated description", "owner_id": 1}`,
			tokenGiven:   "",
			statusCode:   401,
			errorMessage: "Unauthorized",
		},
		{
			// When incorrect token is provided
			id:           strconv.Itoa(int(AuthEventID)),
			updateJSON:   `{"title":"This is still another title", "description": "This is the updated description", "owner_id": 1}`,
			tokenGiven:   "this is an incorrect token",
			statusCode:   401,
			errorMessage: "Unauthorized",
		},
		{
			//Note: "Title 2" belongs to event 2, and title must be unique
			id:           strconv.Itoa(int(AuthEventID)),
			updateJSON:   `{"title":"Title 2", "description": "This is the updated description", "owner_id": 1}`,
			statusCode:   500,
			tokenGiven:   tokenString,
			errorMessage: "Title Already Taken",
		},
		{
			id:           strconv.Itoa(int(AuthEventID)),
			updateJSON:   `{"title":"", "description": "This is the updated description", "owner_id": 1}`,
			statusCode:   422,
			tokenGiven:   tokenString,
			errorMessage: "Required Title",
		},
		{
			id:           strconv.Itoa(int(AuthEventID)),
			updateJSON:   `{"title":"Awesome title", "description": "", "owner_id": 1}`,
			statusCode:   422,
			tokenGiven:   tokenString,
			errorMessage: "Required Description",
		},
		{
			id:           strconv.Itoa(int(AuthEventID)),
			updateJSON:   `{"title":"This is another title", "description": "This is the updated description"}`,
			statusCode:   401,
			tokenGiven:   tokenString,
			errorMessage: "Unauthorized",
		},
		{
			id:         "unknwon",
			statusCode: 400,
		},
		{
			id:           strconv.Itoa(int(AuthEventID)),
			updateJSON:   `{"title":"This is still another title", "description": "This is the updated description", "owner_id": 2}`,
			tokenGiven:   tokenString,
			statusCode:   401,
			errorMessage: "Unauthorized",
		},
	}

	for _, v := range samples {

		req, err := http.NewRequest("POST", "/events", bytes.NewBufferString(v.updateJSON))
		if err != nil {
			t.Errorf("this is the error: %v\n", err)
		}
		req = mux.SetURLVars(req, map[string]string{"id": v.id})
		rr := httptest.NewRecorder()
		handler := http.HandlerFunc(server.UpdateEvent)

		req.Header.Set("Authorization", v.tokenGiven)

		handler.ServeHTTP(rr, req)

		responseMap := make(map[string]interface{})
		err = json.Unmarshal([]byte(rr.Body.String()), &responseMap)
		if err != nil {
			t.Errorf("Cannot convert to json: %v", err)
		}
		assert.Equal(t, rr.Code, v.statusCode)
		if v.statusCode == 200 {
			assert.Equal(t, responseMap["title"], v.title)
			assert.Equal(t, responseMap["description"], v.description)
			assert.Equal(t, responseMap["owner_id"], float64(v.owner_id)) //just to match the type of the json we receive thats why we used float64
		}
		if v.statusCode == 401 || v.statusCode == 422 || v.statusCode == 500 && v.errorMessage != "" {
			assert.Equal(t, responseMap["error"], v.errorMessage)
		}
	}
}

func TestDeleteEvent(t *testing.T) {

	var EventUserEmail, EventUserPassword string
	var EventUserID uint32
	var AuthEventID uint64

	err := refreshUserAndEventTable()
	if err != nil {
		log.Fatal(err)
	}
	users, events, err := seedUsersAndEvents()
	if err != nil {
		log.Fatal(err)
	}
	//Let's get only the Second user
	for _, user := range users {
		if user.ID == 1 {
			continue
		}
		EventUserEmail = user.Email
		EventUserPassword = "password" //Note the password in the database is already hashed, we want unhashed
	}
	//Login the user and get the authentication token
	token, err := server.SignIn(EventUserEmail, EventUserPassword)
	if err != nil {
		log.Fatalf("cannot login: %v\n", err)
	}
	tokenString := fmt.Sprintf("Bearer %v", token)

	// Get only the second event
	for _, event := range events {
		if event.ID == 1 {
			continue
		}
		AuthEventID = event.ID
		EventUserID = event.OwnerID
	}
	eventSample := []struct {
		id           string
		owner_id     uint32
		tokenGiven   string
		statusCode   int
		errorMessage string
	}{
		{
			// Convert int64 to int first before converting to string
			id:           strconv.Itoa(int(AuthEventID)),
			owner_id:     EventUserID,
			tokenGiven:   tokenString,
			statusCode:   204,
			errorMessage: "",
		},
		{
			// When empty token is passed
			id:           strconv.Itoa(int(AuthEventID)),
			owner_id:     EventUserID,
			tokenGiven:   "",
			statusCode:   401,
			errorMessage: "Unauthorized",
		},
		{
			// When incorrect token is passed
			id:           strconv.Itoa(int(AuthEventID)),
			owner_id:     EventUserID,
			tokenGiven:   "This is an incorrect token",
			statusCode:   401,
			errorMessage: "Unauthorized",
		},
		{
			id:         "unknwon",
			tokenGiven: tokenString,
			statusCode: 400,
		},
		{
			id:           strconv.Itoa(int(1)),
			owner_id:     1,
			statusCode:   401,
			errorMessage: "Unauthorized",
		},
	}
	for _, v := range eventSample {

		req, _ := http.NewRequest("GET", "/events", nil)
		req = mux.SetURLVars(req, map[string]string{"id": v.id})

		rr := httptest.NewRecorder()
		handler := http.HandlerFunc(server.DeleteEvent)

		req.Header.Set("Authorization", v.tokenGiven)

		handler.ServeHTTP(rr, req)

		assert.Equal(t, rr.Code, v.statusCode)

		if v.statusCode == 401 && v.errorMessage != "" {

			responseMap := make(map[string]interface{})
			err = json.Unmarshal([]byte(rr.Body.String()), &responseMap)
			if err != nil {
				t.Errorf("Cannot convert to json: %v", err)
			}
			assert.Equal(t, responseMap["error"], v.errorMessage)
		}
	}
}
