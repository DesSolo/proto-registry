package gitlab

import (
	"context"
	"fmt"
	"io"
	"net/http"
)

type Client struct {
	apiURL string
	token  string
	client *http.Client
}

func NewClient(client *http.Client, apiURL, token string) *Client {
	return &Client{
		apiURL: apiURL,
		token:  token,
		client: client,
	}
}

func (c *Client) newRequest(ctx context.Context, method, uri string, body io.Reader) (*http.Request, error) {
	req, err := http.NewRequestWithContext(ctx, method, c.apiURL+uri, body)
	if err != nil {
		return nil, fmt.Errorf("http.NewRequestWithContext: %w", err)
	}

	req.Header.Set("PRIVATE-TOKEN", c.token)

	return req, nil
}

func (c *Client) do(req *http.Request, validStatusCode int) (*http.Response, error) {
	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("client.Do: %w", err)
	}

	if resp.StatusCode != validStatusCode {
		if resp.StatusCode == http.StatusNotFound {
			return nil, ErrNotFound
		}

		return nil, fmt.Errorf("invalid status code: %d", resp.StatusCode)
	}

	return resp, nil
}
