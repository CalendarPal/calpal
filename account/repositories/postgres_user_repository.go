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

func (r *PostgresUserRepository) Update(ctx context.Context, u *models.User) error {
	query := `
		UPDATE users
		SET name =:name, email=:email, website=:website, updated_at=CURRENT_TIMESTAMP
		WHERE uid=:uid
		RETURNING *;
		`

	nstmt, err := r.DB.PrepareNamedContext(ctx, query)

	if err != nil {
		log.Printf("Unable to prepare user update query: %v\n", err)
		return apperrors.NewInternal()
	}

	if err := nstmt.GetContext(ctx, u, u); err != nil {
		log.Printf("Failed to update details for user: %v\n", err)
		return apperrors.NewInternal()
	}

	return nil
}

// UpdateImage Update a user's image separately from other account details
func (r *PostgresUserRepository) UpdateImage(ctx context.Context, uid uuid.UUID, imageURL string) (*models.User, error) {
	query := `
		UPDATE users 
		SET image_url=$2, updated_at=CURRENT_TIMESTAMP
		WHERE uid=$1
		RETURNING *;
	`

	u := &models.User{}

	err := r.DB.GetContext(ctx, u, query, uid, imageURL)

	if err != nil {
		log.Printf("Error updating image_url in database: %v\n", err)
		return nil, apperrors.NewInternal()
	}

	return u, nil
}
