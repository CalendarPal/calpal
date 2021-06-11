package models

import (
	"errors"
	"html"
	"strings"
	"time"

	"gorm.io/gorm"
)

type Event struct {
	ID          uint64    `gorm:"primary_key;auto_increment" json:"id"`
	Title       string    `gorm:"size:255;not null;unique" json:"title"`
	Description string    `gorm:"size:255;not null;" json:"description"`
	Owner       User      `json:"owner"`
	OwnerID     uint32    `gorm:"not null" json:"owner_id"`
	StartTime   time.Time `gorm:"not null; default:CURRENT_TIMESTAMP" json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	CreatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	State       string    `gorm:"default:not_started" json:"state"`
}

func (e *Event) Prepare() {
	e.ID = 0
	e.Title = html.EscapeString(strings.TrimSpace(e.Title))
	e.Description = html.EscapeString(strings.TrimSpace(e.Description))
	e.Owner = User{}
	e.CreatedAt = time.Now()
	e.UpdatedAt = time.Now()
	e.State = "not_started"
}

func (e *Event) Validate() error {

	if e.Title == "" {
		return errors.New("Required Title")
	}
	if e.Description == "" {
		return errors.New("Required Description")
	}
	if e.OwnerID < 1 {
		return errors.New("Required Owner")
	}
	return nil
}

func (e *Event) SaveEvent(db *gorm.DB) (*Event, error) {
	var err error
	err = db.Debug().Model(&Event{}).Create(&e).Error
	if err != nil {
		return &Event{}, err
	}
	if e.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", e.OwnerID).Take(&e.Owner).Error
		if err != nil {
			return &Event{}, err
		}
	}
	return e, nil
}

func (e *Event) FindAllEvents(db *gorm.DB) (*[]Event, error) {
	var err error
	Events := []Event{}
	err = db.Debug().Model(&Event{}).Limit(100).Find(&Events).Error
	if err != nil {
		return &[]Event{}, err
	}
	if len(Events) > 0 {
		for i, _ := range Events {
			err := db.Debug().Model(&User{}).Where("id = ?", Events[i].OwnerID).Take(&Events[i].Owner).Error
			if err != nil {
				return &[]Event{}, err
			}
		}
	}
	return &Events, nil
}

func (e *Event) FindEventByID(db *gorm.DB, pid uint64) (*Event, error) {
	var err error
	err = db.Debug().Model(&Event{}).Where("id = ?", pid).Take(&e).Error
	if err != nil {
		return &Event{}, err
	}
	if e.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", e.OwnerID).Take(&e.Owner).Error
		if err != nil {
			return &Event{}, err
		}
	}
	return e, nil
}

func (e *Event) UpdateAEvent(db *gorm.DB) (*Event, error) {

	var err error

	err = db.Debug().Model(&Event{}).Where("id = ?", e.ID).Updates(Event{Title: e.Title, Description: e.Description, UpdatedAt: time.Now()}).Error
	if err != nil {
		return &Event{}, err
	}
	if e.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", e.OwnerID).Take(&e.Owner).Error
		if err != nil {
			return &Event{}, err
		}
	}
	return e, nil
}

func (e *Event) DeleteAEvent(db *gorm.DB, pid uint64, uid uint32) (int64, error) {

	db = db.Debug().Model(&Event{}).Where("id = ? and owner_id = ?", pid, uid).Take(&Event{}).Delete(&Event{})

	if db.Error != nil {
		if errors.Is(db.Error, gorm.ErrRecordNotFound) {
			return 0, errors.New("Event not found")
		}
		return 0, db.Error
	}
	return db.RowsAffected, nil
}
