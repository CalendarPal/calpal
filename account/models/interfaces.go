package models

import "github.com/google/uuid"

// UserService defines methods the handler layer expects the service it interacts with to implement
type UserService interface {
	Get(uid uuid.UUID) (*User, error)
}

// UserRepository defines methods the service layer expects the repository it interacts with to implement
type UserRepository interface {
	FindByID(uid uuid.UUID) (*User, error)
}
