package repositories

import (
	"context"
	"encoding/json"
	"log"

	"cloud.google.com/go/pubsub"
	"github.com/CalendarPal/calpal/account-server/models"
	"github.com/CalendarPal/calpal/account-server/utils/apperrors"
)

// eventsRepository Implements pushing events to be published to pubsub
type eventsRepository struct {
	PubSub *pubsub.Client
}

const topic = "events"

func NewEventsRepository(pubSubClient *pubsub.Client) models.EventsRepository {
	return &eventsRepository{
		PubSub: pubSubClient,
	}
}

// PublishUserUpdated sends user to "user-updated" topic of pubsub
func (e *eventsRepository) PublishUserUpdated(ctx context.Context, u *models.User, isNewUser bool) error {
	t := e.PubSub.Topic(topic)

	serializedUser, err := json.Marshal(u)

	if err != nil {
		log.Printf("Problem serializing user in PublishUserUpdated: %v\n", err)
		return apperrors.NewInternal()
	}

	var eventType string
	if isNewUser {
		eventType = "user-created"
	} else {
		eventType = "user-updated"
	}

	result := t.Publish(ctx, &pubsub.Message{
		Data: serializedUser,
		Attributes: map[string]string{
			"type": eventType,
		},
	})

	_, err = result.Get(ctx)

	if err != nil {
		log.Printf("Failure getting id of published result: %v\n", err)
	}

	return nil
}
