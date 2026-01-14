.PHONY:lint
lint:
	$(LOCAL_BIN)/golangci-lint run

.PHONY:test
test:
	go test -v ./...
