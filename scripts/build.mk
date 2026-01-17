
RELEASE_DIRECTORY := ${LOCAL_BIN}/release

build-server:
	go build -o ${RELEASE_DIRECTORY}/registry-server cmd/server/main.go

build-cli:
	go build -o ${RELEASE_DIRECTORY}/registry-cli cmd/server/main.go
