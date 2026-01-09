CONTAINER_RUNNER=podman-compose
COMPOSE_FILE_PATH=docker-compose.d

PHONY: compose-up
compose-up:
	${CONTAINER_RUNNER} -f ${COMPOSE_FILE_PATH}/docker-compose.yaml up
