package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/CalendarPal/calpal-api/auth"
	"github.com/CalendarPal/calpal-api/models"
	"github.com/CalendarPal/calpal-api/responses"
	"github.com/CalendarPal/calpal-api/utils/formaterror"
	"github.com/go-chi/chi"
	"github.com/gorilla/mux"
)

func (server *Server) CreateEvent(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	event := models.Event{}
	err = json.Unmarshal(body, &event)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	event.Prepare()
	err = event.Validate()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	uid, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}
	if uid != event.OwnerID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New(http.StatusText(http.StatusUnauthorized)))
		return
	}
	eventCreated, err := event.SaveEvent(server.DB)
	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}
	w.Header().Set("Lacation", fmt.Sprintf("%s%s/%d", r.Host, r.URL.Path, eventCreated.ID))
	responses.JSON(w, http.StatusCreated, eventCreated)
}

func (server *Server) GetEvents(w http.ResponseWriter, r *http.Request) {

	event := models.Event{}

	events, err := event.FindAllEvents(server.DB)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, events)
}

func (server *Server) GetEvent(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	reqId := chi.URLParam(r, "id")
	pid, err := strconv.ParseUint(reqId, 10, 64)
	if vars != nil && reqId == "" {
		pid, err = strconv.ParseUint(vars["id"], 10, 64)
	}
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	event := models.Event{}

	eventReceived, err := event.FindEventByID(server.DB, pid)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, eventReceived)
}

func (server *Server) UpdateEvent(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	reqId := chi.URLParam(r, "id")
	pid, err := strconv.ParseUint(reqId, 10, 64)
	if vars != nil && reqId == "" {
		pid, err = strconv.ParseUint(vars["id"], 10, 64)
	}
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	//CHeck if the auth token is valid and  get the user id from it
	uid, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	// Check if the event exist
	event := models.Event{}
	err = server.DB.Debug().Model(models.Event{}).Where("id = ?", pid).Take(&event).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Event not found"))
		return
	}

	// If a user attempt to update a event not belonging to him
	if uid != event.OwnerID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}
	// Read the data evented
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	// Start processing the request data
	eventUpdate := models.Event{}
	err = json.Unmarshal(body, &eventUpdate)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	//Also check if the request user id is equal to the one gotten from token
	if uid != eventUpdate.OwnerID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	eventUpdate.Prepare()
	err = eventUpdate.Validate()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	eventUpdate.ID = event.ID //this is important to tell the model the event id to update, the other update field are set above

	eventUpdated, err := eventUpdate.UpdateAEvent(server.DB)

	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}
	responses.JSON(w, http.StatusOK, eventUpdated)
}

func (server *Server) DeleteEvent(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	reqId := chi.URLParam(r, "id")
	pid, err := strconv.ParseUint(reqId, 10, 64)
	if vars != nil && reqId == "" {
		pid, err = strconv.ParseUint(vars["id"], 10, 64)
	}
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	// Is this user authenticated?
	uid, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	// Check if the event exist
	event := models.Event{}
	err = server.DB.Debug().Model(models.Event{}).Where("id = ?", pid).Take(&event).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Unauthorized"))
		return
	}

	// Is the authenticated user, the owner of this event?
	if uid != event.OwnerID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}
	_, err = event.DeleteAEvent(server.DB, pid, uid)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	w.Header().Set("Entity", fmt.Sprintf("%d", pid))
	responses.JSON(w, http.StatusNoContent, "")
}
