package data

var validImageTypes = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
}

// IsAllowedImageType Checks if the image is of an allowed file type
func IsAllowedImageType(mimetype string) bool {
	_, exists := validImageTypes[mimetype]

	return exists
}
