package registry

import "errors"

var (
	ErrNotFound         = errors.New("not found")
	ErrValidationFailed = errors.New("validation failed")
)
