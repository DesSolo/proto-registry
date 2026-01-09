MIGRATIONS_PATH=migrations
MIGRATIONS_DSN="host=127.0.0.1 port=5432 user=postgres password=postgres dbname=proto-registry sslmode=disable"

migration-up:
	$(LOCAL_BIN)/goose -dir ${MIGRATIONS_PATH} postgres ${MIGRATIONS_DSN} up

migration-down:
	$(LOCAL_BIN)/goose -dir ${MIGRATIONS_PATH} postgres ${MIGRATIONS_DSN} down

migration-create:
	$(LOCAL_BIN)/goose -dir ${MIGRATIONS_PATH} create auto sql