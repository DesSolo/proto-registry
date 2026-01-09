package gitlab

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

// GetRepositoryFile https://docs.gitlab.com/api/repository_files/#get-file-from-repository
func (c *Client) GetRepositoryFile(ctx context.Context, project, filePath, ref string) ([]byte, error) {
	uri := "/projects/" + url.QueryEscape(project) + "/repository/files/" + url.QueryEscape(filePath) + "?ref=" + ref

	req, err := c.newRequest(ctx, http.MethodGet, uri, nil)
	if err != nil {
		return nil, fmt.Errorf("newRequest: %w", err)
	}

	resp, err := c.do(req, http.StatusOK)
	if err != nil {
		return nil, fmt.Errorf("do: %w", err)
	}

	var r struct {
		Content []byte `json:"content"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&r); err != nil {
		return nil, fmt.Errorf("json decode: %w", err)
	}
	defer resp.Body.Close()

	return r.Content, nil
}
