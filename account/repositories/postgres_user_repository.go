package repositories

import (
	"context"
	"log"

	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type PostgresUserRepository struct {
	DB *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) models.UserRepository {
	return &PostgresUserRepository{
		DB: db,
	}
}

func (r *PostgresUserRepository) Create(ctx context.Context, u *models.User) error {
	query := "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *"

	if err := r.DB.GetContext(ctx, u, query, u.Email, u.Password); err != nil {
		// Checks the unique constraint
		if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
			log.Printf("Could not create a user with email: %v. Reason: %v\n", u.Email, err.Code.Name())
			return apperrors.NewConflict("email", u.Email)
		}

		log.Printf("Could not create a user with email: %v. Reason: %v\n", u.Email, err)
		return apperrors.NewInternal()
	}
	return nil
}

func (r *PostgresUserRepository) FindByID(ctx context.Context, uid uuid.UUID) (*models.User, error) {
	user := &models.User{}

	query := "SELECT * FROM users WHERE uid=$1"

	// TODO: Further error checking
	if err := r.DB.GetContext(ctx, user, query, uid); err != nil {
		return user, apperrors.NewNotFound("uid", uid.String())
	}

	return user, nil
}

func (r *PostgresUserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	user := &models.User{}

	query := "SELECT * FROM users WHERE email=$1"

	if err := r.DB.GetContext(ctx, user, query, email); err != nil {
		log.Printf("Unable to get user with email: %v. Err: %v\n", email, err)
		return user, apperrors.NewNotFound("email", email)
	}

	return user, nil
}
