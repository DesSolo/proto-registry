.prebin:
	mkdir -p ${LOCAL_BIN}

bin-deps:
	GOBIN=$(LOCAL_BIN) go install github.com/easyp-tech/easyp/cmd/easyp@v0.12.2
	GOBIN=$(LOCAL_BIN) go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	GOBIN=$(LOCAL_BIN) go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	GOBIN=$(LOCAL_BIN) go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@v2.27.1
	GOBIN=$(LOCAL_BIN) go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@v2.27.1
	GOBIN=$(LOCAL_BIN) go install github.com/envoyproxy/protoc-gen-validate@v1.2.1
	GOBIN=$(LOCAL_BIN) go install github.com/dessolo/protoc-gen-stub@latest

GOOSE_VERSION := v3.26.0

install-goose:
	curl -Ls https://github.com/pressly/goose/releases/download/${GOOSE_VERSION}/goose_linux_x86_64 --output ${LOCAL_BIN}/goose
	chmod +x ${LOCAL_BIN}/goose

install-deps: \
	.prebin \
	bin-deps \
	install-goose
