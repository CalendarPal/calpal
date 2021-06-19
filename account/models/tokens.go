package models

// TokenPair Used for returning pairs of ID and Refresh tokens
type TokenPair struct {
	IDToken      string `json:"idToken"`
	RefreshToken string `json:"refreshToken"`
}
