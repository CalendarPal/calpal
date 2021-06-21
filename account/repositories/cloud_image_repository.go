package repositories

import (
	"cloud.google.com/go/storage"
	"github.com/CalendarPal/calpal-api/account/models"
)

type cloudImageRepository struct {
	Storage    *storage.Client
	BucketName string
}

func NewImageRepository(cloudClient *storage.Client, bucketName string) models.ImageRepository {
	return &cloudImageRepository{
		Storage:    cloudClient,
		BucketName: bucketName,
	}
}
