package proto_registry

import desc "proto-registry/pkg/api/registry"

type Client struct {
	client desc.ProtoRegistryClient
}

func NewClient(client desc.ProtoRegistryClient) *Client {
	return &Client{client: client}
}
