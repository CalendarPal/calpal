package repositories

import (
	"cloud.google.com/go/storage"
	"context"
	"fmt"
	"github.com/CalendarPal/calpal-api/account/models"
	"github.com/CalendarPal/calpal-api/account/utils/apperrors"
	"io"
	"log"
	"mime/multipart"
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

func (r *cloudImageRepository) UpdateProfile(ctx context.Context, objName string, imageFile multipart.File) (string, error) {
	bckt := r.Storage.Bucket(r.BucketName)

	object := bckt.Object(objName)
	wc := object.NewWriter(ctx)

	wc.ObjectAttrs.CacheControl = "Cache-Control:no-cache, max-age=0"

	// Multipart.File reader
	if _, err := io.Copy(wc, imageFile); err != nil {
		log.Printf("Unable to write file to Google Cloud Storage: %v\n", err)
		return "", apperrors.NewInternal()
	}

	if err := wc.Close(); err != nil {
		return "", fmt.Errorf("Writer.Close: %v", err)
	}

	imageURL := fmt.Sprintf(
		"https://storage.googleapis.com/%s/%s",
		r.BucketName,
		objName,
	)

	return imageURL, nil
}
