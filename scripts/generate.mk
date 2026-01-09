

generate:
	$(LOCAL_BIN)/easyp mod download
	$(LOCAL_BIN)/easyp mod vendor
	PATH=$(LOCAL_BIN):$(PATH) $(LOCAL_BIN)/easyp generate
